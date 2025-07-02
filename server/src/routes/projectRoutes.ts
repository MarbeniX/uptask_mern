import { Router } from 'express'
import { ProjectController } from '../controllers/ProjectController'
import { body, param } from 'express-validator'
import { handleInputErrors } from '../middlewares/validation'
import { TasksController } from '../controllers/TaskController'
import { validateProjectExists } from '../middlewares/project'
import { hasAuthorization, validateTasksExists } from '../middlewares/tasks'
import { authenticate } from '../middlewares/auth'
import { TeamController } from '../controllers/TeamController'
import { NoteController } from '../controllers/NoteController'

const router = Router()

router.use(authenticate)

router.post('/', 
    body('projectName')
        .notEmpty().withMessage('Project name is required'),
    body('clientName')
        .notEmpty().withMessage('Client name is required'),
    body('description')
        .notEmpty().withMessage('Description is required'),
    handleInputErrors,
    ProjectController.createProject
)

router.get('/',
    ProjectController.getAllProjects)

router.get('/:id', 
    param('id').isMongoId().withMessage('Invalid project ID'),
    handleInputErrors,
    ProjectController.getProjectById
)

router.put('/:id',
    param('id').isMongoId().withMessage('Invalid project ID'),
    body('projectName')
        .notEmpty().withMessage('Project name is required'),
    body('clientName')
        .notEmpty().withMessage('Client name is required'),
    body('description')
        .notEmpty().withMessage('Description is required'),
    handleInputErrors,
    ProjectController.updateProject    
)

router.delete('/:id',
    param('id').isMongoId().withMessage('Invalid project ID'),
    handleInputErrors,
    ProjectController.deleteProject
)

/**Routes for tasks */
router.param('projectId', validateProjectExists)
router.param('taskId', validateTasksExists)

router.post('/:projectId/tasks',
    body('name')
        .notEmpty().withMessage('Task name is required'),
    body('description')
        .notEmpty().withMessage('Description is required'),
    handleInputErrors,
    TasksController.createTask
)

router.get('/:projectId/tasks',
    TasksController.getProjectTasks
)

router.get('/:projectId/tasks/:taskId',
    param('taskId')
        .isMongoId().withMessage('Invalid task ID'),
    handleInputErrors,
    TasksController.getTaskById
)

router.put('/:projectId/tasks/:taskId',
    hasAuthorization,
    param('taskId')
        .isMongoId().withMessage('Invalid task ID'),
    body('name')
        .notEmpty().withMessage('Task name is required'),
    body('description')
        .notEmpty().withMessage('Description is required'),
    handleInputErrors,
    TasksController.updateTask 
)

router.delete('/:projectId/tasks/:taskId',
    hasAuthorization,
    param('taskId')
        .isMongoId().withMessage('Invalid task ID'),
    handleInputErrors,
    TasksController.deleteTask
)

router.post('/:projectId/tasks/:taskId/status',
    param('taskId')
        .isMongoId().withMessage('Invalid task ID'),
    body('status')
        .notEmpty().withMessage('Status is required'),
    handleInputErrors,
    TasksController.updateTaskStatus
)

/**Routes por teams */
router.post('/:projectId/team/find',
    body('email')
        .isEmail().isLowercase().withMessage('Email is required'),
    handleInputErrors,
    TeamController.findUserByEmail
)

router.post('/:projectId/team',
    body('id')
        .isMongoId().withMessage('Invalid user ID'),
    handleInputErrors,
    TeamController.addUserToProject
)

router.delete('/:projectId/team',
    body('id')
        .isMongoId().withMessage('Invalid user ID'),
    handleInputErrors,
    TeamController.removeUserFromProject
)

router.get('/:projectId/team',
    TeamController.getProjectTeam
)

/**Notes */
router.post('/:projectId/tasks/:taskId/note',
    body('content').notEmpty().withMessage('Content is required'),
    handleInputErrors,
    NoteController.createNote
)

router.get('/:projectId/tasks/:taskId/note',
    handleInputErrors, 
    NoteController.getNotes
)

router.delete('/:projectId/tasks/:taskId/note/:noteId',
    param('noteId').isMongoId().withMessage('Invalid note ID'),
    handleInputErrors,
    NoteController.deleteNote
)

export default router