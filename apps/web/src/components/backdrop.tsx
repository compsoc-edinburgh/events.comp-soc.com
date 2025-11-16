import { motion } from "motion/react";

interface BackdropProps {
  children: React.ReactNode;
}

const BACKDROP_STYLE = {
  backdropFilter: "blur(8px) brightness(0.4)",
  WebkitBackdropFilter: "blur(8px) brightness(0.4)",
  backgroundColor: "rgba(10, 10, 10, 0.85)"
};

function Backdrop({ children }: BackdropProps) {
  return (
    <motion.div
      className="fixed inset-0 z-50 overflow-y-auto mobile-backdrop"
      style={BACKDROP_STYLE}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {children}
    </motion.div>
  );
}

export default Backdrop;
