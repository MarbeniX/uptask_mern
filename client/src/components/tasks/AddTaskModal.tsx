import { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import TaskForm from './TaskForm';
import { TaskFormData } from '@/types/index';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createTask } from '@/services/TaskService';
import { toast } from 'react-toastify';

export default function AddTaskModal() {
    const navigate = useNavigate()

    /**Read if modal exists */
    const location = useLocation()
    //console.log(location.search)
    const queryParams = new URLSearchParams(location.search)
    //console.log(queryParams)
    const modalTask = queryParams.get('newtask')
    //console.log(modalTask)
    const show = modalTask ? true : false
    //console.log(show)

    /**Get projectId */
    const params = useParams()
    const projectId = params.id!

    const initialValues : TaskFormData = {
        name: '',
        description: '',
    }

    const { register, handleSubmit, formState: { errors }, reset } = useForm({defaultValues: initialValues })

    const queryClient = useQueryClient()
    const mutation = useMutation({
        mutationFn: createTask,
        onError: (error) => {
            toast.error(error.message)
        },
        onSuccess: (data) => {
            queryClient.invalidateQueries({queryKey: ['editProject', projectId]})
            toast.success(data)
            navigate(location.pathname)
            reset()
        }
    })

    const handleAddTask = (formData: TaskFormData) => {
        const data = {
            formData,
            projectId
        }
        mutation.mutate(data) 
    }

    return (        

        <>
            <Transition appear show={show} as={Fragment}>
                <Dialog as="div" className="relative z-10" onClose={() => navigate(location.pathname, {replace: true})}>
                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <div className="fixed inset-0 bg-black/60" />
                    </Transition.Child>

                    <div className="fixed inset-0 overflow-y-auto">
                        <div className="flex min-h-full items-center justify-center p-4 text-center">
                            <Transition.Child
                                as={Fragment}
                                enter="ease-out duration-300"
                                enterFrom="opacity-0 scale-95"
                                enterTo="opacity-100 scale-100"
                                leave="ease-in duration-200"
                                leaveFrom="opacity-100 scale-100"
                                leaveTo="opacity-0 scale-95"
                            >
                                <Dialog.Panel className="w-full max-w-4xl transform overflow-hidden rounded-2xl bg-white text-left align-middle shadow-xl transition-all p-16">
                                    <Dialog.Title
                                        as="h3"
                                        className="font-black text-4xl  my-5"
                                    >
                                        Nueva Tarea
                                    </Dialog.Title>

                                    <p className="text-xl font-bold">Llena el formulario y crea  {''}
                                        <span className="text-fuchsia-600">una tarea</span>
                                    </p>

                                    <form
                                        className='mt-10 space-y-3'
                                        noValidate
                                        onSubmit={handleSubmit(handleAddTask)}
                                    >
                                        <TaskForm 
                                            errors={errors}
                                            register={register}
                                        />

                                        <input 
                                            type="submit" 
                                            className='bg-fuchsia-600 hover:bg-fuchsia-600 w-full p-3 text-white uppercase font-bold cursor-pointer transition-colors'
                                            value='Guardar Tarea'
                                        />
                                        
                                    </form>

                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                </Dialog>
            </Transition>
        </>
    )
}