// import axios from "axios";

// type TestCase = {
//   input: string;
//   output: string;
// };

// interface Judge0Result {
//   stdout: string;
//   stderr: string;
//   time: string;
//   memory: number;
//   status: { id: number; description: string };
// }

// interface ExecutionResult {
//   passedTests: number;
//   totalTime: number;
//   totalMemory: number;
//   lastResult: Judge0Result | null;
// }

// const wait = (ms: number) => new Promise((res) => setTimeout(res, ms));

// // Language-specific boilerplate generators
// const generateBoilerplate = (userCode: string, languageId: number): string => {
//   switch (languageId) {
//     case 70: // Python
//       return `${userCode}

// # Read input and call the solution
// import sys

// def main():
//     try:
//         # Read input line
//         input_line = sys.stdin.read().strip()
        
//         # Call the user's function with the input
//         result = isPalindrome(input_line)
        
//         # Output the result (convert boolean to lowercase string)
//         print(str(result).lower())
            
//     except Exception as e:
//         print(f"Error: {e}", file=sys.stderr)

// if __name__ == "__main__":
//     main()`;

//     case 54: // C++
//       return `#include <iostream>
// #include <string>
// #include <algorithm>
// #include <cctype>
// using namespace std;

// ${userCode}

// int main() {
//     try {
//         string input;
//         getline(cin, input);
        
//         bool result = isPalindrome(input);
//         cout << (result ? "true" : "false") << endl;
        
//     } catch (const exception& e) {
//         cerr << "Error: " << e.what() << endl;
//         return 1;
//     }
    
//     return 0;
// }`;

//     case 62: // Java
//       return `import java.util.*;
// import java.io.*;

// public class Main {
//     ${userCode}
    
//     public static void main(String[] args) {
//         try {
//             Scanner scanner = new Scanner(System.in);
//             String input = scanner.nextLine();
            
//             boolean result = isPalindrome(input);
//             System.out.println(result ? "true" : "false");
            
//         } catch (Exception e) {
//             System.err.println("Error: " + e.getMessage());
//         }
//     }
// }`;

//     default:
//       return userCode; // Fallback for unsupported languages
//   }
// };

// export const runCodeAgainstTestCases = async (
//   code: string,
//   languageId: number,
//   testCases: TestCase[]
// ): Promise<ExecutionResult> => {
//   let passedTests = 0;
//   let totalTime = 0;
//   let totalMemory = 0;
//   let lastResult: Judge0Result | null = null;

//   const baseURL = "http://0.0.0.0:2358";
  
//   // Validate languageId
//   if (!languageId) {
//     console.error("Language ID is undefined");
//     return { passedTests: 0, totalTime: 0, totalMemory: 0, lastResult: null };
//   }
  
//   // Generate complete executable code with boilerplate
//   const completeCode = generateBoilerplate(code, languageId);

//   console.log("Generated complete code:", completeCode);
//   console.log("Language ID:", languageId);
//   console.log("Test cases to run:", testCases);

//   for (let i = 0; i < testCases.length; i++) {
//     const test = testCases[i];
//     console.log(`\n🧪 Running test case ${i + 1}/${testCases.length}`);
//     console.log(`Input: "${test.input}"`);
//     console.log(`Expected: "${test.output}"`);
    
//     try {
//       const requestBody = {
//         source_code: completeCode,
//         language_id: languageId,
//         stdin: test.input,
//         expected_output: test.output,
//         cpu_time_limit: "2",
//         memory_limit: "128000"
//       };

//       console.log("Submitting to Judge0...");

//       // Submit the code
//       const submitResponse = await axios.post(
//         `${baseURL}/submissions/?base64_encoded=false&wait=false`, 
//         requestBody
//       );
      
//       const token = submitResponse.data.token;
//       console.log("Received token:", token);
      
//       if (!token) {
//         console.error("No token received from Judge0");
//         continue;
//       }

//       // Poll for results
//       let attempts = 0;
//       let result: Judge0Result;
      
//       do {
//         await wait(1000);
//         console.log(`Polling attempt ${attempts + 1}...`);
        
//         const resultResponse = await axios.get(`${baseURL}/submissions/${token}`);
//         result = resultResponse.data;
//         attempts++;
        
//         console.log(`Status: ${result.status?.description} (ID: ${result.status?.id})`);
        
//         if (result.status?.id > 2 || attempts > 15) break;
//       } while (result.status?.id <= 2);

//       lastResult = result;
      
//       console.log("Final result:", {
//         status: result.status,
//         stdout: result.stdout?.trim(),
//         stderr: result.stderr,
//         expected: test.output.trim()
//       });

//       // Check if test passed
//       const actualOutput = result.stdout?.trim() || "";
//       const expectedOutput = test.output.trim();
      
//       const testPassed = 
//         result.status?.id === 3 && // 3 = Accepted
//         actualOutput === expectedOutput;

//       if (testPassed) {
//         passedTests++;
//         console.log("✅ Test passed");
//       } else {
//         console.log("❌ Test failed");
//         console.log(`Expected: "${expectedOutput}"`);
//         console.log(`Got: "${actualOutput}"`);
//         console.log(`Status: ${result.status?.description}`);
//         if (result.stderr) console.log(`Stderr: ${result.stderr}`);
        
//         // Log compilation errors specifically
//         if (result.status?.id === 6) {
//           console.log("🔥 Compilation Error:", result.stderr);
//         }
//         if (result.status?.id === 5) {
//           console.log("💥 Runtime Error:", result.stderr);
//         }
//       }

//       totalTime += parseFloat(result.time || "0");
//       totalMemory += result.memory || 0;

//     } catch (err: any) {
//       console.error(`Error with test case ${i + 1}:`, err.message);
//       if (err.response) {
//         console.error("Response data:", err.response.data);
//         console.error("Response status:", err.response.status);
//       }
//     }
//   }

//   console.log(`\n🏁 Final results: ${passedTests}/${testCases.length} tests passed`);
//   console.log(`⏱️  Total time: ${totalTime}s`);
//   console.log(`💾 Total memory: ${totalMemory}KB`);

//   return {
//     passedTests,
//     totalTime,
//     totalMemory,
//     lastResult
//   };
// };