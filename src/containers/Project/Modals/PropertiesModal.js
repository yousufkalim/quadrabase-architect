// init
import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { useStyles } from "../../../css/projectView";
import { Store } from "../../../StoreContext";
import api from "../../../api";
import { toast } from "react-toastify";
import styled from "@emotion/styled";

// components
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import { Button, Grid } from "@mui/material";
import InputWithLabel from "../../../components/InputWithLabel";
import InputDropdown from "../../../components/InputDropdown";
import RowRadioButtonsGroup from "../component/RadioGroup";
import InputWithOptions from "../../../components/InputWithOptions";

const Textarea = styled.textarea`
  margin-right: 4rem;
  width: 100%;
  font-size: 1rem;
  padding: 10px;
  border: 1px solid lightgrey;
  border-radius: 3px;
  outline: none;
  font-family: Arial, Helvetica, sans-serif;
  &:focus {
    border: 2px solid #1a76d2;
    color: black;
    &::-webkit-input-placeholder {
      transition: opacity 250ms ease;
      opacity: 0;
    }
    &::-moz-placeholder {
      transition: opacity 250ms ease;
      opacity: 0;
    }
    &:-ms-placeholder {
      transition: opacity 250ms ease;
      opacity: 0;
    }
  }
`;

const TOC = [
  {
    value: "Simple",
    label: "Simple",
  },
  {
    value: "Trades",
    label: "Trades",
  },
  {
    value: "TradesAndTranches",
    label: "Trades And Tranches",
  },
  {
    value: "PurchaseOrder",
    label: "Purchase Order",
  },
];

const TOP = [
  {
    value: "DQEAndBPU",
    label: "DQE And BPU",
  },
  {
    value: "DPGF",
    label: "DPGF",
  },
];

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

