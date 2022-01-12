// init
import React, { useState, useEffect } from "react";
import { Store } from "../../../StoreContext";
import api from "../../../api";

// component
import { Button } from "@mui/material";
import InputWithLabel from "../../../components/InputWithLabel";
import InputDropdown from "../../../components/InputDropdown";
import { toast } from "react-toastify";

const AddWorkModal = ({
  selectedWork,
  selectedWorkDetail,
  setOpenWorkModal,
  projectWorkData,
  currentProject,
  setSelectedWorkDetail,
  setSelectedWork,
}) => {
  const [values, setValues] = useState({
    name: "",
    unit: "",
    unit_price: "",
    quantity: 1,
    work_details: [],
  });
  const [options, setOptions] = useState([]);

  useEffect(() => {
    selectedWork &&
      setValues((prev) => {
        prev.name = selectedWork.name;
        prev.unit = selectedWork.unit;
        prev.unit_price = selectedWork.unit_price;
        prev.name = selectedWork.name;
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
    let data = values;
    data.workId = selectedWork._id;
    data.work_details = selectedWorkDetail;
    const result = await api(
      "post",
      `/project/addWork/${currentProject._id}`,
      data
    );
    toast.success(result.data.message);
    setSelectedWorkDetail([]);
    setSelectedWork();
    setOpenWorkModal(false);
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
            Submit
          </Button>
        </div>
      </form>
    </div>
  );
};

export default AddWorkModal;
