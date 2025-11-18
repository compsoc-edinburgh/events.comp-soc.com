import { motion } from "motion/react";
import { useNavigate } from "react-router-dom";

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
  const navigate = useNavigate();

  return (
    <header className="w-full flex items-center justify-start px-6 py-4 fixed top-0 left-0 z-50 backdrop-blur-md sm:backdrop-blur-none hover:cursor-pointer">
      <a onClick={() => navigate("")}>
        <CompSocImage />
      </a>
    </header>
  );
}

export default Header;
