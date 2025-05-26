import { Navigate, useParams } from "react-router-dom"
import { useQuery } from "@tanstack/react-query"
import { getProjectById } from "@/services/ProjectService"
import EditProjectForm from "@/components/projects/EditProjectForm"

export default function ProjectEdit() {
    const params = useParams()
    const projectID = params.id!

    const { data, isLoading, isError } = useQuery({
        queryKey: ['editProject', projectID],
        queryFn: () => getProjectById(projectID),
        retry: false
    })

    if (isLoading) return <div>Loading...</div>
    if (isError) return <Navigate to="/404" />
    if (data) return <EditProjectForm data={data} projectId={projectID}/>
}
