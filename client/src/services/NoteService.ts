import { isAxiosError } from "axios";
import { Note, NoteContent, Project, Task } from "../types";
import api from "@/lib/axios";

type NoteAPITypes = {
    content: NoteContent,
    projectId: Project['_id'],
    taskId: Task['_id'], 
    noteId: Note['_id']
}

export async function craeteNote({content, projectId, taskId}: Pick<NoteAPITypes, 'content' | 'projectId' | 'taskId'>){
    try{
        const url = `/projects/${projectId}/tasks/${taskId}/note`
        const response = await api.post<string>(url, content)
        return response.data
    }catch(error){
        if(isAxiosError(error) && error.response){
            throw new Error(error.response.data.error)
        }
    }
}

export async function deleteNote({projectId, taskId, noteId}: Pick<NoteAPITypes, 'projectId' | 'taskId' | 'noteId'>){
    try{
        const url = `/projects/${projectId}/tasks/${taskId}/note/${noteId}`
        const response = await api.delete<string>(url)
        return response.data
    }catch(error){
        if(isAxiosError(error) && error.response){
            throw new Error(error.response.data.error)
        }
    }
}