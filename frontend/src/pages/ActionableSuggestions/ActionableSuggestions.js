import React from "react";
import { injectIntl } from "react-intl";
import Page from "material-ui-shell/lib/containers/Page/Page";
import Scrollbar from "material-ui-shell/lib/components/Scrollbar";
import { Card, CardContent, Chip } from "@material-ui/core";

import data from "../../data/msf";

const { primary } = data.actionableSuggestions;

const renderSuggestions = () => {
  return primary.map((skill) => {
    return (
      <Chip
        key={skill}
        label={skill}
        color="primary"
        style={{ margin: "2px" }}
      />
    );
  });
};

const ActionableSuggestionsPage = ({ intl }) => {
  return (
    <Page pageTitle={intl.formatMessage({ id: "actionableSuggestions" })}>
      <Scrollbar
        style={{ height: "100%", width: "100%", display: "flex", flex: 1 }}
      >
        {/* {intl.formatMessage({ id: 'skills' })} */}
        <Card>
          <CardContent>{renderSuggestions()}</CardContent>
        </Card>
      </Scrollbar>
    </Page>
  );
};

export default injectIntl(ActionableSuggestionsPage);
