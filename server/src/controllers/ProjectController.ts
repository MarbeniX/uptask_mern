import type { Request, Response } from "express"
import Project from "../models/project"
import Task from "../models/task"

export class ProjectController{
    static createProject = async(req: Request, res: Response) => {
        const project = new Project(req.body)
        project.manager = req.user.id
        try {
            await project.save()
            res.send("Project created")
        }catch(error){
            console.log(error)
        }
    }

    static getAllProjects = async(req: Request, res: Response) => {
        try{
            const projects = await Project.find({
                $or:[
                    {manager: {$in: req.user.id}},
                    {team: {$in: req.user.id}}
                ]
            })
            res.json(projects)
        }catch(error){
            console.log(error)
        }
    }

    static getProjectById = async(req: Request, res: Response): Promise<void> => {
        try{
            const project = await Project.findById(req.params.id).populate('tasks')
            if (!project) {
                res.status(404).send("Project not found")
                return
            }
            if(project.manager.toString() !== req.user.id && !project.team.includes(req.user.id)) {
                res.status(403).send("You are not authorized to view this project")
                return
            }
            res.json(project)
        }catch(error){
            console.log(error)
        }
    }

    static updateProject = async(req: Request, res: Response) => {
        try{
            const project = await Project.findById(req.params.id)
            if (!project) {
                res.status(404).send("Project not found")
                return
            }
            if(project.manager.toString() !== req.user.id) { 
                res.status(403).send("You are not authorized to update this project")
                return
            }
            project.projectName = req.body.projectName
            project.clientName = req.body.clientName
            project.description = req.body.description
            await project.save()
            res.send("Project updated")
        }catch(error){
            console.log(error)
        }
    }

    static deleteProject = async(req: Request, res: Response) => {
        try{
            const project = await Project.findById(req.params.id)
            if (!project) {
                res.status(404).send("Project not found")
                return
            }
            if(project.manager.toString() !== req.user.id) {
                res.status(403).send("You are not authorized to delete this project")
                return
            }
            await Promise.all(project.tasks.map(async (taskId) => {
                await Task.findByIdAndDelete(taskId)
            }))
            await project.deleteOne()
            res.send("Project deleted")
        }catch(error){
            console.log(error)
        }
    }
}