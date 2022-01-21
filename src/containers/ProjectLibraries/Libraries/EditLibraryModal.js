// init
import React, { useState, useEffect } from "react";
import api from "../../../api";
import { toast } from "react-toastify";
import { Store } from "../../../StoreContext";
import PropTypes from "prop-types";

// component
import InputWithLabel from "../../../components/InputWithLabel";
import { useStyles } from "../../../css/projectLibraries";
import { Button, Grid } from "@mui/material";
import InputWithOptions from "../../../components/InputWithOptions";
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
const AddLibraryModal = ({ library, handleOpenEditLibrariesModal }) => {
  const classes = useStyles();
  const store = Store();
  // states
  const [values, setValues] = useState({
    name: "",
    families: [],
    cctp_text: [],
    type: "private",
  });
  const [options, setOptions] = useState();
  const [cctp_text1, setcctp_text1] = React.useState("");
  const [cctp_text2, setcctp_text2] = React.useState("");
  const [cctp_text3, setcctp_text3] = React.useState("");
  const [cctp_text4, setcctp_text4] = React.useState("");
  const [selectedTabIndex, setSelectedTabIndex] = React.useState(0);

  const handleTabChange = (event, newValue) => {
    setSelectedTabIndex(newValue);
  };

  // useEffect to set initialData
  useEffect(() => {
    let temp = [];
    temp.push(library?.families?.map((item) => item));
    library &&
      setValues((prev) => {
        prev.name = library.name;
        prev.families = temp;
        prev.families = prev.families[0];
        prev.cctp_text = [];
        prev.type = "private";
        return { ...prev };
      });
    library.cctp_text[0] && setcctp_text1(library.cctp_text[0]);
    library.cctp_text[1] && setcctp_text2(library.cctp_text[1]);
    library.cctp_text[2] && setcctp_text3(library.cctp_text[2]);
    library.cctp_text[3] && setcctp_text4(library.cctp_text[3]);
  }, [library]);

  // useEffect to get all families
  useEffect(() => {
    getFamilies();
  }, []);

  const getFamilies = async () => {
    const result = await api("get", `/Families/architect/getAll`);
    setOptions(result.data.families);
  };

  // handle change function
  const handleChange = (name, value) => {
    setValues((prev) => {
      prev[name] = value;
      return { ...prev };
    });
  };

  // handle change for family
  const handleFamilyChange = (event) => {
    const {
      target: { value },
    } = event;
    let temp = typeof value === "string" ? value.split(",") : value;
    setValues((prev) => {
      prev.families = temp;
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
    data.architect = store.user._id;
    const result = await api(
      "put",
      `/BookLibraries/update/${library._id}`,
      data
    );
    toast.success(result.data.message);
    handleOpenEditLibrariesModal();
  };

  // jsx
  return (
    <form className={classes.form} onSubmit={handleSubmit}>
      {/* All fields */}
      <br />
      <Grid container spacing={2}>
        <Grid item zeroMinWidth xs>
          <InputWithLabel
            label="Name"
            required={true}
            name="name"
            type="text"
            value={values.name}
            handleChange={(e) => handleChange(e.target.name, e.target.value)}
          />
        </Grid>
        <Grid item zeroMinWidth xs>
          <InputWithOptions
            label="Select Family"
            required={true}
            name="family"
            value={values.families}
            handleChange={(e) => handleFamilyChange(e)}
            options={options}
          />
        </Grid>
      </Grid>
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
          Update
        </Button>
      </div>
    </form>
  );
};

export default AddLibraryModal;
