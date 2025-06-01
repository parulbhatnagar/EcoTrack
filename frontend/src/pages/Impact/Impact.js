import React from "react";
import { injectIntl } from "react-intl";
import Page from "material-ui-shell/lib/containers/Page/Page";
import Scrollbar from "material-ui-shell/lib/components/Scrollbar";
import { Card, CardContent, Typography } from "@material-ui/core";

const ImpactPage = ({ intl }) => {
  return (
    <Page pageTitle={intl.formatMessage({ id: "impact" })}>
      <Scrollbar
        style={{ height: "100%", width: "100%", display: "flex", flex: 1 }}
      >
        {/* {intl.formatMessage({ id: 'about' })} */}
        <Card>
          <CardContent>
            <Typography variant="body2" color="textPrimary" component="p">
              Impact
            </Typography>
          </CardContent>
        </Card>
      </Scrollbar>
    </Page>
  );
};

export default injectIntl(ImpactPage);
