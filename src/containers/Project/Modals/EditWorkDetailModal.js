// init
import React, { useState, useEffect } from "react";
import { Store } from "../../../StoreContext";
import api from "../../../api";

// component
import { Button } from "@mui/material";
import InputWithLabel from "../../../components/InputWithLabel";
import InputDropdown from "../../../components/InputDropdown";
import { toast } from "react-toastify";

const EditWorkDetailModal = ({
  selectedWorkDetail,
  currentProject,
  handleOpenEditWorkDetailModal,
}) => {
  const [values, setValues] = useState({
    name: "",
    unit: "",
    unit_price: "",
    quantity: 1,
  });
  const [options, setOptions] = useState([]);

  useEffect(() => {
    selectedWorkDetail &&
      setValues((prev) => {
        prev.name = selectedWorkDetail.name;
        prev.unit = selectedWorkDetail.unit;
        prev.unit_price = selectedWorkDetail.unit_price;
        prev.quantity = selectedWorkDetail.quantity;
        return { ...prev };
      });
  }, [selectedWorkDetail]);
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
      workDetailId: selectedWorkDetail._id,
      name: values.name,
      unit: values.unit,
      unit_price: values.unit_price,
      quantity: values.quantity,
    };
    const result = await api(
      "put",
      `/project/updateWorkDetail/${currentProject._id}`,
      data
    );
    toast.success(result.data.message);
    handleOpenEditWorkDetailModal();
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
        />
        <br />
        <InputWithLabel
          label="Qty"
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
            Update
          </Button>
        </div>
      </form>
    </div>
  );
};

export default EditWorkDetailModal;
