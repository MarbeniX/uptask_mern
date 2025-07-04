import { Router } from "express";
import { AuthController } from "../controllers/AutthController";
import { body, param } from 'express-validator';
import { handleInputErrors } from "../middlewares/validation";
import { authenticate } from "../middlewares/auth";

const router = Router();

router.post('/create-account',
    body('email')
        .isEmail().withMessage('Email is not valid'),
    body('password')
        .isLength({ min: 8 }).withMessage('Password must be at least 6 characters long'),
    body('passwordConfirmation')
        .custom((value, { req }) => {
            if (value !== req.body.password) {
                throw new Error('Passwords do not match')
            } 
            return true
        }),
    body('username')
        .isLength({ min: 3 }).withMessage('Name must be at least 3 characters long'),
    handleInputErrors,
    AuthController.createAccount
)

router.post('/confirm-account',
    body('token')
        .isLength({ min: 6 }).withMessage('Token is not valid'),
    handleInputErrors,
    AuthController.confirmAccount
)

router.post('/login',
    body('email')
        .isEmail().withMessage('Email is not valid'),
    body('password')
        .isLength({ min: 8 }).withMessage('Password must be at least 6 characters long'),
    handleInputErrors,
    AuthController.login
)

router.post('/request-code',
    body('email')
        .isEmail().withMessage('Email is not valid'),
    handleInputErrors,
    AuthController.requestConfirmationCode
)

router.post('/password-reset',
    body('email')
        .isEmail().withMessage('Email is not valid'),
    handleInputErrors,
    AuthController.requestNewPassword
)

router.post('/validate-token',
    body('token')
        .isLength({ min: 6 }).withMessage('Token is not valid'),
    handleInputErrors,
    AuthController.validateToken
)

router.post('/update-password/:token',
    param('token')
        .isNumeric().withMessage('Token is not valid'),
    body('password')
        .isLength({ min: 8 }).withMessage('Password must be at least 8 characters long'),
    body('passwordConfirmation')
        .custom((value, { req }) => {
            if (value !== req.body.password) {
                throw new Error('Passwords do not match')
            } 
            return true
        }),
    handleInputErrors,
    AuthController.updatePassword
)

router.get('/user',
    authenticate,
    AuthController.user
)

/**Profile actions */
router.put('/profile',
    authenticate,
    body('username')
        .isLength({ min: 3 }).withMessage('Name must be at least 3 characters long'),
    body('email')
        .isEmail().withMessage('Email is not valid'),
    handleInputErrors,
    AuthController.updateUser    
)

router.post('/profile/update-password',
    authenticate,
    body('newPassword')
        .isLength({ min: 8 }).withMessage('New password must be at least 8 characters long'),
    body('password')
        .isLength({ min: 8 }).withMessage('Password must be at least 6 characters long'),
    body('passwordConfirmation')
        .custom((value, { req }) => {
            if (value !== req.body.password) {
                throw new Error('Passwords do not match')
            } 
            return true
        }),
    handleInputErrors,
    AuthController.updateProfilePassword
)

router.post('/profile/verify-password',
    authenticate,
    body('password')
        .isLength({ min: 8 }).withMessage('Password must be at least 8 characters long'),
    handleInputErrors,
    AuthController.verifyPassword
)

export default router 