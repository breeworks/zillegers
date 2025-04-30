import { Router } from "express";

export const WaitingRoomRoute = Router();

WaitingRoomRoute.get("/waiting-room", async(req,res) => {
    res.json({
        "messgae":"this is from user playground in the waiting-room"
    });
})