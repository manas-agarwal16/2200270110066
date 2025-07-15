import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import {
  RouterProvider,
  createBrowserRouter,
} from "react-router-dom";

import UrlShortenerPage from "./pages/urlShortenerPage.jsx";
import StatisticsPage from "./pages/StatisticsPage.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "",
        element: <UrlShortenerPage />,
      },
      {
        path: "shorturls/:shortCode",
        element: <StatisticsPage />,
      }
    ],
  },
]);

createRoot(document.getElementById("root")).render(
    <RouterProvider router={router}>
      <App />
    </RouterProvider>
);
