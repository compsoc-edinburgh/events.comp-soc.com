import { motion } from "motion/react";

const CompSocImage = () => (
  <motion.img
    src="https://comp-soc.com/compsoc-mini.svg"
    alt="CompSoc Logo"
    className="h-6 w-6 lg:h-8 lg:w-8"
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
    transition={{ duration: 0.2 }}
  />
);

function Header() {
  return (
    <header className="w-full flex items-center justify-start px-6 py-4 fixed top-0 left-0 z-50 backdrop-blur-md sm:backdrop-blur-none">
      <a href="https://comp-soc.com" target="_blank" rel="noopener noreferrer">
        <CompSocImage />
      </a>
    </header>
  );
}

export default Header;
