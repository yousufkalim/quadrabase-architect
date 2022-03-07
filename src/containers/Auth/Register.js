// init
import React, { useState, useEffect } from "react";
import { useStyles } from "../../css/register";
import api from "../../api";
import { toast } from "react-toastify";
import validate from "validate.js";
import Logo from "../../assets/Quadralogo.png";
import { useHistory } from "react-router-dom";

// component
import Box from "@mui/material/Box";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepButton from "@mui/material/StepButton";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import InputWithLabel from "../../components/InputWithLabel";
import InputDropdown from "../../components/InputDropdown";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";

const steps = [
  "General information",
  "Login information",
  "Subscription package",
  "Payment",
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

const options = [
  { _id: 1, title: 1 },
  { _id: 2, title: 2 },
  { _id: 3, title: 3 },
  { _id: 4, title: 4 },
  { _id: 5, title: 5 },
];

// Register Component
const Register = ({ setCurrentPage }) => {
  const classes = useStyles();
  const history = useHistory();

  // states
  const [activeStep, setActiveStep] = useState(0);
  const [completed, setCompleted] = useState({});
  const [invoiceUrl, setInvoiceUrl] = useState("");
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

  const [subAmounts, setSubAmount] = useState({
    initial: {
      count: 1,
      price: 1190,
    },
    extended: {
      count: 0,
      price: 1190,
    },
    pack: {
      count: 1,
      price: 500,
    },
  });
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
    // to creating account
    let data = {
      establishment: form1.values.establishment,
      service: form1.values.service,
      address_1: form1.values.address_1,
      address_2: form1.values.address_2,
      po_box: form1.values.po_box,
      postal_code: form1.values.postal_code,
      city: form1.values.city,
      phone: form1.values.phone,
      last_name: form2.values.last_name,
      first_name: form2.values.first_name,
      email: form2.values.email,
      password: form2.values.password,
      confirm_password: form2.values.confirm_password,
      subscription: {
        duration:
          (parseInt(subAmounts.initial.count) +
            parseInt(subAmounts.extended.count)) *
          12,
        projects: parseInt(subAmounts.pack.count) * 5,
      },
    };
    const result = await api("post", `/Architects/signup`, data);
    toast.success(result.data.message);
    // to generate invoice
    let invoiceData = {
      address1: form1.values.address_1,
      initialPrice: subAmounts.initial.price,
      initialCount: subAmounts.initial.count,
      extendedPrice: subAmounts.extended.price,
      extendedCount: subAmounts.extended.count,
      packPrice: subAmounts.pack.price,
      packCount: subAmounts.pack.count,
      totalHT:
        subAmounts.initial.price * subAmounts.initial.count +
        subAmounts.extended.price * subAmounts.extended.count +
        subAmounts.pack.price * subAmounts.pack.count,
      tvaPercentage: 20,
      tvaAmount:
        ((subAmounts.initial.price * subAmounts.initial.count +
          subAmounts.extended.price * subAmounts.extended.count +
          subAmounts.pack.price * subAmounts.pack.count) *
          20) /
        100,
      TotalCost:
        ((subAmounts.initial.price * subAmounts.initial.count +
          subAmounts.extended.price * subAmounts.extended.count +
          subAmounts.pack.price * subAmounts.pack.count) *
          20) /
          100 +
        subAmounts.initial.price * subAmounts.initial.count +
        subAmounts.extended.price * subAmounts.extended.count +
        subAmounts.pack.price * subAmounts.pack.count,
      paymentMode: "Card",
    };
    const result2 = await api("post", `/Architects/download`, invoiceData);
    setInvoiceUrl(result2.data.path);
    handleComplete();
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
    e?.preventDefault();
    if (activeStep === 1) {
      if (form2.values.password !== form2.values.confirm_password) {
        toast.error("Password and confirm password does not match!");
      } else {
        const newCompleted = completed;
        newCompleted[activeStep] = true;
        setCompleted(newCompleted);
        handleNext();
      }
    } else {
      const newCompleted = completed;
      newCompleted[activeStep] = true;
      setCompleted(newCompleted);
      handleNext();
    }
  };

  const handleReset = () => {
    setActiveStep(0);
    setCompleted({});
  };

  // returning jsx
  return (
    <div className={classes.mainContainer}>
      {/* left container */}
      <div className={classes.left}>
        {/* Welcome text and login button */}
        <div className={classes.leftContent}>
          <img src={Logo} alt="" />
          <button
            type="submit"
            className={classes.btnLogin}
            onClick={() => {
              history.push("/");
            }}
          >
            Login
          </button>
        </div>
      </div>
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
                  All steps completed -{" "}
                  <a href={invoiceUrl} target="_blank">
                    View invoice
                  </a>
                </Typography>
                <Box sx={{ display: "flex", flexDirection: "row", pt: 2 }}>
                  <Box sx={{ flex: "1 1 auto" }} />
                  <Button onClick={() => setCurrentPage("login")}>
                    Proceed to login
                  </Button>
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
                                form1.touched.address_1 &&
                                form1.errors.address_1
                              }
                              errorMessage={
                                form1.touched.address_1 &&
                                form1.errors.address_1
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
                              error={
                                form1.touched.po_box && form1.errors.po_box
                              }
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
                                form2.touched.last_name &&
                                form2.errors.last_name
                              }
                              errorMessage={
                                form2.touched.last_name &&
                                form2.errors.last_name
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
                          errorMessage={
                            form2.touched.email && form2.errors.email
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
                  ) : activeStep === 2 ? (
                    <>
                      <br />
                      <form onSubmit={handleComplete}>
                        <div className={classes.mainBox}>
                          {/* Top section */}
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "space-between",
                              marginBottom: 5,
                            }}
                          >
                            <div
                              style={{
                                width: "55%",
                              }}
                            >
                              <span className={classes.borderText}>
                                Subscription
                              </span>
                              <div className={classes.borderBox}>
                                <div className={classes.textContainer}>
                                  <div>Initial subscription for 1 year</div>
                                  <div>
                                    {subAmounts.initial.price.toFixed(2)} € HT
                                  </div>
                                </div>
                                <span style={{ fontSize: 12 }}>
                                  (1 year, 5 projects)
                                </span>
                                <div className={classes.textContainer}>
                                  <div>Extend subscription for 1 year</div>
                                  <div>
                                    {subAmounts.extended.price.toFixed(2)} € HT
                                  </div>
                                </div>
                                <span style={{ fontSize: 12 }}>
                                  (extend date of subscription)
                                </span>
                              </div>
                            </div>
                            <div className={classes.middleBox}>
                              <div style={{ marginBottom: 5 }}>
                                <InputDropdown
                                  options={options}
                                  height={38}
                                  disabled={true}
                                  value={subAmounts.initial.count}
                                  component="register"
                                />
                              </div>
                              <InputDropdown
                                options={options}
                                height={38}
                                value={subAmounts.extended.count}
                                onChange={(e) => {
                                  setSubAmount((prev) => {
                                    prev.extended.count = e.target.value;
                                    return { ...prev };
                                  });
                                }}
                                component="register"
                                first="notDisable"
                              />
                            </div>
                            <div className={classes.rightBox}>
                              <span className={classes.borderText}>
                                Total HT
                              </span>
                              <div className={classes.borderBox}>
                                <div
                                  style={{
                                    position: "relative",
                                    zIndex: 1,
                                    width: "100%",
                                    textAlign: "right",
                                    backgroundColor: "white",
                                    padding: 7,
                                    marginBottom: 5,
                                  }}
                                >
                                  {subAmounts.initial.price.toFixed(2)} €
                                </div>
                                <div
                                  style={{
                                    width: "100%",
                                    textAlign: "right",
                                    backgroundColor: "white",
                                    padding: 7,
                                  }}
                                >
                                  {(
                                    subAmounts.extended.count *
                                    subAmounts.extended.price
                                  ).toFixed(2)}{" "}
                                  €
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* middle Section */}
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "space-between",
                              marginBottom: 5,
                            }}
                          >
                            <div
                              style={{
                                width: "55%",
                              }}
                            >
                              <span className={classes.borderText}>
                                Projects Pack
                              </span>
                              <div className={classes.middleBorderBox}>
                                <div className={classes.middleTextContainer}>
                                  <div>Pack of 5 projects</div>
                                  <div>
                                    {subAmounts.pack.price.toFixed(2)} € HT
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className={classes.middleBox2}>
                              <InputDropdown
                                options={options}
                                height={38}
                                value={subAmounts.pack.count}
                                onChange={(e) => {
                                  setSubAmount((prev) => {
                                    prev.pack.count = e.target.value;
                                    return { ...prev };
                                  });
                                }}
                                component="register"
                              />
                            </div>
                            <div className={classes.rightBox}>
                              <span className={classes.borderText}>
                                Total HT
                              </span>
                              <div className={classes.middleBorderBox}>
                                <div
                                  style={{
                                    position: "relative",
                                    zIndex: 1,
                                    width: "100%",
                                    textAlign: "right",
                                    backgroundColor: "white",
                                    padding: 3,
                                    marginBottom: 5,
                                  }}
                                >
                                  {(
                                    subAmounts.pack.count *
                                    subAmounts.pack.price
                                  ).toFixed(2)}{" "}
                                  €
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* bottom  section */}
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "space-between",
                              marginBottom: 5,
                            }}
                          >
                            <div
                              style={{
                                width: "100%",
                              }}
                            >
                              <span className={classes.borderText}>Total</span>
                              <div className={classes.borderBox}>
                                <div
                                  style={{
                                    height: "100%",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "space-between",
                                  }}
                                >
                                  <div>
                                    <div>
                                      Total duration:{" "}
                                      {parseInt(subAmounts.initial.count) +
                                        parseInt(
                                          subAmounts.extended.count
                                        )}{" "}
                                      year
                                    </div>
                                    <div>
                                      Number of projects:{" "}
                                      {parseInt(subAmounts.pack.count) * 5}
                                    </div>
                                  </div>
                                  <div>
                                    <div
                                      style={{
                                        display: "flex",
                                      }}
                                    >
                                      <div style={{ width: 120 }}>
                                        Total HT:
                                      </div>
                                      &nbsp;&nbsp;&nbsp;&nbsp;
                                      <div
                                        style={{
                                          position: "relative",
                                          zIndex: 1,
                                          width: "80%",
                                          textAlign: "right",
                                          backgroundColor: "white",
                                          padding: 1,
                                          marginBottom: 3,
                                        }}
                                      >
                                        {(
                                          subAmounts.initial.price *
                                            subAmounts.initial.count +
                                          subAmounts.extended.price *
                                            subAmounts.extended.count +
                                          subAmounts.pack.price *
                                            subAmounts.pack.count
                                        ).toFixed(2)}{" "}
                                        €
                                      </div>
                                    </div>
                                    <div
                                      style={{
                                        display: "flex",
                                      }}
                                    >
                                      <div style={{ width: 120 }}>VAT 20%:</div>
                                      &nbsp;&nbsp;&nbsp;&nbsp;
                                      <div
                                        style={{
                                          position: "relative",
                                          zIndex: 1,
                                          width: "80%",
                                          textAlign: "right",
                                          backgroundColor: "white",
                                          padding: 1,
                                          marginBottom: 3,
                                        }}
                                      >
                                        {(
                                          ((subAmounts.initial.price *
                                            subAmounts.initial.count +
                                            subAmounts.extended.price *
                                              subAmounts.extended.count +
                                            subAmounts.pack.price *
                                              subAmounts.pack.count) *
                                            20) /
                                          100
                                        ).toFixed(2)}{" "}
                                        €
                                      </div>
                                    </div>
                                    <div
                                      style={{
                                        display: "flex",
                                      }}
                                    >
                                      <div style={{ width: 120 }}>
                                        Total cost:
                                      </div>
                                      &nbsp;&nbsp;&nbsp;&nbsp;
                                      <div
                                        style={{
                                          position: "relative",
                                          zIndex: 1,
                                          width: "80%",
                                          textAlign: "right",
                                          backgroundColor: "white",
                                          padding: 1,
                                          marginBottom: 3,
                                        }}
                                      >
                                        {(
                                          ((subAmounts.initial.price *
                                            subAmounts.initial.count +
                                            subAmounts.extended.price *
                                              subAmounts.extended.count +
                                            subAmounts.pack.price *
                                              subAmounts.pack.count) *
                                            20) /
                                            100 +
                                          subAmounts.initial.price *
                                            subAmounts.initial.count +
                                          subAmounts.extended.price *
                                            subAmounts.extended.count +
                                          subAmounts.pack.price *
                                            subAmounts.pack.count
                                        ).toFixed(2)}{" "}
                                        €
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>

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
                        </div>
                      </form>
                    </>
                  ) : (
                    <>
                      <br />
                      <form onSubmit={handleFinish}>
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            marginBottom: 5,
                          }}
                        >
                          <div
                            style={{
                              width: "100%",
                            }}
                          >
                            <span className={classes.borderText}>Review</span>
                            <div className={classes.page4BorderBox}>
                              <div style={{ marginBottom: 20 }}>
                                <div
                                  style={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                  }}
                                >
                                  <div>Initial subscription for 1 year</div>
                                  <div
                                    style={{
                                      backgroundColor: "white",
                                      padding: "1px 10px",
                                      marginBottom: 5,
                                      width: 200,
                                      display: "flex",
                                      justifyContent: "space-between",
                                    }}
                                  >
                                    <div>{subAmounts.initial.price} €</div>
                                    <div>{subAmounts.initial.count}</div>
                                    <div>
                                      {subAmounts.initial.price *
                                        subAmounts.initial.count}{" "}
                                      €
                                    </div>
                                  </div>
                                </div>
                                <div
                                  style={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                  }}
                                >
                                  <div>Extend subscription for 1 year</div>
                                  <div
                                    style={{
                                      backgroundColor: "white",
                                      padding: "1px 10px",
                                      marginBottom: 5,
                                      width: 200,
                                      display: "flex",
                                      justifyContent: "space-between",
                                    }}
                                  >
                                    <div>{subAmounts.extended.price} €</div>
                                    <div>{subAmounts.extended.count}</div>
                                    <div>
                                      {subAmounts.extended.price *
                                        subAmounts.extended.count}{" "}
                                      €
                                    </div>
                                  </div>
                                </div>
                                <div
                                  style={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                  }}
                                >
                                  <div>Pack of 5 projects</div>
                                  <div
                                    style={{
                                      backgroundColor: "white",
                                      padding: "1px 10px",
                                      marginBottom: 7,
                                      width: 200,
                                      display: "flex",
                                      justifyContent: "space-between",
                                    }}
                                  >
                                    <div>{subAmounts.pack.price} €</div>
                                    <div>{subAmounts.pack.count}</div>
                                    <div>
                                      {subAmounts.pack.price *
                                        subAmounts.pack.count}{" "}
                                      €
                                    </div>
                                  </div>
                                </div>
                                <div
                                  style={{
                                    width: "100%",
                                    height: 2,
                                    backgroundColor: "lightgray",
                                  }}
                                ></div>
                              </div>

                              <div
                                style={{
                                  height: "35%",
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "flex-end",
                                }}
                              >
                                <div>
                                  <div
                                    style={{
                                      display: "flex",
                                    }}
                                  >
                                    <div style={{ width: 120 }}>Total HT:</div>
                                    &nbsp;&nbsp;&nbsp;&nbsp;
                                    <div
                                      style={{
                                        position: "relative",
                                        zIndex: 1,
                                        width: "80%",
                                        textAlign: "right",
                                        backgroundColor: "white",
                                        padding: 1,
                                        marginBottom: 3,
                                      }}
                                    >
                                      {(
                                        subAmounts.initial.price *
                                          subAmounts.initial.count +
                                        subAmounts.extended.price *
                                          subAmounts.extended.count +
                                        subAmounts.pack.price *
                                          subAmounts.pack.count
                                      ).toFixed(2)}{" "}
                                      €
                                    </div>
                                  </div>
                                  <div
                                    style={{
                                      display: "flex",
                                    }}
                                  >
                                    <div style={{ width: 120 }}>VAT 20%:</div>
                                    &nbsp;&nbsp;&nbsp;&nbsp;
                                    <div
                                      style={{
                                        position: "relative",
                                        zIndex: 1,
                                        width: "80%",
                                        textAlign: "right",
                                        backgroundColor: "white",
                                        padding: 1,
                                        marginBottom: 3,
                                      }}
                                    >
                                      {(
                                        ((subAmounts.initial.price *
                                          subAmounts.initial.count +
                                          subAmounts.extended.price *
                                            subAmounts.extended.count +
                                          subAmounts.pack.price *
                                            subAmounts.pack.count) *
                                          20) /
                                        100
                                      ).toFixed(2)}{" "}
                                      €
                                    </div>
                                  </div>
                                  <div
                                    style={{
                                      display: "flex",
                                    }}
                                  >
                                    <div style={{ width: 120 }}>
                                      Total cost:
                                    </div>
                                    &nbsp;&nbsp;&nbsp;&nbsp;
                                    <div
                                      style={{
                                        position: "relative",
                                        zIndex: 1,
                                        width: "80%",
                                        textAlign: "right",
                                        backgroundColor: "white",
                                        padding: 1,
                                        marginBottom: 3,
                                      }}
                                    >
                                      {(
                                        ((subAmounts.initial.price *
                                          subAmounts.initial.count +
                                          subAmounts.extended.price *
                                            subAmounts.extended.count +
                                          subAmounts.pack.price *
                                            subAmounts.pack.count) *
                                          20) /
                                          100 +
                                        subAmounts.initial.price *
                                          subAmounts.initial.count +
                                        subAmounts.extended.price *
                                          subAmounts.extended.count +
                                        subAmounts.pack.price *
                                          subAmounts.pack.count
                                      ).toFixed(2)}{" "}
                                      €
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            marginBottom: 5,
                          }}
                        >
                          <div
                            style={{
                              width: "100%",
                            }}
                          >
                            <span className={classes.borderText}>
                              Payment Method
                            </span>
                            <div className={classes.page4BottomBorderBox}>
                              <FormControl>
                                <RadioGroup
                                  row
                                  aria-labelledby="demo-row-radio-buttons-group-label"
                                  name="row-radio-buttons-group"
                                >
                                  <FormControlLabel
                                    value="card"
                                    control={<Radio />}
                                    label="Card"
                                  />
                                  <FormControlLabel
                                    value="sepa"
                                    control={<Radio />}
                                    label="SEPA"
                                  />
                                </RadioGroup>
                              </FormControl>
                            </div>
                          </div>
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
                            disabled={
                              !completed[0] || !completed[1] || !completed[2]
                            }
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
    </div>
  );
};

export default Register;
