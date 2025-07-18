import { BrowserRouter, Routes, Route } from "react-router-dom";
import AppLayout from "./layouts/AppLayout";
import DashBoardView from "./views/DashBoardView";
import CreateProjectView from "./views/projects/CreateProjectView";
import ProjectEdit from "./views/projects/ProjectEdit";
import ProjectDetailsView from "./views/projects/ProjectDetailsView";
import AuthLayout from "./layouts/AuthLayout";
import LoginView from "./views/auth/LoginView";
import RegisterView from "./views/auth/RegisterView";
import ConfirmAccountView from "./views/auth/ConfirmAccountView";
import RequestNewCodeView from "./views/auth/RequestNewCodeView";
import ForgotPasswordView from "./views/auth/ForgotPasswordVew";
import NewPasswordView from "./views/auth/NewPasswordView";
import ProjectTeasmView from "./views/projects/ProjectTeasmView";
import ProfileLayout from "./layouts/ProfileLayout";
import ProfileView from "./views/profile/ProfileView";
import ChangePasswordView from "./views/profile/ChangePasswordView";
import NotFound from "./views/404/NotFound";

export default function Router(){
    return(
        <BrowserRouter>
            <Routes>
                <Route element={<AppLayout/>}>
                    <Route path='/' element={<DashBoardView/>} index/>
                    <Route path='/projects/create' element={<CreateProjectView/>} />
                    <Route path='/projects/:id' element={<ProjectDetailsView/>} />
                    <Route path='/projects/:id/edit' element={<ProjectEdit/>} />
                    <Route path='/projects/:id/team' element={<ProjectTeasmView/>} />
                    <Route element={<ProfileLayout/>}>
                        <Route path='/profile' element={<ProfileView/>} index />
                        <Route path='/profile/change-password' element={<ChangePasswordView/>} />
                    </Route>
                </Route>

                <Route element={<AuthLayout/>}>
                    <Route path='/auth/login' element={<LoginView/>} />
                    <Route path='/auth/register' element={<RegisterView/>} />
                    <Route path='/auth/confirm-account' element={<ConfirmAccountView/>} />
                    <Route path='/auth/request-code' element={<RequestNewCodeView/>} />
                    <Route path='/auth/forgot-password' element={<ForgotPasswordView/>} />
                    <Route path='/auth/new-password' element={<NewPasswordView/>} />
                </Route>

                <Route element={<AppLayout/>}>
                    <Route path="*" element={<NotFound/>}/>
                </Route>
            </Routes>
        </BrowserRouter>
    )
}