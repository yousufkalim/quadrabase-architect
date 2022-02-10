// init
import React, { useState, useEffect } from "react";
import api from "../../../api";
import { toast } from "react-toastify";

// component
import InputWithLabel from "../../../components/InputWithLabel";
import { useStyles } from "../../../css/projectLibraries";
import { Button } from "@mui/material";

// component
const TranchesModal = () => {
  const classes = useStyles();
  const [name, setName] = useState();
  const [tracnhesData, setTranchesData] = useState();
  const [updateTranch, setUpdateTranch] = useState();

  // useEffect to get all Tranches
  useEffect(() => {
    getTranches();
  }, []);

  const getTranches = async () => {
    const result = await api("get", `/Tranches/`);
    setTranchesData(result.data.tranches);
  };

  // handle update
  const handleUpdate = async () => {
    const result = await api("put", `/Tranches/${updateTranch._id}`, {
      name: updateTranch.name,
    });
    toast.success(result.data.message);
    setUpdateTranch();
    getTranches();
  };

  // handle delete
  const handleDelete = async (id) => {
    const result = await api("delete", `/Tranches/${id}`);
    toast.success(result.data.message);
    setUpdateTranch();
    getTranches();
  };

  // handle submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await api("post", `/Tranches/create`, {
      name,
      ranking:
        tracnhesData.length > 0
          ? tracnhesData[tracnhesData.length - 1].ranking + 1
          : 0,
    });
    toast.success(result.data.message);
    setName();
    getTranches();
  };
  // jsx
  return (
    <>
      <div
        style={{
          maxHeight: 350,
          marginTop: 10,
          marginBottom: 10,
          overflow: "scroll",
          border: "1px solid lightgray",
          padding: 10,
        }}
      >
        {tracnhesData?.map((tranch) => {
          return (
            <div
              style={{
                marginTop: 10,
                marginBottom: 30,
                display: "flex",
              }}
            >
              <InputWithLabel
                label="Name"
                required={true}
                name="text"
                type="text"
                value={
                  !updateTranch || updateTranch?._id !== tranch._id
                    ? tranch.name
                    : updateTranch.name
                }
                handleChange={(e) =>
                  setUpdateTranch((prev) => {
                    prev.name = e.target.value;
                    return { ...prev };
                  })
                }
                style={{ marginRight: 10 }}
                disabled={!updateTranch || updateTranch?._id !== tranch._id}
              />
              {!updateTranch || updateTranch?._id !== tranch._id ? (
                <Button
                  variant="contained"
                  className={classes.btn2}
                  onClick={() => setUpdateTranch(tranch)}
                >
                  Edit
                </Button>
              ) : (
                <Button
                  variant="contained"
                  className={classes.btn2}
                  onClick={handleUpdate}
                >
                  Update
                </Button>
              )}

              <Button
                variant="contained"
                style={{
                  backgroundColor: "lightgray",
                  color: "black",
                  marginLeft: 10,
                  height: 35,
                }}
                onClick={() => handleDelete(tranch._id)}
              >
                Delete
              </Button>
            </div>
          );
        })}
      </div>
      <h2>Add Tranch</h2>
      <form className={classes.smform} onSubmit={handleSubmit}>
        {/* All fields */}
        <br />
        <InputWithLabel
          label="Name"
          required={true}
          name="text"
          type="text"
          value={name}
          handleChange={(e) => setName(e.target.value)}
        />
        <br />
        <br />

        {/* create button */}
        <div style={{ width: "100%", textAlign: "right" }}>
          <Button variant="contained" className={classes.btn} type="submit">
            Add tranch
          </Button>
        </div>
      </form>
    </>
  );
};

export default TranchesModal;
