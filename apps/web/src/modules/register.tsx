import { motion } from "motion/react";

interface RegistrationSectionProps {
  title: string;
  description: string;
  buttonText: string;
  onButtonClick?: () => void;
}

function Register({
  title,
  description,
  buttonText,
  onButtonClick,
}: RegistrationSectionProps) {
  return (
    <section className="mt-8 sm:mt-12 bg-neutral-900 border border-neutral-800 rounded-xl overflow-hidden shadow-lg">
      <div className="bg-neutral-800 px-4 sm:px-5 py-2 m-[0.2rem] rounded-t-[0.55rem]">
        <h2 className="text-sm font-semibold text-white tracking-wide">
          {title}
        </h2>
      </div>
      <div className="px-4 sm:px-6 py-3 sm:py-4 flex flex-col gap-4">
        <p className="text-neutral-400 leading-relaxed text-sm sm:text-base">
          {description}
        </p>
        <motion.button
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
          transition={{ duration: 0.2 }}
          onClick={onButtonClick}
          className="w-full px-5 py-2 bg-white text-black font-medium rounded-lg hover:bg-neutral-200 transition-colors cursor-pointer text-sm sm:text-base"
        >
          {buttonText}
        </motion.button>
      </div>
    </section>
  );
}

export default Register;
