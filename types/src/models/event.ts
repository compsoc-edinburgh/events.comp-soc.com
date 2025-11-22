import type { EventState, Sigs } from "../const";
import type { Nullable } from "../utils";
import type { Form } from "./form";

type Hero = {
  title: string;
  tags: string[];
};

type Registration = {
  title: string;
  description: Nullable<string>;
  buttonText: string;
  enabled: boolean;
};

type Location = {
  name: string;
  description: Nullable<string>;
  mapUrl: Nullable<string>;
  mapTitle: Nullable<string>;
};

type Time = {
  start: string;
  end: Nullable<string>;
};

export type Event = {
  id: string;
  organizerSig: Sigs;
  state: EventState;
  hero: Hero;
  registration: Nullable<Registration>;
  aboutMarkdown: string;
  location: Location;
  form: Nullable<Form>;
  date: string;
  time: Time;
  createdAt: string;
  updatedAt: string;
};

export type SearchEvent = {
  id: string;
  organizerSig: Sigs;
  state: EventState;
  heroTitle: string;
  date: string;
  time: Time;
  locationName: string;
};
