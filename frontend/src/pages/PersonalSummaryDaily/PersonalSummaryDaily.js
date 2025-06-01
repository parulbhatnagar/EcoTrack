import React from "react";
import { injectIntl } from "react-intl";
import Page from "material-ui-shell/lib/containers/Page/Page";
import Scrollbar from "material-ui-shell/lib/components/Scrollbar";
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  makeStyles,
  Paper,
  Step,
  StepContent,
  StepLabel,
  Stepper,
  TextField,
  Typography,
} from "@material-ui/core";
import MenuItem from "@material-ui/core/MenuItem";
import axios from "axios"; // <-- Add axios for HTTP requests
import { endpoint } from "../../config/api";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
  },
  button: {
    marginTop: theme.spacing(1),
    marginRight: theme.spacing(1),
  },
  actionsContainer: {
    marginBottom: theme.spacing(2),
  },
  resetContainer: {
    padding: theme.spacing(3),
  },
}));

function getSteps() {
  return [
    "Transportation Today",
    "Energy & Home Usage Today",
    "Food & Consumption Today",
    "Waste Generated Today",
    "Water Usage Today",
  ];
}

// --- Add initial state for all form fields ---
const initialForm = {
  // Transportation
  primary_mode: "",
  distance_km: "",
  passengers: "",
  traffic: "",
  public_transit_type: "",
  public_transit_duration: "",
  public_transit_distance: "",
  cycled_distance: "",
  cycled_purpose: "",
  walked_distance: "",
  walked_duration: "",
  flew_distance: "",
  flew_trip_type: "",
  stayed_home_reason: "",
  secondary_trips: "",
  ride_sharing: "",
  delivery_services: "",
  // Energy & Home
  heating_cooling: "",
  shower_min: "",
  baths: "",
  laundry_loads: "",
  screen_time_hrs: "",
  gaming_hrs: "",
  work_equipment_hrs: "",
  natural_light: "",
  led_usage: "",
  traditional_bulbs: "",
  home_office_usage: "",
  hosting_guests: "",
  appliance_heavy: "",
  // Food & Consumption
  breakfast: "",
  lunch: "",
  dinner: "",
  snacks: "",
  beef: "",
  pork: "",
  chicken: "",
  vegetarian_meals: "",
  local_organic_pct: "",
  food_waste: "",
  online_orders: "",
  package_sizes: "",
  in_store_shopping: "",
  impulse_purchases: [],
  sustainable_choices: [],
  // Waste
  general_waste: "",
  recycling: "",
  composting: "",
  special_waste: [],
  // Plastic
  water_bottles: "",
  food_containers: "",
  plastic_bags: "",
  avoided_plastics: "",
  packaging_waste: "",
  // Water
  shower_time_min: "",
  baths_taken: "",
  handwash_min: "",
  dishwasher_loads: "",
  laundry_loads_water: "",
  water_temp: "",
  gardening_min: "",
  car_wash: "",
  pool_spa: "",
  water_saving_actions: [],
  rainwater_collection: "",
  greywater_reuse: "",
};

