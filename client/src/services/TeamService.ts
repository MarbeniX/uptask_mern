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