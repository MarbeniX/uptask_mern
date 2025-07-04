import { useForm } from "react-hook-form"
import { NoteContent } from "@/types/index"
import ErrorMessage from "../ErrorMessage"
import { useLocation, useParams } from "react-router-dom"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { craeteNote } from "@/services/NoteService"
import { toast } from "react-toastify"

export default function AddNoteForm() {
    const params = useParams()
    const projectId = params.id!

    const location = useLocation()
    const query = new URLSearchParams(location.search)
    const taskId = query.get('viewTask')!

    const queryClient = useQueryClient()
    const { mutate } = useMutation({
        mutationFn: craeteNote, 
        onError: (error) => {
            toast.error(error.message)
        },
        onSuccess: (data) => {
            toast.success(data)
            queryClient.invalidateQueries({ queryKey: ['viewTask', taskId] })
        }
    })

    const initialValues : NoteContent = {
        content: ''
    }
    const { register, handleSubmit, formState: { errors }, reset } = useForm({
        defaultValues: initialValues,
    })
    const handleCreateNote = (formData: NoteContent) => {
        mutate({content: formData, projectId, taskId})
        reset()
    }

    return (
        <form
            onSubmit={handleSubmit(handleCreateNote)}
            className="bg-white rounded mb-4"
            noValidate
        >
            <label className="font-bold" htmlFor="content">Crete note</label>
            <input 
                type="text" 
                id="content"
                placeholder="Write your note here..."
                className="w-full border border-slate-300 rounded-md p-2 mt-2 mb-4"
                {...register('content', {
                    required: 'Content is required', 
                })}
            />
            {errors.content && (
                <ErrorMessage>{errors.content.message}</ErrorMessage>
            )}

            <input
                type="submit"
                value="Add Note"                
                className="bg-fuchsia-600 hover:bg-fuchsia-700 cursor-pointer rounded-lg fond-bold w-full p-2 text-center text-black"
            />
        </form>
    )
}
