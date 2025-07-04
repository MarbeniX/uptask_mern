import { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { Navigate, useLocation, useNavigate, useParams } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { getTaskById, updateTaskModal } from '@/services/TaskService';
import { toast } from 'react-toastify';
import { formatDate } from '@/utils/utils';
import { statusTranslations } from '@/locales/es';
import { TaskStatus } from '@/types/index';
import NotesPanel from '../notes/NotesPanel';

export default function TaskModalDetails() {
    const params = useParams()
    const projectId = params.id!

    const navigate = useNavigate()

    const location = useLocation()
    const query = new URLSearchParams(location.search)
    const viewTask = query.get('viewTask')!
    const show = viewTask ? true : false

    const {data, isError, error} = useQuery({
        queryKey: ['viewTask', viewTask],
        queryFn: () => getTaskById({projectId, taskId: viewTask}),
        enabled: !!show,
        retry: false
    })

    const queryClient = useQueryClient()
    const { mutate } = useMutation({
        mutationFn: updateTaskModal,
        onError: (error) => {
            toast.error(error.message, {toastId: 'error'})
        },
        onSuccess: (data) => {
            queryClient.invalidateQueries({queryKey: ['editProject', projectId]})
            queryClient.invalidateQueries({queryKey: ['viewTask', viewTask]})
            toast.success(data, {toastId: 'success'})
            navigate(location.pathname, {replace: true})
        }
    })

    const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const status = e.target.value as TaskStatus
        const data = {
            projectId,
            taskId: viewTask,
            status
        }
        mutate(data)
    }

    if(isError){
        toast.error(error.message, {toastId: 'error'})
        return <Navigate to={`/projects/${projectId}`}/>
    }

    if(data)return(
        <>
            <Transition appear show={show} as={Fragment}>
                <Dialog as="div" className="relative z-10" onClose={() => navigate(location.pathname, {replace: true})} >
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
                                    <p className='text-sm text-slate-400'>Agregada el: {formatDate(data.createdAt)}</p>
                                    <p className='text-sm text-slate-400'>Última actualización: {formatDate(data.updatedAt)}</p>
                                    <Dialog.Title
                                        as="h3"
                                        className="font-black text-4xl text-slate-600 my-5"
                                    >{data?.name}
                                    </Dialog.Title>
                                    <p className='text-lg text-slate-500 mb-2'>Descripción: {data.description}</p>

                                    {data.completedBy && data.completedBy.length > 0 && (
                                        <>
                                            <p className='text-slate-600 mb-2 font-bold text-2xl'>Historial de cambios</p>
                                            {data.completedBy && (
                                                <ul className='list-decimal pl-5'>
                                                {data.completedBy.map((user) => (
                                                    <li key={user._id} className='text-lg text-slate-400 mb-2'>
                                                            {user.user.username} - {statusTranslations[user.status]}
                                                        </li>
                                                    ))}
                                                </ul>
                                            )}
                                        </>
                                    )}


                                    <div className='my-5 space-y-3'>
                                        <label className='font-bold'>Estado Actual:
                                            <select 
                                                className='w-full border border-slate-300 rounded-md p-2'
                                                defaultValue={data.status}
                                                onChange={handleChange}
                                            >
                                                {Object.entries(statusTranslations).map(([status, translation]) => (
                                                    <option key={status} value={status}>{translation}</option>
                                                ))}
                                            </select>
                                        </label>
                                    </div>

                                    <NotesPanel notes={data.notes}/>
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                </Dialog>
            </Transition>
        </>
    )
}