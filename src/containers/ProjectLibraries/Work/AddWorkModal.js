// init
import React, { useState, useEffect } from "react";
import api from "../../../api";
import { toast } from "react-toastify";
import { Store } from "../../../StoreContext";

// component
import InputWithLabel from "../../../components/InputWithLabel";
import { useStyles } from "../../../css/projectLibraries";
import { Button, Grid } from "@mui/material";
import TextEditor from "../../../components/TextEditor";
import InputDropdown from "../../../components/InputDropdown";

// component
const AddWorkModal = ({ handleOpenAddWorkModal, workData, category }) => {
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
  const [cctp_text1, setcctp_text1] = useState("");
  const [cctp_text2, setcctp_text2] = useState("");
  const [cctp_text3, setcctp_text3] = useState("");
  const [bpu_text1, setbpu_text1] = useState("");
  const [bpu_text2, setbpu_text2] = useState("");
  const [bpu_text3, setbpu_text3] = useState("");

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

  // handle Submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    let data = values;
    data.cctp_text = [];
    data.bpu_text = [];
    cctp_text1 && data.cctp_text.push(cctp_text1);
    cctp_text2 && data.cctp_text.push(cctp_text2);
    cctp_text3 && data.cctp_text.push(cctp_text3);
    bpu_text1 && data.bpu_text.push(bpu_text1);
    bpu_text2 && data.bpu_text.push(bpu_text2);
    bpu_text3 && data.bpu_text.push(bpu_text3);
    data.categoryId = category;
    data.ranking = workData ? workData.length : 0;
    const result = await api("post", `/BookLibraries/add/Work`, data);
    toast.success(result.data.message);
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
            label="Name"
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
            label="Unit"
            value={values.unit}
            onChange={(e) => handleChange(e.target.name, e.target.value)}
            options={options}
            required={true}
          />
        </Grid>
      </Grid>

      <br />
      <br />
      <div style={{ height: 210, marginBottom: -20 }}>
        <Grid container spacing={2}>
          <Grid item zeroMinWidth xs>
            <TextEditor
              onChange={(value) => setcctp_text1(value)}
              value={cctp_text1}
              label={"CCTP 1"}
            />
          </Grid>
          <Grid item zeroMinWidth xs>
            <TextEditor
              onChange={(value) => setcctp_text2(value)}
              value={cctp_text2}
              label={"CCTP 2"}
            />
          </Grid>
          <Grid item zeroMinWidth xs>
            <TextEditor
              onChange={(value) => setcctp_text3(value)}
              value={cctp_text3}
              label={"CCTP 3"}
            />
          </Grid>
        </Grid>
      </div>
      <br />
      <br />
      <br />
      <div style={{ height: 210 }}>
        <Grid container spacing={2}>
          <Grid item zeroMinWidth xs>
            <TextEditor
              onChange={(value) => setbpu_text1(value)}
              value={bpu_text1}
              label={"BPU 1"}
            />
          </Grid>
          <Grid item zeroMinWidth xs>
            <TextEditor
              onChange={(value) => setbpu_text2(value)}
              value={bpu_text2}
              label={"BPU 2"}
            />
          </Grid>
          <Grid item zeroMinWidth xs>
            <TextEditor
              onChange={(value) => setbpu_text3(value)}
              value={bpu_text3}
              label={"BPU 3"}
            />
          </Grid>
        </Grid>
      </div>
      <br />
      <br />

      {/* create button */}
      <div style={{ width: "100%", textAlign: "right" }}>
        <Button variant="contained" className={classes.btn} type="submit">
          Create
        </Button>
      </div>
    </form>
  );
};

export default AddWorkModal;
