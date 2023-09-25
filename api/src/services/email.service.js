import mailTransporter from "../config/mail-config.js";
import fs from "fs";
import { fileURLToPath } from "url";
import path from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const sendEmail = async (email, template) => {
    try {
        await mailTransporter.sendMail({
            from: process.env.MAIL_SMTP_USER,
            to: email,
            template,
        });
    } catch (error) {
        console.error(error);
    }
};

export const sendEmailConfirmation = async (email, token) => {
    try {
        const confirmationLink = `http://localhost:3000/auth/validate?email=${email}&token=${token}`;

        const htmlTemplate = fs.readFileSync(
            path.join(__dirname, "../templates/email-confirmation.html"),
            "utf8"
        );

        const template = htmlTemplate.replace(
            "{{confirmationLink}}",
            confirmationLink
        );

        await sendEmail(email, template);

        return true;
    } catch (error) {
        console.error(`Error sending confirmation email : ${error}`);
    }
};
