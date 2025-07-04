import { userAuth } from "@/hooks/userAuth"
import { deleteNote } from "@/services/NoteService"
import { Note2 } from "@/types/index"
import { formatDate } from "@/utils/utils"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useLocation, useParams } from "react-router-dom"
import { toast } from "react-toastify"

type NoteDetailProps = {
    nota: Note2
}

export default function NoteDetail({ nota }: NoteDetailProps) {  
    const params = useParams()
    const projectId = params.id!

    const location = useLocation()
    const query = new URLSearchParams(location.search)
    const taskId = query.get('viewTask')!
    
    const { data, isLoading } = userAuth()

    const queryClient = useQueryClient()
    const { mutate } = useMutation({
        mutationFn: deleteNote, 
        onError: (error) => {
            toast.error(error.message)
        },
        onSuccess: (data) => {
            toast.success(data)
            queryClient.invalidateQueries({ queryKey: ['viewTask', taskId] })
        }
    })
    const handleDeleteNote = () => {
        mutate({projectId: projectId, taskId, noteId: nota._id})
    }

    if (isLoading) return <p>Loading...</p>
    if(data)return (
        <div className="p-3 flex justify-between items-center">
            <div>
                <p>
                    {nota.content} por <span className="font-bold">{nota.createdBy.username}</span>
                </p>
                <p className="text-xs text-slate-500">
                    {formatDate(nota.createdAt)}
                </p>
            </div>

            {data._id === nota.createdBy._id && (
                <button
                    onClick={handleDeleteNote}
                    className="flex items-center justify-center"
                >
                    <span className="bg-fuchsia-500 p-2 text-white text-sm hover:bg-fuchsia-600 rounded-md cursor-pointer">
                        Eliminar
                    </span>
                </button>
            )}
        </div>
    )
}
