import type { Request, Response } from 'express';
import Note, { INote } from '../models/note';

export class NoteController {
    static createNote = async(req: Request<{}, {}, INote>, res: Response) => {
        const note = new Note
        note.content = req.body.content;
        note.task = req.task.id;
        note.createdBy = req.user.id;
        req.task.notes.push(note.id);
        try{
            await Promise.allSettled([note.save(), req.task.save()]);
            res.send('Note created successfully');
        }catch(error) {
            res.status(500).send('Internal server error');
        }
    }

    static getNotes = async(req: Request, res: Response) => {
        try{
            const notes = await Note.find({task: req.task.id})
            res.json(notes);    
        }catch(error) {
            res.status(500).send('Internal server error');  
        }
    }

    static deleteNote = async(req: Request, res: Response) => {
        try{
            const noteExists = await Note.findById(req.params.noteId);
            if(!noteExists) {
                res.status(404).send('Note not found');
            }
            if(noteExists.createdBy.toString() !== req.user.id) {
                res.status(403).send('You do not have permission to delete this note');
            }
            req.task.notes = req.task.notes.filter((noteId) => noteId.toString() !== req.params.noteId);
            await Promise.allSettled([noteExists.deleteOne(), req.task.save()]);
            res.send('Note deleted successfully');
        }catch(error) {
            res.status(500).send('Internal server error');
        }
    }
}