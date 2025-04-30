import { Router } from "express";

export const UserDashboardRoute = Router();

UserDashboardRoute.get("/user-section", async(req,res) => {
    res.json({
        "message":"this is from user user-section"
    });
})

UserDashboardRoute.get("/update-user-section", async(req,res) => {  //not working
    res.json({
        "message":"this is from user user-section"
    });
})