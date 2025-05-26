import type { ConfirmAccountForm, NewPasswordForm } from "../../types";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import ErrorMessage from "@/components/ErrorMessage";
import { toast, ToastContainer } from "react-toastify";
import { useMutation } from "@tanstack/react-query";
import { updatePassword } from "@/services/AuthService";

type NewPasswordFormProps = {
    token: ConfirmAccountForm['token']
}

export default function NewPasswordForm({token} : NewPasswordFormProps) {
    const navigate = useNavigate()
    const initialValues: NewPasswordForm = {
        password: '',
        passwordConfirmation: '',
    }

    const { mutate } = useMutation({
        mutationFn: updatePassword,
        onError: (error) => {
            toast.error(error.message)
        },
        onSuccess: (data) => {
            toast.success(data)
        } 
    })

    const { register, handleSubmit, watch, reset, formState: { errors } } = useForm({ defaultValues: initialValues });

    const handleNewPassword = (formData : NewPasswordForm) => {
        const data = {
            formData,
            token
        }
        mutate(data)
        reset()
        navigate('/auth/login')
    }

    const password = watch('password');

    return (
        <>
            <form
                onSubmit={handleSubmit(handleNewPassword)}
                className="space-y-8 p-10  bg-white mt-10"
                noValidate
            >

                <div className="flex flex-col gap-5">
                    <label
                        className="font-normal text-2xl"
                    >Password</label>

                    <input
                        type="password"
                        placeholder="Password de Registro"
                        className="w-full p-3  border-gray-300 border"
                        {...register("password", {
                            required: "El Password es obligatorio",
                            minLength: {
                                value: 8,
                                message: 'El Password debe ser mínimo de 8 caracteres'
                            }
                        })}
                    />
                    {errors.password && (
                        <ErrorMessage>{errors.password.message}</ErrorMessage>
                    )}
                </div>

                <div className="flex flex-col gap-5">
                    <label
                        className="font-normal text-2xl"
                    >Repetir Password</label>

                    <input
                        id="password_confirmation"
                        type="password"
                        placeholder="Repite Password de Registro"
                        className="w-full p-3  border-gray-300 border"
                        {...register("passwordConfirmation", {
                            required: "Repetir Password es obligatorio",
                            validate: value => value === password || 'Los Passwords no son iguales'
                        })}
                    />

                    {errors.passwordConfirmation && (
                        <ErrorMessage>{errors.passwordConfirmation.message}</ErrorMessage>
                    )}
                </div>

                <input
                    type="submit"
                    value='Establecer Password'
                    className="bg-fuchsia-600 hover:bg-fuchsia-700 w-full p-3  text-white font-black  text-xl cursor-pointer"
                />
            </form>

            <ToastContainer
                position="top-right"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
            />
        </>
    )
}