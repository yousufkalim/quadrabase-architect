// init
import React, { useState, useEffect } from "react";
import api from "../../api";
import { Button, Grid } from "@mui/material";
import { Store } from "../../StoreContext";
import { toast } from "react-toastify";
import InputWithLabel from "../../components/InputWithLabel";
import { useStyles } from "../../css/addStakeholder";

// component
const BuySubscription = ({ stakeholder, handleEditStakeholderModal }) => {
  const store = Store();
  const classes = useStyles();
  // states
  const [values, setValues] = useState({
    title: "",
    email: "",
    contact_no: "",
    entity: "",
    service: "",
    city: "",
    address1: "",
    address2: "",
    zipcode: "",
  });

  // useEffect to set values
  useEffect(() => {
    setValues({
      title: stakeholder.title,
      email: stakeholder.email,
      contact_no: stakeholder.contact_no,
      entity: stakeholder.entity,
      service: stakeholder.service,
      city: stakeholder.city,
      address1: stakeholder.address1,
      address2: stakeholder.address2,
      zipcode: stakeholder.zipcode,
    });
  }, [stakeholder]);

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
    const result = await api("put", `/stakeholder/${stakeholder._id}`, values);
    toast.success(result.data.message);
    handleEditStakeholderModal();
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
            required={true}
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
              Update
            </Button>
          </div>
        </form>
      </div>
    </>
  );
};

export default BuySubscription;
