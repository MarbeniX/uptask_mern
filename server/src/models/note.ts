import mongoose, { Schema, Document, Types} from "mongoose";

export interface INote extends Document {
    content: string, 
    task: Types.ObjectId,
    createdBy: Types.ObjectId,
}

const NoteSchema = new Schema({
    content: {
        type: String, 
        required: true,
    },
    task: {
        type: Types.ObjectId,
        ref: 'Task',
        required: true,
    },
    createdBy: {
        type: Types.ObjectId,
        ref: 'User',
        required: true,
    }
}, { timestamps: true });

const Note = mongoose.model<INote>('Note', NoteSchema);
export default Note;