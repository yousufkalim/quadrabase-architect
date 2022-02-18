// init
import React, { useState } from "react";
import api from "../../../api";
import { toast } from "react-toastify";
import { Store } from "../../../StoreContext";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";

// component
import InputWithLabel from "../../../components/InputWithLabel";
import { useStyles } from "../../../css/projectLibraries";
import { Button, Grid } from "@mui/material";
import TextEditor from "../../../components/TextEditor";
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

// component
const AddCategoryModal = ({
  handleOpenAddCatgeoryModal,
  categoryData,
  library,
}) => {
  const { t } = useTranslation();
  const classes = useStyles();
  // states
  const [values, setValues] = useState({
    name: "",
    cctp_text: [],
  });
  const [cctp_text1, setcctp_text1] = React.useState("");
  const [cctp_text2, setcctp_text2] = React.useState("");
  const [cctp_text3, setcctp_text3] = React.useState("");
  const [cctp_text4, setcctp_text4] = React.useState("");
  const [selectedTabIndex, setSelectedTabIndex] = React.useState(0);

  const handleTabChange = (event, newValue) => {
    setSelectedTabIndex(newValue);
  };

  // handle change function
  const handleChange = (name, value) => {
    setValues((prev) => {
      prev[name] = value;
      return { ...prev };
    });
  };

  // handle Submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    let data = values;
    data.cctp_text = [];
    cctp_text1 && data.cctp_text.push(cctp_text1);
    cctp_text2 && data.cctp_text.push(cctp_text2);
    cctp_text3 && data.cctp_text.push(cctp_text3);
    cctp_text4 && data.cctp_text.push(cctp_text4);
    data.libraryId = library;
    data.ranking = categoryData ? categoryData.length : 0;
    const result = await api("post", `/BookLibraries/add/Category`, data);
    toast.success(result.data.message);
    handleOpenAddCatgeoryModal();
  };

  // jsx
  return (
    <form className={classes.form} onSubmit={handleSubmit}>
      {/* All fields */}
      <br />
      <InputWithLabel
        label={t("Name")}
        required={true}
        name="name"
        type="text"
        value={values.name}
        handleChange={(e) => handleChange(e.target.name, e.target.value)}
      />
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
          </Tabs>
        </Box>
        <TabPanel value={selectedTabIndex} index={0}>
          <TextEditor
            onChange={(value) => setcctp_text1(value)}
            value={cctp_text1}
            height={200}
          />
        </TabPanel>
        <TabPanel value={selectedTabIndex} index={1}>
          <TextEditor
            onChange={(value) => setcctp_text2(value)}
            value={cctp_text2}
            height={200}
          />
        </TabPanel>
        <TabPanel value={selectedTabIndex} index={2}>
          <TextEditor
            onChange={(value) => setcctp_text3(value)}
            value={cctp_text3}
            height={200}
          />
        </TabPanel>
        <TabPanel value={selectedTabIndex} index={3}>
          <TextEditor
            onChange={(value) => setcctp_text4(value)}
            value={cctp_text4}
            height={200}
          />
        </TabPanel>
      </Box>
      <br />
      <br />

      {/* create button */}
      <div style={{ width: "100%", textAlign: "right" }}>
        <Button variant="contained" className={classes.btn} type="submit">
          {t("Create")}
        </Button>
      </div>
    </form>
  );
};

export default AddCategoryModal;
