import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import App from "./App";
import { Provider } from "react-redux";
import store from "./slices/store/index.js";
import "./init18n.jsx";
import { I18nextProvider } from "react-i18next";
import { AuthProvider } from "./context/authContext.js";
import i18next from "i18next";
import { Provider as RollbarProvider, ErrorBoundary } from "@rollbar/react";

const rollbarConfig = {
  accessToken: process.env.ROLLBAR_ACCESS_TOKEN,
  captureUncaught: true,
  captureUnhandledRejections: true,
  environment: process.env.ROLLBAR_ENVIRONMENT,
};

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <BrowserRouter>
    <RollbarProvider config={rollbarConfig}>
      <ErrorBoundary>
        <Provider store={store}>
          <I18nextProvider i18n={i18next}>
            <AuthProvider>
              <App />
            </AuthProvider>
          </I18nextProvider>
        </Provider>
      </ErrorBoundary>
    </RollbarProvider>
  </BrowserRouter>
);
