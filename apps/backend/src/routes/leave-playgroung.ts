import { Router } from "express";
import Middleware from "../middlewares/user";
import client from "@repo/db/client"
export const LeavePlaygroundRoute = Router();

LeavePlaygroundRoute.post("/logout-account",Middleware, async(req,res) => {
    try {
        const {username,email} = req.body;

        const userId = req.userId
        console.log(userId);

        const UserExist = await client.user.findUnique({where:{id: userId}})

        if(UserExist){UserExist.isverified == false};

        console.log(`${UserExist?.username} logged out!`);
        res.status(201).json({message : `${UserExist?.username} logged out!`})
        return;

    }catch (error : any) {
        console.error("user-section error:", error?.message || error);
        res.status(400).json({ error: error?.message || "Something went wrong." });
        return;
    }
});


LeavePlaygroundRoute.delete("/delete-account",Middleware, async(req,res) => {
    try {
        const userId = req.userId;
        console.log(userId);
        
        const DeleteAccount = await client.user.delete({
            where:{id : userId}
        });

        if(DeleteAccount){
            console.log(`${DeleteAccount.username}'s account has been deactivated.`);
            res.status(201).json({message:`${DeleteAccount.username}'s account has been deactivated.`});
            return;
        }else{
            console.log(`Error in deactivating the account.`);
            res.status(201).json({message:`Error in deactivating the account.`});
            return;
        }
        
    }catch (error : any) {
        console.error("user-section error:", error?.message || error);
        res.status(400).json({ error: error?.message || "Something went wrong." });
        return;
    }
});
