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
  MenuItem,
  Paper,
  Step,
  StepContent,
  StepLabel,
  Stepper,
  TextField,
  Typography,
} from "@material-ui/core";
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
    "Basic Information Section",
    "Commute & Transportation Section",
    "Home & Energy Section",
    "Food & Consumption Section",
    "Waste & Recycling Section",
    "Environmental Awareness & Goals Section",
  ];
}

const initialForm = {
  user_id: "user_001",
  name: "",
  email: "",
  profile_picture: "",
  location: "",
  age_range: "",
  household_size: "",
  housing_type: "",
  work_location: "",
  office_distance_km: "",
  primary_commute_mode: "",
  secondary_transport: "",
  car_make: "",
  car_model: "",
  car_year: "",
  car_fuel_type: "",
  car_avg_mileage_kmpl: "",
  air_travel_frequency: "",
  average_flight_distance: "",
  public_transit_availability: "",
  home_size: "",
  home_age: "",
  primary_heating: "",
  energy_provider_type: "",
  smart_home_features: [],
  monthly_electricity_bill_inr: "",
  heating_cooling_preference: "",
  water_heating: "",
  primary_diet: "",
  meal_preparation: "",
  food_shopping: "",
  food_waste: "",
  shopping_frequency: "",
  package_delivery: "",
  clothing_purchases: "",
  electronics: "",
  recycling_participation: "",
  composting: "",
  plastic_usage: "",
  reusable_items: [],
  environmental_awareness: "",
  climate_action_experience: "",
  motivation_level: "",
  primary_focus_areas: [],
  budget_for_changes_inr: "",
  time_availability: "",
  lifestyle_change_tolerance: "",
};

