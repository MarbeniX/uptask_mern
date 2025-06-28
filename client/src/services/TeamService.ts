import api from "@/lib/axios";
import { isAxiosError } from "axios";
import { Project, TeamMember, TeamMemberForm } from "../types";

export async function findUserByEmail({projectId, formData}: {projectId: Project['_id'], formData: TeamMemberForm}){
    try{
        const url = `/projects/${projectId}/team/find`
        const response = await api.post<TeamMember>(url, formData)
        if(response){
            return response.data
        }
    }catch(error){
        if(isAxiosError(error) && error.response){
            throw new Error(error.response.data.error)
        }
    }
}

export async function addMemberToProject({projectId, userId} : {projectId: Project['_id'], userId: TeamMember['_id']}) {
    try {
        const url = `/projects/${projectId}/team`
        const response = await api.post<TeamMember>(url, { id: userId })
        if (response) {
            return response.data
        }
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.error)
        }
    }
}

export async function getProjectTeam({projectId} : {projectId: Project['_id']}){
    try{
        const url = `/projects/${projectId}/team`
        const response = await api.get<TeamMember[]>(url)
        if(response){
            return response.data
        }
    }catch(error){
        if(isAxiosError(error) && error.response){
            throw new Error(error.response.data.error)
        }
    }
}

export async function removeMemberFromProject({projectId, userId} : {projectId: Project['_id'], userId: TeamMember['_id']}) {
    try{
        const url = `/projects/${projectId}/team`
        const response = await api.delete<string>(url, { data: { id: userId } })
        if(response){
            return response.data
        }
    }catch(error){
        if(isAxiosError(error) && error.response){
            throw new Error(error.response.data.error)
        }
    }
}