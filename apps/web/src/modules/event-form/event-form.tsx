import { type EventCreateInput, EventCreateSchema } from "@monorepo/types";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { formatTime } from "../../lib/utils.ts";
import { SIGsCarousel } from "../../components/sigs-carousel.tsx";
import HeroSection from "./hero-section.tsx";
import ScheduleSection from "./schedule-section.tsx";
import SectionHeader from "../section-header.tsx";
import AboutSection from "./about-section.tsx";
import LocationSection from "./location-section.tsx";
import RegistrationSettings from "./registration-section.tsx";
import { RegistrationFormBuilder } from "./form-builder.tsx";
import VisibilitySection from "../visibility-section.tsx";

export function EventForm({ defaultValues }: { defaultValues: EventCreateInput }) {
  const {
    control,
    handleSubmit,
    register,
    watch,
    setValue,
    formState: { isSubmitting }
  } = useForm<EventCreateInput>({
    resolver: zodResolver(EventCreateSchema),
    defaultValues
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

  const onSubmit = () => {};

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
