import { Router } from "express";

export const UserRouter = Router();

UserRouter.get("/UserInfo", async(req,res) => {
    res.json({
        "messgae":"this is from user"
    });
})