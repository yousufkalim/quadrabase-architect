// init
import React, { useState, useEffect } from "react";
import api from "../../../api";
import { toast } from "react-toastify";
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
const EditCategoryModal = ({ handleOpenEditCatgeoryModal, category }) => {
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

  useEffect(() => {
    category &&
      setValues((prev) => {
        prev.name = category.name;
        prev.cctp_text = [];
        return { ...prev };
      });
    category.cctp_text[0] && setcctp_text1(category.cctp_text[0]);
    category.cctp_text[1] && setcctp_text2(category.cctp_text[1]);
    category.cctp_text[2] && setcctp_text3(category.cctp_text[2]);
    category.cctp_text[3] && setcctp_text4(category.cctp_text[3]);
  }, [category]);

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
    const result = await api(
      "put",
      `/BookLibraries/update/editCategory/${category._id}`,
      data,
      t
    );
    toast.success(t(result.data.message));
    handleOpenEditCatgeoryModal();
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
      </Box>
      <br />
      <br />

      {/* create button */}
      <div style={{ width: "100%", textAlign: "right" }}>
        <Button variant="contained" className={classes.btn} type="submit">
          {t("Update")}
        </Button>
      </div>
    </form>
  );
};

export default EditCategoryModal;
