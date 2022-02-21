// init
import React, { useState, useEffect } from "react";
import { Store } from "../../../StoreContext";
import api from "../../../api";
import { useTranslation } from "react-i18next";

// component
import { Button } from "@mui/material";
import InputWithLabel from "../../../components/InputWithLabel";
import InputDropdown from "../../../components/InputDropdown";
import { toast } from "react-toastify";

const EditWorkModal = ({
  selectedWork,
  currentProject,
  handleOpenEditWorkModal,
  getworks,
}) => {
  const { t } = useTranslation();
  const [values, setValues] = useState({
    name: "",
    unit: "",
    unit_price: "",
    quantity: 1,
  });
  const [options, setOptions] = useState([]);

  useEffect(() => {
    selectedWork &&
      setValues((prev) => {
        prev.name = selectedWork.name;
        prev.unit = selectedWork.unit;
        prev.unit_price = selectedWork.unit_price;
        prev.quantity = selectedWork.quantity;
        return { ...prev };
      });
  }, [selectedWork]);
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

  // handle submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    let data = {
      workId: selectedWork._id,
      name: values.name,
      unit: values.unit,
      unit_price: values.unit_price,
      quantity: values.quantity,
    };
    const result = await api(
      "put",
      `/project/updateWork/${currentProject._id}`,
      data,
      t
    );
    toast.success(t(result.data.message));
    handleOpenEditWorkModal();
    getworks();
  };

  return (
    <div style={{ width: "45vw" }}>
      <form
        style={{ marginTop: "auto", marginBottom: "auto" }}
        onSubmit={handleSubmit}
      >
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
        <InputDropdown
          name="unit"
          label={t("Unit")}
          value={values.unit}
          onChange={(e) => handleChange(e.target.name, e.target.value)}
          options={options}
        />
        <br />
        <InputWithLabel
          label={t("Qty")}
          required={true}
          name="quantity"
          type="text"
          value={values.quantity}
          handleChange={(e) => handleChange(e.target.name, e.target.value)}
        />
        <br />
        <br />
        <InputWithLabel
          label="PU HT"
          required={true}
          name="unit_price"
          type="text"
          value={values.unit_price}
          handleChange={(e) => handleChange(e.target.name, e.target.value)}
        />
        <br />
        {/* register button */}
        <div
          style={{ display: "flex", justifyContent: "flex-end", marginTop: 10 }}
        >
          <Button
            variant="contained"
            style={{
              backgroundColor: "#3b373c",
              height: "35px",
            }}
            type="submit"
          >
            {t("Update")}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default EditWorkModal;
