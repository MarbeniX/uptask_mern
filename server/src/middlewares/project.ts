import type { Request, Response, NextFunction } from 'express'
import Project, { IProject } from "../models/project"

declare global {
    namespace Express {
        interface Request {
            project: IProject
        }
    }
}

export async function validateProjectExists(req: Request, res: Response, next: NextFunction){
    try{
        const { projectId } = req.params
        const project = await Project.findById(projectId)
        if (!project) {
            res.status(404).send("Project not found")
            return
        }
        req.project = project
        next()
    }catch(error){
        res.status(500).send('Internal server error')
    }
}