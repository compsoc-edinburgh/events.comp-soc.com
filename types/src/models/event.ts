import type { Form } from "./form";
import type { Sigs } from "../const/sigs";

type Hero = {
  title: string;
  tags?: string[];
};

type Registration = {
  title: string;
  description?: string;
  buttonText: string;
  enabled: boolean;
};

type Location = {
  name: string;
  description?: string;
  mapUrl?: string;
  mapTitle?: string;
};

type Time = {
  start: string;
  end?: string;
};

export type Event = {
  id: string;
  organizerSig: Sigs;
  hero: Hero;
  registration?: Registration;
  aboutMarkdown: string;
  location: Location;
  form?: Form;

  date: string;
  time: Time;

  createdAt: string;
  updatedAt: string;
};

export type SearchEvent = {
  id: string;
  organizerSig: string;
  heroTitle: string;
  date: string;
  time: Time;
  locationName: string;
};