// component
const PropertiesModal = ({ handleOpenPropertiesModal, currentProject }) => {
  const classes = useStyles();

  //  States
  const [values, setValues] = useState({
    name: "",
    prescriber: "",
    vat: "",
    reference: "",
    description: "",
    chap0part2: "",
  });

  const [values2, setValues2] = useState({
    market_type: "Simple",
    structure: "DQEAndBPU",
  });
  const [values3, setValues3] = useState({
    stakeholders: [],
  });

  const [options, setOptions] = useState([]);
  const [chapOptions, setChapOptions] = useState([]);
  const [stakeholderOptions, setStakeholderOptions] = useState([]);
  const [value, setValue] = useState(0);

  //   useEffect to get vat
  useEffect(() => {
    if (currentProject) {
      setValues((prev) => {
        prev.name = currentProject.name;
        prev.prescriber = currentProject.prescriber;
        prev.vat = currentProject.vat._id;
        prev.reference = currentProject.reference
          ? currentProject.reference
          : "";
        prev.description = currentProject.description
          ? currentProject.description
          : "";
        prev.chap0part2 = currentProject.chap0part2
          ? currentProject.chap0part2
          : "";
        return { ...prev };
      });
      setValues2((prev) => {
        prev.market_type = currentProject.market_type;
        prev.structure = currentProject.structure;
        return { ...prev };
      });
      setValues3((prev) => {
        prev.stakeholders = currentProject.stakeholders;
        return { ...prev };
      });
    }

    getVat();
    getChap0Part2();
    getStakeholders();
  }, [currentProject]);

  //   func to get stakeholders
  const getStakeholders = async () => {
    try {
      const result = await api("get", `/Stakeholders/`);
      console.log("stakeholders", result.data);
      setStakeholderOptions(result.data.stakeholders);
    } catch (error) {
      if (error.response) console.log(error.response.data.message, "error ");
    }
  };

  //   func to get vat
  const getVat = async () => {
    try {
      const result = await api("get", `/VAT/getAll`);
      setOptions(result?.data?.vat);
    } catch (error) {
      if (error.response) console.log(error.response.data.message, "error ");
    }
  };

  //   func to get Chap0Part2Data
  const getChap0Part2 = async () => {
    try {
      const result = await api(
        "get",
        `/ArchitectsChap0/current/architectchap0part2`
      );
      setChapOptions(result.data.architectsChap0);
    } catch (error) {
      if (error.response) console.log(error.response.data.message, "error ");
    }
  };

  // handle change function
  const handleChange = (name, value) => {
    setValues((prev) => {
      prev[name] = value;
      return { ...prev };
    });
  };

  // handle change function
  const handleChange2 = (name, value) => {
    setValues2((prev) => {
      prev[name] = value;
      return { ...prev };
    });
  };

  // handle change for stakeholders
  const handleStakeholdersChange = (event) => {
    const {
      target: { value },
    } = event;
    let temp = typeof value === "string" ? value.split(",") : value;
    setValues3((prev) => {
      prev.stakeholders = temp;
      return { ...prev };
    });
  };

  //   handle submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let data = values;
      !values.reference && delete data.reference;
      !values.description && delete data.description;
      !values.chap0part2 && delete data.chap0part2;
      console.log(data);
      const result = await api("put", `/project/${currentProject._id}`, data);
      toast.success(result.data.message);
      handleOpenPropertiesModal();
    } catch (err) {
      toast.error(err.response.data.message);
    }
  };

  //   handle submit
  const handleSubmit2 = async (e) => {
    e.preventDefault();
    try {
      const result = await api(
        "put",
        `/project/${currentProject._id}`,
        values2
      );
      toast.success(result.data.message);
      handleOpenPropertiesModal();
    } catch (err) {
      toast.error(err.response.data.message);
    }
  };
  //   handle submit
  const handleSubmit3 = async () => {
    try {
      const result = await api(
        "put",
        `/project/${currentProject._id}`,
        values3
      );
      toast.success(result.data.message);
      handleOpenPropertiesModal();
    } catch (err) {
      toast.error(err.response.data.message);
    }
  };

  const handleTabChange = (event, newValue) => {
    setValue(newValue);
  };
  return (
    <Box sx={{ width: "45vw" }}>
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs value={value} onChange={handleTabChange}>
          <Tab label="Project References" {...a11yProps(0)} />
          <Tab label="Market Type / Structure" {...a11yProps(1)} />
          <Tab label="Speakers" {...a11yProps(2)} />
        </Tabs>
      </Box>
      <TabPanel value={value} index={0}>
        <form className={classes.form} onSubmit={handleSubmit}>
          {/* All fields */}
          <InputWithLabel
            label="Name"
            required={true}
            name="name"
            type="text"
            value={values.name}
            handleChange={(e) => handleChange(e.target.name, e.target.value)}
          />
          <br />
          <br />
          <Grid container spacing={2}>
            <Grid item zeroMinWidth xs>
              <InputWithLabel
                label="Prescriber"
                required={true}
                name="prescriber"
                value={values.prescriber}
                handleChange={(e) =>
                  handleChange(e.target.name, e.target.value)
                }
                type="text"
              />
            </Grid>
            <Grid item zeroMinWidth xs>
              <InputDropdown
                label="VAT"
                required={true}
                name="vat"
                value={values.vat}
                options={options}
                type="text"
                onChange={(e) => handleChange(e.target.name, e.target.value)}
              />
            </Grid>
          </Grid>
          <br />
          <InputWithLabel
            label="Reference"
            name="reference"
            type="text"
            value={values.reference}
            handleChange={(e) => handleChange(e.target.name, e.target.value)}
          />
          <br />
          <br />
          <label htmlFor="grid-first-name" style={{ color: "gray" }}>
            Description
          </label>
          <Textarea
            name="description"
            type="text"
            value={values.description}
            onChange={(e) => handleChange(e.target.name, e.target.value)}
          />
          <br />
          <br />
          <InputDropdown
            label="Chap. 0 part 2"
            name="chap0part2"
            value={values.chap0part2}
            options={chapOptions}
            type="text"
            onChange={(e) => handleChange(e.target.name, e.target.value)}
          />
          <br />
          {/* register button */}
          <div style={{ width: "100%", textAlign: "right" }}>
            <Button variant="contained" className={classes.btn} type="submit">
              Update
            </Button>
          </div>
        </form>
      </TabPanel>
      <TabPanel value={value} index={1}>
        <form className={classes.form} onSubmit={handleSubmit2}>
          {/* All fields */}
          <RowRadioButtonsGroup
            row={true}
            label="Type of Contract"
            data={TOC}
            value={values2.market_type}
            name="market_type"
            handleChange={(e) => handleChange2(e.target.name, e.target.value)}
            disabled={true}
          />
          <br />
          <RowRadioButtonsGroup
            row={true}
            label="Type of Project"
            data={TOP}
            value={values2.structure}
            name="structure"
            handleChange={(e) => handleChange2(e.target.name, e.target.value)}
          />
          {/* register button */}
          <div style={{ width: "100%", textAlign: "right" }}>
            <Button variant="contained" className={classes.btn} type="submit">
              Update
            </Button>
          </div>
        </form>
      </TabPanel>
      <TabPanel value={value} index={2}>
        <InputWithOptions
          label="Select Family"
          required={true}
          name="family"
          value={values3.stakeholders}
          handleChange={(e) => handleStakeholdersChange(e)}
          options={stakeholderOptions}
        />
        <br />
        {/* register button */}
        <div style={{ width: "100%", textAlign: "right" }}>
          <Button
            variant="contained"
            className={classes.btn}
            onClick={handleSubmit3}
          >
            Update
          </Button>
        </div>
      </TabPanel>
    </Box>
  );
};

export default PropertiesModal;
