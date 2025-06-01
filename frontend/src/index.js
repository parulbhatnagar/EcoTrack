import React from "react";
import { render } from "react-dom";
import App from "./App";
import * as serviceWorker from "./serviceWorker";
import { IntlProvider } from "react-intl";
import messages from "./config/locales/en";

render(
  <IntlProvider locale="en" messages={messages["en"]}>
    <App />
  </IntlProvider>,
  document.getElementById("root")
);

serviceWorker.register();
