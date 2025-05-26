import mongoose, {Schema, Document, PopulatedDoc, Types} from "mongoose";
import { IProject } from "./project";

export interface IUser extends Document {
    username: string,
    email: string,
    password: string,
    confirmed: boolean,
    projects: PopulatedDoc<IProject & Document>[]
}

const UserSchema: Schema = new Schema({
    email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
        unique: true
    },
    username: {
        type: String,
        required: true,
        trim: true,
    },
    password: {
        type: String,
        required: true,
        trim: true
    },
    confirmed: {
        type: Boolean,
        default: false
    },
    projects:[{
        type: Types.ObjectId,
        ref: 'Project'
    }]
})

const User = mongoose.model<IUser>('User', UserSchema)
export default User