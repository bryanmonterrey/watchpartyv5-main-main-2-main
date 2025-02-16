"use client";

import { Results, ResultsSkeleton } from "./_components/results";
import { Suspense } from "react";
import { Hero, HeroSkeleton } from "./_components/hero";
import { motion } from "framer-motion";

export default function ClientHome() {
  return (
    <motion.div 
    layout 
    transition={{ duration: 0.9 }} 
    className="rounded-xl bg-[#0C0C0C]">
      <div className="grid h-[calc(100%-30rem)]">
      <Suspense fallback={<HeroSkeleton/>}>
        <Hero/>
      </Suspense>
      </div>
      <div className="h-full py-4 px-7 mx-auto">
        <Suspense fallback={<ResultsSkeleton/>}>
        <Results />
        </Suspense>
      </div>
   </motion.div>
   
  );
}

