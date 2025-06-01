import React from "react";
import allLocales from "./locales";
import {
  AccountCircleOutlined,
  ComputerOutlined,
  SettingsOutlined,
  LanguageOutlined,
} from "@material-ui/icons";
import AssessmentOutlinedIcon from "@material-ui/icons/AssessmentOutlined";
import EcoOutlinedIcon from "@material-ui/icons/EcoOutlined";
import CalendarTodayOutlinedIcon from "@material-ui/icons/CalendarTodayOutlined";

const getMenuItems = (props) => {
  const { appConfig, intl, locale, updateLocale } = props;
  const { auth } = appConfig || {};
  const isAuthorised = auth.isAuthenticated();
  const localeItems = allLocales.map((l) => {
    return {
      value: undefined,
      visible: true,
      primaryText: intl.formatMessage({ id: l.locale }),
      onClick: () => {
        updateLocale(l.locale);
      },
      leftIcon: <LanguageOutlined />,
    };
  });

  return [
    {
      value: "/profile",
      visible: true,
      primaryText: intl.formatMessage({ id: "profile" }),
      leftIcon: <AccountCircleOutlined />,
    },
    {
      value: "/personalSummaryDaily",
      visible: isAuthorised,
      primaryText: intl.formatMessage({ id: "personalSummaryDaily" }),
      leftIcon: <CalendarTodayOutlinedIcon />,
    },
    {
      value: "/impact",
      visible: isAuthorised,
      primaryText: intl.formatMessage({ id: "impact" }),
      leftIcon: <EcoOutlinedIcon />,
    },
    {
      value: "/summaryWeekly",
      visible: isAuthorised,
      primaryText: intl.formatMessage({ id: "summaryWeekly" }),
      leftIcon: <AssessmentOutlinedIcon />,
    },
    {
      value: "/actionableSuggestions",
      visible: isAuthorised,
      primaryText: intl.formatMessage({ id: "actionableSuggestions" }),
      leftIcon: <ComputerOutlined />,
    },
    {
      divider: true,
    },
    {
      primaryText: intl.formatMessage({ id: "settings" }),
      secondaryText: intl.formatMessage({ id: locale }),
      primaryTogglesNestedList: true,
      leftIcon: <SettingsOutlined />,
      nestedItems: [
        {
          primaryText: intl.formatMessage({ id: "language" }),
          secondaryText: intl.formatMessage({ id: locale }),
          primaryTogglesNestedList: true,
          leftIcon: <LanguageOutlined />,
          nestedItems: localeItems,
        },
      ],
    },
  ];
};

export default getMenuItems;
