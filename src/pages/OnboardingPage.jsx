import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

// SLOW & CINEMATIC ENTRANCE
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.2, delayChildren: 0.3 }
  }
};

const itemVariants = {
  hidden: { y: 30, opacity: 0, filter: 'blur(10px)' },
  visible: { 
    y: 0, 
    opacity: 1, 
    filter: 'blur(0px)',
    transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } 
  }
};

export default function OnboardingPage() {
  const navigate = useNavigate();

  return (
    <div className="relative w-full h-full bg-black overflow-hidden flex flex-col items-center justify-end pb-12 px-6">
      <div className="absolute inset-0 z-0">
        <img src="https://images.unsplash.com/photo-1614850523459-c2f4c699c52e?q=80&w=1000&auto=format&fit=crop" className="w-full h-full object-cover opacity-60" alt="" />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
      </div>

      <motion.div 
        className="relative z-10 w-full text-center"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.h1 variants={itemVariants} className="text-5xl font-black text-white tracking-tighter mb-4 leading-[0.9]">
          Твой город.<br/>Твой вайб.
        </motion.h1>
        
        <motion.p variants={itemVariants} className="text-white/60 text-lg mb-10 font-medium leading-relaxed max-w-xs mx-auto">
          Находи людей рядом, создавай спонтанные встречи и живи моментом.
        </motion.p>

        <motion.button 
          variants={itemVariants}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate('/')}
          className="w-full py-5 rounded-[24px] bg-white text-black font-black text-xl shadow-[0_0_40px_rgba(255,255,255,0.3)]"
        >
          Начать
        </motion.button>
      </motion.div>
    </div>
  );
}