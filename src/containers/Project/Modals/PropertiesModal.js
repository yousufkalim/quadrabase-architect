// init
import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { useStyles } from "../../../css/projectView";
import api from "../../../api";
import { toast } from "react-toastify";
import styled from "@emotion/styled";
import { useTranslation } from "react-i18next";

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
import { TextField } from "@mui/material";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";

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
const PropertiesModal = ({
  handleOpenPropertiesModal,
  currentProject,
  getProject,
}) => {
  const { t } = useTranslation();
  const classes = useStyles();

  //  States
  const [values, setValues] = useState({
    name: "",
    prescriber: "",
    vat: "",
    reference: "",
    description: "",
    chap0part2: "",
    architectStakeholder: [],
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
  const [typeOptions, setTypeOptions] = useState([]);
  const [typeValue, setTypeValue] = useState("");
  const [stakeholderOptions, setStakeholderOptions] = useState([]);
  const [stakeholderOptions2, setStakeholderOptions2] = useState([]);
  const [selectedStakeholder, setSelectedStakeholder] = useState("");
  const [value, setValue] = useState(0);

  //   useEffect to get vat
  useEffect(() => {
    if (currentProject) {
      setValues((prev) => {
        prev.name = currentProject?.name;
        prev.prescriber = currentProject?.prescriber;
        prev.vat = currentProject?.vat?._id;
        prev.reference = currentProject?.reference
          ? currentProject?.reference
          : "";
        prev.description = currentProject?.description
          ? currentProject?.description
          : "";
        prev.chap0part2 = currentProject?.chap0part2
          ? currentProject?.chap0part2?.id?._id
          : "";
        return { ...prev };
      });
      setValues2((prev) => {
        prev.market_type = currentProject?.market_type;
        prev.structure = currentProject?.structure;
        return { ...prev };
      });
      setValues3((prev) => {
        prev.stakeholders = currentProject?.stakeholders;
        return { ...prev };
      });
      setSelectedStakeholder(currentProject?.architectStakeholder);
    }

    getVat();
    getChap0Part2();
    getTypes();
    currentProject?.stakeholders[0] && getCurrentType();
  }, [currentProject]);

  useEffect(() => {
    getStakeholders();
  }, [typeValue]);
  useEffect(() => {
    getStakeholders2();
  }, []);

  const getCurrentType = async () => {
    const result = await api(
      "get",
      `/StakeholderTypes/getByStakeholder/${currentProject?.stakeholders[0]}`
    );
    setTypeValue(result.data.type._id);
  };

  // func to getAll Units
  const getTypes = async () => {
    const result = await api("get", `/StakeholderTypes/`);
    setTypeOptions(result.data.stakeholderTypes);
  };

  //   func to get stakeholders
  const getStakeholders = async () => {
    if (typeValue) {
      const result = await api("get", `/Stakeholders/getByType/${typeValue}`);
      setStakeholderOptions(result.data.stakeholder);
    }
  };

  //   func to get stakeholders
  const getStakeholders2 = async () => {
    const result = await api("get", `/Stakeholders/`);
    setStakeholderOptions2(result.data.stakeholders);
  };

  //   func to get vat
  const getVat = async () => {
    const result = await api("get", `/VAT/getAll`);
    setOptions(result?.data?.vat.sort((a, b) => a.value - b.value));
  };

  //   func to get Chap0Part2Data
  const getChap0Part2 = async () => {
    const result = await api("get", `/ArchitectsChap0/current/getByProject`);
    setChapOptions(result.data.data);
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

  const removeStakeholder = (id) => {
    let temp = [];
    temp = values3.stakeholders.filter((item) => item !== id);
    setValues3((prev) => {
      prev.stakeholders = temp;
      return { ...prev };
    });
  };

  //   handle submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    let data = values;
    !values.reference && delete data.reference;
    !values.description && delete data.description;
    values.architectStakeholder = selectedStakeholder && selectedStakeholder;
    if (
      !values.chap0part2 ||
      (currentProject.chap0part2 &&
        currentProject.chap0part2.id._id == data.chap0part2)
    ) {
      delete data.chap0part2;
    } else {
      chapOptions?.architectsChap0?.map((item) => {
        if (item._id == data.chap0part2) {
          data.chap0part2 = { id: values.chap0part2, status: "selected" };
        }
      });
      if (!data.chap0part2.status) {
        data.chap0part2 = { id: values.chap0part2, status: "modified" };
      }
    }
    const result = await api("put", `/project/${currentProject._id}`, data, t);
    toast.success(t(result.data.message));
    handleOpenPropertiesModal();
    getProject();
  };

  //   handle submit
  const handleSubmit2 = async (e) => {
    e.preventDefault();
    const result = await api(
      "put",
      `/project/${currentProject._id}`,
      values2,
      t
    );
    toast.success(t(result.data.message));
    handleOpenPropertiesModal();
    getProject();
  };
  //   handle submit
  const handleSubmit3 = async () => {
    const result = await api(
      "put",
      `/project/${currentProject._id}`,
      values3,
      t
    );
    toast.success(t(result.data.message));
    handleOpenPropertiesModal();
    getProject();
  };

  const handleTabChange = (event, newValue) => {
    setValue(newValue);
  };
  return (
    <Box sx={{ width: "45vw" }}>
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs value={value} onChange={handleTabChange}>
          <Tab label={t("Project References")} {...a11yProps(0)} />
          <Tab label={t("Market Type / Structure")} {...a11yProps(1)} />
          <Tab label={t("Stakeholders")} {...a11yProps(2)} />
        </Tabs>
      </Box>
      <TabPanel value={value} index={0}>
        <form className={classes.form} onSubmit={handleSubmit}>
          {/* All fields */}
          <InputWithLabel
            label={t("Name")}
            name="name"
            type="text"
            value={values.name}
            handleChange={(e) => handleChange(e.target.name, e.target.value)}
          />
          <br />
          <br />

          <InputDropdown
            label={t("Stakeholders")}
            name="stakeholder"
            value={selectedStakeholder}
            options={stakeholderOptions2}
            type="text"
            onChange={(e) => setSelectedStakeholder(e.target.value)}
          />
          <br />
          <Grid container spacing={2}>
            <Grid item zeroMinWidth xs>
              <InputWithLabel
                label={t("Prescriber")}
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
                label={t("VAT")}
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
            label={t("Reference")}
            name="reference"
            type="text"
            value={values.reference}
            handleChange={(e) => handleChange(e.target.name, e.target.value)}
          />
          <br />
          <br />
          <label htmlFor="grid-first-name" style={{ color: "gray" }}>
            {t("Description")}
          </label>
          <Textarea
            name="description"
            type="text"
            value={values.description}
            onChange={(e) => handleChange(e.target.name, e.target.value)}
          />
          <br />
          <br />
          <TextField
            name="chap0part2"
            label="Chap. 0 part 2"
            onChange={(e) => handleChange(e.target.name, e.target.value)}
            select
            fullWidth
            SelectProps={{ native: true }}
            value={values.chap0part2}
            variant="outlined"
            InputLabelProps={{
              shrink: true,
              style: { color: "#3b373c" },
            }}
            InputProps={{
              style: { height: 50 },
            }}
          >
            <option value="" disabled></option>

            <option value="general" disabled>
              {t("General Chap. 0 part 2")}
            </option>
            {chapOptions?.chap0?.map((option) => (
              <option value={option._id}>{option.title}</option>
            ))}
            <option value="architect" disabled>
              {t("Architect Chap. 0 part 2")}
            </option>
            {chapOptions?.architectsChap0?.map((option) => (
              <option value={option._id}>{option.title}</option>
            ))}
          </TextField>
          <br />
          <br />
          {/* register button */}
          <div style={{ width: "100%", textAlign: "right" }}>
            <Button
              variant="contained"
              style={{
                backgroundColor: "#3b373c",
                height: "35px",
              }}
              type="submit"
            >
              {t("Update")}
            </Button>
          </div>
        </form>
      </TabPanel>
      <TabPanel value={value} index={1}>
        <form className={classes.form} onSubmit={handleSubmit2}>
          {/* All fields */}
          <RowRadioButtonsGroup
            row={true}
            label={t("Type Of Contract")}
            data={TOC}
            value={values2.market_type}
            name="market_type"
            handleChange={(e) => handleChange2(e.target.name, e.target.value)}
            disabled={true}
          />
          <br />
          <RowRadioButtonsGroup
            row={true}
            label={t("Type Of Project")}
            data={TOP}
            value={values2.structure}
            name="structure"
            handleChange={(e) => handleChange2(e.target.name, e.target.value)}
          />
          {/* register button */}
          <div style={{ width: "100%", textAlign: "right" }}>
            <Button variant="contained" className={classes.btn} type="submit">
              {t("Update")}
            </Button>
          </div>
        </form>
      </TabPanel>
      <TabPanel value={value} index={2}>
        <Grid container spacing={2}>
          <Grid item zeroMinWidth xs>
            <InputDropdown
              name="type"
              label={t("Type")}
              value={typeValue}
              onChange={(e) => setTypeValue(e.target.value)}
              options={typeOptions}
              required={true}
            />
          </Grid>
          <Grid item zeroMinWidth xs>
            <InputWithOptions
              label={t("Select Stakeholder")}
              required={true}
              name="family"
              value={values3.stakeholders}
              handleChange={(e) => handleStakeholdersChange(e)}
              options={stakeholderOptions}
            />
          </Grid>
        </Grid>
        <br />
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>{t("Type of stakeholder")}</TableCell>
                <TableCell align="left">{t("Name of stakeholder")}</TableCell>
                <TableCell align="right"></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {stakeholderOptions2?.map((row) =>
                values3?.stakeholders?.map((row2) => {
                  if (row2.toString() == row._id.toString()) {
                    return (
                      <TableRow
                        key={row.name}
                        sx={{
                          "&:last-child td, &:last-child th": { border: 0 },
                        }}
                      >
                        <TableCell component="th" scope="row">
                          {row.name}
                        </TableCell>
                        <TableCell align="left">{row.type.text}</TableCell>
                        <TableCell align="left">
                          <Button
                            variant="contained"
                            className={classes.btn}
                            onClick={() => removeStakeholder(row2)}
                          >
                            {t("Delete")}
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  }
                })
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <br />
        {/* register button */}
        <div style={{ width: "100%", textAlign: "right" }}>
          <Button
            variant="contained"
            className={classes.btn}
            onClick={handleSubmit3}
          >
            {t("Update")}
          </Button>
        </div>
      </TabPanel>
    </Box>
  );
};

export default PropertiesModal;
