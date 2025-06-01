import React from "react";
import {
  Avatar,
  Button,
  Card,
  CardContent,
  CardHeader,
  Typography,
} from "@material-ui/core";
import data from "../../data/msf";

const { title, subtitle, description } = data.landingPage;

export default function (props) {
  return (
    <div
      style={{
        minHeight: "95vh",
        minWidth: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Card>
        <CardHeader
          avatar={<Avatar src="" />}
          title={title}
          subheader={subtitle}
        />
        <CardContent>
          <Typography variant="body2" color="textPrimary" component="p">
            {description}
          </Typography>
        </CardContent>

        <div style={{ textAlign: "center", margin: "20px" }}>
          <Button
            variant="contained"
            color="primary"
            onClick={() => props.history.push("/profile")}
          >
            Continue
          </Button>
        </div>
      </Card>
    </div>
  );
}
