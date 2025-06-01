import React from "react";
import { render } from "react-dom";
import * as serviceWorker from "./serviceWorker";
import { IntlProvider } from "react-intl";
import messages from "./config/locales/en";
import { BrowserRouter } from "react-router-dom/cjs/react-router-dom";
import AppComponent from "./App";

render(
  <IntlProvider locale="en" messages={messages["en"]}>
    <BrowserRouter>
      <AppComponent />
    </BrowserRouter>
  </IntlProvider>,
  document.getElementById("root")
);

serviceWorker.register();
