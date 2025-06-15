import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Code, Zap, Trophy, Users } from 'lucide-react';
import ParticleBackground from '../components/ParticleBackground';
import FloatingCode from '../components/FloatingCode';

const Landing: React.FC = () => {
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen relative overflow-hidden"
    >
      <ParticleBackground />
      <FloatingCode />
      
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-20 relative z-10">
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="text-center"
        >
          <motion.h1
            className="text-8xl md:text-9xl font-black mb-8 gradient-text neon-text"
            initial={{ scale: 0.5 }}
            animate={{ scale: 1 }}
            transition={{ 
              type: "spring", 
              stiffness: 100, 
              damping: 10,
              delay: 0.8 
            }}
          >
            PLAYGROUND
          </motion.h1>
          
          <motion.p
            className="text-xl md:text-2xl mb-12 text-cyan-300 max-w-3xl mx-auto"
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 1.2 }}
          >
            Where Code Warriors Battle in Real-Time
          </motion.p>

          <motion.button
            onClick={() => navigate('/auth')}
            className="px-12 py-4 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-full text-xl font-bold hover:from-cyan-400 hover:to-purple-500 transition-all duration-300 neon-border transform hover:scale-105"
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 1.5 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Enter the Arena
          </motion.button>
        </motion.div>

        {/* Features Grid */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mt-32"
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 2 }}
        >
          {[
            { icon: Code, title: "Real-Time Coding", desc: "Battle opponents in live coding duels" },
            { icon: Zap, title: "Lightning Fast", desc: "Instant compilation and testing" },
            { icon: Trophy, title: "Competitive", desc: "Climb the leaderboards" },
            { icon: Users, title: "Community", desc: "Join thousands of developers" }
          ].map((feature, index) => (
            <motion.div
              key={index}
              className="glass-effect rounded-xl p-6 text-center tilt-effect hover:bg-white/20 transition-all duration-300"
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 2.2 + index * 0.2 }}
              whileHover={{ y: -10 }}
            >
              <feature.icon className="w-12 h-12 text-cyan-400 mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2 text-white">{feature.title}</h3>
              <p className="text-gray-300">{feature.desc}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div
          className="absolute bottom-10 left-1/2 transform -translate-x-1/2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 3 }}
        >
          <motion.div
            className="w-6 h-10 border-2 border-cyan-400 rounded-full flex justify-center"
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <motion.div
              className="w-1 h-3 bg-cyan-400 rounded-full mt-2"
              animate={{ opacity: [1, 0, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Landing;