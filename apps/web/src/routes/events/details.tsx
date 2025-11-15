"use client";

import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import { SIGsCarousel } from "../../modules/sigs-carousel";
import Tag from "../../components/tag";
import Register from "../../modules/register";
import AboutMarkdown from "../../modules/about-markdown";
import Location from "../../modules/location";
import { Sigs } from "@monorepo/types";

const eventData = {
  organizer: { sig: Sigs.TypeSig },
  hero: {
    title: "MathSoc x TypeSig: Lean Sesh",
    tags: ["Mathematics", "Proof Assistants", "Lean", "Logic", "Collaboration"],
  },
  registration: {
    title: "Sign Up",
    description:
      "Join us for the MathSoc x TypeSig Lean Sesh! Whether you're curious about formal proofs, want to put Lean through its paces, or just enjoy logic puzzles, this collaborative workshop is for you.",
    buttonText: "I'm interested!",
  },
  about: {
    content: `A chill collaborative session with **MathSoc** and **TypeSig**.

- Try out the Lean proof assistant
- Solve logic puzzles and mini proof challenges
- Get help from experienced users
- No prior experience required
- Bring your curiosity and laptop!

All interested in mathematics, logic, or programming are welcome.`,
  },
  location: {
    locationName: "Informatics Forum, Room G.07",
    description:
      "Enter via the main doors of the Informatics Forum (10 Crichton Street), turn left, and G.07 is the large seminar room past the atrium.",
    mapEmbedUrl:
      "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2244.396113649709!2d-3.1890397840362427!3d55.94460328058827!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x4887c786d29dbdd3%3A0x6b23e390e6a4c91!2sInformatics%20Forum!5e0!3m2!1sen!2suk!4v1710000000000!5m2!1sen!2suk",
    mapTitle: "Informatics Forum Map",
  },
};

const BUTTON_VARIANTS = {
  initial: { opacity: 0, y: 25 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -25 },
};

function Details() {
  const [isRSVPModalOpen, setIsRSVPModalOpen] = useState(false);
  const [isPageLoading, setIsPageLoading] = useState(false);

  const handleRSVPClick = () => setIsRSVPModalOpen(true);
  const handleClose = () => {
    setIsRSVPModalOpen(false);
  };

  useEffect(() => {
    if (isRSVPModalOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
  }, [isRSVPModalOpen]);

  return (
    <div className="relative min-h-screen text-white bg-neutral-900">
      <main className="flex flex-col items-center justify-center px-4 sm:px-6 pb-10">
        <div className="max-w-2xl w-full">
          <SIGsCarousel organizer={eventData.organizer.sig} />

          <h1 className="font-bold text-2xl sm:text-3xl md:text-4xl leading-tight">
            {eventData.hero.title}
          </h1>

          <div className="flex flex-wrap gap-2 mt-4">
            {eventData.hero.tags.map((tag, index) => (
              <Tag key={index}>{tag}</Tag>
            ))}
          </div>

          <Register
            title={eventData.registration.title}
            description={eventData.registration.description}
            buttonText={eventData.registration.buttonText}
            onButtonClick={handleRSVPClick}
          />

          <AboutMarkdown content={eventData.about.content} />

          <Location
            locationName={eventData.location.locationName}
            description={eventData.location.description}
            mapEmbedUrl={eventData.location.mapEmbedUrl}
            mapTitle={eventData.location.mapTitle}
          />
        </div>
      </main>

      <AnimatePresence>
        {isRSVPModalOpen && (
          <motion.div
            className="fixed inset-0 z-50 overflow-y-auto mobile-backdrop"
            style={{
              backdropFilter: "blur(8px) brightness(0.4)",
              WebkitBackdropFilter: "blur(8px) brightness(0.4)",
              backgroundColor: "rgba(10, 10, 10, 0.85)",
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <button
              onClick={handleClose}
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
                <h2 className="text-2xl sm:text-3xl font-bold mb-2">
                  Request to join
                </h2>
                <p className="text-neutral-300 mb-6 sm:mb-8 text-sm sm:text-base">
                  Please enter your email address to request to join.
                </p>

                <form
                  className="flex flex-col gap-5 sm:gap-6"
                  onSubmit={(e) => {
                    e.preventDefault();
                    setIsPageLoading(true);
                    setTimeout(() => {
                      setIsPageLoading(false);
                    }, 1000);
                  }}
                >
                  <div className="flex flex-col gap-2">
                    <label
                      htmlFor="email"
                      className="text-sm font-medium text-neutral-200"
                    >
                      Email Address
                    </label>
                    <input
                      id="email"
                      type="email"
                      placeholder="your.email@example.com"
                      autoComplete="email"
                      className="px-4 py-3 text-base rounded-lg bg-neutral-800 border border-neutral-700 focus:border-white focus:outline-none focus:ring-2 focus:ring-white/20 transition-colors placeholder:text-neutral-500"
                    />
                  </div>

                  <motion.button
                    disabled={isPageLoading}
                    onClick={() => {
                      setIsPageLoading(true);
                      setTimeout(() => {
                        setIsPageLoading(false);
                      }, 1000);
                    }}
                    whileTap={{ scale: isPageLoading ? 1 : 0.98 }}
                    className="mt-2 bg-white text-black font-semibold py-3 rounded-lg hover:bg-neutral-200 transition-colors relative overflow-hidden"
                  >
                    <AnimatePresence mode="popLayout" initial={false}>
                      {isPageLoading ? (
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
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default Details;
