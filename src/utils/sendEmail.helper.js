import nodemailer from "nodemailer";
import path from "path"
import ejs from "ejs"
export const sendEmailPassword = async (email_user, link) => {
    const __dirname = path.resolve()
    const data = await ejs.renderFile(`${__dirname}/src/views/messageHTML.ejs`, { link: link });

  var transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
      user: process.env.EMAIL_ADDRESS,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  var mailOptions = {
    from: process.env.EMAIL_ADDRESS,
    to: email_user,
    subject: "Recuperar contraseña",
    html:data
  };

  transporter.sendMail(mailOptions, function(error, info){
    if (error){
        console.log(error);
        
    } else {
        console.log("Email sent",info);
        
    }
});
};
