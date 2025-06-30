import type { Request, Response } from "express"
import Task from "../models/task"

export class TasksController{
    static createTask = async(req: Request, res: Response) => {
        try{
            const task = new Task(req.body)
            task.project = req.project.id
            req.project.tasks.push(task.id)
            await Promise.allSettled([task.save(), req.project.save()])
            res.send('Task created successfully')
        }catch(error){
            res.status(500).send('Internal server error')
        }
    }
    
    static getProjectTasks = async(req: Request, res: Response) => {
        try{
            const tasks = await Task.find({project: req.project.id}).populate('project')
            res.json(tasks)
        }catch(error){
            res.status(500).send('Internal server error')
        }
    }

    static getTaskById = async(req: Request, res: Response) => {
        try{
            const task = await Task.findById(req.task.id).populate({path: 'completedBy', select: 'id username email'})
            res.json(task)
        }catch(error){
            res.status(500).send('Internal server error')
        }
    }

    static updateTask = async(req: Request, res: Response) => {
        try{
            req.task.name = req.body.name
            req.task.description = req.body.description
            await req.task.save()
            res.send('Task updated successfully')
        }catch(error){
            res.status(500).send('Internal server error')
        }
    }
    
    static deleteTask = async(req: Request, res: Response) => {
        try{
            req.project.tasks = req.project.tasks.filter((taskId) => taskId.toString() !== req.params.taskId)
            await Promise.allSettled([req.task.deleteOne(), req.project.save()])
            res.send('Task deleted successfully')
        }catch(error){
            res.status(500).send('Internal server error')
        }
    }

    static updateTaskStatus = async(req: Request, res: Response) => {
        try{
            req.task.status = req.body.status
            if(req.body.status === 'pending'){
                req.task.completedBy = null
            }else{
                req.task.completedBy = req.user.id
            }
            await req.task.save()
            res.send('Task status updated successfully')
        }catch(error){
            res.status(500).send('Internal server error')
        }
    }
}