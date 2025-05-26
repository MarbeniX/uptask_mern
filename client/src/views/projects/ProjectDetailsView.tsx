import { Link, useNavigate, useParams } from "react-router-dom"
import { useQuery } from "@tanstack/react-query"
import { getProjectById } from "@/services/ProjectService"
import AddTaskModal from "../../components/tasks/AddTaskModal"
import TaskList from "@/components/tasks/TaskList"
import EditTaskData from "@/components/tasks/EditTaskData"
import TaskModalDetails from "@/components/tasks/TaskModalDetails"

export default function ProjectEdit() {
    const navigate = useNavigate()

    const params = useParams()
    const projectID = params.id!

    const { data, isLoading, error } = useQuery({
        queryKey: ['editProject', projectID],
        queryFn: () => getProjectById(projectID),
        retry: false
    })

    if (isLoading) return <div>Loading...</div>
    if (error) console.log(error)
    if (data) return (
        <>
            <h1 className="text-5xl font-black">{data.projectName}</h1>
            <p className="text-2xl font-light text-gray-500 mt-5">{data.description}</p>

            <nav className="my-5 flex gap-5">
                <button 
                    className="bg-purple-400 hover:bg-purple-500 px-10 py-3 text-white text-xl font-bold cursor-pointer transition-colors"
                    type = "button"
                    onClick={() => navigate('?newtask=true')}
                >Agregar Tarea</button>
                <Link 
                    to={'team'}
                    className="bg-fuchsia-700 hover:bg-fuchsia-600 px-10 py-3 text-white text-xl font-bold cursor-pointer transition-colors"
                >Colaboradores</Link>
            </nav>
            
            <TaskList tasks={data.tasks}/>

            <AddTaskModal/>
            <EditTaskData/>
            <TaskModalDetails/>
        </>
    )
}