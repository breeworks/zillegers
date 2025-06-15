import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Play, Clock, CheckCircle, XCircle } from 'lucide-react';
import { useUser } from '../contexts/UserContext';
import Editor from '@monaco-editor/react';

const Playground: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useUser();
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState('python');
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes
  const [testResults, setTestResults] = useState<any[]>([]);
  const [isRunning, setIsRunning] = useState(false);

  const problem = {
    title: "Two Sum",
    difficulty: "Easy",
    description: "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.",
    examples: [
      {
        input: "nums = [2,7,11,15], target = 9",
        output: "[0,1]",
        explanation: "Because nums[0] + nums[1] == 9, we return [0, 1]."
      }
    ],
    constraints: [
      "2 <= nums.length <= 10^4",
      "-10^9 <= nums[i] <= 10^9",
      "-10^9 <= target <= 10^9"
    ]
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          navigate('/result');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [navigate]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleRunCode = () => {
    setIsRunning(true);
    
    // Simulate test execution
    setTimeout(() => {
      const results = [
        { input: '[2,7,11,15], 9', output: '[0,1]', expected: '[0,1]', passed: true },
        { input: '[3,2,4], 6', output: '[1,2]', expected: '[1,2]', passed: true },
        { input: '[3,3], 6', output: '[0,1]', expected: '[0,1]', passed: true }
      ];
      setTestResults(results);
      setIsRunning(false);
    }, 2000);
  };

  const handleSubmit = () => {
    navigate('/result');
  };

  if (!user) {
    navigate('/auth');
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="h-screen flex flex-col bg-gray-900"
    >
      {/* Header */}
      <motion.div
        className="flex items-center justify-between p-4 bg-gray-800 border-b border-gray-700"
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <div className="flex items-center gap-4">
          <h1 className="text-xl font-bold text-white">Code Battle</h1>
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-cyan-400" />
            <span className={`font-mono text-lg ${timeLeft < 60 ? 'text-red-400' : 'text-cyan-400'}`}>
              {formatTime(timeLeft)}
            </span>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="px-3 py-1 bg-gray-700 text-white rounded border border-gray-600 focus:border-cyan-400 outline-none"
          >
            <option value="python">Python</option>
            <option value="javascript">JavaScript</option>
            <option value="cpp">C++</option>
            <option value="java">Java</option>
          </select>
          
          <motion.button
            onClick={handleRunCode}
            disabled={isRunning}
            className="px-4 py-2 bg-green-600 hover:bg-green-500 text-white rounded transition-colors disabled:opacity-50"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Play className="w-4 h-4 inline mr-2" />
            {isRunning ? 'Running...' : 'Run'}
          </motion.button>
          
          <motion.button
            onClick={handleSubmit}
            className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Submit
          </motion.button>
        </div>
      </motion.div>

      <div className="flex-1 flex">
        {/* Problem Description */}
        <motion.div
          className="w-1/2 p-4 bg-gray-800 overflow-y-auto scrollbar-hide"
          initial={{ x: -100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <div className="space-y-4">
            <div>
              <h2 className="text-2xl font-bold text-white mb-2">{problem.title}</h2>
              <span className="px-2 py-1 bg-green-500 text-xs rounded text-white">
                {problem.difficulty}
              </span>
            </div>
            
            <p className="text-gray-300 leading-relaxed">{problem.description}</p>
            
            <div>
              <h3 className="text-lg font-semibold text-white mb-2">Example:</h3>
              {problem.examples.map((example, index) => (
                <div key={index} className="bg-gray-700 p-3 rounded mb-2">
                  <div className="code-font text-sm text-gray-300">
                    <div><strong>Input:</strong> {example.input}</div>
                    <div><strong>Output:</strong> {example.output}</div>
                    <div><strong>Explanation:</strong> {example.explanation}</div>
                  </div>
                </div>
              ))}
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-white mb-2">Constraints:</h3>
              <ul className="text-gray-300 text-sm space-y-1">
                {problem.constraints.map((constraint, index) => (
                  <li key={index} className="code-font">• {constraint}</li>
                ))}
              </ul>
            </div>
          </div>
        </motion.div>

        {/* Code Editor */}
        <motion.div
          className="w-1/2 flex flex-col"
          initial={{ x: 100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          <div className="flex-1">
            <Editor
              height="60%"
              defaultLanguage={language}
              value={code}
              onChange={value => setCode(value || '')}
              theme="vs-dark"
              options={{
                fontSize: 14,
                minimap: { enabled: false },
                scrollBeyondLastLine: false,
                automaticLayout: true,
                padding: { top: 16 }
              }}
            />
          </div>
          
          {/* Test Results */}
          <div className="h-2/5 bg-gray-900 border-t border-gray-700 p-4 overflow-y-auto">
            <h3 className="text-lg font-semibold text-white mb-3">Test Results</h3>
            
            {isRunning && (
              <div className="flex items-center gap-2 text-yellow-400">
                <motion.div
                  className="w-4 h-4 border-2 border-yellow-400 border-t-transparent rounded-full"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                />
                Running tests...
              </div>
            )}
            
            {testResults.length > 0 && (
              <div className="space-y-2">
                {testResults.map((result, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={`p-3 rounded border-l-4 ${
                      result.passed 
                        ? 'bg-green-900/30 border-green-500' 
                        : 'bg-red-900/30 border-red-500'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      {result.passed ? (
                        <CheckCircle className="w-4 h-4 text-green-400" />
                      ) : (
                        <XCircle className="w-4 h-4 text-red-400" />
                      )}
                      <span className={`font-semibold ${result.passed ? 'text-green-400' : 'text-red-400'}`}>
                        Test Case {index + 1} {result.passed ? 'PASSED' : 'FAILED'}
                      </span>
                    </div>
                    <div className="code-font text-sm text-gray-300">
                      <div>Input: {result.input}</div>
                      <div>Output: {result.output}</div>
                      <div>Expected: {result.expected}</div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Playground;