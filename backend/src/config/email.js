const nodemailer = require('nodemailer');
require('dotenv').config(); 


// Отладочный вывод
console.log('EMAIL_HOST:', process.env.EMAIL_HOST);
console.log('EMAIL_USER:', process.env.EMAIL_USER);
console.log('EMAIL_PASS configured:', Boolean(process.env.EMAIL_PASS));

// Создаем транспорт для отправки email
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || 'mail.cheburnetu.net', // SMTP сервер
  port: process.env.EMAIL_PORT || 587, // Порт SMTP
  secure: process.env.EMAIL_SECURE === 'true', // true для 465, false для других портов
  auth: {
    user: process.env.EMAIL_USER, // Ваш email
    pass: process.env.EMAIL_PASS // Ваш пароль или app password
  }
});


//функция для отправки электроной почтф
const sendEmail = async (options) => {
    try {
        const mailOptions = {
            from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
            to: options.to,
            subject: options.subject,
            text: options.text,
            html: options.html
        }

        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent ' + info.messageId);
        return info;


    } catch (error) {
        console.error("Error sending email: ", error);
        throw error;
    }
};

module.exports = { transporter, sendEmail }