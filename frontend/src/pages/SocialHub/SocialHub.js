import React from "react";
import { injectIntl } from "react-intl";
import Page from "material-ui-shell/lib/containers/Page/Page";
import Scrollbar from "material-ui-shell/lib/components/Scrollbar";
import {
  Avatar,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Grid,
  IconButton,
} from "@material-ui/core";
import { openUrl } from "../../utils";
import data from "../../data/msf";

const socialHubUrls = data.socialHubUrls || [];
const renderActions = (socialNetworks) => {
  return socialNetworks.map(({ name, url, icon }) => {
    return (
      <IconButton aria-label={name} key={name} onClick={() => openUrl(url)}>
        {icon}
      </IconButton>
    );
  });
};

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
                    <CardHeader
                      avatar={<Avatar src={item.displayPicture} />}
                      title={item.name}
                      subheader={item.description}
                    />
                    <CardActions disableSpacing>
                      {renderActions(item.socialNetworks)}
                    </CardActions>
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
