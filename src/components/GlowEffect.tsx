
import React from "react";
import { motion } from "framer-motion";

interface GlowEffectProps {
  children: React.ReactNode;
  className?: string;
  glowColor?: string;
  intensity?: "low" | "medium" | "high";
  interactive?: boolean;
}

const GlowEffect = ({
  children,
  className = "",
  glowColor = "rgba(255, 132, 0, 0.5)",
  intensity = "medium",
  interactive = true,
}: GlowEffectProps) => {
  // Map intensity to blur values
  const blurMap = {
    low: "10px",
    medium: "20px",
    high: "30px",
  };

  const blur = blurMap[intensity] || blurMap.medium;
  
  // Interactive states for hover animation
  const variants = {
    initial: {
      opacity: 0.3,
      scale: 1,
    },
    hover: interactive ? {
      opacity: 0.7,
      scale: 1.05,
    } : {
      opacity: 0.3,
      scale: 1,
    },
  };

  return (
    <div className={`relative ${className}`}>
      {/* The glow effect */}
      <motion.div
        className="absolute inset-0 z-0 rounded-lg pointer-events-none"
        style={{
          filter: `blur(${blur})`,
          background: glowColor,
          opacity: 0.3,
        }}
        variants={variants}
        initial="initial"
        animate={interactive ? undefined : "initial"}
        whileHover="hover"
        transition={{ duration: 0.3 }}
      />
      
      {/* The actual content */}
      <div className="relative z-10">{children}</div>
    </div>
  );
};

export default GlowEffect;
