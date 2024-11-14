/**
 * Entry application component used to compose providers and render Routes.
 * */

import React from "react";
import { BrowserRouter } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { Routes } from "../app/Routes";
import { LayoutSplashScreen, MaterialThemeProvider } from "../_metronic/layout";

export default function App() {
  return (
    <React.Suspense fallback={<LayoutSplashScreen />}>
      <ToastContainer />
      <BrowserRouter>
        <MaterialThemeProvider>
          <Routes />
        </MaterialThemeProvider>
      </BrowserRouter>
    </React.Suspense>
  );
}
