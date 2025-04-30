import e, { Router } from "express";
import { UserDashboardRoute } from "./user-dashboard";
import { LeavePlaygroundRoute } from "./leave-playgroung";
import { PlaygroundDashboardRoute } from "./playground-dashboard";
import { PlaygroundRoute } from "./playground";
import { WaitingRoomRoute } from "./waiting-room";
import client from '@repo/db/client';
import jwt from "jsonwebtoken";
import {compare, hash} from "../scrypt";
import createError, { HttpError } from 'http-errors';
import { AuthSchema } from "../types";

export const router = Router();


router.post("/signup", async(req,res) => {
    const JwtSecret = process.env.JwtSecret;
    
    try {
        const {username, password} = AuthSchema.parse(req.body);
        const HashingPassword = await hash(password);

        const SameUsername = await client.user.findUnique({
            where: { username },
          });
          
          if (SameUsername) {
              res.status(401).json({message : `Player with this ${username} already exists.`})
              return;
            //   throw createError(409, 'Username already exists');
        }

        if(!SameUsername){
            const newPlayer = await client.user.create({
                data:{
                    username,
                    password:HashingPassword
                },
            });

            const jwtToken = jwt.sign({ id: newPlayer.id, username: newPlayer.username }, `${JwtSecret}`, { expiresIn: "1d" });

            const AddTokenInCookie = res.cookie('access_token',jwtToken,{
                httpOnly: true,
                secure: false, // ❗ false for localhost, true for production
                sameSite: 'lax', 
                maxAge: 1000 * 60 * 60 * 24, 
            });

            console.log(`${username} with playerId ${newPlayer.id} has successfully join with ${password}.`);
            
            res.status(201).json({message : `${username} has successfulyy join.`})
            return;
        } 
        else {
            console.log("There's something broken. FIX!");
            res.status(400).json({message : `There's something broken. FIX!`});
            return;
        }
    } catch (error) {
        res.status(400).json(error);
        return;
    }
})


router.post("/login", async(req,res) => {
    const JwtSecret = process.env.JwtSecret;
    console.log(`${JwtSecret}`);
    
    
    try {
        const {username, password} = AuthSchema.parse(req.body);

        const existingUser = await client.user.findUnique({
            where: { username },
          });
      
          if (!existingUser) {
            res.status(401).json({ message: 'Invalid username or password' });
            return;      
            }

          const isValidPassword = await compare(password, existingUser.password);
          if (!isValidPassword) {
            res.status(401).json({ message: 'Invalid username or password' });
            return;      
            }

          const jwtToken = jwt.sign(
            { id: existingUser.id, username: existingUser.username },
            `${JwtSecret}` as string,
            { expiresIn: '1d' }
          );

          res.cookie('access_token', jwtToken, {
            httpOnly: true,
            secure: false, 
            sameSite: 'lax',
            maxAge: 1000 * 60 * 60 * 24, 
          });

          console.log(`${username} logged in successfully`);
          res.status(200).json({ message: 'Login successful' });
          return;      
    } catch (error) {
        res.status(400).json(error);
        console.log(error);
        
        return;
    }
})  


router.use("/user-dashboard/",UserDashboardRoute)
router.use("/playground/",PlaygroundRoute)
router.use("/playground-dashboard/",PlaygroundDashboardRoute)
router.use("/playground-waiting-room/",WaitingRoomRoute)
router.use("/leave-playground/",LeavePlaygroundRoute)