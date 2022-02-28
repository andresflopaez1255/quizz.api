import prisma from "../utils/prismaDB.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import jwtHelper from "../utils/jwtHelper.js";
const saltRounds = 10;
const signUpWithEmail = async (req, res) => {
  const { name_user, email_user, password, avatar_user } = req.body;
  const userIfExist = await prisma.user.findFirst({
    where: {
      email_user: email_user,
    },
  });

  if (userIfExist) {
    return res.status(400).send({
      status: "error",
      message: "User already exist",
    });
  }

  const jtwToken = jwtHelper.createToken({ email_user, name_user });

  console.log(jtwToken, process.env.SECRET_KEY);
  const salt = bcrypt.genSaltSync(saltRounds);
  const hashPass = bcrypt.hashSync(password, salt);

  const user = await prisma.user.create({
    data: {
      name_user,
      email_user,
      password: hashPass,
      avatar_user,
      access_token: jtwToken,
    },
  });

  res.send({
    status: "success",
    message: "User created",
    data: {
      id: user.id,
      email_user: user.email_user,
      name_user: user.name_user,
      avatar_user: user.avatar_user,
      token_google: user.token_google,
    },
  });
};

const signInWithEmail = async (req, res) => {
  const { email_user, password } = req.body;
  const user = await prisma.user.findFirst({
    where: {
      email_user: email_user,
    },
  });
  if (!user) {
    return res.status(400).send({
      status: "error",
      message: "User not found",
    });
  }
  const isPasswordValid = bcrypt.compareSync(password, user.password);
  if (!isPasswordValid) {
    return res.status(400).send({
      status: "error",
      message: "Invalid password",
    });
  }

  const refreshToken = jwtHelper.createToken(
    { id: user.id, email_user, name_user: user.name_user },
    1814400
  );
  res.send({
    status: "success",
    message: "Logged in successfully",
    data: {
      id: user.id,
      email_user: user.email_user,
      name_user: user.name_user,
      avatar_user: user.avatar_user,
      token_google: user.token_google,
      accessToken: user.access_token,
      refreshToken: refreshToken,
    },
  });
};

const signUpWithGoogle = async (req, res) => {
  const { email_user, name_user, avatar_user, token_google } = req.body;
  const user = await prisma.user.findFirst({
    where: {
      email_user: email_user,
    },
  });

  if (!user) {
    const jtwToken = jwtHelper.createToken({ email_user, name_user });
    const newUser = await prisma.user.create({
      data: {
        name_user,
        email_user,
        avatar_user,
        token_google,
        access_token: jtwToken,
      },
    });
    return res.send({
      status: "success",
      message: "SignIn in successfully",
      data: {
        id: newUser.id,
        email_user: newUser.email_user,
        name_user: newUser.name_user,
        avatar_user: newUser.avatar_user,
        accessToken: newUser.token_google,
      },
    });
  } else {
    return res.status(400).send({
      status: "error",
      message: "User already exist",
    });
  }
};

const signInWithGoogle = async (req, res) => {
  const { token_google } = req.body;

  if (token_google) {
    const user = await prisma.user.findFirst({
      where: {
        token_google: token_google,
      },
    });
    if (!user) {
      return res.status(400).send({
        status: "error",
        message: "User",
      });
    }

    const refreshToken = jwtHelper.createToken(
      { id: user.id, email_user, name_user: user.name_user },
      1814400
    );

    res.send({
      status: "success",
      message: "Logged in successfully",
      data: {
        id: user.id,
        email_user: user.email_user,
        name_user: user.name_user,
        avatar_user: user.avatar_user,
        token_google: user.token_google,
        accessToken: refreshToken,
      },
    });
  }
};

const updateRefreshToken = async (req, res) => {
  const { refreshToken } = req.body;
  const user = await prisma.user.findFirst({
    where: {
      refresh_token: refreshToken,
    },
  });
  if (!user) {
    return res.status(400).send({
      status: "error",
      message: "User not found",
    });
  }
  const newRefreshToken = jwtHelper.createToken(
    { id: user.id, email_user, name_user: user.name_user },
    1814400
  );

  await prisma.user.update({
    where: {
      id: user.id,
    },
    data: {
      refresh_token: newRefreshToken,
    },
  });
  res.send({
    status: "success",
    message: "Logged in successfully",
    data: null,
  });
};

const requestResetPassword = async (req, res) => {
  const { email_user } = req.body;
  const user = await prisma.user.findFirst({
    where: {
      email_user: email_user,
    },
  });

  if (!user) {
    return res.status(400).send({
      status: "error",

      message: "User not found",
    });
  }

  const token = jwtHelper.createResetPasswordToken({
    email_user,
    name_user: user.name_user,
  });

  await prisma.user.update({
    where: {
      id: user.id,
    },
    data: {
      reset_token: token,
    },
  });

  var fullUrl = `${req.protocol}://${req.get("host")}/recovery_password`;
  res.send({
    status: "success",
    message: "Reset password request successfully",
    data: fullUrl + "?token=" + token,
  });
};

const setNewPassword = async (req, res) => {
  const { token, password } = req.body;
  const user = await prisma.user.findFirst({
    where: {
      reset_token: token,
    },
  });

  if (!user) {
    return res.status(400).send({
      status: "error",
      message: "User not found",
    });
  }

  const newPassword = bcrypt.hashSync(password, 10);

  await prisma.user.update({
    where: {
      id: user.id,
    },
    data: {
      password: newPassword,
      reset_token: null,
    },
  });

  res.send({
    status: "success",
    message: "Password updated successfully",
    data: null,
  });
};

export default {
  signUpWithEmail,
  signInWithEmail,
  signUpWithGoogle,
  signInWithGoogle,
  updateRefreshToken,
  requestResetPassword,
  setNewPassword,
};
