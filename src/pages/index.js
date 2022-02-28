import axios from "axios";

const newPasswordInput = document.querySelector("#newPassword");
const confirmNewPasswordInput = document.querySelector("#confirmNewPassword");

const newPassword = newPasswordInput.value;
const confirmNewPassword = confirmNewPasswordInput.value;

const setNewPassword = async () => {
  const { token } = queryString.parse(window.location.search);
  const noInputEmpty = newPassword.length > 0 && confirmNewPassword.length > 0;
  if (noInputEmpty) {
    if (newPassword !== confirmNewPassword) {
      return res.status(400).send({
        status: "error",
        message: "Passwords do not match",
      });
    }
    const result = axios.put(`${process.env.API_URL}/set_new_password`, {
      token,
      password: newPassword,
    });

    if (result.status === "success") {
      alert("Password successfully changed");
    }
  }
};
