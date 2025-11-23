import { EventState, Sigs } from "@monorepo/types";
import { EventForm } from "../../modules/event-form/event-form.tsx";

function Create() {
  const values = {
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
  };

  return <EventForm defaultValues={values} />;
}

export default Create;