function getStepContent(step, form, handleChange) {
  switch (step) {
    case 0:
      return (
        <div>
          <Card>
            <CardHeader subheader="Primary Mode Selection (Visual Icons)" />
            <CardContent>
              <form noValidate autoComplete="off">
                <div style={{ display: "flex", flexWrap: "wrap", gap: 16 }}>
                  {/* Car */}
                  <div style={{ minWidth: 180 }}>
                    <Typography variant="subtitle1">Drove Car</Typography>
                    <TextField
                      label="Distance (km)"
                      variant="outlined"
                      fullWidth
                      margin="dense"
                      name="distance_km"
                      value={form.distance_km}
                      onChange={handleChange}
                    />
                    <TextField
                      label="Passengers"
                      variant="outlined"
                      fullWidth
                      margin="dense"
                      type="number"
                      name="passengers"
                      value={form.passengers}
                      onChange={handleChange}
                    />
                    <TextField
                      select
                      label="Traffic"
                      variant="outlined"
                      fullWidth
                      margin="dense"
                      defaultValue=""
                      name="traffic"
                      value={form.traffic}
                      onChange={handleChange}
                    >
                      <MenuItem value="Light">Light</MenuItem>
                      <MenuItem value="Heavy">Heavy</MenuItem>
                    </TextField>
                  </div>
                  {/* Public Transit */}
                  <div style={{ minWidth: 180 }}>
                    <Typography variant="subtitle1">Public Transit</Typography>
                    <TextField
                      select
                      label="Type"
                      variant="outlined"
                      fullWidth
                      margin="dense"
                      defaultValue=""
                      name="public_transit_type"
                      value={form.public_transit_type}
                      onChange={handleChange}
                    >
                      <MenuItem value="Bus">Bus</MenuItem>
                      <MenuItem value="Train">Train</MenuItem>
                      <MenuItem value="Metro">Metro</MenuItem>
                    </TextField>
                    <TextField
                      label="Duration (min)"
                      variant="outlined"
                      fullWidth
                      margin="dense"
                      type="number"
                      name="public_transit_duration"
                      value={form.public_transit_duration}
                      onChange={handleChange}
                    />
                    <TextField
                      label="Distance (km)"
                      variant="outlined"
                      fullWidth
                      margin="dense"
                      name="public_transit_distance"
                      value={form.public_transit_distance}
                      onChange={handleChange}
                    />
                  </div>
                  {/* Cycled */}
                  <div style={{ minWidth: 180 }}>
                    <Typography variant="subtitle1">Cycled</Typography>
                    <TextField
                      label="Distance (km)"
                      variant="outlined"
                      fullWidth
                      margin="dense"
                      name="cycled_distance"
                      value={form.cycled_distance}
                      onChange={handleChange}
                    />
                    <TextField
                      select
                      label="Purpose"
                      variant="outlined"
                      fullWidth
                      margin="dense"
                      defaultValue=""
                      name="cycled_purpose"
                      value={form.cycled_purpose}
                      onChange={handleChange}
                    >
                      <MenuItem value="Commute">Commute</MenuItem>
                      <MenuItem value="Recreation">Recreation</MenuItem>
                      <MenuItem value="Errands">Errands</MenuItem>
                    </TextField>
                  </div>
                  {/* Walked */}
                  <div style={{ minWidth: 180 }}>
                    <Typography variant="subtitle1">Walked</Typography>
                    <TextField
                      label="Distance (km)"
                      variant="outlined"
                      fullWidth
                      margin="dense"
                      name="walked_distance"
                      value={form.walked_distance}
                      onChange={handleChange}
                    />
                    <TextField
                      label="Duration (min)"
                      variant="outlined"
                      fullWidth
                      margin="dense"
                      type="number"
                      name="walked_duration"
                      value={form.walked_duration}
                      onChange={handleChange}
                    />
                  </div>
                  {/* Flew */}
                  <div style={{ minWidth: 180 }}>
                    <Typography variant="subtitle1">Flew</Typography>
                    <TextField
                      label="Distance (km)"
                      variant="outlined"
                      fullWidth
                      margin="dense"
                      name="flew_distance"
                      value={form.flew_distance}
                      onChange={handleChange}
                    />
                    <TextField
                      select
                      label="Trip Type"
                      variant="outlined"
                      fullWidth
                      margin="dense"
                      defaultValue=""
                      name="flew_trip_type"
                      value={form.flew_trip_type}
                      onChange={handleChange}
                    >
                      <MenuItem value="Business">Business</MenuItem>
                      <MenuItem value="Personal">Personal</MenuItem>
                    </TextField>
                  </div>
                  {/* Stayed Home */}
                  <div style={{ minWidth: 180 }}>
                    <Typography variant="subtitle1">Stayed Home</Typography>
                    <TextField
                      select
                      label="Reason"
                      variant="outlined"
                      fullWidth
                      margin="dense"
                      defaultValue=""
                      name="stayed_home_reason"
                      value={form.stayed_home_reason}
                      onChange={handleChange}
                    >
                      <MenuItem value="Work from home">Work from home</MenuItem>
                      <MenuItem value="Rest day">Rest day</MenuItem>
                    </TextField>
                  </div>
                </div>
              </form>
            </CardContent>
          </Card>
          <Card>
            <CardHeader subheader="Additional Transport (if applicable)" />
            <CardContent>
              <form noValidate autoComplete="off">
                <TextField
                  label="Secondary trips (describe)"
                  variant="outlined"
                  fullWidth
                  margin="dense"
                  name="secondary_trips"
                  value={form.secondary_trips}
                  onChange={handleChange}
                />
                <TextField
                  label="Ride-sharing (Uber/Lyft usage)"
                  variant="outlined"
                  fullWidth
                  margin="dense"
                  name="ride_sharing"
                  value={form.ride_sharing}
                  onChange={handleChange}
                />
                <TextField
                  label="Delivery services (Food/Shopping/Other)"
                  variant="outlined"
                  fullWidth
                  margin="dense"
                  name="delivery_services"
                  value={form.delivery_services}
                  onChange={handleChange}
                />
              </form>
            </CardContent>
          </Card>
        </div>
      );
    case 1:
      return (
        <div>
          <Card>
            <CardHeader subheader="Consumption Variations" />
            <CardContent>
              <form noValidate autoComplete="off">
                {/* Heating/Cooling */}
                <TextField
                  select
                  label="Heating/Cooling"
                  variant="outlined"
                  fullWidth
                  margin="dense"
                  defaultValue=""
                  name="heating_cooling"
                  value={form.heating_cooling}
                  onChange={handleChange}
                >
                  <MenuItem value="Much Less">Much Less than usual</MenuItem>
                  <MenuItem value="Less">Less than usual</MenuItem>
                  <MenuItem value="Normal">Normal</MenuItem>
                  <MenuItem value="More">More than usual</MenuItem>
                  <MenuItem value="Much More">Much More than usual</MenuItem>
                </TextField>
                {/* Hot Water Usage */}
                <Typography variant="subtitle2" style={{ marginTop: 16 }}>
                  Hot Water Usage
                </Typography>
                <TextField
                  label="Shower duration (min)"
                  variant="outlined"
                  fullWidth
                  margin="dense"
                  type="number"
                  name="shower_min"
                  value={form.shower_min}
                  onChange={handleChange}
                />
                <TextField
                  label="Baths taken"
                  variant="outlined"
                  fullWidth
                  margin="dense"
                  type="number"
                  name="baths"
                  value={form.baths}
                  onChange={handleChange}
                />
                <TextField
                  label="Laundry loads"
                  variant="outlined"
                  fullWidth
                  margin="dense"
                  type="number"
                  name="laundry_loads"
                  value={form.laundry_loads}
                  onChange={handleChange}
                />
                {/* Electronics */}
                <Typography variant="subtitle2" style={{ marginTop: 16 }}>
                  Electronics
                </Typography>
                <TextField
                  label="Screen time (hours)"
                  variant="outlined"
                  fullWidth
                  margin="dense"
                  type="number"
                  name="screen_time_hrs"
                  value={form.screen_time_hrs}
                  onChange={handleChange}
                />
                <TextField
                  label="Gaming (hours)"
                  variant="outlined"
                  fullWidth
                  margin="dense"
                  type="number"
                  name="gaming_hrs"
                  value={form.gaming_hrs}
                  onChange={handleChange}
                />
                <TextField
                  label="Work equipment (hours)"
                  variant="outlined"
                  fullWidth
                  margin="dense"
                  type="number"
                  name="work_equipment_hrs"
                  value={form.work_equipment_hrs}
                  onChange={handleChange}
                />
                {/* Lighting */}
                <Typography variant="subtitle2" style={{ marginTop: 16 }}>
                  Lighting
                </Typography>
                <TextField
                  select
                  label="Natural light reliance"
                  variant="outlined"
                  fullWidth
                  margin="dense"
                  defaultValue=""
                  name="natural_light"
                  value={form.natural_light}
                  onChange={handleChange}
                >
                  <MenuItem value="High">High</MenuItem>
                  <MenuItem value="Moderate">Moderate</MenuItem>
                  <MenuItem value="Low">Low</MenuItem>
                </TextField>
                <TextField
                  select
                  label="LED usage"
                  variant="outlined"
                  fullWidth
                  margin="dense"
                  defaultValue=""
                  name="led_usage"
                  value={form.led_usage}
                  onChange={handleChange}
                >
                  <MenuItem value="All">All</MenuItem>
                  <MenuItem value="Most">Most</MenuItem>
                  <MenuItem value="Some">Some</MenuItem>
                  <MenuItem value="None">None</MenuItem>
                </TextField>
                <TextField
                  select
                  label="Traditional bulbs"
                  variant="outlined"
                  fullWidth
                  margin="dense"
                  defaultValue=""
                  name="traditional_bulbs"
                  value={form.traditional_bulbs}
                  onChange={handleChange}
                >
                  <MenuItem value="None">None</MenuItem>
                  <MenuItem value="Some">Some</MenuItem>
                  <MenuItem value="Most">Most</MenuItem>
                  <MenuItem value="All">All</MenuItem>
                </TextField>
              </form>
            </CardContent>
          </Card>
          <Card>
            <CardHeader subheader="Special Activities" />
            <CardContent>
              <form noValidate autoComplete="off">
                <TextField
                  label="Home office equipment usage"
                  variant="outlined"
                  fullWidth
                  margin="dense"
                  name="home_office_usage"
                  value={form.home_office_usage}
                  onChange={handleChange}
                />
                <TextField
                  label="Hosting guests (energy impact)"
                  variant="outlined"
                  fullWidth
                  margin="dense"
                  name="hosting_guests"
                  value={form.hosting_guests}
                  onChange={handleChange}
                />
                <TextField
                  label="Appliance-heavy activities (cooking, cleaning)"
                  variant="outlined"
                  fullWidth
                  margin="dense"
                  name="appliance_heavy"
                  value={form.appliance_heavy}
                  onChange={handleChange}
                />
              </form>
            </CardContent>
          </Card>
        </div>
      );
    case 2:
      return (
        <div>
          <Card>
            <CardHeader subheader="Meal Tracking (Simplified)" />
            <CardContent>
              <form noValidate autoComplete="off">
                <TextField
                  select
                  label="Breakfast"
                  variant="outlined"
                  fullWidth
                  margin="dense"
                  defaultValue=""
                  name="breakfast"
                  value={form.breakfast}
                  onChange={handleChange}
                >
                  <MenuItem value="Home Cooked">Home Cooked</MenuItem>
                  <MenuItem value="Restaurant">Restaurant</MenuItem>
                  <MenuItem value="Fast Food">Fast Food</MenuItem>
                  <MenuItem value="Skipped">Skipped</MenuItem>
                </TextField>
                <TextField
                  select
                  label="Lunch"
                  variant="outlined"
                  fullWidth
                  margin="dense"
                  defaultValue=""
                  name="lunch"
                  value={form.lunch}
                  onChange={handleChange}
                >
                  <MenuItem value="Home Cooked">Home Cooked</MenuItem>
                  <MenuItem value="Restaurant">Restaurant</MenuItem>
                  <MenuItem value="Fast Food">Fast Food</MenuItem>
                  <MenuItem value="Takeout">Takeout</MenuItem>
                  <MenuItem value="Packed from Home">Packed from Home</MenuItem>
                </TextField>
                <TextField
                  select
                  label="Dinner"
                  variant="outlined"
                  fullWidth
                  margin="dense"
                  defaultValue=""
                  name="dinner"
                  value={form.dinner}
                  onChange={handleChange}
                >
                  <MenuItem value="Home Cooked">Home Cooked</MenuItem>
                  <MenuItem value="Restaurant">Restaurant</MenuItem>
                  <MenuItem value="Fast Food">Fast Food</MenuItem>
                  <MenuItem value="Takeout">Takeout</MenuItem>
                </TextField>
                <TextField
                  select
                  label="Snacks/Beverages"
                  variant="outlined"
                  fullWidth
                  margin="dense"
                  defaultValue=""
                  name="snacks"
                  value={form.snacks}
                  onChange={handleChange}
                >
                  <MenuItem value="Local/Homemade">Local/Homemade</MenuItem>
                  <MenuItem value="Packaged">Packaged</MenuItem>
                  <MenuItem value="Restaurant/Café">Restaurant/Café</MenuItem>
                </TextField>
              </form>
            </CardContent>
          </Card>
          <Card>
            <CardHeader subheader="Food Details (Optional Deep Dive)" />
            <CardContent>
              <form noValidate autoComplete="off">
                <Typography variant="subtitle2" style={{ marginTop: 8 }}>
                  Meat Consumption
                </Typography>
                <TextField
                  label="Beef (servings)"
                  variant="outlined"
                  fullWidth
                  margin="dense"
                  type="number"
                  name="beef"
                  value={form.beef}
                  onChange={handleChange}
                />
                <TextField
                  label="Pork (servings)"
                  variant="outlined"
                  fullWidth
                  margin="dense"
                  type="number"
                  name="pork"
                  value={form.pork}
                  onChange={handleChange}
                />
                <TextField
                  label="Chicken (servings)"
                  variant="outlined"
                  fullWidth
                  margin="dense"
                  type="number"
                  name="chicken"
                  value={form.chicken}
                  onChange={handleChange}
                />
                <TextField
                  label="Vegetarian meals count"
                  variant="outlined"
                  fullWidth
                  margin="dense"
                  type="number"
                  name="vegetarian_meals"
                  value={form.vegetarian_meals}
                  onChange={handleChange}
                />
                <TextField
                  label="Local/Organic (% of today's food)"
                  variant="outlined"
                  fullWidth
                  margin="dense"
                  type="number"
                  name="local_organic_pct"
                  value={form.local_organic_pct}
                  onChange={handleChange}
                  InputProps={{
                    endAdornment: <span>%</span>,
                  }}
                />
                <TextField
                  select
                  label="Food waste"
                  variant="outlined"
                  fullWidth
                  margin="dense"
                  defaultValue=""
                  name="food_waste"
                  value={form.food_waste}
                  onChange={handleChange}
                >
                  <MenuItem value="None">None</MenuItem>
                  <MenuItem value="Small amount">Small amount</MenuItem>
                  <MenuItem value="Moderate">Moderate</MenuItem>
                  <MenuItem value="Significant">Significant</MenuItem>
                </TextField>
              </form>
            </CardContent>
          </Card>
          <Card>
            <CardHeader subheader="Purchases Today" />
            <CardContent>
              <form noValidate autoComplete="off">
                <TextField
                  label="Online orders (number)"
                  variant="outlined"
                  fullWidth
                  margin="dense"
                  type="number"
                  name="online_orders"
                  value={form.online_orders}
                  onChange={handleChange}
                />
                <TextField
                  label="Package sizes"
                  variant="outlined"
                  fullWidth
                  margin="dense"
                  name="package_sizes"
                  value={form.package_sizes}
                  onChange={handleChange}
                />
                <TextField
                  select
                  label="In-store shopping"
                  variant="outlined"
                  fullWidth
                  margin="dense"
                  defaultValue=""
                  name="in_store_shopping"
                  value={form.in_store_shopping}
                  onChange={handleChange}
                >
                  <MenuItem value="Local">Local</MenuItem>
                  <MenuItem value="Chain store">Chain store</MenuItem>
                  <MenuItem value="Bulk store">Bulk store</MenuItem>
                </TextField>
                <TextField
                  select
                  label="Impulse purchases"
                  variant="outlined"
                  fullWidth
                  margin="dense"
                  defaultValue=""
                  name="impulse_purchases"
                  value={form.impulse_purchases}
                  onChange={handleChange}
                  SelectProps={{
                    multiple: true,
                  }}
                >
                  <MenuItem value="Electronics">Electronics</MenuItem>
                  <MenuItem value="Clothing">Clothing</MenuItem>
                  <MenuItem value="Home items">Home items</MenuItem>
                </TextField>
                <TextField
                  select
                  label="Sustainable choices"
                  variant="outlined"
                  fullWidth
                  margin="dense"
                  defaultValue=""
                  name="sustainable_choices"
                  value={form.sustainable_choices}
                  onChange={handleChange}
                  SelectProps={{
                    multiple: true,
                  }}
                >
                  <MenuItem value="Reusable bags">Reusable bags</MenuItem>
                  <MenuItem value="Local products">Local products</MenuItem>
                  <MenuItem value="Eco-friendly options">
                    Eco-friendly options
                  </MenuItem>
                </TextField>
              </form>
            </CardContent>
          </Card>
        </div>
      );
    case 3:
      return (
        <div>
          <Card>
            <CardHeader subheader="Waste Stream Tracking" />
            <CardContent>
              <form noValidate autoComplete="off">
                <TextField
                  select
                  label="General waste"
                  variant="outlined"
                  fullWidth
                  margin="dense"
                  defaultValue=""
                  name="general_waste"
                  value={form.general_waste}
                  onChange={handleChange}
                >
                  <MenuItem value="Small bag">Small bag</MenuItem>
                  <MenuItem value="Medium bag">Medium bag</MenuItem>
                  <MenuItem value="Large bag">Large bag</MenuItem>
                  <MenuItem value="Multiple bags">Multiple bags</MenuItem>
                </TextField>
                <TextField
                  select
                  label="Recycling"
                  variant="outlined"
                  fullWidth
                  margin="dense"
                  defaultValue=""
                  name="recycling"
                  value={form.recycling}
                  onChange={handleChange}
                >
                  <MenuItem value="None">None</MenuItem>
                  <MenuItem value="Small amount">Small amount</MenuItem>
                  <MenuItem value="Moderate">Moderate</MenuItem>
                  <MenuItem value="Large amount">Large amount</MenuItem>
                </TextField>
                <TextField
                  select
                  label="Composting"
                  variant="outlined"
                  fullWidth
                  margin="dense"
                  defaultValue=""
                  name="composting"
                  value={form.composting}
                  onChange={handleChange}
                >
                  <MenuItem value="None">None</MenuItem>
                  <MenuItem value="Small amount">Small amount</MenuItem>
                  <MenuItem value="Moderate">Moderate</MenuItem>
                  <MenuItem value="Large amount">Large amount</MenuItem>
                </TextField>
                <TextField
                  select
                  label="Special waste"
                  variant="outlined"
                  fullWidth
                  margin="dense"
                  defaultValue=""
                  name="special_waste"
                  value={form.special_waste}
                  onChange={handleChange}
                  SelectProps={{
                    multiple: false,
                  }}
                >
                  <MenuItem value="Electronics">Electronics</MenuItem>
                  <MenuItem value="Batteries">Batteries</MenuItem>
                  <MenuItem value="Hazardous materials">
                    Hazardous materials
                  </MenuItem>
                </TextField>
              </form>
            </CardContent>
          </Card>
          <Card>
            <CardHeader subheader="Plastic Usage Today" />
            <CardContent>
              <form noValidate autoComplete="off">
                <TextField
                  label="Single-use plastics: Water bottles"
                  variant="outlined"
                  fullWidth
                  margin="dense"
                  type="number"
                  name="water_bottles"
                  value={form.water_bottles}
                  onChange={handleChange}
                />
                <TextField
                  label="Single-use plastics: Food containers"
                  variant="outlined"
                  fullWidth
                  margin="dense"
                  type="number"
                  name="food_containers"
                  value={form.food_containers}
                  onChange={handleChange}
                />
                <TextField
                  label="Single-use plastics: Bags"
                  variant="outlined"
                  fullWidth
                  margin="dense"
                  type="number"
                  name="plastic_bags"
                  value={form.plastic_bags}
                  onChange={handleChange}
                />
                <TextField
                  label="Avoided plastics: Reusable alternatives used"
                  variant="outlined"
                  fullWidth
                  margin="dense"
                  type="number"
                  name="avoided_plastics"
                  value={form.avoided_plastics}
                  onChange={handleChange}
                />
                <TextField
                  select
                  label="Packaging waste"
                  variant="outlined"
                  fullWidth
                  margin="dense"
                  defaultValue=""
                  name="packaging_waste"
                  value={form.packaging_waste}
                  onChange={handleChange}
                >
                  <MenuItem value="Minimal">Minimal</MenuItem>
                  <MenuItem value="Moderate">Moderate</MenuItem>
                  <MenuItem value="Excessive">Excessive</MenuItem>
                </TextField>
              </form>
            </CardContent>
          </Card>
        </div>
      );
    case 4:
      return (
        <div>
          <Card>
            <CardHeader subheader="Direct Usage" />
            <CardContent>
              <form noValidate autoComplete="off">
                <TextField
                  label="Shower time (minutes)"
                  variant="outlined"
                  fullWidth
                  margin="dense"
                  type="number"
                  name="shower_time_min"
                  value={form.shower_time_min}
                  onChange={handleChange}
                />
                <TextField
                  label="Baths taken"
                  variant="outlined"
                  fullWidth
                  margin="dense"
                  type="number"
                  name="baths_taken"
                  value={form.baths_taken}
                  onChange={handleChange}
                />
                <Typography variant="subtitle2" style={{ marginTop: 16 }}>
                  Dishwashing
                </Typography>
                <TextField
                  label="Hand wash (minutes)"
                  variant="outlined"
                  fullWidth
                  margin="dense"
                  type="number"
                  name="handwash_min"
                  value={form.handwash_min}
                  onChange={handleChange}
                />
                <TextField
                  label="Dishwasher (loads)"
                  variant="outlined"
                  fullWidth
                  margin="dense"
                  type="number"
                  name="dishwasher_loads"
                  value={form.dishwasher_loads}
                  onChange={handleChange}
                />
                <Typography variant="subtitle2" style={{ marginTop: 16 }}>
                  Laundry
                </Typography>
                <TextField
                  label="Laundry loads"
                  variant="outlined"
                  fullWidth
                  margin="dense"
                  type="number"
                  name="laundry_loads_water"
                  value={form.laundry_loads_water}
                  onChange={handleChange}
                />
                <TextField
                  select
                  label="Water temperature"
                  variant="outlined"
                  fullWidth
                  margin="dense"
                  defaultValue=""
                  name="water_temp"
                  value={form.water_temp}
                  onChange={handleChange}
                >
                  <MenuItem value="Cold">Cold</MenuItem>
                  <MenuItem value="Warm">Warm</MenuItem>
                  <MenuItem value="Hot">Hot</MenuItem>
                </TextField>
                <Typography variant="subtitle2" style={{ marginTop: 16 }}>
                  Outdoor use
                </Typography>
                <TextField
                  label="Gardening (minutes)"
                  variant="outlined"
                  fullWidth
                  margin="dense"
                  type="number"
                  name="gardening_min"
                  value={form.gardening_min}
                  onChange={handleChange}
                />
                <TextField
                  select
                  label="Car wash"
                  variant="outlined"
                  fullWidth
                  margin="dense"
                  defaultValue=""
                  name="car_wash"
                  value={form.car_wash}
                  onChange={handleChange}
                >
                  <MenuItem value="Yes">Yes</MenuItem>
                  <MenuItem value="No">No</MenuItem>
                </TextField>
                <TextField
                  select
                  label="Pool/spa"
                  variant="outlined"
                  fullWidth
                  margin="dense"
                  defaultValue=""
                  name="pool_spa"
                  value={form.pool_spa}
                  onChange={handleChange}
                >
                  <MenuItem value="Yes">Yes</MenuItem>
                  <MenuItem value="No">No</MenuItem>
                </TextField>
              </form>
            </CardContent>
          </Card>
          <Card>
            <CardHeader subheader="Conservation Efforts" />
            <CardContent>
              <form noValidate autoComplete="off">
                <TextField
                  select
                  label="Water-saving actions"
                  variant="outlined"
                  fullWidth
                  margin="dense"
                  defaultValue=""
                  name="water_saving_actions"
                  value={form.water_saving_actions}
                  onChange={handleChange}
                  SelectProps={{
                    multiple: false,
                  }}
                >
                  <MenuItem value="Shorter showers">Shorter showers</MenuItem>
                  <MenuItem value="Full loads only">Full loads only</MenuItem>
                  <MenuItem value="Leak fixes">Leak fixes</MenuItem>
                </TextField>
                <TextField
                  select
                  label="Rainwater collection"
                  variant="outlined"
                  fullWidth
                  margin="dense"
                  defaultValue=""
                  name="rainwater_collection"
                  value={form.rainwater_collection}
                  onChange={handleChange}
                >
                  <MenuItem value="Yes">Yes</MenuItem>
                  <MenuItem value="No">No</MenuItem>
                </TextField>
                <TextField
                  select
                  label="Grey water reuse"
                  variant="outlined"
                  fullWidth
                  margin="dense"
                  defaultValue=""
                  name="greywater_reuse"
                  value={form.greywater_reuse}
                  onChange={handleChange}
                >
                  <MenuItem value="Yes">Yes</MenuItem>
                  <MenuItem value="No">No</MenuItem>
                </TextField>
              </form>
            </CardContent>
          </Card>
        </div>
      );
    default:
      return "Unknown step";
  }
}

