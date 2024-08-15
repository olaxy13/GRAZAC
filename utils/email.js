// const nodemailer = require("nodemailer");
// //const htmlToText = require("html-to-text"); //we use this coz some pple prefer plain text instead of the formatted html to covert the html to plain text
// const Transport = require("nodemailer-brevo-transport"); 
// // const token = require("../utils/token")

// module.exports = class Email {
//     constructor(user, url) {
//         this.to = user.email;
//         this.firstName = user.name.split(' ')[0];
//         this.url = url;
//         this.from = `Oke Olamide <${process.env.EMAIL_FROM}>` 
//         this.user = user;
//     }

//     newTransport() {
//         ////////////////////////////
//         return nodemailer.createTransport({
//           host: process.env.EMAIL_HOST,
//           port: process.env.EMAIL_PORT,
//           auth: {
//              user: process.env.EMAIL_USERNAME,
//             pass: process.env.EMAIL_PASSWORD
//             }
//         })
//      }
//         //send the actual email
//     async send(subject) {
//         subject //this is the subject for the template not one of the argument
    

//      //2) DEfine email options
//      const mailOptions = {
//                 from: this.from,
//                 to: this.to, 
//                 subject,
//                 // html,
//                  text: `We are glad to have you OnBoard${this.firstName}`//htmlToText.convert(html), //so we converted the html formate stored in the html to text
                
//             };
//      //3) Create ttransport and send email
//    await this.newTransport().sendMail(mailOptions)
// }
//     async sendWelcome() {
//         await this.send("welcome", "Welcome to the Natours Family!");
//     }
//     async sendEmailToken() {
//         await this.send("emailVerification", `Almost there!  -Plase verify your email with this token ${this.user.confirmEmailToken}`);
//     }

//     async sendPasswordReset() {
//         await this.send("passwordReset", "Your password reset token (valid for only 10 minutes)")
//     }
// }


const nodemailer = require("nodemailer");

const sendEmail = async(options) => {

const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD
    }
})
const mailOptions = {
    from: process.env.EMAIL_FROM,
    to: options.email,
    subject: options.subject,
    text: options.message
}

await transporter.sendMail(mailOptions)
}

module.exports= sendEmail;