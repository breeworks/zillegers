import { Router } from "express";
import Middleware from "../middlewares/user";
import client from "@repo/db/client";
import { v4 as uuidv4 } from "uuid";

// logic so that P1 can send Joiningcode to P2 and if P2 join succeffully,
// both will get notify if not P2 can send some msg error in joining

export const JoiningcodeMap = new Map(); // code -> { creatorId, expiry, matchId?, createdAt }

export const PlaygroundDashboardRoute = Router();

PlaygroundDashboardRoute.post("/match-with-your-buddy",Middleware,async (req, res) => {

    try {
      const userId = req.userId;
      const { action } = req.query;
      const { Difficulty,topic } = req.body;      

      // CASE 1: Player wants to create a joining code
      if (action === "create") {
        const joiningCode = Math.random().toString(36).substring(2, 8).toUpperCase();

        JoiningcodeMap.set(joiningCode, { 
          creatorId: userId,
          expiry: new Date(Date.now() + 30 * 60 * 1000), // 30 minutes expiry
          createdAt: new Date(),
          Difficulty: Difficulty,
          Topic: topic
        });
        console.log(JoiningcodeMap);
        res.status(200).json({ success: true, joiningCode, message: "Share this code with your buddy to join the match"});
        return;
      }     

      // CASE 2: Player wants to join using a code
      // {FIX: both player has to have same topic and difficulty level, then only they are allowed to continue the match.}
      else if (action === "join") {
        const { code } = req.query;

        if (!code) {
          res.status(400).json({
            success: false,
            message: "Joining code is required",
          })
          return;
        }

        // Check if code exists and is valid
        const codeData = JoiningcodeMap.get(code);

        if (!codeData) {
          res.status(404).json({
            success: false,
            message: "Invalid joining code",
          });
          return;
        }

        if (codeData.expiry < new Date()) {
          JoiningcodeMap.delete(code);
          res.status(400).json({
            success: false,
            message: "This joining code has expired",
          });
          return;
        }

        if (codeData.creatorId === userId) {
          res.status(400).json({
            success: false,
            message: "You cannot join your own game",
          });
          return;
        }

        if (codeData.matchId) {
          res.status(400).json({
            success: false,
            message: "This game is already in progress",
          });
          return;
        }

        // both the players should have same Difficulty and problem topic
        if(codeData.difficulty != Difficulty && codeData.topic != topic){
          res.status(400).json({success: false, message: "Both players must have the same difficulty and topic to join the match"});
          return;
        }

        //create team in db
        const team = await client.team.create({
          data: {
            playerOneId: codeData.creatorId,
            playerTwoId: userId,
            joinCode: code as string,
            isPrivate: true,
          },
        });

        console.log(team.playerOneId,team.playerTwoId);
        
        // Select a random question
        // const question = await client.questionBank.findFirst({
        //   orderBy: {
        //     id: "desc", // Replace with a random order mechanism
        //   },
        //   take: 1,
        // });

        const question = await client.questionBank.findFirst({
          where:{
            tags: {
              has: topic
            },
            difficulty: Difficulty
          },
        });

        // if(question){
        //   const deleteQuestion = await client.questionBank.delete({
        //     where:{
        //       id: question.id,  
        //       tags: JoiningcodeMap.get(topic),
        //       difficulty: JoiningcodeMap.get(Difficulty)
        //     }
        //   });
        // }

        console.log(question);

        if (!question) {
          res.status(500).json({
            success: false,
            message: "No questions available",
          });
          return;
        }

        // Create a match
        const match = await client.match.create({
          data: {
            teamId: team.id,
            questionId: question.id,
            status: "ACTIVE",
          },
        });

        res.cookie("matchId",match.id, {
          httpOnly: true,
          secure: false,
          sameSite: "lax",
          maxAge: 1000 * 60 * 60 * 24,
        });
  

        // Update code data with match ID
        codeData.matchId = match.id;
        JoiningcodeMap.set(code, codeData);

        // Emit socket event to notify creator
        const io = req.app.get("io"); // Assuming you attached io to app
        io.to(`Hey! user-${codeData.creatorId}`).emit("matchCreated", {
          matchId: match.id,
          opponent: {
            id: userId,
            username: req.userName,
          },
          questionId: question.id,
        });

        res.status(200).json({
          success: true,
          matchId: match.id,
          teamId: team.id,
          questionId: question.id,
          message: "Successfully joined the match!",
        });
        return;
      }

      // CASE 3: Check status of a code
      else if (action === "check") {
        const { code } = req.query;

        if (!code) {
          res.status(400).json({
            success: false,
            message: "Joining code is required",
          });
          return;
        }

        const codeData = JoiningcodeMap.get(code);

        if (!codeData) {
          res.status(404).json({
            success: false,
            message: "Invalid joining code",
          });
          return;
        }

        // If this user created the code, provide status
        if (codeData.creatorId === userId) {
          res.status(200).json({
            success: true,
            status: codeData.matchId ? "matched" : "waiting",
            matchId: codeData.matchId,
            expiresAt: codeData.expiry,
          });
          return;
        } else {
          res.status(403).json({
            success: false,
            message: "You don't have permission to check this code",
          });
          return;
        }
      }

      // Invalid action
      else {
        res.status(400).json({
          success: false,
          message: "Invalid action. Use 'create', 'join', or 'check'",
        });
        return;
      }
      
    } catch (error: any) {
      console.error("Match with buddy error:", error?.message || error);
      res.status(500).json({
        success: false,
        error: error?.message || "Something went wrong",
      });
    }
  // Clean up expired codes every 10 min (example, put outside the route)
  setInterval(() => {
    const now = new Date();
    for (const [code, data] of JoiningcodeMap.entries()) {
      if (data.expiry < now) {
        JoiningcodeMap.delete(code);
      }
    }
  }, 10 * 60 * 1000);
    
});