// init
import React, { useState } from "react";
import api from "../../../api";
import { Button, Grid } from "@mui/material";
import { Store } from "../../../StoreContext";
import { toast } from "react-toastify";
import InputWithLabel from "../../../components/InputWithLabel";
import { useStyles } from "../../../css/addStakeholder";

// component
const AddChap0Part2 = ({ handleAddChap0Part2Modal }) => {
  const store = Store();
  const classes = useStyles();
  // states
  const [values, setValues] = useState({
    title: "",
    text: "",
  });

  // handle change function
  const handleChange = (name, value) => {
    setValues((prev) => {
      prev[name] = value;
      return { ...prev };
    });
  };

  // handle Submit function
  const handleSubmit = async (e) => {
    e.preventDefault();
    let data = values;
    data.architect = store.user._id;
    const result = await api("post", `/ArchitectsChap0/create/`, data);
    toast.success(result.data.message);
    handleAddChap0Part2Modal();
  };

  // jsx
  return (
    <>
      <div className={classes.container}>
        <form className={classes.form} onSubmit={handleSubmit}>
          {/* All fields */}
          <br />
          <Grid container spacing={2}>
            <Grid item zeroMinWidth xs>
              <InputWithLabel
                label="Title"
                required={true}
                name="title"
                type="text"
                value={values.title}
                handleChange={(e) =>
                  handleChange(e.target.name, e.target.value)
                }
              />
            </Grid>
            <Grid item zeroMinWidth xs>
              <InputWithLabel
                label="Text"
                required={true}
                name="text"
                type="text"
                value={values.text}
                handleChange={(e) =>
                  handleChange(e.target.name, e.target.value)
                }
              />
            </Grid>
          </Grid>
          <br />

          {/* create button */}
          <div style={{ width: "100%", textAlign: "right" }}>
            <Button variant="contained" className={classes.btn} type="submit">
              Create
            </Button>
          </div>
        </form>
      </div>
    </>
  );
};

export default AddChap0Part2;
