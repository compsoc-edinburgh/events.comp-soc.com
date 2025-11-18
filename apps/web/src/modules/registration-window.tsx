import { AnimatePresence, motion } from "motion/react";
import Backdrop from "../components/backdrop";
import { useId, type FormEvent } from "react";

const BUTTON_VARIANTS = {
  initial: { opacity: 0, y: 25 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -25 }
};

interface RegistrationWindowProps {
  open: boolean;
  isLoading: boolean;
  onClose: () => void;
  onSubmit: (email: string) => void;
}

function RegistrationWindow({ open, isLoading, onClose, onSubmit }: RegistrationWindowProps) {
  const emailFieldId = useId();

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const email = (formData.get("email") as string) ?? "";
    onSubmit(email);
  };

  return (
    <AnimatePresence>
      {open && (
        <Backdrop>
          <button
            onClick={onClose}
            className="fixed top-4 right-4 sm:top-6 sm:right-6 text-gray-300 hover:text-white text-2xl z-10 transition-colors touch-manipulation hover:cursor-pointer"
            aria-label="Close modal"
          >
            ✕
          </button>

          <div className="flex min-h-full items-start justify-center px-4 sm:px-6 py-12 sm:py-20 sm:pt-44">
            <motion.div
              className="max-w-md w-full text-white my-auto sm:my-0"
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 30, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="text-2xl sm:text-3xl font-bold mb-2">Request to join</h2>
              <p className="text-neutral-300 mb-6 sm:mb-8 text-sm sm:text-base">
                Please enter your email address to request to join.
              </p>

              <form className="flex flex-col gap-5 sm:gap-6" onSubmit={handleSubmit}>
                <div className="flex flex-col gap-2">
                  <label htmlFor={emailFieldId} className="text-sm font-medium text-neutral-200">
                    Email Address
                  </label>
                  <input
                    id={emailFieldId}
                    name="email"
                    type="email"
                    placeholder="your.email@example.com"
                    autoComplete="email"
                    required
                    className="px-4 py-3 text-base rounded-lg bg-neutral-800 border border-neutral-700 focus:border-white focus:outline-none focus:ring-2 focus:ring-white/20 transition-colors placeholder:text-neutral-500"
                  />
                </div>

                <motion.button
                  type="submit"
                  disabled={isLoading}
                  whileTap={{ scale: isLoading ? 1 : 0.98 }}
                  className="mt-2 bg-white text-black font-semibold py-3 rounded-lg hover:bg-neutral-200 transition-colors relative overflow-hidden"
                >
                  <AnimatePresence mode="popLayout" initial={false}>
                    {isLoading ? (
                      <motion.p
                        key="loading"
                        variants={BUTTON_VARIANTS}
                        initial="initial"
                        animate="animate"
                        exit="exit"
                      >
                        Loading...
                      </motion.p>
                    ) : (
                      <motion.p
                        key="request-to-join"
                        variants={BUTTON_VARIANTS}
                        initial="initial"
                        animate="animate"
                        exit="exit"
                      >
                        I'm interested!
                      </motion.p>
                    )}
                  </AnimatePresence>
                </motion.button>
              </form>
            </motion.div>
          </div>
        </Backdrop>
      )}
    </AnimatePresence>
  );
}

export default RegistrationWindow;
