import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { SIGsCarousel } from "../../components/sigs-carousel";
import { formatTime } from "../../lib/utils";
import { EventState, Sigs } from "@monorepo/types/const";
import SectionHeader from "../../modules/section-header.tsx";
import { EventCreateSchema, type EventCreateInput } from "@monorepo/types/schemas";
import VisibilitySection from "../../modules/visibility-section.tsx";

import { RegistrationFormBuilder } from "../../modules/event-form/form-builder.tsx";
import ScheduleSection from "../../modules/event-form/schedule-section.tsx";
import AboutSection from "../../modules/event-form/about-section.tsx";
import LocationSection from "../../modules/event-form/location-section.tsx";
import HeroSection from "../../modules/event-form/hero-section.tsx";
import RegistrationSettings from "../../modules/event-form/registration-section.tsx";

const createDefaultEventInput = (): EventCreateInput => ({
  organizerSig: Sigs.Compsoc,
  state: EventState.Draft,
  hero: {
    title: "",
    tags: []
  },
  registration: {
    enabled: false,
    title: "",
    description: "",
    buttonText: ""
  },
  aboutMarkdown: "",
  location: {
    name: "",
    description: "",
    mapUrl: "",
    mapTitle: ""
  },
  date: "",
  time: {
    start: "",
    end: ""
  }
});

export function EventForm() {
  const {
    control,
    handleSubmit,
    register,
    watch,
    setValue,
    formState: { isSubmitting }
  } = useForm<EventCreateInput>({
    resolver: zodResolver(EventCreateSchema),
    defaultValues: createDefaultEventInput()
  });

  const preview = watch();

  const date = preview.date
    ? new Date(preview.date).toLocaleDateString("en-GB", {
        weekday: "long",
        day: "numeric",
        month: "short"
      })
    : "Add a date";

  const time = [preview.time?.start, preview.time?.end]
    .filter(Boolean)
    .map((time) => (time ? formatTime(time) : null))
    .join(" → ");

  const registrationEnabled = preview.registration?.enabled ?? false;

  const onSubmit = (values: EventCreateInput) => {};

  return (
    <div className="relative min-h-screen text-white bg-neutral-900">
      <main className="flex flex-col items-center pb-10">
        <div className="max-w-2xl w-full space-y-10">
          <Controller
            control={control}
            name="organizerSig"
            render={({ field }) => (
              <SIGsCarousel
                organizer={field.value}
                selectable
                isScrollable
                onSelect={(sig) => field.onChange(sig)}
              />
            )}
          />

          <HeroSection control={control} register={register} />

          <ScheduleSection register={register} date={date} time={time} />

          <SectionHeader title="About" />
          <AboutSection register={register} />

          <SectionHeader title="Location" />
          <LocationSection register={register} />

          <SectionHeader title="Registration form" />
          <RegistrationSettings
            control={control}
            register={register}
            enabled={registrationEnabled}
          />

          <Controller
            control={control}
            name="form"
            render={({ field }) => (
              <RegistrationFormBuilder value={field.value} onChange={field.onChange} />
            )}
          />

          <SectionHeader title="Visibility" />
          <VisibilitySection
            currentState={preview.state}
            isSubmitting={isSubmitting}
            onStateChange={(state) =>
              setValue("state", state, { shouldDirty: true, shouldValidate: true })
            }
            onSubmit={handleSubmit(onSubmit)}
          />
        </div>
      </main>
    </div>
  );
}

function Create() {
  return <EventForm />;
}

export default Create;
