import React from "react";
import ReactDOM from "react-dom";
import * as Sentry from "@sentry/react";
import { Integrations } from "@sentry/tracing";
import Favicon from "react-favicon";
import App from "./components/App";
import reportWebVitals from "./reportWebVitals";

import favicon from "../src/images/favicon-32x32.png";

import "antd/dist/antd.css";
import "./index.css";

// sentry
Sentry.init({
  dsn: process.env.REACT_APP_SENTRY_DSN ? process.env.REACT_APP_SENTRY_DSN : "",
  integrations: [new Integrations.BrowserTracing()],

  // We recommend adjusting this value in production, or using tracesSampler
  // for finer control
  tracesSampleRate: 1.0,
});

ReactDOM.render(
  <React.StrictMode>
    <Favicon url={favicon} />
    <App />
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
