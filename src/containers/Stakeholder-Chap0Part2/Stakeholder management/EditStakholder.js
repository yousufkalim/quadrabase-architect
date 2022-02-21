// init
import React, { useState, useEffect } from "react";
import api from "../../../api";
import { Button, Grid } from "@mui/material";
import { Store } from "../../../StoreContext";
import { toast } from "react-toastify";
import InputWithLabel from "../../../components/InputWithLabel";
import InputDropdown from "../../../components/InputDropdown";
import { useStyles } from "../../../css/addStakeholder";
import { useTranslation } from "react-i18next";

// component
const EditStakholder = ({ stakeholder, handleEditStakeholderModal }) => {
  const { t } = useTranslation();
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
    type: "",
  });
  const [options, setOptions] = useState([]);

  // useEffect to get all types
  useEffect(() => {
    getTypes();
  }, []);

  // func to getAll Units
  const getTypes = async () => {
    const result = await api("get", `/StakeholderTypes/`);
    setOptions(result.data.stakeholderTypes);
  };

  // useEffect to set values
  useEffect(() => {
    setValues({
      name: stakeholder.name,
      email: stakeholder.email,
      contact_no: stakeholder.contact_no,
      entity: stakeholder.entity,
      service: stakeholder.service,
      city: stakeholder.city,
      address1: stakeholder.address1,
      address2: stakeholder.address2,
      zipcode: stakeholder.zipcode,
      type: stakeholder.type,
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
    const result = await api(
      "put",
      `/stakeholders/${stakeholder._id}`,
      values,
      t
    );
    toast.success(t(result.data.message));
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
                label={t("Name")}
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
              <InputDropdown
                name="type"
                label={t("Type")}
                value={values.type}
                onChange={(e) => handleChange(e.target.name, e.target.value)}
                options={options}
                required={true}
              />
            </Grid>
          </Grid>
          <br />
          <Grid container spacing={2}>
            <Grid item zeroMinWidth xs>
              <InputWithLabel
                label={t("Email")}
                required={true}
                name="email"
                type="email"
                value={values.email}
                handleChange={(e) =>
                  handleChange(e.target.name, e.target.value)
                }
              />
            </Grid>
            <Grid item zeroMinWidth xs>
              <InputWithLabel
                label={t("Contact Number")}
                required={true}
                name="contact_no"
                type="number"
                value={values.contact_no}
                handleChange={(e) =>
                  handleChange(e.target.name, e.target.value)
                }
              />
            </Grid>
          </Grid>
          <br />
          <br />
          <Grid container spacing={2}>
            <Grid item zeroMinWidth xs>
              <InputWithLabel
                label={t("Entity")}
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
                label={t("Service")}
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
            label={t("City")}
            required={true}
            name="city"
            type="text"
            value={values.city}
            handleChange={(e) => handleChange(e.target.name, e.target.value)}
          />
          <br />
          <br />

          <InputWithLabel
            label={t("Address 1")}
            required={true}
            name="address1"
            type="text"
            value={values.address1}
            handleChange={(e) => handleChange(e.target.name, e.target.value)}
          />
          <br />
          <br />

          <InputWithLabel
            label={t("Address 2")}
            name="address2"
            type="text"
            value={values.address2}
            handleChange={(e) => handleChange(e.target.name, e.target.value)}
          />
          <br />
          <br />
          <InputWithLabel
            label={t("Zipcode")}
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
              {t("Update")}
            </Button>
          </div>
        </form>
      </div>
    </>
  );
};

export default EditStakholder;
