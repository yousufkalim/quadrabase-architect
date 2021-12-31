// init
import React, { useState } from "react";
import api from "../../../api";
import { toast } from "react-toastify";

// component
import InputWithLabel from "../../../components/InputWithLabel";
import { useStyles } from "../../../css/projectLibraries";
import { Button } from "@mui/material";

// component
const AddFamilyModal = ({ handleOpenFamiliesModal }) => {
  const classes = useStyles();
  const [name, setName] = useState();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await api("post", `/Families/architect/create`, { name });
    toast.success(result.data.message);
    handleOpenFamiliesModal();
  };
  // jsx
  return (
    <form className={classes.form} onSubmit={handleSubmit}>
      {/* All fields */}
      <br />
      <InputWithLabel
        label="Name"
        required={true}
        name="text"
        type="text"
        value={name}
        handleChange={(e) => setName(e.target.value)}
      />
      <br />
      <br />

      {/* create button */}
      <div style={{ width: "100%", textAlign: "right" }}>
        <Button variant="contained" className={classes.btn} type="submit">
          Add Family
        </Button>
      </div>
    </form>
  );
};

export default AddFamilyModal;
