import { motion, AnimatePresence } from "framer-motion";

export default function CeyloriaLoader() {
  return (
    <motion.div 
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8, ease: "easeInOut" }}
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#faf9f6]"
    >
      {/* Background Decorative Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div 
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.1, 0.2, 0.1] 
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
          className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-[#c8007b]/10 rounded-full blur-[120px]"
        />
        <motion.div 
          animate={{ 
            scale: [1, 1.3, 1],
            opacity: [0.1, 0.15, 0.1] 
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "linear", delay: 2 }}
          className="absolute -bottom-[10%] -right-[10%] w-[50%] h-[50%] bg-[#eab308]/10 rounded-full blur-[120px]"
        />
      </div>

      <div className="relative z-10 flex flex-col items-center">
        {/* Logo Container with Animation */}
        <div className="relative mb-12 flex justify-center items-center">
          {/* Outer Rotating Rings */}
          <motion.div 
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="absolute w-40 h-40 border-t border-r border-[#c8007b]/20 rounded-full"
          />
          <motion.div 
            animate={{ rotate: -360 }}
            transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
            className="absolute w-48 h-48 border-b border-l border-[#eab308]/20 rounded-full"
          />

          {/* Text Logo with Letter Animation */}
          <motion.div
            initial="hidden"
            animate="visible"
            className="relative flex items-center justify-center"
          >
            <div className="flex gap-1 md:gap-2">
              {"Ceyloria".split("").map((char, index) => (
                <motion.span
                  key={index}
                  variants={{
                    hidden: { opacity: 0, y: 40, rotateX: -90, scale: 0.5 },
                    visible: { 
                      opacity: 1, 
                      y: 0, 
                      rotateX: 0, 
                      scale: 1,
                      transition: {
                        type: "spring",
                        damping: 12,
                        stiffness: 150,
                        delay: index * 0.1
                      }
                    }
                  }}
                  className={`text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter ${
                    index < 3 ? "text-[#c8007b]" : "text-[#fbbf24]"
                  }`}
                  style={{ 
                    fontFamily: "'Playfair Display', serif",
                    textShadow: "0 10px 20px rgba(0,0,0,0.05)"
                  }}
                >
                  {char}
                </motion.span>
              ))}
            </div>

            {/* Accent Dot */}
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 1, duration: 0.5, type: "spring" }}
              className="absolute -right-4 md:-right-8 bottom-2 md:bottom-4 w-3 md:w-5 h-3 md:h-5 bg-[#c8007b] rounded-full shadow-lg shadow-[#c8007b]/20"
            />
          </motion.div>
        </div>

        {/* Loading Progress Wrapper */}
        <div className="flex flex-col items-center space-y-4">
          <div className="flex items-center gap-3">
             <motion.div 
              animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
              className="w-1.5 h-1.5 rounded-full bg-[#c8007b]" 
            />
            <span className="text-[10px] md:text-xs font-black uppercase tracking-[0.5em] text-gray-900/40">
              Discovering Paradise
            </span>
             <motion.div 
              animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }}
              transition={{ repeat: Infinity, duration: 1.5, delay: 0.5 }}
              className="w-1.5 h-1.5 rounded-full bg-[#eab308]" 
            />
          </div>

          {/* Elegant Progress Bar */}
          <div className="w-48 h-[2px] bg-gray-100 rounded-full overflow-hidden relative">
            <motion.div
              initial={{ left: "-100%" }}
              animate={{ left: "100%" }}
              transition={{ 
                duration: 2.5, 
                repeat: Infinity, 
                ease: "easeInOut" 
              }}
              className="absolute top-0 bottom-0 w-1/3 bg-gradient-to-r from-transparent via-[#c8007b] to-transparent"
            />
          </div>
        </div>
      </div>
    </motion.div>
  );
}
