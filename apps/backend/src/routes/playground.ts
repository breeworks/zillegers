import { Router } from "express";
import client from "@repo/db/client";
import { JoiningcodeMap } from "./playground-dashboard";
import Middleware from "../middlewares/user";

export const PlaygroundRoute = Router();

PlaygroundRoute.post("/playground",Middleware, async(req,res) => {
    try {
        const {submit} = req.query;
        const {answer} = req.body;
        const userId = req.userId;
        const MatchId  = req.cookies.matchId;

        const SubmitCode = await client.solution.create({
            data:{
                code: answer,
                language: "PYTHON",
                match: {connect: {id: MatchId}},
                user: { connect: { id: userId } }
            }
        })

        const checkCode = await client.solution.findUnique({
            where:{
                id: SubmitCode.id
            }
        });

        // solution from here will then be checked by judge0

    } catch (error: any) {
        console.error("Match with playground error:", error?.message || error);
        res.status(500).json({
          success: false,
          error: error?.message || "Something went wrong",
        });
      }
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

