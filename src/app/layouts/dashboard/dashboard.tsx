import { Navbar } from "@/app/layouts/dashboard/navbar";
import { SsvLogo } from "@/components/ui/ssv-logo";
import { useIsRestoring } from "@tanstack/react-query";
import { AnimatePresence, motion } from "framer-motion";
import type { FC, ReactNode } from "react";

export const DashboardLayout: FC<{ children: ReactNode }> = ({ children }) => {
  const isRestoring = useIsRestoring();

  return (
    <AnimatePresence>
      {isRestoring ? (
        <motion.div
          className="fixed bg-gray-50 inset-0 flex h-screen items-center justify-center"
          key="loading"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <SsvLogo />
        </motion.div>
      ) : (
        <motion.div
          className={"flex flex-col h-screen"}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          key="content"
        >
          <Navbar />
          <main className="p-6 flex-1 overflow-auto">{children}</main>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

DashboardLayout.displayName = "Layout";
