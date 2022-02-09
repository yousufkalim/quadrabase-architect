// init
import React, { useState, useEffect } from "react";
import { useStyles } from "../../css/register";
import api from "../../api";
import { toast } from "react-toastify";
import validate from "validate.js";

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

const schema1 = {
  establishment: {
    presence: { allowEmpty: false, message: "is required" },
    length: {
      maximum: 32,
    },
  },
  service: {
    presence: { allowEmpty: false, message: "is required" },
    length: {
      maximum: 32,
    },
  },
  address_1: {
    presence: { allowEmpty: false, message: "is required" },
  },
  po_box: {
    presence: { allowEmpty: false, message: "is required" },
  },
  postal_code: {
    presence: { allowEmpty: false, message: "is required" },
    length: {
      minimum: 5,
      maximum: 5,
    },
  },
  city: {
    presence: { allowEmpty: false, message: "is required" },
    length: {
      maximum: 32,
    },
  },
  phone: {
    length: {
      minimum: 10,
      maximum: 10,
    },
  },
};

const schema2 = {
  first_name: {
    presence: { allowEmpty: false, message: "is required" },
    length: {
      maximum: 32,
    },
  },
  last_name: {
    presence: { allowEmpty: false, message: "is required" },
    length: {
      maximum: 32,
    },
  },
  email: {
    email: true,
    length: {
      maximum: 64,
    },
  },
  password: {
    length: {
      maximum: 128,
      minimum: 6, //// minimum requirement 6 characters
    },
  },
  confirm_password: {
    length: {
      maximum: 128,
      minimum: 6, //// minimum requirement 6 characters
    },
  },
};

