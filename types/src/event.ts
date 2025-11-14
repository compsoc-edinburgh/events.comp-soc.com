type Hero = {
  title: string;
  tags: string;
};

type Registration = {
  title: string;
  description: string;
  buttonText: string;
};

type Location = {
  name: string;
  description: string;
  mapUrl: string;
  mapTitle: string;
};

export type Event = {
  id: string;
  orginiser: string;
  hero: Hero;
  registration: Registration;
  aboutMarkdown: string;
  location: Location;

  createdAt: string;
  updatedAt: string;
};
