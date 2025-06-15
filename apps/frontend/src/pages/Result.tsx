import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Trophy, Target, Clock, ArrowUp, ArrowDown, RotateCcw } from 'lucide-react';
import { useUser } from '../contexts/UserContext';
import Confetti from 'react-confetti';

const Result: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useUser();
  const [showConfetti, setShowConfetti] = useState(false);
  const [windowDimensions, setWindowDimensions] = useState({
    width: window.innerWidth,
    height: window.innerHeight
  });

  // Mock result data
  const result = {
    winner: user,
    loser: {
      name: 'Alex Chen',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=alex',
      stats: { rank: 1180 }
    },
    yourScore: 85,
    opponentScore: 72,
    yourTime: 3.5,
    opponentTime: 4.2,
    testCasesPassed: 12,
    totalTestCases: 15,
    xpGained: 25,
    rankChange: 15,
    isWinner: true
  };

  useEffect(() => {
    if (result.isWinner) {
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 5000);
    }

    const handleResize = () => {
      setWindowDimensions({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (!user) {
    navigate('/auth');
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen flex items-center justify-center relative bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900"
    >
      {showConfetti && (
        <Confetti
          width={windowDimensions.width}
          height={windowDimensions.height}
          recycle={false}
          numberOfPieces={500}
          colors={['#00D4FF', '#FF0080', '#00FF88', '#FFFF00', '#FF4500']}
        />
      )}

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          className="max-w-4xl mx-auto text-center"
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          {/* Winner Announcement */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.5, type: "spring", stiffness: 100 }}
            className="mb-8"
          >
            <motion.div
              className="text-8xl mb-4"
              animate={{ 
                rotateY: [0, 360],
                scale: [1, 1.2, 1]
              }}
              transition={{ 
                rotateY: { duration: 2, repeat: Infinity, ease: "linear" },
                scale: { duration: 2, repeat: Infinity }
              }}
            >
              {result.isWinner ? '👑' : '💔'}
            </motion.div>
            
            <motion.h1
              className={`text-6xl font-black mb-4 ${result.isWinner ? 'text-yellow-400' : 'text-gray-400'}`}
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.7 }}
            >
              {result.isWinner ? 'VICTORY!' : 'DEFEAT'}
            </motion.h1>
          </motion.div>

          {/* Battle Summary */}
          <motion.div
            className="glass-effect rounded-2xl p-8 mb-8"
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.9 }}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Winner Side */}
              <motion.div
                className={`text-center ${result.isWinner ? 'order-first' : 'order-last'}`}
                initial={{ x: result.isWinner ? -100 : 100, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 1.1 }}
              >
                <div className="relative">
                  <motion.img
                    src={result.winner.avatar}
                    alt={result.winner.name}
                    className={`w-32 h-32 rounded-full mx-auto mb-4 border-4 ${
                      result.isWinner ? 'border-yellow-400' : 'border-gray-400'
                    }`}
                    animate={result.isWinner ? { 
                      boxShadow: [
                        "0 0 20px #fbbf24",
                        "0 0 40px #fbbf24",
                        "0 0 20px #fbbf24"
                      ]
                    } : {}}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                  {result.isWinner && (
                    <motion.div
                      className="absolute -top-4 -right-4 text-4xl"
                      animate={{ rotate: [0, 360] }}
                      transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    >
                      👑
                    </motion.div>
                  )}
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">{result.winner.name}</h3>
                <div className="space-y-2 text-lg">
                  <div className="flex items-center justify-center gap-2">
                    <Target className="w-5 h-5 text-green-400" />
                    <span className="text-white">Score: {result.yourScore}</span>
                  </div>
                  <div className="flex items-center justify-center gap-2">
                    <Clock className="w-5 h-5 text-blue-400" />
                    <span className="text-white">Time: {result.yourTime}m</span>
                  </div>
                </div>
              </motion.div>

              {/* Loser Side */}
              <motion.div
                className={`text-center ${result.isWinner ? 'order-last' : 'order-first'}`}
                initial={{ x: result.isWinner ? 100 : -100, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 1.3 }}
              >
                <motion.img
                  src={result.loser.avatar}
                  alt={result.loser.name}
                  className="w-32 h-32 rounded-full mx-auto mb-4 border-4 border-gray-600 grayscale"
                  initial={{ scale: 1 }}
                  animate={{ scale: 0.9 }}
                  transition={{ delay: 1.5 }}
                />
                <h3 className="text-2xl font-bold text-gray-400 mb-2">{result.loser.name}</h3>
                <div className="space-y-2 text-lg">
                  <div className="flex items-center justify-center gap-2">
                    <Target className="w-5 h-5 text-red-400" />
                    <span className="text-gray-300">Score: {result.opponentScore}</span>
                  </div>
                  <div className="flex items-center justify-center gap-2">
                    <Clock className="w-5 h-5 text-red-400" />
                    <span className="text-gray-300">Time: {result.opponentTime}m</span>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* VS Badge */}
            <motion.div
              className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-gradient-to-br from-red-500 to-orange-500 rounded-full flex items-center justify-center text-white font-bold text-xl border-4 border-white"
              initial={{ scale: 0, rotate: 0 }}
              animate={{ scale: 1, rotate: 360 }}
              transition={{ delay: 1.7, type: "spring", stiffness: 200 }}
            >
              VS
            </motion.div>
          </motion.div>

          {/* Stats */}
          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 1.9 }}
          >
            <div className="glass-effect rounded-xl p-6">
              <Trophy className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
              <h3 className="text-xl font-bold text-white mb-1">XP Gained</h3>
              <p className="text-2xl font-bold text-green-400">+{result.xpGained}</p>
            </div>
            
            <div className="glass-effect rounded-xl p-6">
              <div className="flex items-center justify-center mb-2">
                {result.rankChange > 0 ? (
                  <ArrowUp className="w-8 h-8 text-green-400" />
                ) : (
                  <ArrowDown className="w-8 h-8 text-red-400" />
                )}
              </div>
              <h3 className="text-xl font-bold text-white mb-1">Rank Change</h3>
              <p className={`text-2xl font-bold ${result.rankChange > 0 ? 'text-green-400' : 'text-red-400'}`}>
                {result.rankChange > 0 ? '+' : ''}{result.rankChange}
              </p>
            </div>
            
            <div className="glass-effect rounded-xl p-6">
              <Target className="w-8 h-8 text-blue-400 mx-auto mb-2" />
              <h3 className="text-xl font-bold text-white mb-1">Test Cases</h3>
              <p className="text-2xl font-bold text-cyan-400">
                {result.testCasesPassed}/{result.totalTestCases}
              </p>
            </div>
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center"
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 2.1 }}
          >
            <motion.button
              onClick={() => navigate('/matching')}
              className="px-8 py-3 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl font-bold hover:from-green-400 hover:to-emerald-400 transition-all duration-300 flex items-center justify-center gap-2"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <RotateCcw className="w-5 h-5" />
              Play Again
            </motion.button>
            
            <motion.button
              onClick={() => navigate('/dashboard')}
              className="px-8 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-xl font-bold hover:from-cyan-400 hover:to-blue-400 transition-all duration-300"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Dashboard
            </motion.button>
            
            <motion.button
              onClick={() => navigate('/about')}
              className="px-8 py-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl font-bold hover:from-purple-400 hover:to-pink-400 transition-all duration-300"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Leaderboard
            </motion.button>
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Result;