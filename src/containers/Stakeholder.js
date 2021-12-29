// init
import React, { useState, useEffect } from "react";
import Header from "../components/Header";
import StakeholdersTable from "../components/Tabel";
import { StakeholderheadCells } from "../utils/tableHeads";
import { useStyles } from "../css/stakeholder";
import { Button } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import Modal from "../components/Modal";
import DeleteModal from "../components/DeleteModal";
import AddStakeholder from "./Stakeholder/AddStakholder";
import EditStakholder from "./Stakeholder/EditStakholder";
import api from "../api";
import { Store } from "../StoreContext";

// component
const Stakeholder = () => {
  const classes = useStyles();
  const store = Store();

  //   states
  const [stakeholdersData, setStakeholdersData] = useState([]);
  const [headCells, setheadCells] = useState("");
  const [addStakeholderModal, setAddStakeholderModal] = useState(false);
  const [editStakeholderModal, setEditStakeholderModal] = useState(false);
  const [editStakeholder, setEditStakeholder] = useState({});
  const [deleteStakeholderModal, setDeleteStakeholderModal] = useState(false);
  const [deleteStakeholder, setDeleteStakeholder] = useState();

  //   useEffect to setheadcells
  useEffect(() => {
    let array = [];
    StakeholderheadCells.slice(0, StakeholderheadCells.length - 1).map((cell) =>
      array.push(cell.id)
    );
    setheadCells(array);
  }, []);

  //   useEffect to get stakeholders
  useEffect(() => {
    getStakeholders();
  }, [addStakeholderModal, editStakeholderModal, deleteStakeholderModal]);

  //   func to get stakeholders
  const getStakeholders = async () => {
    try {
      const result = await api("get", `/Architects/current/getStakeholders`);
      setStakeholdersData(result.data.stakeholders);
    } catch (error) {
      if (error.response) console.log(error.response.data.message, "error ");
    }
  };

  //   func to delete stakeholders
  const handleDelete = async () => {
    try {
      console.log("deleteStakeholder", deleteStakeholder);
      const result = await api(
        "delete",
        `/stakeholder/${deleteStakeholder}/${store.user._id}`
      );
      console.log("resulr", result);
      handleDeleteStakeholderModal();
    } catch (error) {
      if (error.response) console.log(error.response.data.message, "error ");
    }
  };

  //   funct to open/close modal
  const handleAddStakeholderModal = () =>
    setAddStakeholderModal(!addStakeholderModal);

  const handleEditStakeholderModal = (stakeholder) => {
    if (stakeholder) {
      setEditStakeholder(stakeholder);
    }
    setEditStakeholderModal(!editStakeholderModal);
  };

  const handleDeleteStakeholderModal = (id) => {
    if (id) {
      setDeleteStakeholder(id);
    }
    setDeleteStakeholderModal(!deleteStakeholderModal);
  };

  // jsx
  return (
    <div>
      <Header />
      <Modal
        title="Add Stakeholder"
        open={addStakeholderModal}
        onClose={handleAddStakeholderModal}
        component={
          <AddStakeholder
            handleAddStakeholderModal={handleAddStakeholderModal}
          />
        }
      />
      <Modal
        title="Edit Stakeholder"
        open={editStakeholderModal}
        onClose={handleEditStakeholderModal}
        component={
          <EditStakholder
            stakeholder={editStakeholder}
            handleEditStakeholderModal={handleEditStakeholderModal}
          />
        }
      />
      <Modal
        open={deleteStakeholderModal}
        onClose={handleDeleteStakeholderModal}
        component={
          <DeleteModal
            handleCancel={handleDeleteStakeholderModal}
            handleDelete={handleDelete}
          />
        }
      />
      <div className={classes.container}>
        <div className={classes.flex_container}>
          <span style={{ fontSize: 24 }}>
            <i>Stakeholders</i>
          </span>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            style={{ backgroundColor: "#3b373c" }}
            onClick={handleAddStakeholderModal}
          >
            Add Stakeholder
          </Button>
        </div>
        <div>
          <StakeholdersTable
            headCells={StakeholderheadCells}
            data={stakeholdersData}
            rows={headCells}
            handleEdit={handleEditStakeholderModal}
            handleDelete={handleDeleteStakeholderModal}
          />
        </div>
      </div>
    </div>
  );
};

export default Stakeholder;
