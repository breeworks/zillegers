import { Router } from "express";
import client from "@repo/db/client";
import Middleware from "../middlewares/user";
import axios from "axios";

export const PlaygroundRoute = Router();

const RAPIDAPI_KEY = ""

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
  
      const testCaseWrapper = match.question.test_cases as any;
      console.log("testCase Wrapper: ", testCaseWrapper);
      
      let testCases = [];
      
      // Handle different test case formats
      if (Array.isArray(testCaseWrapper)) {
        // Simple array format
        testCases = testCaseWrapper;
      } else if (testCaseWrapper && typeof testCaseWrapper === 'object') {
        // Object with hidden/public or testCases property
        if (testCaseWrapper.testCases && Array.isArray(testCaseWrapper.testCases)) {
          testCases = testCaseWrapper.testCases;
        } else {
          // Combine hidden and public test cases
          const hiddenTests = testCaseWrapper.hidden || [];
          const publicTests = testCaseWrapper.public || [];
          testCases = [...publicTests, ...hiddenTests];
        }
      }
      
      // Normalize test case format
      testCases = testCases.map((test: { input: any; stdin: any; output: any; expected_output: any; stdout: any; }) => ({
        input: test.input || test.stdin || '',
        output: test.output || test.expected_output || test.stdout || ''
      }));
      
      if (!Array.isArray(testCases) || testCases.length === 0) {
        res.status(500).json({ success: false, message: "No valid test cases found" });
        return;
      }
      
      console.log("Test cases to execute:", testCases);    
      
      const expectedTime = match.question.expected_time_complexity;
      const expectedSpace = match.question.expected_space_complexity;
  
      const languageMap: Record<string, number> = {
        PYTHON: 71,
        CPP: 54,
        JAVASCRIPT: 63,
        JAVA: 62,
        C: 50
      };
  
      const languageId = languageMap[language.toUpperCase()];
      if (!languageId) {
        res.status(400).json({ success: false, message: "Unsupported language" });
        return;
      }
  
      // Create solution record first
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
      let testResults = [];
      let allTokens = [];

      const sanitizedCode = answer.replace(/\r/g, '').replace(/^\s*\n/, '').trim();
      
      console.log("Sanitized code:", sanitizedCode);
  
      // Submit all test cases to Judge0
      for (let i = 0; i < testCases.length; i++) {
        const test = testCases[i];
        
        try {
          console.log(`Submitting test case ${i + 1}:`, {
            input: test.input,
            expectedOutput: test.output
          });

          // First, submit the code and get a token
          const submissionResponse = await axios.post(
            "https://judge0-ce.p.rapidapi.com/submissions?base64_encoded=false",
            {
              source_code: sanitizedCode,
              language_id: languageId,
              stdin: test.input,
              expected_output: test.output
            },
            {
              headers: {
                "Content-Type": "application/json",
                "X-RapidAPI-Key": process.env.RAPIDAPI_KEY || RAPIDAPI_KEY,
                "X-RapidAPI-Host": "judge0-ce.p.rapidapi.com"
              }
            }
          );

          const token = submissionResponse.data.token;
          allTokens.push({ token, testCase: i + 1 });
          console.log(`Test case ${i + 1} submitted with token:`, token);

          // Wait a bit before checking result
          await new Promise(resolve => setTimeout(resolve, 1000));

          // Get the result using the token
          let result = null;
          let attempts = 0;
          const maxAttempts = 10;

          while (attempts < maxAttempts) {
            try {
              const resultResponse = await axios.get(
                `https://judge0-ce.p.rapidapi.com/submissions/${token}?base64_encoded=false`,
                {
                  headers: {
                    "X-RapidAPI-Key": process.env.RAPIDAPI_KEY || RAPIDAPI_KEY,
                    "X-RapidAPI-Host": "judge0-ce.p.rapidapi.com"
                  }
                }
              );

              result = resultResponse.data;
              
              // Check if processing is complete
              if (result.status && result.status.id > 2) {
                break;
              }
              
              // Wait before next attemptt
              await new Promise(resolve => setTimeout(resolve, 1000));
              attempts++;
            } catch (fetchError) {
              console.error(`Error fetching result for token ${token}:`, fetchError);
              attempts++;
              await new Promise(resolve => setTimeout(resolve, 1000));
            }
          }

          if (!result) {
            console.error(`Failed to get result for test case ${i + 1} after ${maxAttempts} attempts`);
            testResults.push({
              testCase: i + 1,
              token: token,
              status: { id: -1, description: "Timeout" },
              error: "Failed to get result from Judge0"
            });
            continue;
          }

          console.log(`Test case ${i + 1} result:`, {
            status: result.status,
            stdout: result.stdout,
            stderr: result.stderr,
            time: result.time,
            memory: result.memory
          });

          testResults.push({
            testCase: i + 1,
            token: token,
            status: result.status,
            stdout: result.stdout,
            stderr: result.stderr,
            time: result.time,
            memory: result.memory,
            input: test.input,
            expectedOutput: test.output,
            actualOutput: result.stdout?.trim()
          });

          // Calculate metrics
          totalTime += parseFloat(result.time || "0");
          totalMemory += parseFloat(result.memory || "0");

          // Check if test passed
          const isCorrect = result.status?.id === 3 && 
                           result.stdout?.trim() === test.output?.trim();
          
          if (isCorrect) {
            passedTests++;
          }

          console.log(`Test case ${i + 1} ${isCorrect ? 'PASSED' : 'FAILED'}`);

        } catch (error : any) {
          console.error(`Error processing test case ${i + 1}:`, error);
          testResults.push({
            testCase: i + 1,
            token: null,
            status: { id: -1, description: "Error" },
            error: error.message || "Unknown error",
            input: test.input,
            expectedOutput: test.output
          });
        }
      }

      // Calculate average time and memory
      const avgTime = testCases.length > 0 ? totalTime / testCases.length : 0;
      const avgMemory = testCases.length > 0 ? totalMemory / testCases.length : 0;

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

      const success = passedTests === testCases.length;

      res.status(200).json({
        success: true,
        message: "Code submitted and executed successfully",
        submission: {
          id: SubmitCode.id,
          code: answer,
          language: language,
          createdAt: SubmitCode.submittedAt
        },
        execution: {
          allPassed: success,
          passedTests,
          totalTests: testCases.length,
          passRate: `${passedTests}/${testCases.length}`,
          totalTime,
          avgTime,
          totalMemory,
          avgMemory,
          expectedTime,
          expectedSpace
        },
        tokens: allTokens,
        testResults: testResults,
        details: testResults.map(result => ({
          testCase: result.testCase,
          token: result.token,
          passed: result.status?.id === 3 && result.actualOutput === result.expectedOutput,
          status: result.status?.description || 'Unknown',
          input: result.input,
          expectedOutput: result.expectedOutput,
          actualOutput: result.actualOutput,
          time: result.time,
          memory: result.memory,
          error: result.stderr || result.error
        }))
      });

    } catch (error: any) {
      console.error("Match with playground error:", error?.message || error);
      res.status(500).json({
        success: false,
        error: error?.message || "Something went wrong",
        details: error.stack || "No stack trace available"
      })
      return;
    }
});

