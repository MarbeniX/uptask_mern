import { getUser } from "@/services/AuthService"
import { useQuery } from "@tanstack/react-query"

export const userAuth = () => {
    const { data , isLoading, isError} = useQuery({
        queryKey: ['user'],
        queryFn: getUser,
        retry: 1,
        refetchOnWindowFocus: false
    })

    return{ data, isLoading, isError}
}