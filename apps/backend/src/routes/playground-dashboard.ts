import { Router } from "express";

export const PlaygroundDashboardRoute = Router();

PlaygroundDashboardRoute.get("/match-with-waiting-users-list", async(req,res) => {
    res.json({
        "messgae":"this is from user playground match-with-your-waiting-users"
    });
})

PlaygroundDashboardRoute.get("/match-with-your-buddy", async(req,res) => {
    res.json({
        "messgae":"this is from user playground match-with-your-buddy"
    });
})

PlaygroundDashboardRoute.get("/match-with-random", async(req,res) => {
    res.json({
        "messgae":"this is from user playground match-with-random-player "
    });
})
