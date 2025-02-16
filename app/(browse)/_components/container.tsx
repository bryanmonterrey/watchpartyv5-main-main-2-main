"use client";

import { useEffect } from 'react';
import { useMediaQuery } from 'usehooks-ts';
import { cn } from '@/lib/utils';
import { useSidebar } from '@/store/use-sidebar';
import { motion } from 'framer-motion';

interface ContainerProps {
    children: React.ReactNode;
};

export const Container = ({
  children,
}: ContainerProps) => {
    const matches = useMediaQuery("(max-width: 1024px)");
    const {
        collapsed,
        onCollapse,
        onExpand,
    } = useSidebar((state) => state);

    useEffect(() => {
        if (matches) {
            onCollapse();
        }
    }, [matches, onCollapse]); 

  return (
    <motion.div
      className="flex-1 rounded-r-[15px]"
      initial={{ marginLeft: collapsed ? 44 : 240 }}
      animate={{ marginLeft: collapsed ? 44 : 240 }}
      transition={{ duration: 0.2, ease: "easeInOut" }}
    >
      {children}
    </motion.div>
  );
};
