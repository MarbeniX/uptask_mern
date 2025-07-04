import e, { Request, Response } from 'express';
import User from '../models/user';
import { comparePasswords, hashPassword } from '../utils/auth';
import Token from '../models/token';
import { generateToken } from '../utils/token';
import { AuthEmail } from '../emails/AuthEmil';
import { generateJWT } from '../utils/jwt';

export class AuthController{
    static createAccount = async(req: Request, res: Response) => {
        try{
            const {password, email} = req.body
            // Check if the email is already in use
            const emailExists = await User.findOne({email})
            if(emailExists){
                res.status(400).send("Email is already in use")
                return
            }
            const user = new User(req.body)
            // Hash the password before saving it to the database
            user.password = await hashPassword(password)
            //Generate a token to verify the email
            const token = new Token()
            token.token = generateToken()   
            token.user = user.id
            // Send email
            AuthEmail.sendConfirmationEmail({
                email: user.email,
                name: user.username,
                token: token.token
            })
            await Promise.allSettled([user.save(), token.save()])
            res.send("Account created, check your email to verify your account")
        }catch(error){
            res.status(500).send(error)
        }
    }

    static confirmAccount = async(req: Request, res: Response) => {
        try{
            const {token} = req.body
            const tokenExists = await Token.findOne({token})
            if(!tokenExists){
                const error = new Error("Invalid token")
                res.status(404).send({error: error.message})
                return
            }
            const user = await User.findById(tokenExists.user)
            user.confirmed = true
            await Promise.allSettled([user.save(), tokenExists.deleteOne()])
            res.send("Account confirmed")
        }catch(error){
            res.status(500).send(error)
        }
    }

    static login = async(req: Request, res: Response) => {
        try{
            const {email, password} = req.body
            const user = await User.findOne({email})
            if(!user){
                const error = new Error("User not found")
                res.status(404).send({error: error.message})
                return
            }
            if(!user.confirmed){
                const token = new Token()
                token.user = user.id
                token.token = generateToken()
                await token.save()

                AuthEmail.sendConfirmationEmail({
                    email: user.email,
                    name: user.username,
                    token: token.token
                })

                const error = new Error("Account not confirmed, check your email to confirm your account") 
                res.status(401).send({error: error.message})
                return
            }
            const passwordMatch = await comparePasswords(password, user.password)
            if(!passwordMatch){
                const error = new Error("Invalid password")
                res.status(401).send({error: error.message})
                return
            }
            //Return a JWT
            const token = generateJWT({id: user.id})
            res.send(token)
        }catch(error){
            res.status(500).send(error)
        }
    }

    static requestConfirmationCode = async(req: Request, res: Response) => {
        try{
            const {email} = req.body
            // Check if the email is already in use
            const user = await User.findOne({email})
            if(!user){
                res.status(404).send("User not found")
                return
            }
            if(user.confirmed){
                res.status(403).send("Account is already confirmed")
                return
            }
            //Generate a token to verify the email
            const token = new Token()
            token.token = generateToken()   
            token.user = user.id
            // Send email
            AuthEmail.sendConfirmationEmail({
                email: user.email,
                name: user.username,
                token: token.token
            })
            await Promise.allSettled([user.save(), token.save()])
            res.send("Check your email to verify your account")
        }catch(error){
            res.status(500).send(error)
        }
    }

    static requestNewPassword = async(req: Request, res: Response) => { 
        try{
            const {email} = req.body
            // Check if the email is already in use
            const user = await User.findOne({email})
            if(!user){
                res.status(404).send("User not found")
                return
            }
            //Generate a token to verify the email
            const token = new Token()
            token.token = generateToken()   
            token.user = user.id
            await token.save()
            // Send email
            AuthEmail.sendPasswordResetToken({
                email: user.email,
                name: user.username,
                token: token.token
            })
            res.send("Check your email to reset your password")
        }catch(error){ 
            res.status(500).send(error)
        }
    }

    static validateToken = async(req: Request, res: Response) => {
        try{
            const {token} = req.body
            const tokenExists = await Token.findOne({token})
            if(!tokenExists){
                const error = new Error("Invalid token")
                res.status(404).send({error: error.message})
                return
            }
            res.send("Token is valid, define a new password")
        }catch(error){
            res.status(500).send(error)
        }
    }

    static updatePassword = async(req: Request, res: Response) => {
        try{
            const {token} = req.params
            const tokenExists = await Token.findOne({token})
            if(!tokenExists){
                const error = new Error("Invalid token")
                res.status(404).send({error: error.message})
                return
            }
            const user = await User.findById(tokenExists.user)
            user.password = await hashPassword(req.body.password)
            await Promise.allSettled([user.save(), tokenExists.deleteOne()])
            res.send("Password updated")
        }catch(error){
            res.status(500).send(error)
        }
    }

    static user = async(req: Request, res: Response) => {
        res.json(req.user)
    }

    static updateUser = async(req: Request, res: Response) => {
        const { username, email } = req.body
        const userExists = await User.findOne({email})
        if(userExists && userExists.id !== req.user.id){
            const error = new Error("Email is already in use")
            res.status(400).send({error: error.message})
            return
        }
        req.user.username = username
        req.user.email = email
        try{
            await req.user.save()
            res.send("User updated")
        }catch(error){
            res.status(500).send(error)
        }
    }

    static updateProfilePassword = async(req: Request, res: Response) => {
        const { newPassword, password } = req.body
        const userExists = await User.findById(req.user.id)
        const passwordMatch = await comparePasswords(password, userExists.password)
        if(!passwordMatch){
            const error = new Error("Invalid password")
            res.status(401).send({error: error.message})
            return
        }
        userExists.password = await hashPassword(newPassword)
        try{
            await userExists.save()
            res.send("Password updated")
        }catch(error){
            res.status(500).send(error)
        }
    }

    static verifyPassword = async(req: Request, res: Response) => {
        const { password } = req.body
        const userExists = await User.findById(req.user.id)
        const passwordMatch = await comparePasswords(password, userExists.password)
        if(!passwordMatch){
            const error = new Error("Invalid password")
            res.status(401).send({error: error.message})
            return
        }
        res.send("Password is valid")
    }
}