const PersonalSummaryPage = ({ intl }) => {
  const classes = useStyles();
  const [activeStep, setActiveStep] = React.useState(0);
  const steps = getSteps();
  const [form, setForm] = React.useState(initialForm);
  const [submitting, setSubmitting] = React.useState(false);

  const handleChange = (e) => {
    const { name, value, type, multiple, checked } = e.target;
    if (multiple) {
      // Multi-select
      const options = e.target.options;
      const values = [];
      for (let i = 0, l = options.length; i < l; i++) {
        if (options[i].selected) {
          values.push(options[i].value);
        }
      }
      setForm((prev) => ({ ...prev, [name]: values }));
    } else if (type === "checkbox") {
      setForm((prev) => ({ ...prev, [name]: checked }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleReset = () => {
    setActiveStep(0);
    setForm(initialForm);
  };

  // --- Helper to build payload for API ---
  const buildPayload = () => {
    // You may want to add user_id and date dynamically
    return {
      user_id: "user_001",
      date: new Date().toISOString().slice(0, 10),
      transportation: {
        primary_mode: form.primary_mode,
        distance_km: Number(form.distance_km) || 0,
        passengers: Number(form.passengers) || 0,
        traffic: form.traffic,
        secondary_trips: form.secondary_trips
          ? form.secondary_trips.split(",").map((s) => s.trim())
          : [],
        ride_sharing:
          form.ride_sharing === "true" || form.ride_sharing === true,
        delivery_services: form.delivery_services
          ? form.delivery_services.split(",").map((s) => s.trim())
          : [],
      },
      energy_home: {
        heating_cooling: form.heating_cooling,
        hot_water: {
          shower_min: Number(form.shower_min) || 0,
          baths: Number(form.baths) || 0,
          laundry_loads: Number(form.laundry_loads) || 0,
        },
        electronics: {
          screen_time_hrs: Number(form.screen_time_hrs) || 0,
          gaming_hrs: Number(form.gaming_hrs) || 0,
          work_equipment_hrs: Number(form.work_equipment_hrs) || 0,
        },
        lighting: form.led_usage,
      },
      special_activities: [
        ...(form.home_office_usage ? ["Home office equipment usage"] : []),
        ...(form.hosting_guests ? ["Hosting guests (energy impact)"] : []),
        ...(form.appliance_heavy ? ["Appliance-heavy activities"] : []),
      ],
      food_consumption: {
        meals: {
          breakfast: form.breakfast,
          lunch: form.lunch,
          dinner: form.dinner,
          snacks: form.snacks,
        },
        meat_servings: {
          beef: Number(form.beef) || 0,
          pork: Number(form.pork) || 0,
          chicken: Number(form.chicken) || 0,
        },
        plant_based_meals: Number(form.vegetarian_meals) || 0,
        local_organic_pct: Number(form.local_organic_pct) || 0,
        food_waste: form.food_waste,
      },
      purchases: {
        online_orders: Number(form.online_orders) || 0,
        package_size: form.package_sizes,
        in_store: form.in_store_shopping,
        impulse:
          form.impulse_purchases && form.impulse_purchases.length > 0
            ? form.impulse_purchases
            : ["None"],
        sustainable_choices:
          form.sustainable_choices && form.sustainable_choices.length > 0
            ? form.sustainable_choices
            : [],
      },
      waste: {
        general: form.general_waste,
        recycling: form.recycling,
        composting: form.composting,
        special:
          form.special_waste && form.special_waste.length > 0
            ? form.special_waste
            : [],
      },
      plastic: {
        single_use: {
          water_bottles: Number(form.water_bottles) || 0,
          food_containers: Number(form.food_containers) || 0,
          bags: Number(form.plastic_bags) || 0,
        },
        avoided_plastics_count: Number(form.avoided_plastics) || 0,
        packaging_waste: form.packaging_waste,
      },
      water: {
        direct_usage: {
          shower_time_min: Number(form.shower_time_min) || 0,
          baths: Number(form.baths_taken) || 0,
          dishwashing: {
            handwash_min: Number(form.handwash_min) || 0,
            dishwasher_loads: Number(form.dishwasher_loads) || 0,
          },
          laundry_loads: Number(form.laundry_loads_water) || 0,
          water_temp: form.water_temp,
          outdoor_use_min: Number(form.gardening_min) || 0,
        },
        conservation: {
          shorter_showers:
            form.water_saving_actions.includes("Shorter showers"),
          full_loads_only:
            form.water_saving_actions.includes("Full loads only"),
          leak_fixes: form.water_saving_actions.includes("Leak fixes"),
          rainwater_collection: form.rainwater_collection === "Yes",
          greywater_reuse: form.greywater_reuse === "Yes",
        },
      },
    };
  };

  const handleNext = async () => {
    if (activeStep === steps.length - 1) {
      setSubmitting(true);
      try {
        const payload = buildPayload();
        await axios.post(endpoint.saveDailyEcoData, payload);
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
      } catch (err) {
        alert("Failed to submit daily info. Please try again.");
      } finally {
        setSubmitting(false);
      }
    } else {
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
    }
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  return (
    <Page pageTitle={intl.formatMessage({ id: "personalSummaryDaily" })}>
      <Scrollbar
        style={{ height: "100%", width: "100%", display: "flex", flex: 1 }}
      >
        <Card>
          <CardContent>
            <div className={classes.root}>
              <Stepper activeStep={activeStep} orientation="vertical">
                {steps.map((label, index) => (
                  <Step key={label}>
                    <StepLabel>{label}</StepLabel>
                    <StepContent>
                      {getStepContent(index, form, handleChange)}
                      <div className={classes.actionsContainer}>
                        <div>
                          <Button
                            disabled={activeStep === 0 || submitting}
                            onClick={handleBack}
                            className={classes.button}
                          >
                            Back
                          </Button>
                          <Button
                            variant="contained"
                            color="primary"
                            onClick={handleNext}
                            className={classes.button}
                            disabled={submitting}
                          >
                            {activeStep === steps.length - 1
                              ? submitting
                                ? "Submitting..."
                                : "Submit"
                              : "Next"}
                          </Button>
                        </div>
                      </div>
                    </StepContent>
                  </Step>
                ))}
              </Stepper>
              {activeStep === steps.length && (
                <Paper square elevation={0} className={classes.resetContainer}>
                  <Typography>
                    Thanks for taking the time to Check-In!
                  </Typography>
                  <Button onClick={handleReset} className={classes.button}>
                    Reset
                  </Button>
                </Paper>
              )}
            </div>
          </CardContent>
        </Card>
      </Scrollbar>
    </Page>
  );
};

export default injectIntl(PersonalSummaryPage);
