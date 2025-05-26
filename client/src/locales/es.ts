type StatusTasks = {
    [key: string] : string
}

export const statusTranslations : StatusTasks = {
    pending: 'Pendiente',
    onHold: 'En Espera',
    inProgress: 'En Progreso',
    underReview: 'En Revisión',
    completed: 'Completada'
}