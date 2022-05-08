import jtw from "jsonwebtoken";

const createToken = (data, expiresIn) => {
  const token = jtw.sign(data, process.env.SECRET_KEY, {
    expiresIn: !expiresIn ? 999999 : expiresIn,
  });
  return token;
};

const validateToken = (token) => {
  const isValid = jtw.verify(token, process.env.SECRET_KEY);
  return isValid;
};

const createResetPasswordToken = (data, expiresIn) => {
  
  const token = jtw.sign(data, process.env.RESET_TOKEN_KEY, {
    expiresIn: 600,
  });
  return token;
};

export default {
  createToken,
  validateToken,
  createResetPasswordToken
};
