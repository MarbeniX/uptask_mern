import type { Request, Response, NextFunction } from 'express'
import Task, { ITask } from '../models/task'

declare global {
    namespace Express {
        interface Request {
            task: ITask
        }
    }
}

export async function validateTasksExists(req: Request, res: Response, next: NextFunction){
    try{
        const task = await Task.findById(req.params.taskId)
        if(!task){
            const error = new Error('Task not found')
            res.status(404).send(error.message)
            return
        }
        
        if(task.project.toString() !== req.project.id){
            const error = new Error('Task does not belong to project')
            res.status(400).send(error.message)
            return
        }
        req.task = task
        next()
    }catch(error){
        res.status(500).send('Internal server error')
    }
}