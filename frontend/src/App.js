import React, { Component } from "react";
import App from "base-shell/lib";
import MUIConfig from "material-ui-shell/lib";
import merge from "base-shell/lib/utils/config";
import _config from "./config";
import SpeedDial from "@material-ui/lab/SpeedDial";
import SpeedDialAction from "@material-ui/lab/SpeedDialAction";
import { AccountCircleOutlined, ComputerOutlined } from "@material-ui/icons";
import EcoOutlinedIcon from "@material-ui/icons/EcoOutlined";
import CalendarTodayOutlinedIcon from "@material-ui/icons/CalendarTodayOutlined";
import { withRouter } from "react-router-dom";
import { Avatar } from "@material-ui/core";

const config = merge(MUIConfig, _config);

class AppComponent extends Component {
  state = { open: false };

  handleOpen = () => {
    this.setState({ open: true });
  };

  handleClose = () => {
    this.setState({ open: false });
  };

  render() {
    return (
      <div>
        <App config={config} />
        <SpeedDial
          ariaLabel="SpeedDial"
          style={{
            position: "fixed",
            bottom: 32,
            right: 32,
            zIndex: 1300,
          }}
          icon={
            <Avatar
              src="./icons/icon-512x512.png"
              alt="EcoTrack"
              style={{ width: 56, height: 56 }}
            />
          }
          onClose={this.handleClose}
          onOpen={this.handleOpen}
          open={this.state.open}
          onClick={() =>
            this.state.open ? this.handleClose() : this.handleOpen()
          }
        >
          <SpeedDialAction
            icon={<AccountCircleOutlined />}
            tooltipTitle="Start Green Journey"
            onClick={() => {
              this.props.history.push("/profile");
            }}
          />
          <SpeedDialAction
            icon={<CalendarTodayOutlinedIcon />}
            tooltipTitle="Today's Eco Check-In"
            onClick={() => {
              this.props.history.push("/personalSummaryDaily");
            }}
          />
          <SpeedDialAction
            icon={<EcoOutlinedIcon />}
            tooltipTitle="Daily Eco Score"
            onClick={() => {
              this.props.history.push("/impact");
            }}
          />
          <SpeedDialAction
            icon={<EcoOutlinedIcon />}
            tooltipTitle="Weekly Eco Report"
            onClick={() => {
              this.props.history.push("/summaryWeekly");
            }}
          />
          <SpeedDialAction
            icon={<ComputerOutlined />}
            tooltipTitle="Green Actions & Offsets"
            onClick={() => {
              this.props.history.push("/actionableSuggestions");
            }}
          />
        </SpeedDial>
      </div>
    );
  }
}

export default withRouter(AppComponent);
