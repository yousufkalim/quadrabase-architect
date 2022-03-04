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

const AddWorkModal = ({
  selectedWork,
  selectedWorkDetail,
  setOpenWorkModal,
  projectWorkData,
  currentProject,
  setSelectedWorkDetail,
  setSelectedWork,
  getworks,
}) => {
  const { t } = useTranslation();
  const [values, setValues] = useState({
    name: "",
    unit: "",
    unit_price: "",
    quantity: 1,
    ranking: 0,
    work_details: [],
  });
  const [options, setOptions] = useState([]);
  const [tranchOptions, setTranchOptions] = useState([]);
  const [tranch, setTranch] = useState("");

  useEffect(() => {
    selectedWork &&
      setValues((prev) => {
        prev.name = selectedWork.name;
        prev.unit = selectedWork.unit;
        prev.unit_price = selectedWork.unit_price;
        prev.ranking = selectedWork.ranking;
        return { ...prev };
      });
  }, [selectedWork]);
  // useEffect to get all units
  useEffect(() => {
    getUnits();
    currentProject.market_type === "TradesAndTranches" && getTranches();
  }, []);

  const getTranches = async () => {
    const result = await api("get", `/Tranches/`);
    setTranchOptions(result.data.tranches);
  };

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
    data.cctp_text = selectedWork.cctp_text;
    data.bpu_text = selectedWork.bpu_text;
    data.category = selectedWork.category;
    data.work_details = selectedWorkDetail;
    data.providers = selectedWork.providers;
    if (currentProject.market_type === "TradesAndTranches") {
      if (tranch) {
        data.tranch = tranch;
        const result = await api(
          "post",
          `/project/addWork/${currentProject._id}`,
          data,
          t
        );
        toast.success(t(result.data.message));
        setSelectedWorkDetail([]);
        setSelectedWork();
        setOpenWorkModal(false);
        getworks();
      } else {
        toast.error(t("Tranch is required"));
      }
    } else {
      const result = await api(
        "post",
        `/project/addWork/${currentProject._id}`,
        data,
        t
      );
      toast.success(t(result.data.message));
      setSelectedWorkDetail([]);
      setSelectedWork();
      setOpenWorkModal(false);
      getworks();
    }
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
        {currentProject.market_type === "TradesAndTranches" && (
          <>
            <br />
            <InputDropdown
              name="tranch"
              label="Tranch"
              value={tranch}
              onChange={(e) => setTranch(e.target.value)}
              options={tranchOptions}
            />
            <br />
          </>
        )}
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
            {t("Submit")}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default AddWorkModal;
