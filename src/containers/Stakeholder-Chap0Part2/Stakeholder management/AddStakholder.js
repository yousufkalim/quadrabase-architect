// init
import React, { useState } from "react";
import api from "../../../api";
import { Button, Grid } from "@mui/material";
import { Store } from "../../../StoreContext";
import { toast } from "react-toastify";
import InputWithLabel from "../../../components/InputWithLabel";
import { useStyles } from "../../../css/addStakeholder";

// component
const AddStakholder = ({ handleAddStakeholderModal }) => {
  const store = Store();
  const classes = useStyles();
  // states
  const [values, setValues] = useState({
    name: "",
    email: "",
    contact_no: "",
    entity: "",
    service: "",
    city: "",
    address1: "",
    address2: "",
    zipcode: "",
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
    const result = await api(
      "post",
      `/stakeholders/create/${store.user._id}`,
      values
    );
    handleAddStakeholderModal();
    toast.success(result.data.message);
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
                label="Name"
                required={true}
                name="name"
                type="text"
                value={values.name}
                handleChange={(e) =>
                  handleChange(e.target.name, e.target.value)
                }
              />
            </Grid>
            <Grid item zeroMinWidth xs>
              <InputWithLabel
                label="Email"
                required={true}
                name="email"
                type="email"
                value={values.email}
                handleChange={(e) =>
                  handleChange(e.target.name, e.target.value)
                }
              />
            </Grid>
          </Grid>
          <br />
          <InputWithLabel
            label="Contact Number"
            required={true}
            name="contact_no"
            type="number"
            value={values.contact_no}
            handleChange={(e) => handleChange(e.target.name, e.target.value)}
          />
          <br />
          <br />
          <Grid container spacing={2}>
            <Grid item zeroMinWidth xs>
              <InputWithLabel
                label="Entity"
                required={true}
                name="entity"
                type="text"
                value={values.entity}
                handleChange={(e) =>
                  handleChange(e.target.name, e.target.value)
                }
              />
            </Grid>
            <Grid item zeroMinWidth xs>
              <InputWithLabel
                label="Service"
                required={true}
                name="service"
                type="text"
                value={values.service}
                handleChange={(e) =>
                  handleChange(e.target.name, e.target.value)
                }
              />
            </Grid>
          </Grid>
          <br />
          <InputWithLabel
            label="City"
            required={true}
            name="city"
            type="text"
            value={values.city}
            handleChange={(e) => handleChange(e.target.name, e.target.value)}
          />
          <br />
          <br />

          <InputWithLabel
            label="Address 1"
            required={true}
            name="address1"
            type="text"
            value={values.address1}
            handleChange={(e) => handleChange(e.target.name, e.target.value)}
          />
          <br />
          <br />

          <InputWithLabel
            label="Address 2"
            name="address2"
            type="text"
            value={values.address2}
            handleChange={(e) => handleChange(e.target.name, e.target.value)}
          />
          <br />
          <br />
          <InputWithLabel
            label="Zipcode"
            required={true}
            name="zipcode"
            type="number"
            value={values.zipcode}
            handleChange={(e) => handleChange(e.target.name, e.target.value)}
          />
          <br />
          <br />
          {/* register button */}
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

export default AddStakholder;
