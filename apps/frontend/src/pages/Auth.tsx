import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Github, Chrome, ArrowLeft } from 'lucide-react';
import { useUser } from '../contexts/UserContext';
import ParticleBackground from '../components/ParticleBackground';

const Auth: React.FC = () => {
  const navigate = useNavigate();
  const { setUser } = useUser();

  const handleLogin = (provider: 'google' | 'github') => {
    // Mock authentication - in real app, this would be OAuth
    const mockUser = {
      id: '1',
      name: provider === 'google' ? 'John Doe' : 'Jane Smith',
      email: provider === 'google' ? 'john@gmail.com' : 'jane@github.com',
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${provider}`,
      provider,
      stats: {
        totalMatches: 45,
        wins: 28,
        losses: 17,
        rank: 1247,
        xp: 2840,
        bestTime: 125
      }
    };

    setUser(mockUser);
    navigate('/dashboard');
  };

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
          onClick={() => navigate('/')}
          className="absolute top-8 left-8 p-2 text-cyan-400 hover:text-white transition-colors"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <ArrowLeft className="w-6 h-6" />
        </motion.button>

        <motion.div
          className="max-w-md mx-auto"
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <div className="glass-effect rounded-2xl p-8 text-center">
            <motion.h1
              className="text-4xl font-bold mb-2 gradient-text"
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.5 }}
            >
              Sign in to Compete
            </motion.h1>
            
            <motion.p
              className="text-gray-300 mb-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
            >
              Choose your preferred authentication method
            </motion.p>

            <div className="space-y-4">
              <motion.button
                onClick={() => handleLogin('google')}
                className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-gradient-to-r from-red-500 to-orange-500 rounded-xl font-semibold hover:from-red-400 hover:to-orange-400 transition-all duration-300 transform hover:scale-105"
                initial={{ x: -100, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.9 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Chrome className="w-5 h-5" />
                Continue with Google
              </motion.button>

              <motion.button
                onClick={() => handleLogin('github')}
                className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-gradient-to-r from-gray-700 to-gray-900 rounded-xl font-semibold hover:from-gray-600 hover:to-gray-800 transition-all duration-300 transform hover:scale-105"
                initial={{ x: 100, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 1.1 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Github className="w-5 h-5" />
                Continue with GitHub
              </motion.button>
            </div>

            <motion.div
              className="mt-8 text-sm text-gray-400"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 1.3 }}
            >
              By signing in, you agree to our Terms of Service and Privacy Policy
            </motion.div>
          </div>

          {/* Animated Developer Avatars */}
          <motion.div
            className="flex justify-center gap-8 mt-8"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 1.5, type: "spring", stiffness: 100 }}
          >
            <motion.div
              className="w-16 h-16 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-full flex items-center justify-center"
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            >
              <span className="text-2xl">👨‍💻</span>
            </motion.div>
            <motion.div
              className="text-2xl text-cyan-400 flex items-center"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              VS
            </motion.div>
            <motion.div
              className="w-16 h-16 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full flex items-center justify-center"
              animate={{ rotate: [360, 0] }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            >
              <span className="text-2xl">👩‍💻</span>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Auth;