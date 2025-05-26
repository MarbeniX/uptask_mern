import { Link, useNavigate } from "react-router-dom"
import { useForm } from "react-hook-form"
import { useMutation } from "@tanstack/react-query"
import ProjectForm from "@/components/projects/ProyectForm"
import { ProjectFormData } from "@/types/index"
import { createProject } from "@/services/ProjectService"
import { toast } from "react-toastify"

export default function CreateProjectView() {
    const navigate = useNavigate()

    const initialValues : ProjectFormData = {
        projectName: "", 
        clientName: "", 
        description: ""
    }

    const { register, handleSubmit, formState: {errors}} = useForm({defaultValues: initialValues})

    const mutation = useMutation({
        mutationFn: createProject,
        onError: (error) => {
            toast.error(error.message)
        },
        onSuccess: (data) => {
            toast.success(data)
            navigate('/')
        }
    })
    //comentarioasdf
    const handleForm = (data : ProjectFormData) => {
        mutation.mutate(data)
    }
    return (
        <>
            <div className="max-w-3xl mx-auto">
                <h1 className="text-5xl font-black">Crear Proyecto</h1>
                <p className="text-2xl font-light text-gray-500 mt-5">Llena el siguiente formulario para crear un proyecto</p>

                <nav className=" my-5">
                    <Link
                        className="bg-purple-400 hover:bg-purple-500 px-10 py-3 text-white text-xl font-bold cursor-pointer transition-colors"
                        to={'/'}
                    >
                        Volver a proyectos
                    </Link>
                </nav>

                <form 
                    action="" 
                    className="mt-10 bg-white shadow-lg p-10 rounded-lg"
                    onSubmit={handleSubmit(handleForm)}
                    noValidate
                >
                    <ProjectForm
                        register={register}
                        errors={errors}
                    />

                    <input 
                        type="submit" 
                        value="Crear Proyecto" 
                        className=" bg-fuchsia-600 w-full p-3 text-white uppercase font-bold cursor-pointer transition-colors"
                    />
                </form>
            </div>
        </>    
    )
}
