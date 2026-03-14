import { motion } from "framer-motion";

export default function CeyloriaLoader() {
  const brandName = "Ceyloria";

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const letterVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        damping: 12,
        stiffness: 200,
      },
    },
  };

  return (
    <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-white">
      {/* Background Subtle Mesh */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 h-96 w-96 rounded-full bg-secondary/30 blur-[120px] animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 h-96 w-96 rounded-full bg-primary/20 blur-[120px] animate-pulse delay-700"></div>
      </div>

      <div className="relative z-10 flex flex-col items-center">
        {/* Animated Brand Logo (Wipe Reveal) */}
        <div className="flex mb-4 overflow-hidden justify-center relative w-[400px] md:w-[700px] lg:w-[1000px] h-40 md:h-[300px]">
          <motion.div
            initial={{ width: "0%" }}
            animate={{ width: "100%" }}
            transition={{
              duration: 2.5,
              ease: "easeInOut",
            }}
            className="absolute left-0 top-0 h-full overflow-hidden flex justify-start items-center"
          >
            <img 
              src="/logo.png" 
              alt="Ceyloria Logo"
              className="w-[400px] md:w-[700px] lg:w-[1000px] h-40 md:h-[300px] object-contain max-w-none origin-left"
            />
          </motion.div>
        </div>

        {/* Shimmering Line */}
        <div className="relative w-64 h-[2px] bg-gray-100 overflow-hidden rounded-full">
          <motion.div
            initial={{ left: "-100%" }}
            animate={{ left: "100%" }}
            transition={{
              repeat: Infinity,
              duration: 2,
              ease: "easeInOut",
            }}
            className="absolute top-0 bottom-0 w-1/2 bg-gradient-to-r from-transparent via-primary/50 to-transparent"
          />
        </div>

        {/* Loading Text */}
        <motion.div
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: {
                delayChildren: 0.5,
                staggerChildren: 0.1,
              },
            },
          }}
          initial="hidden"
          animate="visible"
          className="mt-5 flex text-gray-500 text-[10px] md:text-xs uppercase tracking-[0.5em] font-bold"
        >
          {"Discovering Paradise".split("").map((char, index) => (
            <motion.span
              key={index}
              variants={{
                hidden: { opacity: 0, y: 10 },
                visible: {
                  opacity: 1,
                  y: 0,
                  transition: {
                    type: "spring",
                    damping: 12,
                    stiffness: 200,
                  },
                },
              }}
            >
              {char === " " ? "\u00A0" : char}
            </motion.span>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
