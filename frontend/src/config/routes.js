/* eslint-disable react/jsx-key */
import React from "react";
import { Route } from "react-router-dom";

import Profile from "../pages/Profile/Profile";
import ActionableSuggestions from "../pages/ActionableSuggestions/ActionableSuggestions";
import Impact from "../pages/Impact/Impact";
import PersonalSummaryDaily from "../pages/PersonalSummaryDaily/PersonalSummaryDaily";
import SummaryWeekly from "../pages/SummaryWeekly/SummaryWeekly";

const routes = [
  <Route path="/profile" exact component={Profile} />,
  <Route path="/personalSummaryDaily" exact component={PersonalSummaryDaily} />,
  <Route path="/summaryWeekly" exact component={SummaryWeekly} />,
  <Route path="/impact" exact component={Impact} />,
  <Route
    path="/actionableSuggestions"
    exact
    component={ActionableSuggestions}
  />,
];

export default routes;
