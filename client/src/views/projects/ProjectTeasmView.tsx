import AddMemberModal from "@/components/team/AddMemberModal";
import { Link, Navigate, useNavigate, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getProjectTeam, removeMemberFromProject } from "@/services/TeamService";
import { Menu, Transition } from "@headlessui/react";
import { Fragment } from "react";
import { EllipsisVerticalIcon } from "@heroicons/react/24/outline";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { TeamMember } from "@/types/index";
import { useQueryClient } from "@tanstack/react-query";

export default function ProjectTeasmView() {
    const params = useParams()
    const projectID = params.id!
    const navigate = useNavigate()
    const queryClient = useQueryClient()

    const { data: teamMembers, isLoading, isError } = useQuery({
        queryKey: ['teamMembers', projectID],
        queryFn: () => getProjectTeam({ projectId: projectID }),
        retry: false,
    })

    const { mutate: removeMember } = useMutation({
        mutationFn: removeMemberFromProject, 
        onError: (error: Error) => {
            toast.error(error.message)
        },
        onSuccess: () => {
            toast.success('Usuario eliminado del proyecto correctamente')
            navigate(location.pathname, { replace: true })
            queryClient.invalidateQueries({ queryKey: ['teamMembers', projectID] })
        }
    })
    const handleRemoveMember = (userId: TeamMember['_id']) => {
        const data = {
            projectId: projectID,
            userId
        }
        removeMember(data)
    }

    if (isLoading) return <p className="text-center text-2xl font-bold">Cargando...</p>
    if (isError) return <Navigate to={'/404'} replace={true} />
    if(teamMembers)return (
        <>
            <h1 className="text-5xl font-black">Administrar Equipo</h1>
            <p className="text-2xl font-light text-gray-500 mt-5">Administra el equipo de trabajo para este projecto</p>

            <nav className="my-5 flex gap-5">
                <button 
                    className="bg-purple-400 hover:bg-purple-500 px-10 py-3 text-white text-xl font-bold cursor-pointer transition-colors"
                    type = "button"
                    onClick={() => navigate('?addMember=true')}
                >Agregar colaborador</button>
                <Link 
                    to={`/projects/${projectID}`}
                    className="bg-fuchsia-700 hover:bg-fuchsia-600 px-10 py-3 text-white text-xl font-bold cursor-pointer transition-colors"
                >Regresar a projecto</Link>
            </nav>

            <h2 className="text-5xl font-black my-10">Miembros actuales</h2>
            {teamMembers.length ? (
                <ul role="list" className="divide-y divide-gray-100 border border-gray-100 mt-10 bg-white shadow-lg">
                    {teamMembers?.map((member) => (
                        <li 
                            className="flex justify-between gap-x-6 px-5 py-10"
                            key={member._id}
                        >
                            <div className="flex min-w-0 gap-x-4">
                                <div className="min-w-0 flex-auto space-y-2">
                                    <p className="text-2xl font-black text-gray-600">
                                        {member.username}
                                    </p>
                                    <p className="text-sm text-gray-400">
                                        {member.email}
                                    </p>
                                </div>
                            </div>
                            <div className="flex shrink-0 items-center gap-x-6">
                                <Menu as="div" className="relative flex-none">
                                    <Menu.Button className="cursor-pointer -m-2.5 block p-2.5 text-gray-500 hover:text-gray-900">
                                            <span className="sr-only">opciones</span>
                                            <EllipsisVerticalIcon className="h-9 w-9" aria-hidden="true" />
                                    </Menu.Button>
                                    <Transition
                                        as={Fragment}
                                        enter="transition ease-out duration-100"
                                        enterFrom="transform opacity-0 scale-95"
                                        enterTo="transform opacity-100 scale-100"
                                        leave="transition ease-in duration-75"
                                        leaveFrom="transform opacity-100 scale-100"
                                        leaveTo="transform opacity-0 scale-95"
                                    >
                                        <Menu.Items className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white py-2 shadow-lg ring-1 ring-gray-900/5 focus:outline-none">
                                            <Menu.Item>
                                                <button
                                                    type='button'
                                                    className='cursor-pointer block px-3 py-1 text-sm leading-6 text-red-500'
                                                    onClick={() => handleRemoveMember(member._id)}
                                                >
                                                    Eliminar del Proyecto
                                                </button>
                                            </Menu.Item>
                                        </Menu.Items>
                                    </Transition>
                                </Menu>
                            </div>
                        </li>
                    ))}
                </ul>
            ) : (
                <p className='text-center py-20'>No hay miembros en este equipo</p>
            )}

            <AddMemberModal />
        </>
    )
}
