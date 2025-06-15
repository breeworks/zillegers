import React from 'react';
import { motion } from 'framer-motion';

const codeSnippets = [
  'def solve(n):', 
  'for i in range(n):', 
  'if left < right:', 
  'return result', 
  'while queue:', 
  'dp[i][j] = max()',
  'O(n log n)',
  'BFS()',
  'DFS()',
  'Binary Search',
  'Heap',
  'Recurssion'
];

const FloatingCode: React.FC = () => {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      {codeSnippets.map((code, index) => (
        <motion.div
          key={index}
          className="absolute text-cyan-400 opacity-20 code-font text-sm"
          initial={{ 
            x: Math.random() * window.innerWidth, 
            y: window.innerHeight + 50,
            opacity: 0 
          }}
          animate={{ 
            y: -100, 
            opacity: [0, 0.3, 0.3, 0] 
          }}
          transition={{ 
            duration: 15 + Math.random() * 10,
            repeat: Infinity,
            delay: Math.random() * 10,
            ease: "linear"
          }}
        >
          {code}
        </motion.div>
      ))}
    </div>
  );
};

export default FloatingCode;