import { z } from "zod";

/** Auth amd Users */
export const authSchema = z.object({
    username: z.string(),
    email: z.string().email(),
    password: z.string(),
    passwordConfirmation: z.string(),
    token: z.string(),
})

export const changePasswordSchema = authSchema.pick({
    password: true,
    passwordConfirmation: true
}).extend({
    newPassword: z.string(),
})

export type Auth = z.infer<typeof authSchema>
export type UserLoginForm = Pick<Auth, 'email' | 'password'>
export type UserRegistrationForm = Pick<Auth, 'username' | 'email' | 'password' | 'passwordConfirmation'>
export type ConfirmAccountForm = Pick<Auth, 'token'>
export type RequestConfirmationCodeForm = Pick<Auth, 'email'>
export type ForgotPasswordForm = Pick<Auth, 'email'>
export type NewPasswordForm = Pick<Auth, 'password' | 'passwordConfirmation'>
export type ChangePasswordForm = z.infer<typeof changePasswordSchema>
export type VerifyPasswordForm = Pick<Auth, 'password'>

/** Users */
export const userSchema = authSchema.pick({
    username: true,
    email: true
}).extend({
    _id: z.string()
})

export type User = z.infer<typeof userSchema>
export type UserFormData = Pick<User, 'username' | 'email'>

/**Notes */
export const noteSchema = z.object({
    _id: z.string(),
    content: z.string(),
    project: z.string(),
    createdBy: userSchema,
    createdAt: z.string(),
})

export const noteSchema2 = noteSchema.omit({
    project: true,
})

export type Note = z.infer<typeof noteSchema>
export type NoteContent = Pick<Note, 'content'>
export type Note2 = Omit<Note, 'project'>

/**Tasks */
export const taskStatusSchema = z.enum(['pending', 'onHold', 'inProgress', 'underReview', 'completed'])
export type TaskStatus = z.infer<typeof taskStatusSchema>

export const taskSchema = z.object({
    _id: z.string(),
    name: z.string(),
    description: z.string(),
    project: z.string(),
    status: taskStatusSchema,
    completedBy: z.array(
        z.object({
            user: userSchema, 
            status: taskStatusSchema,
            _id: z.string()
        })
    ),
    notes: z.array(noteSchema2),
    createdAt: z.string(),
    updatedAt: z.string(),
})

export type Task = z.infer<typeof taskSchema>
export type TaskFormData = Pick<Task, 'name' | 'description'>

/**Projects */
export const projectSchema = z.object({
    _id: z.string(),
    projectName: z.string(),
    clientName: z.string(),
    description: z.string(),
    manager: z.string(),
    tasks: z.array(taskSchema),
})

export const projectSchema2 = z.object({
    _id: z.string(),
    projectName: z.string(),
    clientName: z.string(),
    description: z.string(),
    manager: z.string(),
    tasks: z.array(z.string()), // Array of task IDs
})

export const projectListSchema = z.array(projectSchema2)

export type Project = z.infer<typeof projectSchema>
export type ProjectFormData = Pick<Project, 'clientName' | 'description' | 'projectName'>

/** Teams */
export const teamMemberSchema = userSchema.pick({
    username: true,
    _id: true,
    email: true,
})
export type TeamMember = z.infer<typeof teamMemberSchema>
export type TeamMemberForm = Pick<TeamMember, 'email'>