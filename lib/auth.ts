import { NextAuthOptions } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import CredentialsProvider from "next-auth/providers/credentials";
import { connectTodatabase } from "./db";

import User from "@/models/User";
import bcrypt from "bcryptjs";

export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "email", type: "text", placeholder: "jsmith@mail" },
                password: { label: "Password", type: "password" }
            },

            async authorize(credentials,req){
                if (!credentials?.email || !credentials?.password) {
                    throw new Error("Missing Email or password")
                }

                try {
                    await connectTodatabase()
                    const user = await User.findOne({email:credentials.email})

                    if (!user) {
                        throw new Error("No user found");
                        
                    }

                    const isValid = await bcrypt.compare(credentials.password , user.password)
                    
                    if (!isValid) {
                        throw new Error("Password in correct");  
                    }

                    return { 
                        id: user._id.toString(),
                        email:user.email
                    }

                } catch (error) {
                    throw new Error("No user found");
                }
            }
        })
    ],

    callbacks:{
        async jwt({token ,user}){

            if (user) {
                token.id = user.id
            }

            return token
        },
        async session({session,token}) { 

            if (session.user) {
                session.user.id = token.id as string
            }

            return session
        },
    },

    pages:{
        signIn:"/login",
        error:"/login"
    },

    session:{
        strategy:"jwt",
        maxAge:30*24*60*60
    },

    secret:process.env.NEXTAUTH_SECRET

}