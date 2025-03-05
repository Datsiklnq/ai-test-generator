"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Rocket, Settings, Zap } from "lucide-react";
import { JSX } from "react";

export default function Home() {
  const router = useRouter();

  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen px-6 py-12 bg-gradient-to-br from-gray-950 to-black text-gray-200 overflow-hidden">
      {/* Animated Background Elements */}
      <motion.div
        className="absolute w-[500px] h-[500px] bg-blue-500 opacity-30 blur-3xl rounded-full top-1/4 left-1/3 -z-10"
        animate={{ scale: [1, 1.2, 1] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute w-[350px] h-[350px] bg-purple-500 opacity-30 blur-3xl rounded-full bottom-1/4 right-1/3 -z-10"
        animate={{ scale: [1, 1.3, 1] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Title with Neon Glow & Motion */}
      <motion.h1
        className="text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500 drop-shadow-lg mb-6"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      >
        AI Test Case Generator
      </motion.h1>

      {/* Subtext */}
      <motion.p
        className="text-lg text-gray-300 max-w-lg text-center mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 1 }}
      >
        Instantly generate automated test cases with AI. Revolutionize your
        testing process and boost efficiency.
      </motion.p>

      {/* Animated CTA Button */}
      <motion.button
        onClick={() => router.push("/pages/generate-test-case")}
        className="relative px-10 py-4 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold text-lg shadow-2xl transition-all duration-300 ease-in-out hover:scale-110 hover:shadow-blue-500/50"
        whileHover={{ scale: 1.15 }}
        whileTap={{ scale: 0.95 }}
      >
        🚀 Get Started
        <motion.span
          className="absolute inset-0 rounded-lg bg-gradient-to-r from-blue-400 to-purple-500 opacity-50 blur-lg -z-10"
          animate={{ opacity: [0.3, 0.8, 0.3] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
      </motion.button>

      {/* Features Section */}
      <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-5xl">
        <FeatureCard
          icon={<Rocket size={40} className="text-blue-400" />}
          title="Fast AI-Powered Generation"
          description="Get test cases in seconds, optimized for Cypress, Playwright, and Selenium."
        />
        <FeatureCard
          icon={<Settings size={40} className="text-purple-400" />}
          title="Fully Customizable"
          description="Modify generated test cases easily to fit your project's requirements."
        />
        <FeatureCard
          icon={<Zap size={40} className="text-yellow-400" />}
          title="Lightning-Fast Execution"
          description="Generate and run automated test scripts effortlessly with AI-driven efficiency."
        />
      </div>
    </div>
  );
}

// Feature Card Component with Motion Effects
const FeatureCard = ({
  icon,
  title,
  description,
}: {
  icon: JSX.Element;
  title: string;
  description: string;
}) => {
  return (
    <motion.div
      className="p-6 bg-white/10 backdrop-blur-lg rounded-2xl shadow-lg border border-white/20 text-center transition-all hover:scale-110 hover:border-blue-400"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1, ease: "easeOut" }}
      whileHover={{ y: -10 }}
    >
      <motion.div
        className="mb-4 flex justify-center"
        animate={{ rotate: [0, 10, -10, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      >
        {icon}
      </motion.div>
      <h2 className="text-xl font-semibold text-white mb-2">{title}</h2>
      <p className="text-gray-300 text-sm">{description}</p>
    </motion.div>
  );
};
