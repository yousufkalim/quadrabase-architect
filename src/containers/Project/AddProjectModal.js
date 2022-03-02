import React, { useEffect, useState } from "react";
import InputWithLabel from "../../components/InputWithLabel";
import { useStyles } from "../../css/home";
import { Grid, Button } from "@mui/material";
import api from "../../api";
import RowRadioButtonsGroup from "./component/RadioGroup";
import InputDropdown from "../../components/InputDropdown";
import { Store, UpdateStore } from "../../StoreContext";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";

const TOC = [
  {
    value: "Simple",
    label: "Simple",
  },
  {
    value: "Trades",
    label: "Trades",
  },
  {
    value: "TradesAndTranches",
    label: "Trades And Tranches",
  },
  {
    value: "PurchaseOrder",
    label: "Purchase Order",
  },
];

const TOP = [
  {
    value: "DQEAndBPU",
    label: "DQE And BPU",
  },
  {
    value: "DPGF",
    label: "DPGF",
  },
];

const AddProjectModal = ({ handleAddProjectModal }) => {
  const { t } = useTranslation();
  const classes = useStyles();
  const store = Store();
  const updateStore = UpdateStore();

  //  States
  const [values, setValues] = useState({
    name: "",
    prescriber: "",
    vat: "",
    market_type: "Simple",
    structure: "DQEAndBPU",
  });
  const [options, setOptions] = useState([]);

  //   useEffect to get vat
  useEffect(() => {
    getVat();
  }, []);

  //   func to get vat
  const getVat = async () => {
    const result = await api("get", `/VAT/getAll`);
    setOptions(result?.data?.vat?.sort((a, b) => a.value - b.value));
    result &&
      setValues((prev) => {
        prev.vat = result?.data?.vat[0]?._id;
        return { ...prev };
      });
  };

  // handle change function
  const handleChange = (name, value) => {
    setValues((prev) => {
      prev[name] = value;
      return { ...prev };
    });
  };

  //   handle submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    let data = values;
    data.architect = store.user._id;
    const result = await api("post", `/project/create`, data, t);
    toast.success(t(result.data.message));
    handleAddProjectModal();
    const response = await api("get", "/Architects/current/loggedIn");
    if (response.data.user) {
      updateStore({ loggedIn: true, user: response.data.user });
    }
  };

  return (
    <div>
      <form className={classes.form} onSubmit={handleSubmit}>
        {/* All fields */}
        <br />
        <InputWithLabel
          label={t("Name")}
          required={true}
          name="name"
          type="text"
          value={values.name}
          handleChange={(e) => handleChange(e.target.name, e.target.value)}
        />
        <br />
        <br />
        <Grid container spacing={2}>
          <Grid item zeroMinWidth xs>
            <InputWithLabel
              label={t("Prescriber")}
              required={true}
              name="prescriber"
              value={values.prescriber}
              handleChange={(e) => handleChange(e.target.name, e.target.value)}
              type="text"
            />
          </Grid>
          <Grid item zeroMinWidth xs>
            <InputDropdown
              label={t("VAT")}
              required={true}
              name="vat"
              value={values.vat}
              options={options}
              type="text"
              onChange={(e) => handleChange(e.target.name, e.target.value)}
            />
          </Grid>
        </Grid>
        <br />
        <RowRadioButtonsGroup
          row={true}
          label={t("Type Of Contract")}
          data={TOC}
          value={values.market_type}
          name="market_type"
          handleChange={(e) => handleChange(e.target.name, e.target.value)}
        />
        <br />
        <RowRadioButtonsGroup
          row={true}
          label={t("Type Of Project")}
          data={TOP}
          value={values.structure}
          name="structure"
          handleChange={(e) => handleChange(e.target.name, e.target.value)}
        />
        {/* register button */}
        <div style={{ width: "100%", textAlign: "right" }}>
          <Button variant="contained" className={classes.btn} type="submit">
            {t("Create")}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default AddProjectModal;
