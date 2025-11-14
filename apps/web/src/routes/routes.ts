import { createBrowserRouter } from "react-router-dom";
import Search from "./events/search";
import Details from "./events/details";
import Create from "./events/create";
import Manage from "./events/manage";
import PageLayout from "./page-layout";

const router = createBrowserRouter([
  {
    path: "/",
    Component: PageLayout,
    children: [
      {
        index: true,
        Component: Search,
      },
      {
        path: "events/create",
        Component: Create,
      },
      {
        path: "events/:eventId",
        Component: Details,
      },
      {
        path: "events/:eventId/manage",
        Component: Manage,
      },
    ],
  },
]);

export default router;
