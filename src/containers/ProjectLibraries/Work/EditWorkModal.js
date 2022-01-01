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
const EditWorkModal = ({ handleOpenEditWorkModal, work }) => {
  const classes = useStyles();
  // states
  const [values, setValues] = useState({
    name: "",
    unit: "",
    cctp_text: [],
    btu_text: [],
  });
  const [options, setOptions] = useState([]);
  const [cctp_text1, setcctp_text1] = useState("");
  const [cctp_text2, setcctp_text2] = useState("");
  const [cctp_text3, setcctp_text3] = useState("");
  const [btu_text1, setbtu_text1] = useState("");
  const [btu_text2, setbtu_text2] = useState("");
  const [btu_text3, setbtu_text3] = useState("");

  // useEffect to set intial data
  useEffect(() => {
    work &&
      setValues((prev) => {
        prev.name = work.name;
        prev.unit = work.unit;
        prev.cctp_text = [];
        prev.btu_text = [];
        return { ...prev };
      });
    work.cctp_text[0] && setcctp_text1(work.cctp_text[0]);
    work.cctp_text[1] && setcctp_text2(work.cctp_text[1]);
    work.cctp_text[2] && setcctp_text3(work.cctp_text[2]);
    work.btu_text[0] && setbtu_text1(work.btu_text[0]);
    work.btu_text[1] && setbtu_text2(work.btu_text[1]);
    work.btu_text[2] && setbtu_text3(work.btu_text[2]);
  }, [work]);
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
    data.btu_text = [];
    cctp_text1 && data.cctp_text.push(cctp_text1);
    cctp_text2 && data.cctp_text.push(cctp_text2);
    cctp_text3 && data.cctp_text.push(cctp_text3);
    btu_text1 && data.btu_text.push(btu_text1);
    btu_text2 && data.btu_text.push(btu_text2);
    btu_text3 && data.btu_text.push(btu_text3);
    const result = await api(
      "put",
      `/BookLibraries/edit/Work/${work._id}`,
      data
    );
    toast.success(result.data.message);
    handleOpenEditWorkModal();
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
          <InputDropdown
            name="unit"
            label="Unit"
            value={values.unit}
            onChange={(e) => handleChange(e.target.name, e.target.value)}
            options={options}
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
              onChange={(value) => setbtu_text1(value)}
              value={btu_text1}
              label={"BTU 1"}
            />
          </Grid>
          <Grid item zeroMinWidth xs>
            <TextEditor
              onChange={(value) => setbtu_text2(value)}
              value={btu_text2}
              label={"BTU 2"}
            />
          </Grid>
          <Grid item zeroMinWidth xs>
            <TextEditor
              onChange={(value) => setbtu_text3(value)}
              value={btu_text3}
              label={"BTU 3"}
            />
          </Grid>
        </Grid>
      </div>
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

export default EditWorkModal;
