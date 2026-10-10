import { NextRequest,NextResponse } from "next/server";

import { connectTodatabase } from "@/lib/db";

import User from "@/models/User";
import { error } from "console";


export async function POST(request:NextRequest){
    try {
        const {email , password}  = await request.json()

        if (!email || !password) {
            return  NextResponse.json(
                {error:"Data is required"},
                {status:400}
            )
        }


        await connectTodatabase()

        const existingUser = await User.findOne({email})

        if (existingUser) {
             return  NextResponse.json(
                {error:"Email is already resgister"},
                {status:400}
            )
        }

        await User.create({
            email,
            password
        })

         return  NextResponse.json(
                {message:"User register successfully"},
                {status:200}
            )

    } catch (error) {
         return  NextResponse.json(
                {error:"Failed to register"},
                {status:500}
            )
    }
}