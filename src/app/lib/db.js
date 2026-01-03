import mongoose from 'mongoose'

const MONGO_URL = process.env.MONGO_DB_URL

if(!MONGO_URL){
    throw new Error("Please check the database enviroment variable")
}
let cached = global.mongoose

if(!chached){
    cached = mongoose.connect(MONGO_URL)
}

export async function dbConnection(){
    if(cached.conn) return cached.conn

    if(!cached.promise){
        cached.promise = mongoose.connect(MONGO_URL,{
            bufferCommands:false,
        }).then((mongoose)=>{
            console.log("connected to database");
            
            return mongoose
        })
    }
    cached.conn = await cached.promise
    return cached.conn
}

export default dbConnection