// Register Component
const Register = ({ setCurrentPage }) => {
  const classes = useStyles();

  // states
  const [activeStep, setActiveStep] = useState(0);
  const [completed, setCompleted] = useState({});
  const [form1, setForm1] = useState({
    values: {
      establishment: "",
      service: "",
      address_1: "",
      address_2: "",
      po_box: "",
      postal_code: "",
      city: "",
      phone: "",
    },
    error: {},
    touched: {},
  });

  const [form2, setForm2] = useState({
    values: {
      last_name: "",
      first_name: "",
      email: "",
      password: "",
      confirm_password: "",
    },
    error: {},
    touched: {},
  });

  const [subscriptions, setSubscriptions] = useState();
  const [selected, setSelected] = useState(""); ///state for selected subscription

  // useEffetct
  useEffect(() => {
    getAllSubscriptions();
  }, []);

  useEffect(() => {
    const errors = validate(form1.values, schema1);
    setForm1((formState) => ({
      ...formState,
      errors: errors || {},
    }));
  }, [form1.values]);

  useEffect(() => {
    const errors = validate(form2.values, schema2);
    setForm2((formState) => ({
      ...formState,
      errors: errors || {},
    }));
  }, [form2.values]);

  // function to get all subs
  const getAllSubscriptions = async () => {
    const result = await api("get", `/Subscriptions/getAll/architect`);
    setSubscriptions(result?.data?.subscription);
  };

  // handle change function
  const handleChange = (name, value) => {
    if (activeStep === 0) {
      setForm1((formState) => ({
        ...formState,
        values: {
          ...formState.values,
          [name]: value,
        },
        touched: {
          ...formState.touched,
          [name]: true,
        },
      }));
    } else if (activeStep === 1) {
      setForm2((formState) => ({
        ...formState,
        values: {
          ...formState.values,
          [name]: value,
        },
        touched: {
          ...formState.touched,
          [name]: true,
        },
      }));
    }
  };

  // handle Finish function
  const handleFinish = async (e) => {
    e.preventDefault();
    let data = {
      establishment: form1.values.establishment,
      service: form1.values.service,
      address_1: form1.values.address_1,
      address_2: form1.values.address_2,
      po_box: form1.values.po_box,
      postal_code: form1.values.postal_code,
      city: form1.values.city,
      phone: form1.values.phone,
      last_name: form1.values.last_name,
      first_name: form1.values.first_name,
      email: form1.values.email,
      password: form1.values.password,
      confirm_password: form1.values.confirm_password,
      subscription: selected,
    };
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
    if (activeStep === 0) {
      const newCompleted = completed;
      newCompleted[activeStep] = true;
      setCompleted(newCompleted);
      handleNext();
    } else if (activeStep === 1) {
      if (form2.values.password !== form2.values.confirm_password) {
        toast.error("Password and confirm password does not match!");
      } else {
        const newCompleted = completed;
        newCompleted[activeStep] = true;
        setCompleted(newCompleted);
        handleNext();
      }
    }
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
                            value={form1.values.establishment}
                            handleChange={(e) =>
                              handleChange(e.target.name, e.target.value)
                            }
                            error={
                              form1.touched.establishment &&
                              form1.errors.establishment
                            }
                            errorMessage={
                              form1.touched.establishment &&
                              form1.errors.establishment
                            }
                          />
                        </Grid>
                        <Grid item zeroMinWidth xs>
                          <InputWithLabel
                            label="Service"
                            required={true}
                            name="service"
                            type="text"
                            value={form1.values.service}
                            handleChange={(e) =>
                              handleChange(e.target.name, e.target.value)
                            }
                            error={
                              form1.touched.service && form1.errors.service
                            }
                            errorMessage={
                              form1.touched.service && form1.errors.service
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
                            value={form1.values.address_1}
                            handleChange={(e) =>
                              handleChange(e.target.name, e.target.value)
                            }
                            error={
                              form1.touched.address_1 && form1.errors.address_1
                            }
                            errorMessage={
                              form1.touched.address_1 && form1.errors.address_1
                            }
                          />
                        </Grid>
                        <Grid item zeroMinWidth xs>
                          <InputWithLabel
                            label="Address 2"
                            name="address_2"
                            type="text"
                            value={form1.values.address_2}
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
                            value={form1.values.po_box}
                            handleChange={(e) =>
                              handleChange(e.target.name, e.target.value)
                            }
                            error={form1.touched.po_box && form1.errors.po_box}
                            errorMessage={
                              form1.touched.po_box && form1.errors.po_box
                            }
                          />
                        </Grid>
                        <Grid item zeroMinWidth xs>
                          <InputWithLabel
                            label="Postal Code"
                            required={true}
                            name="postal_code"
                            type="number"
                            value={form1.values.postal_code}
                            handleChange={(e) =>
                              handleChange(e.target.name, e.target.value)
                            }
                            error={
                              form1.touched.postal_code &&
                              form1.errors.postal_code
                            }
                            errorMessage={
                              form1.touched.postal_code &&
                              form1.errors.postal_code
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
                            value={form1.values.city}
                            handleChange={(e) =>
                              handleChange(e.target.name, e.target.value)
                            }
                            error={form1.touched.city && form1.errors.city}
                            errorMessage={
                              form1.touched.city && form1.errors.city
                            }
                          />
                        </Grid>
                        <Grid item zeroMinWidth xs>
                          <InputWithLabel
                            label="Phone Number"
                            required={true}
                            name="phone"
                            type="number"
                            value={form1.values.phone}
                            handleChange={(e) =>
                              handleChange(e.target.name, e.target.value)
                            }
                            error={form1.touched.phone && form1.errors.phone}
                            errorMessage={
                              form1.touched.phone && form1.errors.phone
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
                        <button
                          type="submit"
                          className={classes.btn}
                          disabled={
                            form1?.errors?.establishment ||
                            form1?.errors?.service ||
                            form1?.errors?.address_1 ||
                            form1?.errors?.po_box ||
                            form1?.errors?.postal_code ||
                            form1?.errors?.phone
                          }
                        >
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
                            value={form2.values.first_name}
                            handleChange={(e) =>
                              handleChange(e.target.name, e.target.value)
                            }
                            error={
                              form2.touched.first_name &&
                              form2.errors.first_name
                            }
                            errorMessage={
                              form2.touched.first_name &&
                              form2.errors.first_name
                            }
                          />
                        </Grid>
                        <Grid item zeroMinWidth xs>
                          <InputWithLabel
                            label="Last Name"
                            required={true}
                            name="last_name"
                            type="text"
                            value={form2.values.last_name}
                            handleChange={(e) =>
                              handleChange(e.target.name, e.target.value)
                            }
                            error={
                              form2.touched.last_name && form2.errors.last_name
                            }
                            errorMessage={
                              form2.touched.last_name && form2.errors.last_name
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
                        value={form2.values.email}
                        handleChange={(e) =>
                          handleChange(e.target.name, e.target.value)
                        }
                        error={form2.touched.email && form2.errors.email}
                        errorMessage={form2.touched.email && form2.errors.email}
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
                            value={form2.values.password}
                            handleChange={(e) =>
                              handleChange(e.target.name, e.target.value)
                            }
                            error={
                              form2.touched.password && form2.errors.password
                            }
                            errorMessage={
                              form2.touched.password && form2.errors.password
                            }
                          />
                        </Grid>
                        <Grid item zeroMinWidth xs>
                          <InputWithLabel
                            label="Confirm Password"
                            required={true}
                            name="confirm_password"
                            type="password"
                            value={form2.values.confirm_password}
                            handleChange={(e) =>
                              handleChange(e.target.name, e.target.value)
                            }
                            error={
                              form2.touched.confirm_password &&
                              form2.errors.confirm_password
                            }
                            errorMessage={
                              form2.touched.confirm_password &&
                              form2.errors.confirm_password
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
                        <button
                          type="submit"
                          className={classes.btn}
                          disabled={
                            form2?.errors?.first_name ||
                            form2?.errors?.last_name ||
                            form2?.errors?.email ||
                            form2?.errors?.password ||
                            form2?.errors?.confirm_password
                          }
                        >
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
