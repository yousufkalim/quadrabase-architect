import React from "react";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Button from "@mui/material/Button";
import api from "../../../api";
import { toast } from "react-toastify";

const AddWorkDetailsModal = ({
  selectedWork,
  workDetails,
  selectedWorkDetail,
  setSelectedWorkDetail,
  setOpenWorkDetailModal,
  setSelectedWork,
  currentProject,
}) => {
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
      work_details: [],
    };
    data.work_details = selectedWorkDetail;
    const result = await api(
      "post",
      `/project/addWork/${currentProject._id}`,
      data
    );
    toast.success(result.data.message);
    setSelectedWorkDetail([]);
    setSelectedWork();
    setOpenWorkDetailModal(false);
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
          Submit
        </Button>
      </div>
    </div>
  );
};

export default AddWorkDetailsModal;
