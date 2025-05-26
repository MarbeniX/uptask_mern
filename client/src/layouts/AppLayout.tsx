import { Outlet, Navigate } from "react-router-dom"
import { ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import Logo from "@/components/Logo"
import NavMenu from "@/components/NavMenu"
import { userAuth } from "@/hooks/userAuth"

export default function AppLayout() {

    const { data, isLoading, isError } = userAuth()

    if(isLoading) return <p>Cargando...</p>
    if(isError) return <Navigate to="/auth/login" replace/>

    if(data) return (
        <>
            <header className="bg-gray-800 py-5">
                <div className="max-w-screen-2xl mx-auto flex flex-col lg:flex-row justify-between items-center">
                    <div className="w-64">
                        <Logo/>
                    </div>
                <NavMenu
                    username={data.username}
                />
                </div>
            </header>

            <section className="max-w-screen-2xl mx-auto mt-10 p-5">
                <Outlet/>
            </section>

            <footer className="py-5">
                <p className="text-center">
                    Todos los derechos reservados {new Date().getFullYear()}
                </p>
            </footer>

            <ToastContainer
                position="top-right"
                autoClose={2500}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                draggable
                pauseOnHover={false}
                pauseOnFocusLoss={false}                
            />
        </>
    )
}
