import { isAxiosError } from "axios";
import { ChangePasswordForm, UserFormData } from "../types";
import api from "@/lib/axios";

export async function updateProfile(formData: UserFormData){
    try{
        const url = '/auth/profile'
        const { data } = await api.put(url, formData)
        return data
    }catch(error){
        if(isAxiosError(error) && error.response){
            throw new Error(error.response.data.error)
        }
        throw error
    }
}

export async function updateProfilePassword(formData: ChangePasswordForm){
    try{
        const url = '/auth/profile/update-password'
        const { data } = await api.post(url, formData)
        return data
    }catch(error){
        if(isAxiosError(error) && error.response){
            throw new Error(error.response.data.error)
        }
        throw error
    }
}