import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Trophy, Code, Users, Zap, Github, ArrowLeft, Crown, Medal, Award } from 'lucide-react';
import ParticleBackground from '../components/ParticleBackground';

const About: React.FC = () => {
  const navigate = useNavigate();
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const leaderboardData = [
    { rank: 1, name: 'Alex Chen', xp: 12450, winRate: 89, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=alex' },
    { rank: 2, name: 'Sarah Kim', xp: 11800, winRate: 85, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=sarah' },
    { rank: 3, name: 'Mike Johnson', xp: 11200, winRate: 82, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=mike' },
    { rank: 4, name: 'Emma Davis', xp: 10950, winRate: 78, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=emma' },
    { rank: 5, name: 'James Wilson', xp: 10700, winRate: 75, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=james' }
  ];

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1: return <Crown className="w-6 h-6 text-yellow-400" />;
      case 2: return <Medal className="w-6 h-6 text-gray-300" />;
      case 3: return <Award className="w-6 h-6 text-amber-600" />;
      default: return <span className="text-lg font-bold text-gray-400">#{rank}</span>;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 text-white"
    >
      <ParticleBackground />
      
      <div className="container mx-auto px-4 py-8 relative z-10">
        <motion.button
          onClick={() => navigate('/dashboard')}
          className="absolute top-8 left-8 p-2 text-cyan-400 hover:text-white transition-colors"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <ArrowLeft className="w-6 h-6" />
        </motion.button>

        {/* Hero Section */}
        <motion.div
          className="text-center py-20"
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <motion.h1
            className="text-6xl md:text-8xl font-black mb-8 gradient-text"
            style={{ transform: `translateY(${scrollY * 0.5}px)` }}
          >
            LEADERBOARD
          </motion.h1>
          <motion.p
            className="text-xl text-gray-300 max-w-2xl mx-auto"
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            The ultimate ranking of code warriors in our digital arena
          </motion.p>
        </motion.div>

        {/* Leaderboard */}
        <motion.div
          className="max-w-4xl mx-auto mb-16"
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.7 }}
        >
          <div className="glass-effect rounded-2xl p-8">
            <h2 className="text-3xl font-bold mb-8 text-center text-white">Top Performers</h2>
            
            <div className="space-y-4">
              {leaderboardData.map((player, index) => (
                <motion.div
                  key={player.rank}
                  className={`flex items-center p-4 rounded-xl transition-all duration-300 ${
                    player.rank <= 3 
                      ? 'bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-500/30' 
                      : 'bg-white/5 hover:bg-white/10'
                  }`}
                  initial={{ x: -50, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.9 + index * 0.1 }}
                  whileHover={{ scale: 1.02 }}
                >
                  <div className="flex items-center gap-4 flex-1">
                    <div className="w-12 h-12 flex items-center justify-center">
                      {getRankIcon(player.rank)}
                    </div>
                    
                    <img
                      src={player.avatar}
                      alt={player.name}
                      className="w-12 h-12 rounded-full border-2 border-cyan-400"
                    />
                    
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-white">{player.name}</h3>
                      <p className="text-sm text-gray-300">Win Rate: {player.winRate}%</p>
                    </div>
                    
                    <div className="text-right">
                      <div className="text-xl font-bold text-cyan-400">{player.xp.toLocaleString()}</div>
                      <div className="text-sm text-gray-300">XP</div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* About Section */}
        <motion.div
          className="max-w-4xl mx-auto mb-16"
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 1.2 }}
        >
          <div className="glass-effect rounded-2xl p-8">
            <h2 className="text-4xl font-bold mb-8 text-center gradient-text">What is Playground?</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              <div>
                <p className="text-lg text-gray-300 leading-relaxed mb-6">
                  Playground is a revolutionary competitive coding platform where developers battle in real-time coding duels. 
                  Experience the thrill of algorithmic combat with stunning visuals, instant feedback, and a vibrant community.
                </p>
                
                <p className="text-lg text-gray-300 leading-relaxed">
                  Whether you're a seasoned programmer or just starting your coding journey, our platform offers 
                  challenges that will push your skills to the limit and help you grow as a developer.
                </p>
              </div>
              
              <div className="space-y-4">
                {[
                  { icon: Code, title: "Real-Time Battles", desc: "Face opponents in live coding challenges" },
                  { icon: Zap, title: "Instant Feedback", desc: "Get immediate results and optimizations" },
                  { icon: Users, title: "Global Community", desc: "Connect with developers worldwide" },
                  { icon: Trophy, title: "Competitive Ranking", desc: "Climb the leaderboards and earn XP" }
                ].map((feature, index) => (
                  <motion.div
                    key={index}
                    className="flex items-center gap-3"
                    initial={{ x: 50, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 1.4 + index * 0.1 }}
                  >
                    <div className="w-8 h-8 bg-gradient-to-br from-cyan-500 to-purple-500 rounded-lg flex items-center justify-center">
                      <feature.icon className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-white">{feature.title}</h4>
                      <p className="text-sm text-gray-300">{feature.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Credits Section */}
        <motion.div
          className="text-center py-16"
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 1.6 }}
        >
          <motion.div
            className="glass-effect rounded-2xl p-8 max-w-2xl mx-auto"
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          >
            <h2 className="text-3xl font-bold mb-6 gradient-text">Built with Passion</h2>
            
            <div className="space-y-4 mb-8">
              <p className="text-lg text-gray-300">
                Crafted with love by developers, for developers. This platform represents hundreds of hours 
                of design, development, and optimization to create the ultimate competitive coding experience.
              </p>
              
              <div className="flex items-center justify-center gap-4 text-sm text-gray-400">
                <span>React</span>
                <span>•</span>
                <span>TypeScript</span>
                <span>•</span>
                <span>Tailwind CSS</span>
                <span>•</span>
                <span>Framer Motion</span>
              </div>
            </div>
            
            <motion.a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-gray-700 to-gray-900 rounded-xl font-semibold hover:from-gray-600 hover:to-gray-800 transition-all duration-300"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Github className="w-5 h-5" />
              View on GitHub
            </motion.a>
          </motion.div>
        </motion.div>

        {/* Footer */}
        <motion.footer
          className="text-center py-8 border-t border-gray-700"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2 }}
        >
          <p className="text-gray-400">
            © 2024 Playground. Made with ❤️ for the coding community.
          </p>
        </motion.footer>
      </div>
    </motion.div>
  );
};

export default About;