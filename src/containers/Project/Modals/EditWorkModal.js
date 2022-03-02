// init
import React, { useState, useEffect } from "react";
import { Store } from "../../../StoreContext";
import api from "../../../api";
import { useTranslation } from "react-i18next";
import PropTypes from "prop-types";

// component
import { Button, Grid } from "@mui/material";
import InputWithLabel from "../../../components/InputWithLabel";
import InputDropdown from "../../../components/InputDropdown";
import TextEditor from "../../../components/TextEditor";
import { toast } from "react-toastify";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";

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

const EditWorkModal = ({
  selectedWork,
  currentProject,
  handleOpenEditWorkModal,
  getworks,
}) => {
  const { t } = useTranslation();
  const [values, setValues] = useState({
    name: "",
    unit: "",
    unit_price: "",
    quantity: 1,
  });
  const [options, setOptions] = useState([]);
  const [selectedTabIndex, setSelectedTabIndex] = useState(0);
  const [cctp_text1, setcctp_text1] = useState("");
  const [cctp_text2, setcctp_text2] = useState("");
  const [cctp_text3, setcctp_text3] = useState("");
  const [cctp_text4, setcctp_text4] = useState("");
  const [bpu_text1, setbpu_text1] = useState("");

  const handleTabChange = (event, newValue) => {
    setSelectedTabIndex(newValue);
  };

  useEffect(() => {
    if (selectedWork) {
      setValues((prev) => {
        prev.name = selectedWork.name;
        prev.unit = selectedWork.unit;
        prev.unit_price = selectedWork.unit_price;
        prev.quantity = selectedWork.quantity;
        return { ...prev };
      });
      selectedWork.cctp_text[0] && setcctp_text1(selectedWork.cctp_text[0]);
      selectedWork.cctp_text[1] && setcctp_text2(selectedWork.cctp_text[1]);
      selectedWork.cctp_text[2] && setcctp_text3(selectedWork.cctp_text[2]);
      selectedWork.cctp_text[3] && setcctp_text4(selectedWork.cctp_text[3]);
      selectedWork.bpu_text[0] && setbpu_text1(selectedWork.bpu_text[0]);
    }

    console.log(selectedWork);
  }, [selectedWork]);
  // useEffect to get all units
  useEffect(() => {
    getUnits();
  }, []);

  // func to getAll Units
  const getUnits = async () => {
    const result = await api("get", `/Units/get`);
    setOptions(result.data.units);
  };

  // handle change function
  const handleChange = (name, value) => {
    setValues((prev) => {
      prev[name] = value;
      return { ...prev };
    });
  };

  // handle submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    let data = {
      workId: selectedWork._id,
      name: values.name,
      unit: values.unit,
      unit_price: values.unit_price,
      quantity: values.quantity,
      cctp_text: [],
      bpu_text: [],
    };
    data.cctp_text.push(cctp_text1);
    data.cctp_text.push(cctp_text2);
    data.cctp_text.push(cctp_text3);
    data.cctp_text.push(cctp_text4);
    data.bpu_text.push(bpu_text1);
    const result = await api(
      "put",
      `/project/updateWork/${currentProject._id}`,
      data,
      t
    );
    toast.success(t(result.data.message));
    handleOpenEditWorkModal();
    getworks();
  };

  return (
    <div style={{ width: "45vw" }}>
      <form
        style={{ marginTop: "auto", marginBottom: "auto" }}
        onSubmit={handleSubmit}
      >
        {/* All fields */}
        <br />
        <Grid container spacing={2}>
          <Grid item zeroMinWidth xs>
            <InputWithLabel
              label={t("Name")}
              required={true}
              name="name"
              type="text"
              value={values.name}
              handleChange={(e) => handleChange(e.target.name, e.target.value)}
            />
          </Grid>
          <Grid item zeroMinWidth xs>
            <InputDropdown
              name="unit"
              label={t("Unit")}
              value={values.unit}
              onChange={(e) => handleChange(e.target.name, e.target.value)}
              options={options}
            />
          </Grid>
        </Grid>
        <br />
        <br />
        <Grid container spacing={2}>
          <Grid item zeroMinWidth xs>
            <InputWithLabel
              label={t("Qty")}
              required={true}
              name="quantity"
              type="text"
              value={values.quantity}
              handleChange={(e) => handleChange(e.target.name, e.target.value)}
            />
          </Grid>
          <Grid item zeroMinWidth xs>
            <InputWithLabel
              label="PU HT"
              required={true}
              name="unit_price"
              type="text"
              value={values.unit_price}
              handleChange={(e) => handleChange(e.target.name, e.target.value)}
            />
          </Grid>
        </Grid>
        <br />
        <br />
        {/* CCTP Tab View */}
        <Box sx={{ width: "100%" }}>
          <Box sx={{ borderBottom: 1, borderColor: "#f2f2f2" }}>
            <Tabs
              value={selectedTabIndex}
              onChange={handleTabChange}
              aria-label="CCTPs"
            >
              <Tab label="CCTP1" {...a11yProps(0)} />
              <Tab label="CCTP2" {...a11yProps(1)} />
              <Tab label="CCTP3" {...a11yProps(2)} />
              <Tab label="CCTP4" {...a11yProps(2)} />
              <Tab label="BPU" {...a11yProps(4)} />
            </Tabs>
          </Box>
          <TabPanel value={selectedTabIndex} index={0}>
            <TextEditor setValue={setcctp_text1} value={cctp_text1} />
          </TabPanel>
          <TabPanel value={selectedTabIndex} index={1}>
            <TextEditor setValue={setcctp_text2} value={cctp_text2} />
          </TabPanel>
          <TabPanel value={selectedTabIndex} index={2}>
            <TextEditor setValue={setcctp_text3} value={cctp_text3} />
          </TabPanel>
          <TabPanel value={selectedTabIndex} index={3}>
            <TextEditor setValue={setcctp_text4} value={cctp_text4} />
          </TabPanel>
          <TabPanel value={selectedTabIndex} index={4}>
            <TextEditor setValue={setbpu_text1} value={bpu_text1} />
          </TabPanel>
        </Box>
        <br />
        <br />
        {/* register button */}
        <div
          style={{ display: "flex", justifyContent: "flex-end", marginTop: 10 }}
        >
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
    </div>
  );
};

export default EditWorkModal;
