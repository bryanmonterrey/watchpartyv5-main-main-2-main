'use client'

import { motion } from "framer-motion";

export function MotionWrapper({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      layout
      transition={{ duration: 0.9 }}
      className="rounded-xl bg-[#0C0C0D] bg-opacity-90"
    >
      {children}
    </motion.div>
  );
}