import mongoose from "mongoose"

const MONGODB_URI = process.env.MONGODB_URI!

if (!MONGODB_URI) {
    throw new Error("Please define mongodbURI")
}


let cached = global.mongoose

if (!cached) {
    cached = global.mongoose = {promise : null ,conn:null}
}

export async function  connectTodatabase() {
    if (cached.conn) {
        return cached.conn
    }

    if (!cached.promise) {
        const opts = {
            bufferCommands : true,
            maxPoolSize :10
        }
        cached.promise = mongoose.connect(MONGODB_URI,opts)
                            .then(() => mongoose.connection)
    }

    try {
        cached.conn = await cached.promise

    } catch (error) {
        cached.promise = null
        throw error
    }
    
    return cached.conn

}