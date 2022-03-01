// init
import React, { useState, useEffect } from "react";
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
import InputDropdown from "../../../components/InputDropdown";
import AddMemoizedProvider from "../component/MemorizedProvider";
import AddMemoizedProviders from "../component/MemoizedProviders";
import DocViewer from "../component/DocViewer";
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
const AddWorkModal = ({ handleOpenAddWorkModal, workData, category }) => {
  const { t } = useTranslation();
  const classes = useStyles();
  // states
  const [values, setValues] = useState({
    name: "",
    unit: "",
    unit_price: "",
    cctp_text: [],
    bpu_text: [],
  });
  const [options, setOptions] = useState([]);
  const [ProviderOptions, setProviderOptions] = React.useState([]);
  const [cctp_text1, setcctp_text1] = useState("");
  const [cctp_text2, setcctp_text2] = useState("");
  const [cctp_text3, setcctp_text3] = useState("");
  const [cctp_text4, setcctp_text4] = useState("");
  const [bpu_text1, setbpu_text1] = useState("");
  const [ProviderDataArr, setProviderDataArr] = React.useState([]);
  const [selectedTabIndex, setSelectedTabIndex] = React.useState(0);

  const handleTabChange = (event, newValue) => {
    setSelectedTabIndex(newValue);
  };

  // useEffect to get all units
  useEffect(() => {
    getUnits();
    getAllProviders();
  }, []);

  // func to getAll Units
  const getUnits = async () => {
    const result = await api("get", `/Units/get`);
    setOptions(result.data.units);
  };

  // func to getAll Providers
  const getAllProviders = async () => {
    const result = await api("get", `/Providers/get/all`);
    setProviderOptions(result.data.providers);
  };

  // handle change function
  const handleChange = (name, value) => {
    setValues((prev) => {
      prev[name] = value;
      return { ...prev };
    });
  };

  const handleAdd = (obj) => {
    setProviderDataArr([...ProviderDataArr, obj]);
  };

  const handleDelete = async (id) => {
    let filteredData = ProviderDataArr.filter((dt) => dt.provider !== id);
    setProviderDataArr(filteredData);
  };

  const handleUpdate = (obj) => {
    let filteredIndex = ProviderDataArr.findIndex(
      (dt) => dt.provider == obj.currentProvider
    );
    setProviderDataArr((prev) => {
      prev[filteredIndex] = obj.data;
      return [...prev];
    });
  };

  // handle Submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    let data = values;
    data.cctp_text = [];
    data.bpu_text = [];
    cctp_text1 && data.cctp_text.push(cctp_text1);
    cctp_text2 && data.cctp_text.push(cctp_text2);
    cctp_text3 && data.cctp_text.push(cctp_text3);
    cctp_text4 && data.cctp_text.push(cctp_text4);
    bpu_text1 && data.bpu_text.push(bpu_text1);
    data.categoryId = category;
    data.providers = ProviderDataArr;
    data.ranking = workData ? workData.length : 0;
    const result = await api("post", `/BookLibraries/add/Work`, data, t);
    toast.success(t(result.data.message));
    handleOpenAddWorkModal();
  };

  // jsx
  return (
    <form className={classes.form} onSubmit={handleSubmit}>
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
          <InputWithLabel
            name="unit_price"
            label="PU HT"
            value={values.unit_price}
            handleChange={(e) => handleChange(e.target.name, e.target.value)}
            required={true}
          />
        </Grid>
        <Grid item zeroMinWidth xs>
          <InputDropdown
            name="unit"
            label={t("Unit")}
            value={values.unit}
            onChange={(e) => handleChange(e.target.name, e.target.value)}
            options={options}
            required={true}
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

      <div>
        <AddMemoizedProvider
          ProviderOptions={ProviderOptions}
          onAdd={handleAdd}
        />
      </div>
      <br />
      <div>
        {ProviderDataArr && ProviderDataArr.length > 0 ? (
          <>
            <div
              style={{
                width: "100%",
                border: "1px solid lightgray",
                padding: 20,
                marginBottom: 20,
              }}
            >
              {ProviderDataArr &&
                ProviderDataArr.map(({ documents, provider }, index) => (
                  <div key={index} className="mt-2">
                    <AddMemoizedProviders
                      _id={index}
                      name={provider}
                      documents={documents}
                      ProviderOptions={ProviderOptions}
                      onDelete={() => handleDelete(provider)}
                      handleUpdate={handleUpdate}
                    />
                    {documents && (
                      <div>
                        <DocViewer
                          documents={documents}
                          style={{ maxHeight: "200px" }}
                        />
                      </div>
                    )}
                  </div>
                ))}
            </div>
          </>
        ) : (
          ""
        )}
      </div>
      {/* create button */}
      <div style={{ width: "100%", textAlign: "right" }}>
        <Button variant="contained" className={classes.btn} type="submit">
          {t("Create")}
        </Button>
      </div>
    </form>
  );
};

export default AddWorkModal;
