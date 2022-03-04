import React, { useState, useEffect } from "react";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Button from "@mui/material/Button";
import api from "../../../api";
import { toast } from "react-toastify";
import InputDropdown from "../../../components/InputDropdown";
import { useTranslation } from "react-i18next";

const AddWorkDetailsModal = ({
  selectedWork,
  workDetails,
  selectedWorkDetail,
  setSelectedWorkDetail,
  setOpenWorkDetailModal,
  setSelectedWork,
  currentProject,
  getworks,
}) => {
  const { t } = useTranslation();
  // states
  const [tranchOptions, setTranchOptions] = useState([]);
  const [tranch, setTranch] = useState("");

  // useEffect to get all tranches
  useEffect(() => {
    currentProject.market_type === "TradesAndTranches" && getTranches();
  }, []);

  const getTranches = async () => {
    const result = await api("get", `/Tranches/`);
    setTranchOptions(result.data.tranches);
  };

  const handleCheckbox = (e, item) => {
    if (e.target.checked) {
      let temp = selectedWorkDetail;
      temp.push(item._id);
      setSelectedWorkDetail(temp);
    } else if (!e.target.checked) {
      let temp = selectedWorkDetail;
      const index = temp.indexOf(item._id);
      if (index > -1) {
        temp.splice(index, 1);
      }
      setSelectedWorkDetail(temp);
    }
  };

  const handleValidate = async () => {
    let data = {
      name: selectedWork.name,
      cctp_text: selectedWork.cctp_text,
      bpu_text: selectedWork.bpu_text,
      category: selectedWork.category,
      work_details: [],
    };
    data.work_details = selectedWorkDetail;
    if (data.work_details.length === 0) {
      toast.error(t("Select at least 1 work detail"));
    } else {
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
          setOpenWorkDetailModal(false);
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
        setOpenWorkDetailModal(false);
        getworks();
      }
    }
  };

  return (
    <div style={{ width: "50vw" }}>
      <div style={{ fontSize: 18, marginTop: 10, marginBottom: 10 }}>
        {selectedWork?.name}
      </div>
      <FormGroup>
        {workDetails.map((item) => (
          <FormControlLabel
            control={<Checkbox onChange={(e) => handleCheckbox(e, item)} />}
            label={<div style={{ fontSize: 16 }}>{item.name}</div>}
          />
        ))}
      </FormGroup>
      {currentProject.market_type === "TradesAndTranches" && (
        <>
          <br />
          <h2>{t("Select Tranch")}</h2>
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
      <div
        style={{ display: "flex", justifyContent: "flex-end", marginTop: 10 }}
      >
        <Button
          variant="contained"
          style={{
            backgroundColor: "#3b373c",
            marginRight: "10px",
            height: "35px",
          }}
          onClick={handleValidate}
        >
          {t("Submit")}
        </Button>
      </div>
    </div>
  );
};

export default AddWorkDetailsModal;
