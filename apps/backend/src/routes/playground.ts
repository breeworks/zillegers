import { Router } from "express";
import client from "@repo/db/client";
import Middleware from "../middlewares/user";
import axios from "axios";

export const PlaygroundRoute = Router();

PlaygroundRoute.post("/playground", Middleware, async (req, res) => {
    try {
      const { answer, language } = req.body;
      const userId = req.userId;
      const MatchId = req.cookies.matchId;
  
      if (!answer || !language) {
        res.status(400).json({ success: false, message: "Answer and language are required" });
        return;
      }
  
      const match = await client.match.findUnique({
        where: { id: MatchId },
        include: { question: true }
      });
  
      if (!match || !match.question) {
        res.status(404).json({ success: false, message: "Match or question not found" });
        return;
      }
  
      const testCaseWrapper = match.question.testCases as Array<{input: string; output: string}> | { testCases: Array<{input: string; output: string}> };
      const testCases = Array.isArray(testCaseWrapper)
        ? testCaseWrapper
        : testCaseWrapper.testCases;
      
      if (!Array.isArray(testCases)) {
        res.status(500).json({ success: false, message: "Invalid test cases format" });
        return;
      }
      
      console.log(testCases);
      
      const expectedTime = match.question.expectedTimeComplexity;
      const expectedSpace = match.question.expectedSpaceComplexity;
  
      const languageMap: Record<string, number> = {
        PYTHON: 71,
        CPP: 54
      };
  
      const languageId = languageMap[language.toUpperCase()];
      if (!languageId) {
        res.status(400).json({ success: false, message: "Unsupported language" });
        return;
      }
  
      const SubmitCode = await client.solution.create({
        data: {
          code: answer,
          language: language,
          match: { connect: { id: MatchId } },
          user: { connect: { id: userId } }
        }
      });
  
      let passedTests = 0;
      let totalTime = 0;
      let totalMemory = 0;
      let lastResult = null;

      const sanitizedCode = answer.replace(/\r/g, '').replace(/^\s*\n/, '').trim();
  
      for (const test of testCases) {
        const judgeResponse = await axios.post(
          "https://judge0-ce.p.rapidapi.com/submissions?base64_encoded=false&wait=true",
          {
            source_code: sanitizedCode,
            language_id: languageId,
            stdin: test.input,
            expected_output: test.output
          },
          {
            headers: {
              "Content-Type": "application/json",
              "X-RapidAPI-Key": process.env.RAPIDAPI_KEY || "262566b573msh538f22882e7666ep12f349jsn75615b7dfdcf",
              "X-RapidAPI-Host": "judge0-ce.p.rapidapi.com"
            }
          }
        );
  
        const result = judgeResponse.data;
        lastResult = result;
  
        totalTime += parseFloat(result.time || "0");
        totalMemory += parseFloat(result.memory || "0");
  
        if (result.status?.id === 3 && result.stdout?.trim() === test.output?.trim()) {
          passedTests++;
        }
      }
  
      // Update solution record with performance data
      await client.solution.update({
        where: { id: SubmitCode.id },
        data: {
          executionTime: totalTime,
          memoryUsed: totalMemory,
          passedTests,
          totalTests: testCases.length
        }
      });
  
      res.status(200).json({
        success: true,
        message: "Code submitted and executed successfully",
        submission: SubmitCode,
        result: {
          stdout: lastResult?.stdout,
          stderr: lastResult?.stderr,
          time: totalTime,
          memory: totalMemory,
          status: lastResult?.status,
          passedTests,
          totalTests: testCases.length,
          expectedTime,
          expectedSpace
        }
      });
  
    } catch (error: any) {
      console.error("Match with playground error:", error?.message || error);
      res.status(500).json({
        success: false,
        error: error?.message || "Something went wrong"
      });
    }
  });
  


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

