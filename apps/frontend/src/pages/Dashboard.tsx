import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Trophy, Target, Clock, Zap, Users, LogOut, Play } from 'lucide-react';
import { useUser } from '../contexts/UserContext';
import ParticleBackground from '../components/ParticleBackground';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user, setUser } = useUser();

  if (!user) {
    navigate('/auth');
    return null;
  }

  const handleLogout = () => {
    setUser(null);
    navigate('/');
  };

  const winRate = Math.round((user.stats.wins / user.stats.totalMatches) * 100);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen relative"
    >
      <ParticleBackground />
      
      <div className="container mx-auto px-4 py-8 relative z-10">
        {/* Header */}
        <motion.div
          className="flex justify-between items-center mb-8"
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex items-center gap-4">
            <motion.img
              src={user.avatar}
              alt={user.name}
              className="w-16 h-16 rounded-full border-2 border-cyan-400"
              whileHover={{ scale: 1.1, rotate: 360 }}
              transition={{ duration: 0.5 }}
            />
            <div>
              <h1 className="text-2xl font-bold text-white">{user.name}</h1>
              <p className="text-cyan-400">Rank #{user.stats.rank}</p>
            </div>
          </div>
          
          <motion.button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 text-red-400 hover:text-red-300 transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <LogOut className="w-4 h-4" />
            Logout
          </motion.button>
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          {[
            { icon: Target, label: "Total Matches", value: user.stats.totalMatches, color: "from-blue-500 to-cyan-500" },
            { icon: Trophy, label: "Win Rate", value: `${winRate}%`, color: "from-green-500 to-emerald-500" },
            { icon: Zap, label: "XP Points", value: user.stats.xp, color: "from-purple-500 to-pink-500" },
            { icon: Clock, label: "Best Time", value: `${user.stats.bestTime}s`, color: "from-orange-500 to-red-500" }
          ].map((stat, index) => (
            <motion.div
              key={index}
              className="glass-effect rounded-xl p-6 tilt-effect hover:bg-white/20 transition-all duration-300"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.6 + index * 0.1 }}
              whileHover={{ y: -5 }}
            >
              <div className={`w-12 h-12 bg-gradient-to-br ${stat.color} rounded-lg flex items-center justify-center mb-4`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-1">{stat.value}</h3>
              <p className="text-gray-300 text-sm">{stat.label}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Rank Progress */}
        <motion.div
          className="glass-effect rounded-xl p-6 mb-8"
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          <h2 className="text-xl font-bold mb-4 text-white">Rank Progress</h2>
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <div className="flex justify-between text-sm text-gray-300 mb-2">
                <span>Current Rank: #{user.stats.rank}</span>
                <span>Next: #{user.stats.rank - 1}</span>
              </div>
              <div className="h-3 bg-gray-700 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-cyan-500 to-purple-500"
                  initial={{ width: 0 }}
                  animate={{ width: `${(user.stats.xp % 1000) / 10}%` }}
                  transition={{ delay: 1, duration: 1 }}
                />
              </div>
            </div>
          </div>
        </motion.div>

        {/* Recent Matches */}
        <motion.div
          className="glass-effect rounded-xl p-6 mb-8"
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 1 }}
        >
          <h2 className="text-xl font-bold mb-4 text-white">Recent Matches</h2>
          <div className="space-y-3">
            {[
              { opponent: "Alex Chen", result: "WIN", time: "2m 45s", xp: "+25" },
              { opponent: "Sarah Kim", result: "LOSS", time: "4m 12s", xp: "-10" },
              { opponent: "Mike Johnson", result: "WIN", time: "1m 58s", xp: "+30" }
            ].map((match, index) => (
              <motion.div
                key={index}
                className="flex items-center justify-between p-3 bg-white/5 rounded-lg"
                initial={{ x: -50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 1.2 + index * 0.1 }}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full ${match.result === 'WIN' ? 'bg-green-500' : 'bg-red-500'}`} />
                  <span className="text-white">vs {match.opponent}</span>
                </div>
                <div className="flex items-center gap-4 text-sm">
                  <span className="text-gray-300">{match.time}</span>
                  <span className={`font-semibold ${match.result === 'WIN' ? 'text-green-400' : 'text-red-400'}`}>
                    {match.xp}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Start Match Button */}
        <motion.div
          className="text-center"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 1.4 }}
        >
          <motion.button
            onClick={() => navigate('/matching')}
            className="px-12 py-4 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-full text-xl font-bold hover:from-cyan-400 hover:to-purple-500 transition-all duration-300 neon-border flex items-center gap-3 mx-auto"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Play className="w-6 h-6" />
            Find Match
          </motion.button>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Dashboard;