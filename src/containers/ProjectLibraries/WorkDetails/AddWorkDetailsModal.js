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
const AddWorkDetailsModal = ({
  handleOpenAddWorkDetailModal,
  workDetailData,
  work,
}) => {
  const classes = useStyles();
  // states
  const [values, setValues] = useState({
    name: "",
    unit: "",
  });
  const [options, setOptions] = useState([]);

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
    data.workId = work;
    data.ranking = workDetailData ? workDetailData.length : 0;
    const result = await api("post", `/BookLibraries/add/WorkDetail`, data);
    toast.success(result.data.message);
    handleOpenAddWorkDetailModal();
  };

  // jsx
  return (
    <form className={classes.smform} onSubmit={handleSubmit}>
      {/* All fields */}
      <br />
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
      <InputDropdown
        name="unit"
        label="Unit"
        value={values.unit}
        onChange={(e) => handleChange(e.target.name, e.target.value)}
        options={options}
        required={true}
      />
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

export default AddWorkDetailsModal;
