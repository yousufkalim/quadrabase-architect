// init
import React, { useState, useEffect } from "react";
import { useStyles } from "../../css/register";
import api from "../../api";
import { toast } from "react-toastify";
import validate from "validate.js";
import Logo from "../../assets/Quadralogo.png";
import { useHistory } from "react-router-dom";
import moment from "moment";

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

const typeOptions = [
  { _id: "Prescripteur", title: "Prescripteur" },
  { _id: "Fabricant", title: "Fabricant" },
];

const fabricantSubOptions = [
  { _id: "Référencement", title: "Référencement" },
  { _id: "Alertes", title: "Alertes" },
];

// Register Component
const Register = ({ setCurrentPage }) => {
  const classes = useStyles();
  const history = useHistory();

  // states
  const [type, setType] = useState("Prescripteur");
  const [startStepper, setStartStepper] = useState(false);
  const [fabricantSub, setFabricantSub] = useState("Référencement");
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
    if (type === "Prescripteur") {
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
    } else {
      let data = {
        name: form2.values.first_name,
        email: form2.values.email,
        contact_no: form1.values.phone,
        address1: form1.values.address_1,
        address2: form1.values.address_2,
        city: form1.values.city,
        zipcode: form1.values.postal_code,
        po_box: form1.values.po_box,
        establishment: form1.values.establishment,
        subscription: {
          name: fabricantSub,
          start_date: moment(new Date()).add(1, "days").format("YYYY/MM/DD"),
          end_date: moment(new Date())
            .add(1, "years")
            .add(1, "days")
            .format("YYYY/MM/DD"),
        },
      };
      const result = await api("post", `/Providers/create`, data);
      toast.success(result.data.message);
      handleComplete();
    }
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
        {!startStepper ? (
          <Box sx={{ width: "70%" }}>
            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                pt: 2,
                justifyContent: "center",
              }}
            >
              <Typography variant="h4" gutterBottom>
                Choix du Statut
              </Typography>
            </Box>

            <InputDropdown
              required={true}
              name="type"
              value={type}
              options={typeOptions}
              type="text"
              onChange={(e) => setType(e.target.value)}
            />
            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                pt: 2,
                justifyContent: "center",
              }}
            >
              <button
                className={classes.btn}
                onClick={() => setStartStepper(true)}
              >
                Continuez
              </button>
            </Box>
          </Box>
        ) : (
          <Box sx={{ width: "80%" }}>
            <Stepper
              nonLinear
              activeStep={activeStep}
              sx={{
                "& .css-1u4zpwo-MuiSvgIcon-root-MuiStepIcon-root.Mui-active": {
                  color: "#3b373c",
                },
                "& .css-1u4zpwo-MuiSvgIcon-root-MuiStepIcon-root.Mui-completed":
                  {
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
                          {type === "Prescripteur" ? (
                            <Grid container spacing={2}>
                              <Grid item zeroMinWidth xs>
                                <InputWithLabel
                                  label="Nom Etablissement"
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
                                  name="service"
                                  type="text"
                                  value={form1.values.service}
                                  handleChange={(e) =>
                                    handleChange(e.target.name, e.target.value)
                                  }
                                  error={
                                    form1.touched.service &&
                                    form1.errors.service
                                  }
                                  errorMessage={
                                    form1.touched.service &&
                                    form1.errors.service
                                  }
                                />
                              </Grid>
                            </Grid>
                          ) : (
                            <>
                              <InputWithLabel
                                label="Nom Etablissement"
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
                              <br />
                            </>
                          )}

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
                                label="Boite Postale"
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
                              {type === "Prescripteur" ? (
                                <InputWithLabel
                                  label="Code Postal"
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
                              ) : (
                                <InputWithLabel
                                  label="Code Postal"
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
                              )}
                            </Grid>
                          </Grid>
                          <br />
                          <Grid container spacing={2}>
                            <Grid item zeroMinWidth xs>
                              <InputWithLabel
                                label="Ville"
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
                                label="Téléphone"
                                required={true}
                                name="phone"
                                type="number"
                                value={form1.values.phone}
                                handleChange={(e) =>
                                  handleChange(e.target.name, e.target.value)
                                }
                                error={
                                  form1.touched.phone && form1.errors.phone
                                }
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
                                form1?.errors?.address_1 ||
                                form1?.errors?.postal_code ||
                                form1?.errors?.phone
                              }
                              style={{
                                pointerEvents:
                                  (form1?.errors?.establishment ||
                                    form1?.errors?.address_1 ||
                                    form1?.errors?.postal_code ||
                                    form1?.errors?.phone) &&
                                  "none",
                              }}
                            >
                              Valider
                            </button>
                          </Box>
                        </form>
                      </>
                    ) : activeStep === 1 ? (
                      <>
                        <br />
                        <form onSubmit={handleComplete}>
                          {type === "Prescripteur" ? (
                            <>
                              <Grid container spacing={2}>
                                <Grid item zeroMinWidth xs>
                                  <InputWithLabel
                                    label="Prénom"
                                    required={true}
                                    name="first_name"
                                    type="text"
                                    value={form2.values.first_name}
                                    handleChange={(e) =>
                                      handleChange(
                                        e.target.name,
                                        e.target.value
                                      )
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
                                    label="Nom"
                                    required={true}
                                    name="last_name"
                                    type="text"
                                    value={form2.values.last_name}
                                    handleChange={(e) =>
                                      handleChange(
                                        e.target.name,
                                        e.target.value
                                      )
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
                                error={
                                  form2.touched.email && form2.errors.email
                                }
                                errorMessage={
                                  form2.touched.email && form2.errors.email
                                }
                              />
                              <br />
                              <br />
                              <Grid container spacing={2}>
                                <Grid item zeroMinWidth xs>
                                  <InputWithLabel
                                    label="Mot de passe"
                                    required={true}
                                    name="password"
                                    type="password"
                                    value={form2.values.password}
                                    handleChange={(e) =>
                                      handleChange(
                                        e.target.name,
                                        e.target.value
                                      )
                                    }
                                    error={
                                      form2.touched.password &&
                                      form2.errors.password
                                    }
                                    errorMessage={
                                      form2.touched.password &&
                                      form2.errors.password
                                    }
                                  />
                                </Grid>
                                <Grid item zeroMinWidth xs>
                                  <InputWithLabel
                                    label="Confirmer le mot de passe"
                                    required={true}
                                    name="confirm_password"
                                    type="password"
                                    value={form2.values.confirm_password}
                                    handleChange={(e) =>
                                      handleChange(
                                        e.target.name,
                                        e.target.value
                                      )
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
                                  style={{
                                    pointerEvents:
                                      (form2?.errors?.first_name ||
                                        form2?.errors?.last_name ||
                                        form2?.errors?.email ||
                                        form2?.errors?.password ||
                                        form2?.errors?.confirm_password) &&
                                      "none",
                                  }}
                                >
                                  Valider
                                </button>
                              </Box>
                            </>
                          ) : (
                            <>
                              <Grid container spacing={2}>
                                <Grid item zeroMinWidth xs>
                                  <InputWithLabel
                                    label="Nom"
                                    required={true}
                                    name="first_name"
                                    type="text"
                                    value={form2.values.first_name}
                                    handleChange={(e) =>
                                      handleChange(
                                        e.target.name,
                                        e.target.value
                                      )
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
                                    label="Email"
                                    required={true}
                                    name="email"
                                    type="email"
                                    value={form2.values.email}
                                    handleChange={(e) =>
                                      handleChange(
                                        e.target.name,
                                        e.target.value
                                      )
                                    }
                                    error={
                                      form2.touched.email && form2.errors.email
                                    }
                                    errorMessage={
                                      form2.touched.email && form2.errors.email
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
                                    form2?.errors?.first_name ||
                                    form2?.errors?.email
                                  }
                                  style={{
                                    pointerEvents:
                                      (form2?.errors?.first_name ||
                                        form2?.errors?.email) &&
                                      "none",
                                  }}
                                >
                                  Valider
                                </button>
                              </Box>
                            </>
                          )}
                        </form>
                      </>
                    ) : activeStep === 2 ? (
                      <>
                        <br />
                        <form onSubmit={handleComplete}>
                          <div className={classes.mainBox}>
                            {type === "Prescripteur" ? (
                              <>
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
                                      Abonnement
                                    </span>
                                    <div className={classes.borderBox}>
                                      <div className={classes.textContainer}>
                                        <div>Abonnement Initial 1 an</div>
                                        <div>
                                          {subAmounts.initial.price.toFixed(2)}{" "}
                                          € HT
                                        </div>
                                      </div>
                                      <span style={{ fontSize: 12 }}>
                                        (avec 1 pack 5 Projets)
                                      </span>
                                      <div className={classes.textContainer}>
                                        <div>ReAbonnement 1 an</div>
                                        <div>
                                          {subAmounts.extended.price.toFixed(2)}{" "}
                                          € HT
                                        </div>
                                      </div>
                                      <span style={{ fontSize: 12 }}>
                                        (uniquement si déjà abonné)
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
                                      Pack Projets
                                    </span>
                                    <div className={classes.middleBorderBox}>
                                      <div
                                        className={classes.middleTextContainer}
                                      >
                                        <div>Pack de 5 Projets</div>
                                        <div>
                                          {subAmounts.pack.price.toFixed(2)} €
                                          HT
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
                                    <span className={classes.borderText}>
                                      Montant à régler
                                    </span>
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
                                            Durée total :{" "}
                                            {parseInt(
                                              subAmounts.initial.count
                                            ) +
                                              parseInt(
                                                subAmounts.extended.count
                                              )}{" "}
                                            an
                                          </div>
                                          <div>
                                            Nombre de projets :{" "}
                                            {parseInt(subAmounts.pack.count) *
                                              5}
                                          </div>
                                        </div>
                                        <div>
                                          <div
                                            style={{
                                              display: "flex",
                                            }}
                                          >
                                            <div style={{ width: 150 }}>
                                              Total HT :
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
                                            <div style={{ width: 150 }}>
                                              T.V.A 20% :
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
                                            <div style={{ width: 150 }}>
                                              Total T.T.C:
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
                              </>
                            ) : (
                              <>
                                <div
                                  style={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    alignItems: "center",
                                    marginBottom: 5,
                                  }}
                                >
                                  <div
                                    style={{
                                      width: "50%",
                                    }}
                                  >
                                    <span className={classes.borderText}>
                                      Abonnement
                                    </span>
                                    <div className={classes.borderBox}>
                                      <div className={classes.textContainer2}>
                                        <div>Référencement</div>
                                        <div>2,000.00 € HT</div>
                                      </div>
                                      <div className={classes.textContainer}>
                                        <div>Alertes</div>
                                        <div>5,000.00 € HT</div>
                                      </div>
                                      <span style={{ fontSize: 12 }}>
                                        (comprenant le référencement)
                                      </span>
                                    </div>
                                  </div>
                                  <div className={classes.middleBox3}>
                                    <InputDropdown
                                      options={fabricantSubOptions}
                                      height={38}
                                      value={fabricantSub}
                                      onChange={(e) => {
                                        setFabricantSub(e.target.value);
                                      }}
                                      component="register"
                                      first="notDisable"
                                    />
                                  </div>
                                  <div className={classes.rightBox2}>
                                    <span className={classes.borderText}>
                                      Total HT
                                    </span>
                                    <div className={classes.borderBox2}>
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
                                        {fabricantSub === "Alertes" ? (
                                          <>5000.00</>
                                        ) : (
                                          <>2000.00</>
                                        )}{" "}
                                        €
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
                                      Montant à régler
                                    </span>
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
                                            Abonnement sélectionné :{" "}
                                            {fabricantSub}
                                          </div>
                                        </div>
                                        <div>
                                          <div
                                            style={{
                                              display: "flex",
                                            }}
                                          >
                                            <div style={{ width: 150 }}>
                                              Total HT :
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
                                              {fabricantSub === "Alertes" ? (
                                                <>5000.00</>
                                              ) : (
                                                <>2000.00</>
                                              )}{" "}
                                              €
                                            </div>
                                          </div>
                                          <div
                                            style={{
                                              display: "flex",
                                            }}
                                          >
                                            <div style={{ width: 150 }}>
                                              V.A.T 20% :
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
                                              {(fabricantSub === "Alertes"
                                                ? (5000 * 20) / 100
                                                : (2000 * 20) / 100
                                              ).toFixed(2)}{" "}
                                              €
                                            </div>
                                          </div>
                                          <div
                                            style={{
                                              display: "flex",
                                            }}
                                          >
                                            <div style={{ width: 150 }}>
                                              Total T.T.C :
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
                                              {(fabricantSub === "Alertes"
                                                ? (5000 * 20) / 100 + 5000
                                                : (2000 * 20) / 100 + 2000
                                              ).toFixed(2)}{" "}
                                              €
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </>
                            )}
                            <Box
                              sx={{
                                display: "flex",
                                flexDirection: "row",
                                pt: 2,
                                justifyContent: "center",
                              }}
                            >
                              <button type="submit" className={classes.btn}>
                                Valider
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
                            {type === "Prescripteur" ? (
                              <div
                                style={{
                                  width: "100%",
                                }}
                              >
                                <span className={classes.borderText}>
                                  Récapitulatif
                                </span>
                                <div className={classes.page4BorderBox}>
                                  <div style={{ marginBottom: 20 }}>
                                    <div
                                      style={{
                                        display: "flex",
                                        justifyContent: "space-between",
                                      }}
                                    >
                                      <div>Abonnement Initial 1 an</div>
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
                                      <div>ReAbonnement 1 an</div>
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
                                      <div>Pack de 5 Projets</div>
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
                                        <div style={{ width: 150 }}>
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
                                        <div style={{ width: 150 }}>
                                          T.V.A 20% :
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
                                        <div style={{ width: 150 }}>
                                          Total T.T.C :
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
                            ) : (
                              <div
                                style={{
                                  width: "100%",
                                }}
                              >
                                <span className={classes.borderText}>
                                  Récapitulatif
                                </span>
                                <div className={classes.page4BorderBox}>
                                  <div style={{ marginBottom: 30 }}>
                                    <div
                                      style={{
                                        display: "flex",
                                        justifyContent: "space-between",
                                      }}
                                    >
                                      <div>Alertes abonnement</div>
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
                                        <div> 5000 €</div>
                                        <div>
                                          {fabricantSub === "Alertes" ? (
                                            <>1</>
                                          ) : (
                                            <>0</>
                                          )}
                                        </div>
                                        <div>
                                          {fabricantSub === "Alertes" ? (
                                            <>5000</>
                                          ) : (
                                            <>0</>
                                          )}
                                          €
                                        </div>
                                      </div>
                                    </div>
                                    <div
                                      style={{
                                        display: "flex",
                                        justifyContent: "space-between",
                                        marginTop: 10,
                                      }}
                                    >
                                      <div>Référencement abonnement</div>
                                      <div
                                        style={{
                                          backgroundColor: "white",
                                          padding: "1px 10px",
                                          marginBottom: 15,
                                          width: 200,
                                          display: "flex",
                                          justifyContent: "space-between",
                                        }}
                                      >
                                        <div> 2000 €</div>
                                        <div>
                                          {fabricantSub === "Référencement" ? (
                                            <>1</>
                                          ) : (
                                            <>0</>
                                          )}
                                        </div>
                                        <div>
                                          {fabricantSub === "Référencement" ? (
                                            <>2000</>
                                          ) : (
                                            <>0</>
                                          )}
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
                                        <div style={{ width: 150 }}>
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
                                          {fabricantSub === "Référencement" ? (
                                            <>2000</>
                                          ) : (
                                            <>5000</>
                                          )}{" "}
                                          €
                                        </div>
                                      </div>
                                      <div
                                        style={{
                                          display: "flex",
                                        }}
                                      >
                                        <div style={{ width: 150 }}>
                                          T.V.A 20% :
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
                                          {(fabricantSub === "Alertes"
                                            ? (5000 * 20) / 100
                                            : (2000 * 20) / 100
                                          ).toFixed(2)}{" "}
                                          €
                                        </div>
                                      </div>
                                      <div
                                        style={{
                                          display: "flex",
                                        }}
                                      >
                                        <div style={{ width: 150 }}>
                                          Total T.T.C :
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
                                          {(fabricantSub === "Alertes"
                                            ? (5000 * 20) / 100 + 5000
                                            : (2000 * 20) / 100 + 2000
                                          ).toFixed(2)}{" "}
                                          €
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            )}
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
                                Mode de paiement
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
                              style={{
                                pointerEvents:
                                  (!completed[0] ||
                                    !completed[1] ||
                                    !completed[2]) &&
                                  "none",
                              }}
                            >
                              Valider
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
        )}
      </div>
    </div>
  );
};

export default Register;
