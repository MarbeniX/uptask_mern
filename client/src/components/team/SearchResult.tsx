import { addMemberToProject } from "@/services/TeamService"
import { TeamMember } from "@/types/index"
import { useMutation } from "@tanstack/react-query"
import { toast, ToastContainer } from "react-toastify"
import { useParams } from "react-router-dom"
import { useNavigate } from "react-router-dom"
import { useQueryClient } from "@tanstack/react-query"

type SearchResultProps = {
    user: TeamMember,
    reset: () => void
}

export default function SearchResult({user, reset}: SearchResultProps) {
    const navigate = useNavigate()
    const params = useParams()
    const projectId = params.id!
    const queryClient = useQueryClient()

    const { mutate } = useMutation({
        mutationFn: addMemberToProject, 
        onSuccess: () => {
            toast.success('Usuario agregado al proyecto correctamente')
            reset() 
            navigate(location.pathname, { replace: true })
            queryClient.invalidateQueries({ queryKey: ['teamMembers', projectId] })
        }, 
        onError: (error: Error) => {
            toast.error(error.message)
        }
    })

    const handeAddMemberToProject = () => {
        const data = {
            projectId: projectId, // Assuming user has projectId
            userId: user._id
        }
        mutate(data)
    }

    return (
        <>
            <p className="font-bold text-2xl text-center mt-7">Usuario Encontrado</p>
            <div className="flex justify-between items-center mt-7">
                <p>
                    {user.username} <br />
                </p>
                <button 
                    className="text-purple-600 hover:bg-purple-100 px-10 py-3 font-bold cursor-pointer"
                    onClick={handeAddMemberToProject}
                >
                    Agregar al Proyecto
                </button>
            </div>

            <ToastContainer />
        </>
    )
}
