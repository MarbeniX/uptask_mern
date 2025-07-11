import { transporter } from '../config/nodemailer';

interface IEmail{
    email: string,
    name: string,
    token: string
}

export class AuthEmail{
    static sendConfirmationEmail = async (user : IEmail) => {
        const info = await transporter.sendMail({
            from: 'Uptask <admin@uptask.com>',
            to: user.email,
            subject: 'UpTask - Verify your account',
            text: `UpTask - Verify your account`,
            html: `<p>Hola: ${user.name}, has creado tu cuenta en UpTask, ya casi esta todo listo, solo debes confirmar tu cuenta</p>
                <p>Visita el siguiente enlace:</p>
                <a href="${process.env.FRONTEND_URL}/auth/confirm-account">Confirmar cuenta</a>
                <p>E ingresa el codigo: <b>${user.token}</b></p>
                <p>Este token expira en 10 minutos</p>        
            `
        })
        console.log('Message sent: %s', info.messageId);
    }

    static sendPasswordResetToken = async (user : IEmail) => {
        const info = await transporter.sendMail({
            from: 'Uptask <admin@uptask.com>',
            to: user.email,
            subject: 'UpTask - Password reset',
            text: `UpTask - Password reset`,
            html: `<p>Hello ${user.name}, you have asked to reset your password</p>
                <p>Visita el siguiente enlace:</p>
                <a href="${process.env.FRONTEND_URL}/auth/new-password">Confirm account</a>
                <p>Add the next code: <b>${user.token}</b></p>
                <p>This token expires en 10 minutes</p>        
            `
        })
        console.log('Message sent: %s', info.messageId);
    }
}