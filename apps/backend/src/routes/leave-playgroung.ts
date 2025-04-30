import { Router } from "express";

export const LeavePlaygroundRoute = Router();

LeavePlaygroundRoute.get("/logout-account", async(req,res) => {
    res.json({
        "messgae":"this is from user playground logout-account"
    });
})


LeavePlaygroundRoute.get("/deactivate-account", async(req,res) => {
    res.json({
        "messgae":"this is from user playground deactivate-account"
    });
})
