import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Users, Copy, Check, ArrowLeft } from 'lucide-react';
import { useUser } from '../contexts/UserContext';
import ParticleBackground from '../components/ParticleBackground';

const Matching: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useUser();
  const [matchCode, setMatchCode] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [opponent, setOpponent] = useState<any>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    // Generate random match code
    const code = Math.random().toString(36).substring(2, 8).toUpperCase();
    setMatchCode(code);
  }, []);

  const handleFindMatch = () => {
    setIsSearching(true);
    
    // Simulate finding an opponent
    setTimeout(() => {
      setOpponent({
        name: 'Alex Chen',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=alex',
        rank: 1180,
        winRate: 73
      });
      setIsSearching(false);
    }, 3000);
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(matchCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleStartMatch = () => {
    navigate('/playground');
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
      className="min-h-screen flex items-center justify-center relative"
    >
      <ParticleBackground />
      
      <div className="container mx-auto px-4 relative z-10">
        <motion.button
          onClick={() => navigate('/dashboard')}
          className="absolute top-8 left-8 p-2 text-cyan-400 hover:text-white transition-colors"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <ArrowLeft className="w-6 h-6" />
        </motion.button>

        <div className="max-w-2xl mx-auto">
          <motion.div
            className="glass-effect rounded-2xl p-8 text-center"
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <motion.h1
              className="text-4xl font-bold mb-8 gradient-text"
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.5 }}
            >
              Battle Arena
            </motion.h1>

            <AnimatePresence mode="wait">
              {!opponent && !isSearching && (
                <motion.div
                  key="waiting"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="space-y-6"
                >
                  <div className="bg-white/5 rounded-xl p-6">
                    <h3 className="text-xl font-semibold mb-4 text-white">Match Code</h3>
                    <div className="flex items-center justify-center gap-4">
                      <div className="px-6 py-3 bg-gray-800 rounded-lg font-mono text-2xl text-cyan-400 tracking-widest">
                        {matchCode}
                      </div>
                      <motion.button
                        onClick={handleCopyCode}
                        className="p-3 bg-cyan-500 hover:bg-cyan-400 rounded-lg transition-colors"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        {copied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                      </motion.button>
                    </div>
                    <p className="text-gray-300 text-sm mt-2">Share this code with your opponent</p>
                  </div>

                  <div className="text-gray-300">OR</div>

                  <motion.button
                    onClick={handleFindMatch}
                    className="w-full px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl text-xl font-bold hover:from-purple-400 hover:to-pink-400 transition-all duration-300 flex items-center justify-center gap-3"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Users className="w-6 h-6" />
                    Find Random Opponent
                  </motion.button>
                </motion.div>
              )}

              {isSearching && (
                <motion.div
                  key="searching"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="py-12"
                >
                  <motion.div
                    className="w-16 h-16 border-4 border-cyan-400 border-t-transparent rounded-full mx-auto mb-6"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  />
                  <h3 className="text-2xl font-semibold text-white mb-2">Searching for opponent...</h3>
                  <p className="text-gray-300">Finding a worthy challenger</p>
                </motion.div>
              )}

              {opponent && (
                <motion.div
                  key="opponent-found"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="space-y-6"
                >
                  <motion.div
                    className="text-6xl mb-4"
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 0.5, repeat: 3 }}
                  >
                    ⚔️
                  </motion.div>
                  
                  <h3 className="text-2xl font-bold text-green-400 mb-6">Opponent Found!</h3>
                  
                  <div className="flex items-center justify-center gap-8">
                    <div className="text-center">
                      <img
                        src={user.avatar}
                        alt={user.name}
                        className="w-20 h-20 rounded-full border-2 border-cyan-400 mx-auto mb-2"
                      />
                      <h4 className="font-semibold text-white">{user.name}</h4>
                      <p className="text-cyan-400">Rank #{user.stats.rank}</p>
                    </div>
                    
                    <motion.div
                      className="text-4xl text-red-400"
                      animate={{ scale: [1, 1.3, 1] }}
                      transition={{ duration: 1, repeat: Infinity }}
                    >
                      VS
                    </motion.div>
                    
                    <div className="text-center">
                      <img
                        src={opponent.avatar}
                        alt={opponent.name}
                        className="w-20 h-20 rounded-full border-2 border-purple-400 mx-auto mb-2"
                      />
                      <h4 className="font-semibold text-white">{opponent.name}</h4>
                      <p className="text-purple-400">Rank #{opponent.rank}</p>
                    </div>
                  </div>

                  <motion.button
                    onClick={handleStartMatch}
                    className="w-full px-8 py-4 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl text-xl font-bold hover:from-green-400 hover:to-emerald-400 transition-all duration-300"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    animate={{ 
                      boxShadow: ["0 0 20px #10b981", "0 0 40px #10b981", "0 0 20px #10b981"]
                    }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    Start Battle!
                  </motion.button>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default Matching;