// init
import React, { useState, useEffect } from "react";
import api from "../../../api";
import { Button, Grid } from "@mui/material";
import { Store } from "../../../StoreContext";
import { toast } from "react-toastify";
import InputWithLabel from "../../../components/InputWithLabel";
import { useStyles } from "../../../css/addStakeholder";

// component
const EditChap0Part2 = ({ handleEditChap0Part2Modal, Chap0Part2 }) => {
  const store = Store();
  const classes = useStyles();
  // states
  const [values, setValues] = useState({
    title: "",
    text: "",
  });

  // useEffect to set values
  useEffect(() => {
    setValues({
      title: Chap0Part2.title,
      text: Chap0Part2.text,
    });
  }, [Chap0Part2]);

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
    const result = await api(
      "put",
      `/ArchitectsChap0/${Chap0Part2._id}`,
      values
    );
    toast.success(result.data.message);
    handleEditChap0Part2Modal();
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
              Update
            </Button>
          </div>
        </form>
      </div>
    </>
  );
};

export default EditChap0Part2;