// Helper function to wait for Judge0 result
async function waitForResult(token : string, maxWaitTime = 30000) {
  const startTime = Date.now();
  
  while (Date.now() - startTime < maxWaitTime) {
    try {
      const response = await axios.get(
        `https://judge0-ce.p.rapidapi.com/submissions/${token}?base64_encoded=false`,
        {
          headers: {
            "X-RapidAPI-Key": process.env.RAPIDAPI_KEY || "",
            "X-RapidAPI-Host": "judge0-ce.p.rapidapi.com"
          }
        }
      );
      
      const result = response.data;
            
      if (result.status && result.status.id > 2) {
        result
        return;
      }

      await new Promise(resolve => setTimeout(resolve, 1000));
    } catch (error : any) {
      console.error("Error checking submission status:", error);
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }
  
  throw new Error("Timeout waiting for Judge0 result");
}

PlaygroundRoute.get("/detect-tab-change", async(req,res) => {
  res.json({
      "message":"this is from user playground detect-tab-change"
  });
})

PlaygroundRoute.post("/who-is-what", async(req,res) => {
  /** */
  try {

    const GET_RESPONSE = await axios.get("https://judge0-ce.p.rapidapi.com/submissions/2e979232-92fd-4012-97cf-3e9177257d10")
    
  } catch (error : any) {
    console.error("playground-winner-section error:", error?.message || error);
    res.status(400).json({ error: error?.message || "Something went wrong." });
    return;
  }
})
