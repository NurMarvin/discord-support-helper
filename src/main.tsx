/*
 * Copyright (c) 2023 Marvin Witt
 * Licensed under the Open Software License version 3.0
 */

import React from "react";
import ReactDOM from "react-dom/client";

import {
  RouterProvider,
  createBrowserRouter,
  redirect,
} from "react-router-dom";

import App from "./App.tsx";

import Overview from "./routes/index.tsx";
import ReportTemplate from "./routes/templates/$slug.tsx";

import "./tailwind.css";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/",
        element: <Overview />,
      },
      {
        path: "/templates/:slug",
        element: <ReportTemplate />,
        errorElement: <ReportTemplate.ErrorBoundary />,
      },
      {
        path: "*",
        loader: () => redirect("/"),
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
