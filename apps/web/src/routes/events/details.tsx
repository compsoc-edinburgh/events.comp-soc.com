import { useEffect, useMemo, useState } from "react";
import { SIGsCarousel } from "../../components/sigs-carousel";
import Tag from "../../components/tag";
import Register from "../../modules/register";
import AboutMarkdown from "../../modules/about-markdown";
import Location from "../../modules/location";
import { useParams } from "react-router-dom";
import useGetEvent from "../../data/queries/use-get-event";
import { LoadingState } from "../../modules/states/loading";
import { ErrorState } from "../../modules/states/error";
import { EmptyState } from "../../modules/states/empty";
import RegistrationWindow from "../../modules/registration-window";

function Details() {
  const { eventId } = useParams<{ eventId: string }>();
  const { data: event, isLoading, isError, refetch } = useGetEvent(eventId);
  const [isRSVPModalOpen, setIsRSVPModalOpen] = useState(false);
  const [isRegistrationLoading, setIsRegistrationLoading] = useState(false);

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

  const heroTags = useMemo(() => event?.hero.tags ?? [], [event?.hero.tags]);
  const registration = event?.registration;

  const handleRegistrationSubmit = (_email: string) => {
    setIsRegistrationLoading(true);
    setTimeout(() => {
      setIsRegistrationLoading(false);
    }, 1000);
  };

  if (!eventId) {
    return <EmptyState title="Event not found" description="Missing event ID in the URL." />;
  }

  if (isLoading) {
    return <LoadingState />;
  }

  if (isError || !event) {
    return (
      <ErrorState
        title="Unable to load event"
        description="Something went wrong while fetching the event details."
        refetch={refetch}
      />
    );
  }

  return (
    <div className="relative min-h-screen text-white bg-neutral-900">
      <main className="flex flex-col items-center justify-center px-4 sm:px-6 pb-10">
        <div className="max-w-2xl w-full">
          <SIGsCarousel organizer={event.organizerSig} />

          <h1 className="font-bold text-2xl sm:text-3xl md:text-4xl leading-tight">
            {event.hero.title}
          </h1>

          {heroTags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-4">
              {heroTags.map((tag) => (
                <Tag key={tag}>{tag}</Tag>
              ))}
            </div>
          )}

          {registration?.enabled && (
            <Register
              title={registration.title || "Registration"}
              description={registration.description || "Register your interest for this event."}
              buttonText={registration.buttonText || "Register"}
              onButtonClick={handleRSVPClick}
            />
          )}

          <AboutMarkdown content={event.aboutMarkdown} />
          <Location {...event.location} />
        </div>
      </main>
      <RegistrationWindow
        open={isRSVPModalOpen}
        isLoading={isRegistrationLoading}
        onClose={handleClose}
        onSubmit={handleRegistrationSubmit}
      />
    </div>
  );
}

export default Details;
