import type {Request, Response} from 'express'
import User from '../models/user'
import Project from '../models/project'

export class TeamController{
    static findUserByEmail = async(req: Request, res: Response) => {
        const {email} = req.body
        const user = await User.findOne({email}).select('id username email')
        if(!user){
            const error = new Error('User not found')
            res.status(404).json({error: error.message})
            return
        }
        res.json(user)
    }

    static addUserToProject = async(req: Request, res: Response) => {
        const {id} = req.body
        const user = await User.findById(id).select('id')
        if(!user){
            const error = new Error('User not found')
            res.status(404).json({error: error.message})
            return
        }
        if(req.project.team.some(team => team.toString() === user.id.toString())){
            const error = new Error('User already in project')
            res.status(409).json({error: error.message})
            return
        }
        req.project.team.push(user.id)
        await req.project.save()
        res.send('User added to project')
    }

    static removeUserFromProject = async(req: Request, res: Response) => {
        const {id} = req.body
        if(!req.project.team.some(team => team.toString() === id)){
            const error = new Error('User not found in project')
            res.status(404).json({error: error.message})
            return
        }
        req.project.team = req.project.team.filter(team => team.toString() !== id)
        await req.project.save()
        res.send('User removed from project')
    }

    static getProjectTeam = async(req: Request, res: Response) => {
        const project = await Project.findById(req.project.id).populate('team', 'id username email')
        res.json(project.team)
    }
}