import { Router } from "express";

export const PlaygroundRoute = Router();

PlaygroundRoute.get("/playground", async(req,res) => {
    res.json({
        "messgae":"this is from user playground"
    });
})

PlaygroundRoute.get("/notify-opponent-performance", async(req,res) => {
    res.json({
        "messgae":"this is from user playground notify-opponent-performance"
    });
})

PlaygroundRoute.get("/playground-AI-lifeline", async(req,res) => {
    res.json({
        "messgae":"this is from user playground playground-AI-lifeline"
    });
})


PlaygroundRoute.get("/detect-tab-change", async(req,res) => {
    res.json({
        "messgae":"this is from user playground detect-tab-change"
    });
})


PlaygroundRoute.get("/playground-winner", async(req,res) => {
    res.json({
        "messgae":"this is from user playground playground-winner"
    });
})


PlaygroundRoute.get("/playground-losser", async(req,res) => {
    res.json({
        "messgae":"this is from user playground playground-losser"
    });
})

