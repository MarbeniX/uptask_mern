import api from "@/lib/axios";
import { isAxiosError } from "axios";
import { ConfirmAccountForm, ForgotPasswordForm, NewPasswordForm, RequestConfirmationCodeForm, UserLoginForm, UserRegistrationForm, userSchema } from "../types";

export async function registerUser(formData: UserRegistrationForm){
    try{
        const url = '/auth/create-account'
        const response = await api.post<string>(url, formData)
        return response.data
    }catch(error){
        if(isAxiosError(error) && error.response){
            throw new Error(error.response.data.error)
        }
    }
}

export async function confirmAccount(token: ConfirmAccountForm){
    try{
        const url = '/auth/confirm-account'
        const response = await api.post<string>(url, token)
        return response.data
    }catch(error){
        if(isAxiosError(error) && error.response){
            throw new Error(error.response.data.error)
        }
    }
}

export async function requestCode(email: RequestConfirmationCodeForm){
    try{
        const url = '/auth/request-code'
        const response = await api.post<string>(url, email)
        return response.data
    }catch(error){
        if(isAxiosError(error) && error.response){
            throw new Error(error.response.data.error)
        }
    }
}

export async function loginUser(formData: UserLoginForm){
    try{
        const url = '/auth/login'
        const response = await api.post<string>(url, formData)
        localStorage.setItem('AUTH_TOKEN', response.data)
        return response.data
    }catch(error){
        if(isAxiosError(error) && error.response){
            throw new Error(error.response.data.error)
        }
    }
}

export async function forgotPassword(formData: ForgotPasswordForm){
    try{
        const url = '/auth/password-reset'
        const response = await api.post<string>(url, formData)
        return response.data
    }catch(error){
        if(isAxiosError(error) && error.response){
            throw new Error(error.response.data.error)
        }
    }
}

export async function validateToken(formData: ConfirmAccountForm){
    try{
        const url = '/auth/validate-token'
        const response = await api.post<string>(url, formData)
        return response.data
    }catch(error){
        if(isAxiosError(error) && error.response){
            throw new Error(error.response.data.error)
        }
    }
}

export async function updatePassword({formData, token} : {formData: NewPasswordForm, token: ConfirmAccountForm['token']}){
    try{
        const url = `/auth/update-password/${token}`
        const response = await api.post<string>(url, formData)
        return response.data
    }catch(error){
        if(isAxiosError(error) && error.response){
            throw new Error(error.response.data.error)
        }
    }
}

export async function getUser(){
    try{
        const { data } = await api.get('/auth/user')
        const response = userSchema.safeParse(data)
        if(response.success){
            return response.data
        }
    }catch(error){
        if(isAxiosError(error) && error.response){
            throw new Error(error.response.data.error)
        }
    }
}