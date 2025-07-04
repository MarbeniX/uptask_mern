import ProfileForm from "@/components/profile/ProfileForm";
import { userAuth } from "@/hooks/userAuth";

export default function ProfileView() {
    const { data, isLoading } = userAuth() 

    if (isLoading) return <p>Cargando...</p>
    if(data) return <ProfileForm data={data} />
}
