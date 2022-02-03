// init
import React, { useState, useEffect } from "react";
import { useStyles } from "../../css/register";
import api from "../../api";
import { toast } from "react-toastify";

// component
import Box from "@mui/material/Box";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepButton from "@mui/material/StepButton";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import InputWithLabel from "../../components/InputWithLabel";
import SubscriptionCard from "../Subscription/SubscriptionCard";

const steps = [
  "General information",
  "Login information",
  "Subscription package",
];

// Register Component
const Register = ({ setCurrentPage }) => {
  const classes = useStyles();

  // states
  const [activeStep, setActiveStep] = useState(0);
  const [completed, setCompleted] = useState({});
  const [values, setValues] = useState({
    establishment: "",
    service: "",
    address_1: "",
    address_2: "",
    po_box: "",
    postal_code: "",
    city: "",
    phone: "",
    last_name: "",
    first_name: "",
    email: "",
    password: "",
    confirm_password: "",
  });
  const [subscriptions, setSubscriptions] = useState();
  const [selected, setSelected] = useState(""); ///state for selected subscription

  // useEffetct
  useEffect(() => {
    getAllSubscriptions();
  }, []);

  // function to get all subs
  const getAllSubscriptions = async () => {
    const result = await api("get", `/Subscriptions/getAll/architect`);
    setSubscriptions(result?.data?.subscription);
  };

  // handle change function
  const handleChange = (name, value) => {
    setValues((prev) => {
      prev[name] = value;
      return { ...prev };
    });
  };

  // handle Finish function
  const handleFinish = async (e) => {
    e.preventDefault();
    let data = values;
    data.subscription = selected;
    const result = await api("post", `/Architects/signup`, data);
    toast.success(result.data.message);
    setCurrentPage("login");
  };

  // for stepper
  const totalSteps = () => {
    return steps.length;
  };

  const completedSteps = () => {
    return Object.keys(completed).length;
  };

  const isLastStep = () => {
    return activeStep === totalSteps() - 1;
  };

  const allStepsCompleted = () => {
    return completedSteps() === totalSteps();
  };

  const handleNext = () => {
    const newActiveStep =
      isLastStep() && !allStepsCompleted()
        ? // It's the last step, but not all steps have been completed,
          // find the first step that has been completed
          steps.findIndex((step, i) => !(i in completed))
        : activeStep + 1;
    setActiveStep(newActiveStep);
  };

  const handleStep = (step) => () => {
    setActiveStep(step);
  };

  const handleComplete = (e) => {
    e.preventDefault();
    const newCompleted = completed;
    newCompleted[activeStep] = true;
    setCompleted(newCompleted);
    handleNext();
  };

  const handleReset = () => {
    setActiveStep(0);
    setCompleted({});
  };

  // returning jsx
  return (
    <div className={classes.container}>
      <Box sx={{ width: "80%" }}>
        <Stepper
          nonLinear
          activeStep={activeStep}
          sx={{
            "& .css-1u4zpwo-MuiSvgIcon-root-MuiStepIcon-root.Mui-active": {
              color: "#3b373c",
            },
            "& .css-1u4zpwo-MuiSvgIcon-root-MuiStepIcon-root.Mui-completed": {
              color: "#3b373c",
            },
          }}
        >
          {steps.map((label, index) => (
            <Step key={label} completed={completed[index]}>
              <StepButton color="inherit" onClick={handleStep(index)}>
                {label}
              </StepButton>
            </Step>
          ))}
        </Stepper>
        <div>
          {allStepsCompleted() ? (
            <React.Fragment>
              <Typography sx={{ mt: 2, mb: 1 }}>
                All steps completed - you&apos;re finished
              </Typography>
              <Box sx={{ display: "flex", flexDirection: "row", pt: 2 }}>
                <Box sx={{ flex: "1 1 auto" }} />
                <Button onClick={handleReset}>Reset</Button>
              </Box>
            </React.Fragment>
          ) : (
            <React.Fragment>
              <Typography sx={{ mt: 2, mb: 1 }}>
                {activeStep === 0 ? (
                  <>
                    <br />
                    <form onSubmit={handleComplete}>
                      <Grid container spacing={2}>
                        <Grid item zeroMinWidth xs>
                          <InputWithLabel
                            label="Name of Establishment"
                            required={true}
                            name="establishment"
                            type="text"
                            value={values.establishment}
                            handleChange={(e) =>
                              handleChange(e.target.name, e.target.value)
                            }
                          />
                        </Grid>
                        <Grid item zeroMinWidth xs>
                          <InputWithLabel
                            label="Service"
                            required={true}
                            name="service"
                            type="text"
                            value={values.service}
                            handleChange={(e) =>
                              handleChange(e.target.name, e.target.value)
                            }
                          />
                        </Grid>
                      </Grid>
                      <br />
                      <Grid container spacing={2}>
                        <Grid item zeroMinWidth xs>
                          <InputWithLabel
                            label="Address 1"
                            required={true}
                            name="address_1"
                            type="text"
                            value={values.address_1}
                            handleChange={(e) =>
                              handleChange(e.target.name, e.target.value)
                            }
                          />
                        </Grid>
                        <Grid item zeroMinWidth xs>
                          <InputWithLabel
                            label="Address 2"
                            required={true}
                            name="address_2"
                            type="text"
                            value={values.address_2}
                            handleChange={(e) =>
                              handleChange(e.target.name, e.target.value)
                            }
                          />
                        </Grid>
                      </Grid>
                      <br />
                      <Grid container spacing={2}>
                        <Grid item zeroMinWidth xs>
                          <InputWithLabel
                            label="PO Box"
                            required={true}
                            name="po_box"
                            type="text"
                            value={values.po_box}
                            handleChange={(e) =>
                              handleChange(e.target.name, e.target.value)
                            }
                          />
                        </Grid>
                        <Grid item zeroMinWidth xs>
                          <InputWithLabel
                            label="Postal Code"
                            required={true}
                            name="postal_code"
                            type="text"
                            value={values.postal_code}
                            handleChange={(e) =>
                              handleChange(e.target.name, e.target.value)
                            }
                          />
                        </Grid>
                      </Grid>
                      <br />
                      <Grid container spacing={2}>
                        <Grid item zeroMinWidth xs>
                          <InputWithLabel
                            label="City"
                            required={true}
                            name="city"
                            type="text"
                            value={values.city}
                            handleChange={(e) =>
                              handleChange(e.target.name, e.target.value)
                            }
                          />
                        </Grid>
                        <Grid item zeroMinWidth xs>
                          <InputWithLabel
                            label="Phone Number"
                            required={true}
                            name="phone"
                            type="text"
                            value={values.phone}
                            handleChange={(e) =>
                              handleChange(e.target.name, e.target.value)
                            }
                          />
                        </Grid>
                      </Grid>
                      <Box
                        sx={{
                          display: "flex",
                          flexDirection: "row",
                          pt: 2,
                          justifyContent: "center",
                        }}
                      >
                        <button type="submit" className={classes.btn}>
                          Complete Step
                        </button>
                      </Box>
                    </form>
                  </>
                ) : activeStep === 1 ? (
                  <>
                    <br />
                    <form onSubmit={handleComplete}>
                      <Grid container spacing={2}>
                        <Grid item zeroMinWidth xs>
                          <InputWithLabel
                            label="First Name"
                            required={true}
                            name="first_name"
                            type="text"
                            value={values.first_name}
                            handleChange={(e) =>
                              handleChange(e.target.name, e.target.value)
                            }
                          />
                        </Grid>
                        <Grid item zeroMinWidth xs>
                          <InputWithLabel
                            label="Last Name"
                            required={true}
                            name="last_name"
                            type="text"
                            value={values.last_name}
                            handleChange={(e) =>
                              handleChange(e.target.name, e.target.value)
                            }
                          />
                        </Grid>
                      </Grid>
                      <br />
                      <InputWithLabel
                        label="Email"
                        required={true}
                        name="email"
                        type="email"
                        value={values.email}
                        handleChange={(e) =>
                          handleChange(e.target.name, e.target.value)
                        }
                      />
                      <br />
                      <br />
                      <Grid container spacing={2}>
                        <Grid item zeroMinWidth xs>
                          <InputWithLabel
                            label="Password"
                            required={true}
                            name="password"
                            type="password"
                            value={values.password}
                            handleChange={(e) =>
                              handleChange(e.target.name, e.target.value)
                            }
                          />
                        </Grid>
                        <Grid item zeroMinWidth xs>
                          <InputWithLabel
                            label="Confirm Password"
                            required={true}
                            name="confirm_password"
                            type="password"
                            value={values.confirm_password}
                            handleChange={(e) =>
                              handleChange(e.target.name, e.target.value)
                            }
                          />
                        </Grid>
                      </Grid>
                      <br />
                      <Box
                        sx={{
                          display: "flex",
                          flexDirection: "row",
                          pt: 2,
                          justifyContent: "center",
                        }}
                      >
                        <button type="submit" className={classes.btn}>
                          Complete Step
                        </button>
                      </Box>
                    </form>
                  </>
                ) : (
                  <>
                    <br />
                    <form onSubmit={handleFinish}>
                      <div
                        style={{ display: "flex", justifyContent: "center" }}
                      >
                        {subscriptions?.map((item) => (
                          <SubscriptionCard
                            subscription={item}
                            selected={selected}
                            setSelected={setSelected}
                          />
                        ))}
                      </div>
                      <Box
                        sx={{
                          display: "flex",
                          flexDirection: "row",
                          pt: 2,
                          justifyContent: "center",
                        }}
                      >
                        <button
                          type="submit"
                          disabled={!completed[0] || !completed[1] || !selected}
                          className={classes.btn}
                        >
                          Finish
                        </button>
                      </Box>
                    </form>
                  </>
                )}
              </Typography>
            </React.Fragment>
          )}
        </div>
      </Box>
    </div>
  );
};

export default Register;
