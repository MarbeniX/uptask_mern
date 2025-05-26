import mongoose from "mongoose"
import colors from "colors"

export const connectDB = async () => {
    try{
        const connection = await mongoose.connect(process.env.DATABASE_URL)
        console.log(colors.magenta.bold(`MongoDB connected: ${connection.connection.host}  :  ${connection.connection.port}`))
    }catch(error){
        console.error(colors.red.bold(`Error al conectar a MongoDB : ${error.message}`))
        process.exit(1)
    }
}