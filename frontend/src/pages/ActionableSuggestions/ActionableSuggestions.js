import React, { useEffect, useState } from "react";
import { injectIntl } from "react-intl";
import Page from "material-ui-shell/lib/containers/Page/Page";
import Scrollbar from "material-ui-shell/lib/components/Scrollbar";
import {
  Card,
  CardContent,
  CircularProgress,
  Box,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
} from "@material-ui/core";
import CheckCircleOutlineIcon from "@material-ui/icons/CheckCircleOutline";
import axios from "axios";
import { endpoint } from "../../config/api";
import data from "../../data/msf";

const ecoTips = data.ecoTips || [];
const ActionableSuggestionsPage = ({ intl }) => {
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tipIndex, setTipIndex] = useState(0);

  useEffect(() => {
    let tipInterval;
    if (loading) {
      tipInterval = setInterval(() => {
        setTipIndex((prev) => (prev + 1) % ecoTips.length);
      }, 5000); // Change tip every 2 seconds
    }
    return () => clearInterval(tipInterval);
  }, [loading]);

  useEffect(() => {
    axios
      .get(endpoint.suggestions)
      .then((res) => {
        // Split the response string by \n and filter out empty lines
        const points = res.data
          .split("\n")
          .map((s) => s.trim())
          .filter(Boolean);
        setSuggestions(points);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, []);

  return (
    <Page pageTitle={intl.formatMessage({ id: "actionableSuggestions" })}>
      <Scrollbar
        style={{ height: "100%", width: "100%", display: "flex", flex: 1 }}
      >
        <Card>
          <CardContent>
            {loading ? (
              <Box
                display="flex"
                flexDirection="column"
                justifyContent="center"
                alignItems="center"
                minHeight="60vh"
                width="100%"
              >
                <CircularProgress />
                <Typography
                  variant="subtitle1"
                  align="center"
                  style={{ margin: 20, maxWidth: 400 }}
                >
                  {ecoTips[tipIndex]}...
                </Typography>
              </Box>
            ) : (
              <List>
                {suggestions.map((point, idx) => (
                  <ListItem key={idx} alignItems="flex-start">
                    <ListItemIcon>
                      <CheckCircleOutlineIcon style={{ color: "#388e3c" }} />
                    </ListItemIcon>
                    <ListItemText primary={point} />
                  </ListItem>
                ))}
              </List>
            )}
          </CardContent>
        </Card>
      </Scrollbar>
    </Page>
  );
};

export default injectIntl(ActionableSuggestionsPage);
