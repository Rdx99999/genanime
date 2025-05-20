
import { useState, useEffect } from "react";
import { motion, useSpring, useMotionValue, useTransform } from "framer-motion";

interface AnimatedCounterProps {
  value: number;
  duration?: number;
  formatValue?: (value: number) => string;
  prefix?: string;
  suffix?: string;
  className?: string;
}

const AnimatedCounter = ({
  value,
  duration = 2,
  formatValue = (val) => val.toLocaleString(),
  prefix = "",
  suffix = "",
  className = "",
}: AnimatedCounterProps) => {
  const springValue = useSpring(0, { duration: duration * 1000 });
  const displayValue = useMotionValue(0);
  const roundedValue = useTransform(displayValue, (latest) => Math.round(latest));
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    if (isInView) {
      springValue.set(value);
    }
  }, [value, isInView, springValue]);

  useEffect(() => {
    const unsubscribe = springValue.onChange((latest) => {
      displayValue.set(latest);
    });

    return unsubscribe;
  }, [springValue, displayValue]);

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true, margin: "-100px" }}
      onViewportEnter={() => setIsInView(true)}
    >
      <motion.span className="inline-flex">
        {prefix}
        <motion.span>{roundedValue.get() !== undefined ? formatValue(roundedValue.get()) : "0"}</motion.span>
        {suffix}
      </motion.span>
    </motion.div>
  );
};

export default AnimatedCounter;
