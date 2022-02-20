// init
import React, { useState, useEffect } from "react";
import api from "../../../api";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";

// component
import InputWithLabel from "../../../components/InputWithLabel";
import { useStyles } from "../../../css/projectLibraries";
import { Button } from "@mui/material";

// component
const AddFamilyModal = () => {
  const { t } = useTranslation();
  const classes = useStyles();
  const [name, setName] = useState();
  const [familiesData, setFamiliesData] = useState();
  const [updateFamily, setUpdateFamily] = useState();

  // useEffect to get all families
  useEffect(() => {
    getFamilies();
  }, []);

  const getFamilies = async () => {
    const result = await api("get", `/Families/architect/getAll`);
    setFamiliesData(result.data.families);
  };

  // handle update
  const handleUpdate = async () => {
    const result = await api("put", `/Families/update/${updateFamily._id}`, {
      name: updateFamily.name,
    });
    toast.success(result.data.message);
    setUpdateFamily();
    getFamilies();
  };

  // handle delete
  const handleDelete = async (id) => {
    const result = await api("delete", `/Families/delete/${id}`);
    toast.success(result.data.message);
    setUpdateFamily();
    getFamilies();
  };

  // handle submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await api("post", `/Families/architect/create`, { name });
    toast.success(result.data.message);
    setName();
    getFamilies();
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
        {familiesData?.map((family) => {
          return (
            <div
              style={{
                marginTop: 10,
                marginBottom: 30,
                display: "flex",
              }}
            >
              <InputWithLabel
                label={t("Name")}
                required={true}
                name="text"
                type="text"
                value={
                  !updateFamily || updateFamily?._id !== family._id
                    ? family.name
                    : updateFamily.name
                }
                handleChange={(e) =>
                  setUpdateFamily((prev) => {
                    prev.name = e.target.value;
                    return { ...prev };
                  })
                }
                style={{ marginRight: 10 }}
                disabled={!updateFamily || updateFamily?._id !== family._id}
              />
              {!updateFamily || updateFamily?._id !== family._id ? (
                <Button
                  variant="contained"
                  className={classes.btn2}
                  onClick={() => setUpdateFamily(family)}
                >
                  {t("Edit")}
                </Button>
              ) : (
                <Button
                  variant="contained"
                  className={classes.btn2}
                  onClick={handleUpdate}
                >
                  {t("Update")}
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
                onClick={() => handleDelete(family._id)}
              >
                {t("Delete")}
              </Button>
            </div>
          );
        })}
      </div>
      <form className={classes.smform} onSubmit={handleSubmit}>
        {/* All fields */}
        <br />
        <InputWithLabel
          label={t("Name")}
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
            {t("Add Family")}
          </Button>
        </div>
      </form>
    </>
  );
};

export default AddFamilyModal;
