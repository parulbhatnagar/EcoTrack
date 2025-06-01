import React, { useEffect, useState } from "react";
import { injectIntl } from "react-intl";
import Page from "material-ui-shell/lib/containers/Page/Page";
import Scrollbar from "material-ui-shell/lib/components/Scrollbar";
import {
  Typography,
  Grid,
  CircularProgress,
  Box,
  makeStyles,
} from "@material-ui/core";
import axios from "axios";
import { dailySummaryData, endpoint } from "../../config/api";
import data from "../../data/msf";
import { parseSummaryString } from "../../utils";

const ecoTips = data.ecoTips || [];
const useStyles = makeStyles((theme) => ({
  ringContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    margin: theme.spacing(2, 0),
    position: "relative", // Fix: ensure absolute children are positioned correctly
  },
  ringLabel: {
    marginTop: theme.spacing(1),
    fontWeight: 600,
    fontSize: "1.1rem",
    letterSpacing: 1,
  },
  ringValue: {
    // position: "absolute",
    // top: "50%",
    // left: "50%",
    // transform: "translate(-50%, -60%)",
    fontWeight: 700,
    fontSize: "1.3rem",
    color: theme.palette.primary.main,
  },
  ringDetails: {
    marginTop: theme.spacing(1),
    fontSize: "0.95rem",
    textAlign: "center",
    color: "#555",
    minHeight: 60,
  },
  overallRing: {
    marginTop: theme.spacing(4),
    marginBottom: theme.spacing(2),
  },
}));

const getPercent = (score) => {
  // Converts "78/100" to 78
  if (!score) return 0;
  if (typeof score === "string" && score.includes("/")) {
    return parseInt(score.split("/")[0], 10);
  }
  if (typeof score === "string" && score.includes("%")) {
    return parseInt(score, 10);
  }
  return Number(score) || 0;
};

const colors = {
  Air: "#42a5f5",
  Water: "#26c6da",
  Land: "#8bc34a",
  Overall: "#7e57c2",
};

const ActivityRing = ({ label, value, details, color }) => {
  const classes = useStyles();
  const percent = getPercent(value);

  return (
    <Box className={classes.ringContainer} position="relative">
      <CircularProgress
        variant="determinate"
        value={percent}
        size={120}
        thickness={6}
        style={{ color }}
      />
      <Box className={classes.ringValue}>{value}</Box>
      <Typography className={classes.ringLabel}>{label}</Typography>
      {details && (
        <Typography className={classes.ringDetails}>{details}</Typography>
      )}
    </Box>
  );
};

const ImpactPage = ({ intl }) => {
  const classes = useStyles();
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [tipIndex, setTipIndex] = useState(0);

  const handleErrorResponse = (error) => {
    setSummary(parseSummaryString(dailySummaryData));
    setLoading(false);
  };

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
      .get(endpoint.getDailySummary)
      .then((res) => {
        try {
          setSummary(parseSummaryString(res.data));
          setLoading(false);
        } catch (error) {
          handleErrorResponse(error);
        }
      })
      .catch((error) => {
        handleErrorResponse(error);
      });
  }, []);

  return (
    <Page pageTitle={intl.formatMessage({ id: "impact" })}>
      <Scrollbar
        style={{ height: "100%", width: "100%", display: "flex", flex: 1 }}
      >
        <Box width="100%" maxWidth={900} mx="auto" mt={4}>
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
          ) : !summary ? (
            <Typography color="error" align="center" mt={4}>
              Failed to load summary.
            </Typography>
          ) : (
            <>
              <Grid
                container
                spacing={4}
                style={{ display: "flex", justifyContent: "center" }}
              >
                <Grid item xs={12} md={4}>
                  <ActivityRing
                    label="Air"
                    value={summary.Air["Layman Score"]}
                    details={summary.Air.Details}
                    color={colors.Air}
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <ActivityRing
                    label="Water"
                    value={summary.Water["Layman Score"]}
                    details={summary.Water.Details}
                    color={colors.Water}
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <ActivityRing
                    label="Land"
                    value={summary.Land["Layman Score"]}
                    details={summary.Land.Details}
                    color={colors.Land}
                  />
                </Grid>
              </Grid>
              <Box
                className={classes.overallRing}
                display="flex"
                style={{ display: "flex", justifyContent: "center" }}
              >
                <ActivityRing
                  label="Overall Score"
                  value={summary["Overall Score"]}
                  color={colors.Overall}
                />
              </Box>
            </>
          )}
        </Box>
      </Scrollbar>
    </Page>
  );
};

export default injectIntl(ImpactPage);
