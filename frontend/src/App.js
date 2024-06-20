import React from "react";
import "./App.css";
import { Routes, Route } from "react-router-dom";
import { ROUTES } from "./utils/routes.js";
import Header from "./components/Header";
import Home from "./pages/Home.jsx";
import Login from "./pages/Login.jsx";
import Signup from "./pages/Signup.jsx";
import NotFound from "./pages/NotFound.jsx";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Provider, ErrorBoundary } from "@rollbar/react";

const rollbarConfig = {
  accessToken: "8010c0a4675e42c78a6030896151eb87",
  environment: "testenv",
};

function TestError() {
  const a = null;
  return a.hello();
}

const App = () => {
  return (
    <Provider config={rollbarConfig}>
      <ErrorBoundary>
        <TestError />
        <div className="d-flex flex-column vh-100 bg-light">
          <Header />
          <ToastContainer />
          <Routes>
            <Route path={ROUTES.home} element={<Home />} />
            <Route path={ROUTES.login} element={<Login />} />
            <Route path={ROUTES.signup} element={<Signup />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
      </ErrorBoundary>
    </Provider>
  );
};

export default App;
