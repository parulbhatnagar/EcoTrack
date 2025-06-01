import React from "react";
import { injectIntl } from "react-intl";
import Page from "material-ui-shell/lib/containers/Page/Page";
import Scrollbar from "material-ui-shell/lib/components/Scrollbar";
import { Button, Card, CardContent, Grid, Typography } from "@material-ui/core";
import data from "../../data/msf";

const socialHubUrls = data.socialHubUrls || [];

const SocialHubPage = ({ intl }) => {
  return (
    <Page pageTitle={intl.formatMessage({ id: "socialHub" })}>
      <Scrollbar
        style={{ height: "100%", width: "100%", display: "flex", flex: 1 }}
      >
        {/* {intl.formatMessage({ id: 'about' })} */}
        <Card>
          <CardContent>
            <Grid
              container
              spacing={3}
              justifyContent="center"
              style={{ marginTop: 0 }}
            >
              {socialHubUrls.map((item, idx) => (
                <Grid item xs={12} md={6} key={idx}>
                  <Card elevation={3}>
                    <CardContent>
                      <Typography variant="h6" gutterBottom>
                        {item.name}
                      </Typography>
                      <Typography
                        variant="body2"
                        color="textSecondary"
                        gutterBottom
                      >
                        {item.description}
                      </Typography>
                      <Button
                        variant="contained"
                        color="primary"
                        href={item.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ marginTop: 12 }}
                      >
                        Visit
                      </Button>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </CardContent>
        </Card>
      </Scrollbar>
    </Page>
  );
};

export default injectIntl(SocialHubPage);