function getStepContent(step, form, handleChange, handleFileChange) {
  switch (step) {
    case 0:
      return (
        <Card>
          <CardHeader subheader="Personal Details" />
          <CardContent>
            <form noValidate autoComplete="off">
              <div style={{ marginBottom: 16 }}>
                <TextField
                  label="Name"
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                />
                <TextField
                  label="Email"
                  type="email"
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                />
                {/* Profile Picture Upload */}
                <div style={{ margin: "16px 0" }}>
                  <input
                    accept="image/*"
                    style={{ display: "none" }}
                    id="profile-picture-upload"
                    type="file"
                    onChange={handleFileChange}
                  />
                  <label htmlFor="profile-picture-upload">
                    <Button variant="outlined" color="primary" component="span">
                      Upload Profile Picture
                    </Button>
                  </label>
                  {form.profile_picture && (
                    <Typography variant="caption" style={{ marginLeft: 8 }}>
                      {form.profile_picture}
                    </Typography>
                  )}
                </div>
                <TextField
                  label="Location (City, State/Province, Country)"
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  name="location"
                  value={form.location}
                  onChange={handleChange}
                />
                <TextField
                  select
                  label="Age Range"
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  name="age_range"
                  value={form.age_range}
                  onChange={handleChange}
                >
                  <MenuItem value="18-25">18-25</MenuItem>
                  <MenuItem value="26-35">26-35</MenuItem>
                  <MenuItem value="36-45">36-45</MenuItem>
                  <MenuItem value="46-55">46-55</MenuItem>
                  <MenuItem value="55+">55+</MenuItem>
                </TextField>
                <TextField
                  select
                  label="Household Size"
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  name="household_size"
                  value={form.household_size}
                  onChange={handleChange}
                >
                  <MenuItem value="1">1</MenuItem>
                  <MenuItem value="2">2</MenuItem>
                  <MenuItem value="3-4">3-4</MenuItem>
                  <MenuItem value="5+">5+</MenuItem>
                </TextField>
                <TextField
                  select
                  label="Housing Type"
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  name="housing_type"
                  value={form.housing_type}
                  onChange={handleChange}
                >
                  <MenuItem value="Apartment">Apartment</MenuItem>
                  <MenuItem value="House">House</MenuItem>
                  <MenuItem value="Condo">Condo</MenuItem>
                  <MenuItem value="Other">Other</MenuItem>
                </TextField>
              </div>
            </form>
          </CardContent>
        </Card>
      );
    case 1:
      return (
        <div>
          <Card>
            <CardHeader subheader="Work Commute (if applicable)" />
            <CardContent>
              <form noValidate autoComplete="off">
                <TextField
                  select
                  label="Work Location"
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  name="work_location"
                  value={form.work_location}
                  onChange={handleChange}
                >
                  <MenuItem value="Remote">Remote</MenuItem>
                  <MenuItem value="Hybrid">Hybrid</MenuItem>
                  <MenuItem value="Office">Office</MenuItem>
                </TextField>
                <TextField
                  label="Office Distance (one-way)"
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  type="number"
                  name="office_distance_km"
                  value={form.office_distance_km}
                  onChange={handleChange}
                  InputProps={{
                    endAdornment: (
                      <span style={{ marginLeft: 8 }}>km/miles</span>
                    ),
                  }}
                />
                <TextField
                  select
                  label="Primary Commute Mode"
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  name="primary_commute_mode"
                  value={form.primary_commute_mode}
                  onChange={handleChange}
                >
                  <MenuItem value="Car - Petrol">Car (Petrol)</MenuItem>
                  <MenuItem value="Car - Hybrid">Car (Hybrid)</MenuItem>
                  <MenuItem value="Car - Electric">Car (Electric)</MenuItem>
                  <MenuItem value="Public Transit">Public Transit</MenuItem>
                  <MenuItem value="Bicycle">Bicycle</MenuItem>
                  <MenuItem value="Walking">Walking</MenuItem>
                  <MenuItem value="Motorcycle">Motorcycle</MenuItem>
                </TextField>
                <TextField
                  label="Secondary Transport (weekend/leisure)"
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  name="secondary_transport"
                  value={form.secondary_transport}
                  onChange={handleChange}
                />
                <Typography variant="subtitle1" style={{ marginTop: 16 }}>
                  Car Details (if applicable)
                </Typography>
                <TextField
                  label="Make"
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  name="car_make"
                  value={form.car_make}
                  onChange={handleChange}
                />
                <TextField
                  label="Model"
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  name="car_model"
                  value={form.car_model}
                  onChange={handleChange}
                />
                <TextField
                  label="Year"
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  type="number"
                  name="car_year"
                  value={form.car_year}
                  onChange={handleChange}
                />
                <TextField
                  select
                  label="Fuel Type"
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  name="car_fuel_type"
                  value={form.car_fuel_type}
                  onChange={handleChange}
                >
                  <MenuItem value="Petrol">Petrol</MenuItem>
                  <MenuItem value="Hybrid">Hybrid</MenuItem>
                  <MenuItem value="Electric">Electric</MenuItem>
                  <MenuItem value="Diesel">Diesel</MenuItem>
                  <MenuItem value="Other">Other</MenuItem>
                </TextField>
                <TextField
                  label="Average MPG/L per 100km"
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  type="number"
                  name="car_avg_mileage_kmpl"
                  value={form.car_avg_mileage_kmpl}
                  onChange={handleChange}
                />
              </form>
            </CardContent>
          </Card>
          <Card>
            <CardHeader subheader="Travel Patterns" />
            <CardContent>
              <form noValidate autoComplete="off">
                <TextField
                  select
                  label="Frequency of air travel"
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  name="air_travel_frequency"
                  value={form.air_travel_frequency}
                  onChange={handleChange}
                >
                  <MenuItem value="Never">Never</MenuItem>
                  <MenuItem value="1-2">1-2 times/year</MenuItem>
                  <MenuItem value="3-5">3-5 times/year</MenuItem>
                  <MenuItem value="6+">6+ times/year</MenuItem>
                </TextField>
                <TextField
                  select
                  label="Average flight distance"
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  name="average_flight_distance"
                  value={form.average_flight_distance}
                  onChange={handleChange}
                >
                  <MenuItem value="Local">&lt;500km (Local)</MenuItem>
                  <MenuItem value="Regional">500-2000km (Regional)</MenuItem>
                  <MenuItem value="International">
                    &gt;2000km (International)
                  </MenuItem>
                </TextField>
                <TextField
                  select
                  label="Public transit availability"
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  name="public_transit_availability"
                  value={form.public_transit_availability}
                  onChange={handleChange}
                >
                  <MenuItem value="Excellent">Excellent</MenuItem>
                  <MenuItem value="Good">Good</MenuItem>
                  <MenuItem value="Fair">Fair</MenuItem>
                  <MenuItem value="Poor">Poor</MenuItem>
                  <MenuItem value="None">None</MenuItem>
                </TextField>
              </form>
            </CardContent>
          </Card>
        </div>
      );
    case 2:
      return (
        <div>
          <Card>
            <CardHeader subheader="Living Situation" />
            <CardContent>
              <form noValidate autoComplete="off">
                <TextField
                  select
                  label="Home Size"
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  name="home_size"
                  value={form.home_size}
                  onChange={handleChange}
                >
                  <MenuItem value="<500">&lt;500 sq ft</MenuItem>
                  <MenuItem value="500-1000">500-1000 sq ft</MenuItem>
                  <MenuItem value="1000-1500">1000-1500 sq ft</MenuItem>
                  <MenuItem value="1500-2500">1500-2500 sq ft</MenuItem>
                  <MenuItem value="2500+">2500+ sq ft</MenuItem>
                </TextField>
                <TextField
                  select
                  label="Home Age"
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  name="home_age"
                  value={form.home_age}
                  onChange={handleChange}
                >
                  <MenuItem value="<5">&lt;5 years</MenuItem>
                  <MenuItem value="5-20">5-20 years</MenuItem>
                  <MenuItem value="20-50">20-50 years</MenuItem>
                  <MenuItem value="50+">50+ years</MenuItem>
                </TextField>
                <TextField
                  select
                  label="Primary Heating"
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  name="primary_heating"
                  value={form.primary_heating}
                  onChange={handleChange}
                >
                  <MenuItem value="Natural Gas">Natural Gas</MenuItem>
                  <MenuItem value="Electric">Electric</MenuItem>
                  <MenuItem value="Oil/Propane">Oil/Propane</MenuItem>
                  <MenuItem value="Heat Pump">Heat Pump</MenuItem>
                  <MenuItem value="Solar">Solar</MenuItem>
                  <MenuItem value="Other">Other</MenuItem>
                </TextField>
                <TextField
                  select
                  label="Energy Provider Type"
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  name="energy_provider_type"
                  value={form.energy_provider_type}
                  onChange={handleChange}
                >
                  <MenuItem value="Standard Grid">Standard Grid</MenuItem>
                  <MenuItem value="Green Energy Plan">
                    Green Energy Plan
                  </MenuItem>
                  <MenuItem value="Solar Panels">Solar Panels</MenuItem>
                  <MenuItem value="Mixed">Mixed</MenuItem>
                </TextField>
                <TextField
                  select
                  label="Smart Home Features"
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  name="smart_home_features"
                  value={form.smart_home_features}
                  onChange={handleChange}
                  SelectProps={{
                    multiple: true,
                  }}
                >
                  <MenuItem value="Smart Thermostat">Smart Thermostat</MenuItem>
                  <MenuItem value="Smart Lights">Smart Lights</MenuItem>
                  <MenuItem value="Energy Monitor">Energy Monitor</MenuItem>
                  <MenuItem value="None">None</MenuItem>
                </TextField>
              </form>
            </CardContent>
          </Card>
          <Card>
            <CardHeader subheader="Utility Consumption Estimates" />
            <CardContent>
              <form noValidate autoComplete="off">
                <TextField
                  select
                  label="Monthly Electricity Bill Range"
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  name="monthly_electricity_bill_inr"
                  value={form.monthly_electricity_bill_inr}
                  onChange={handleChange}
                >
                  <MenuItem value="<50">&lt;50</MenuItem>
                  <MenuItem value="50-100">50-100</MenuItem>
                  <MenuItem value="100-200">100-200</MenuItem>
                  <MenuItem value="200-300">200-300</MenuItem>
                  <MenuItem value="300+">300+</MenuItem>
                </TextField>
                <TextField
                  select
                  label="Heating/Cooling Preference"
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  name="heating_cooling_preference"
                  value={form.heating_cooling_preference}
                  onChange={handleChange}
                >
                  <MenuItem value="Energy Saver">Energy Saver</MenuItem>
                  <MenuItem value="Moderate">Moderate</MenuItem>
                  <MenuItem value="Comfort Priority">Comfort Priority</MenuItem>
                </TextField>
                <TextField
                  select
                  label="Water Heating"
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  name="water_heating"
                  value={form.water_heating}
                  onChange={handleChange}
                >
                  <MenuItem value="Tank">Tank</MenuItem>
                  <MenuItem value="Tankless">Tankless</MenuItem>
                  <MenuItem value="Solar">Solar</MenuItem>
                  <MenuItem value="Heat Pump">Heat Pump</MenuItem>
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
            <CardHeader subheader="Dietary Preferences" />
            <CardContent>
              <form noValidate autoComplete="off">
                <TextField
                  select
                  label="Primary Diet"
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  name="primary_diet"
                  value={form.primary_diet}
                  onChange={handleChange}
                >
                  <MenuItem value="Omnivore">Omnivore</MenuItem>
                  <MenuItem value="Vegetarian">Vegetarian</MenuItem>
                  <MenuItem value="Vegan">Vegan</MenuItem>
                  <MenuItem value="Pescatarian">Pescatarian</MenuItem>
                  <MenuItem value="Flexitarian">Flexitarian</MenuItem>
                  <MenuItem value="Keto/Low-carb">Keto/Low-carb</MenuItem>
                </TextField>
                <TextField
                  select
                  label="Meal Preparation"
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  name="meal_preparation"
                  value={form.meal_preparation}
                  onChange={handleChange}
                >
                  <MenuItem value="Cook Most Meals">Cook Most Meals</MenuItem>
                  <MenuItem value="Cook Sometimes">Cook Sometimes</MenuItem>
                  <MenuItem value="Order/Eat Out Frequently">
                    Order/Eat Out Frequently
                  </MenuItem>
                </TextField>
                <TextField
                  select
                  label="Food Shopping"
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  name="food_shopping"
                  value={form.food_shopping}
                  onChange={handleChange}
                >
                  <MenuItem value="Local/Organic Focus">
                    Local/Organic Focus
                  </MenuItem>
                  <MenuItem value="Mixed">Mixed</MenuItem>
                  <MenuItem value="Convenience Focus">
                    Convenience Focus
                  </MenuItem>
                </TextField>
                <TextField
                  select
                  label="Food Waste"
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  name="food_waste"
                  value={form.food_waste}
                  onChange={handleChange}
                >
                  <MenuItem value="Minimal">Minimal</MenuItem>
                  <MenuItem value="Moderate">Moderate</MenuItem>
                  <MenuItem value="Significant">Significant</MenuItem>
                </TextField>
              </form>
            </CardContent>
          </Card>
          <Card>
            <CardHeader subheader="Shopping & Consumption Habits" />
            <CardContent>
              <form noValidate autoComplete="off">
                <TextField
                  select
                  label="Shopping Frequency"
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  name="shopping_frequency"
                  value={form.shopping_frequency}
                  onChange={handleChange}
                >
                  <MenuItem value="Daily">Daily</MenuItem>
                  <MenuItem value="2-3 times/week">2-3 times/week</MenuItem>
                  <MenuItem value="Weekly">Weekly</MenuItem>
                  <MenuItem value="2-3 times/month">2-3 times/month</MenuItem>
                  <MenuItem value="Monthly">Monthly</MenuItem>
                </TextField>
                <TextField
                  select
                  label="Package Delivery"
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  name="package_delivery"
                  value={form.package_delivery}
                  onChange={handleChange}
                >
                  <MenuItem value="Rarely">Rarely</MenuItem>
                  <MenuItem value="1-2/month">1-2/month</MenuItem>
                  <MenuItem value="1-2/week">1-2/week</MenuItem>
                  <MenuItem value="3-5/week">3-5/week</MenuItem>
                  <MenuItem value="Daily">Daily</MenuItem>
                </TextField>
                <TextField
                  select
                  label="Clothing Purchases"
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  name="clothing_purchases"
                  value={form.clothing_purchases}
                  onChange={handleChange}
                >
                  <MenuItem value="Minimal">Minimal</MenuItem>
                  <MenuItem value="Seasonal">Seasonal</MenuItem>
                  <MenuItem value="Regular">Regular</MenuItem>
                  <MenuItem value="Fashion-focused">Fashion-focused</MenuItem>
                </TextField>
                <TextField
                  select
                  label="Electronics"
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  name="electronics"
                  value={form.electronics}
                  onChange={handleChange}
                >
                  <MenuItem value="Keep Until Broken">
                    Keep Until Broken
                  </MenuItem>
                  <MenuItem value="Regular Upgrades">Regular Upgrades</MenuItem>
                  <MenuItem value="Early Adopter">Early Adopter</MenuItem>
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
            <CardHeader subheader="Waste Management" />
            <CardContent>
              <form noValidate autoComplete="off">
                <TextField
                  select
                  label="Recycling Participation"
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  name="recycling_participation"
                  value={form.recycling_participation}
                  onChange={handleChange}
                >
                  <MenuItem value="Always">Always</MenuItem>
                  <MenuItem value="Usually">Usually</MenuItem>
                  <MenuItem value="Occasionally">Occasionally</MenuItem>
                  <MenuItem value="Rarely">Rarely</MenuItem>
                  <MenuItem value="Not Available">Not Available</MenuItem>
                </TextField>
                <TextField
                  select
                  label="Composting"
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  name="composting"
                  value={form.composting}
                  onChange={handleChange}
                >
                  <MenuItem value="Regular">Regular</MenuItem>
                  <MenuItem value="Occasional">Occasional</MenuItem>
                  <MenuItem value="Never">Never</MenuItem>
                  <MenuItem value="Want to Start">Want to Start</MenuItem>
                </TextField>
                <TextField
                  select
                  label="Plastic Usage"
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  name="plastic_usage"
                  value={form.plastic_usage}
                  onChange={handleChange}
                >
                  <MenuItem value="Actively Avoid">Actively Avoid</MenuItem>
                  <MenuItem value="Moderate Effort">Moderate Effort</MenuItem>
                  <MenuItem value="Standard">Standard</MenuItem>
                  <MenuItem value="High Usage">High Usage</MenuItem>
                </TextField>
                <TextField
                  select
                  label="Reusable Items"
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  name="reusable_items"
                  value={form.reusable_items}
                  onChange={handleChange}
                  SelectProps={{
                    multiple: true,
                  }}
                >
                  <MenuItem value="Water Bottle">Water Bottle</MenuItem>
                  <MenuItem value="Shopping Bags">Shopping Bags</MenuItem>
                  <MenuItem value="Food Containers">Food Containers</MenuItem>
                  <MenuItem value="Coffee Cup">Coffee Cup</MenuItem>
                </TextField>
              </form>
            </CardContent>
          </Card>
        </div>
      );
    case 5:
      return (
        <div>
          <Card>
            <CardHeader subheader="Current Knowledge Level" />
            <CardContent>
              <form noValidate autoComplete="off">
                <TextField
                  select
                  label="Environmental Awareness"
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  name="environmental_awareness"
                  value={form.environmental_awareness}
                  onChange={handleChange}
                >
                  <MenuItem value="Expert">Expert</MenuItem>
                  <MenuItem value="High">High</MenuItem>
                  <MenuItem value="Moderate">Moderate</MenuItem>
                  <MenuItem value="Basic">Basic</MenuItem>
                  <MenuItem value="New to Topic">New to Topic</MenuItem>
                </TextField>
                <TextField
                  select
                  label="Climate Action Experience"
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  name="climate_action_experience"
                  value={form.climate_action_experience}
                  onChange={handleChange}
                >
                  <MenuItem value="Veteran">Veteran</MenuItem>
                  <MenuItem value="Some Experience">Some Experience</MenuItem>
                  <MenuItem value="Beginner">Beginner</MenuItem>
                  <MenuItem value="Just Starting">Just Starting</MenuItem>
                </TextField>
                <TextField
                  select
                  label="Motivation Level"
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  name="motivation_level"
                  value={form.motivation_level}
                  onChange={handleChange}
                >
                  <MenuItem value="Highly Motivated">Highly Motivated</MenuItem>
                  <MenuItem value="Moderately Motivated">
                    Moderately Motivated
                  </MenuItem>
                  <MenuItem value="Exploring Options">
                    Exploring Options
                  </MenuItem>
                </TextField>
              </form>
            </CardContent>
          </Card>
          <Card>
            <CardHeader subheader="Personal Goals & Constraints" />
            <CardContent>
              <form noValidate autoComplete="off">
                <TextField
                  select
                  label="Primary Focus Areas"
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  name="primary_focus_areas"
                  value={form.primary_focus_areas}
                  onChange={handleChange}
                  SelectProps={{
                    multiple: true,
                  }}
                >
                  <MenuItem value="Carbon Reduction">Carbon Reduction</MenuItem>
                  <MenuItem value="Cost Savings">Cost Savings</MenuItem>
                  <MenuItem value="Health Benefits">Health Benefits</MenuItem>
                  <MenuItem value="Social Impact">Social Impact</MenuItem>
                </TextField>
                <TextField
                  select
                  label="Budget for Changes"
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  name="budget_for_changes_inr"
                  value={form.budget_for_changes_inr}
                  onChange={handleChange}
                >
                  <MenuItem value="No Budget">No Budget</MenuItem>
                  <MenuItem value="<50">&lt;50/month</MenuItem>
                  <MenuItem value="50-150">50-150/month</MenuItem>
                  <MenuItem value="150-300">150-300/month</MenuItem>
                  <MenuItem value="300+">300+/month</MenuItem>
                </TextField>
                <TextField
                  select
                  label="Time Availability"
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  name="time_availability"
                  value={form.time_availability}
                  onChange={handleChange}
                >
                  <MenuItem value="Very Limited">Very Limited</MenuItem>
                  <MenuItem value="Limited">Limited</MenuItem>
                  <MenuItem value="Moderate">Moderate</MenuItem>
                  <MenuItem value="High Availability">
                    High Availability
                  </MenuItem>
                </TextField>
                <TextField
                  select
                  label="Lifestyle Change Tolerance"
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  name="lifestyle_change_tolerance"
                  value={form.lifestyle_change_tolerance}
                  onChange={handleChange}
                >
                  <MenuItem value="Minimal Changes">Minimal Changes</MenuItem>
                  <MenuItem value="Gradual Changes">Gradual Changes</MenuItem>
                  <MenuItem value="Significant Changes OK">
                    Significant Changes OK
                  </MenuItem>
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

const ProfilePage = ({ intl }) => {
  const classes = useStyles();
  const [activeStep, setActiveStep] = React.useState(0);
  const steps = getSteps();
  const [form, setForm] = React.useState(initialForm);
  const [submitting, setSubmitting] = React.useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    // Handle multi-select fields
    if (e.target.multiple) {
      const options = e.target.options;
      const values = [];
      for (let i = 0, l = options.length; i < l; i++) {
        if (options[i].selected) {
          values.push(options[i].value);
        }
      }
      setForm((prev) => ({ ...prev, [name]: values }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  // For file upload, just store the file name (simulate URL for demo)
  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setForm((prev) => ({
        ...prev,
        profile_picture: e.target.files[0].name,
      }));
    }
  };

  const handleNext = async () => {
    if (activeStep === steps.length - 1) {
      setSubmitting(true);
      try {
        // Map form fields to API payload as needed
        await axios.post(endpoint.saveProfileData, form);
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
      } catch (err) {
        alert("Failed to submit profile. Please try again.");
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

  const handleReset = () => {
    setActiveStep(0);
    setForm(initialForm);
  };

  return (
    <Page pageTitle={intl.formatMessage({ id: "profile" })}>
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
                      {getStepContent(
                        index,
                        form,
                        handleChange,
                        handleFileChange
                      )}
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
                    Thanks for taking the time to complete your profile!
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

export default injectIntl(ProfilePage);
