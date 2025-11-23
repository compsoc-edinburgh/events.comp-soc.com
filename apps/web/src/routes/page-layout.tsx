import { Outlet, ScrollRestoration } from "react-router-dom";
import Header from "../modules/layout/header.tsx";

function PageLayout() {
  return (
    <div className="relative min-h-screen text-white">
      <Header />

      <main className="flex flex-col items-center justify-center px-4 sm:px-6 pt-20 sm:pt-24 pb-10">
        <div className="max-w-2xl w-full">
          <Outlet />
          <ScrollRestoration />
        </div>
      </main>
    </div>
  );
}

export default PageLayout;
