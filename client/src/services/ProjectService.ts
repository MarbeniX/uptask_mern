import api from "@/lib/axios";
import { isAxiosError } from "axios";
import { Project, ProjectFormData, projectListSchema, projectSchema } from "../types";

export async function createProject(formData : ProjectFormData){
    try{
        const { data } = await api.post<string>('/projects', formData)
        return data
    }catch(error){
        if(isAxiosError(error) && error.response){
            throw new Error(error.response.data.error)
        }
    }
}

export async function getProjects(){
    try{
        const { data } = await api.get('/projects')
        console.log(data)
        const result = projectListSchema.safeParse(data)
        console.log(result)
        if(result.success){
            return result.data
        }else{
            throw new Error("Error al obtener los proyectos")
        }
    }catch(error){
        if(isAxiosError(error) && error.response){
            throw new Error(error.response.data.error)
        }
        throw error
    }
}

export async function getProjectById(id: Project['_id']){
    try{
        const { data } = await api.get(`/projects/${id}`)
        console.log(data)
        const result = projectSchema.safeParse(data)
        console.log(result)
        if(result.success){
            return result.data
        }else{
            throw new Error("Error al obtener el proyecto")
        }
    }catch(error){
        if(isAxiosError(error) && error.response){
            throw new Error(error.response.data.error)
        }
        throw error
    }
}

type ProjectUpdateData = {
    formData: ProjectFormData,
    projectId: Project['_id']
}

export async function updateProjectById({formData, projectId} : ProjectUpdateData){
    try{
        const { data } = await api.put<string>(`/projects/${projectId}`, formData)
        return data
    }catch(error){
        if(isAxiosError(error) && error.response){
            throw new Error(error.response.data.error)
        }
    }
}

export async function deleteProjectById(projectId: Project['_id']){
    try{
        const { data } = await api.delete<string>(`/projects/${projectId}`)
        return data
    }catch(error){
        if(isAxiosError(error) && error.response){
            throw new Error(error.response.data.error)
        }
    }

}