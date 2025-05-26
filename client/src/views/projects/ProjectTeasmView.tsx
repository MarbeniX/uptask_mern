import AddMemberModal from "@/components/team/AddMemberModal";
import { Link, useNavigate, useParams } from "react-router-dom";

export default function ProjectTeasmView() {
    const params = useParams()
    const projectID = params.id!
    const navigate = useNavigate()
    return (
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

            <AddMemberModal />
        </>
    )
}
