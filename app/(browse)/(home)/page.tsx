import { Suspense } from "react";
import { Results, ResultsSkeleton } from "./_components/results";
import { Hero, HeroSkeleton } from "./_components/hero";
import { MotionWrapper } from "@/components/MotionWrapper";

export const metadata = {
  title: 'Home',
};

export default function Home() {
  return (
    <MotionWrapper>
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
    </MotionWrapper>
  );
}