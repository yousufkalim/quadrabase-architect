// init
import React, { useState, useEffect } from "react";
import api from "../../../api";
import { toast } from "react-toastify";

// component
import InputWithLabel from "../../../components/InputWithLabel";
import { useStyles } from "../../../css/projectLibraries";
import { Button, Grid } from "@mui/material";
import TextEditor from "../../../components/TextEditor";

// component
const EditCategoryModal = ({ handleOpenEditCatgeoryModal, category }) => {
  const classes = useStyles();
  // states
  const [values, setValues] = useState({
    name: "",
    cctp_text: [],
  });
  const [cctp_text1, setcctp_text1] = React.useState("");
  const [cctp_text2, setcctp_text2] = React.useState("");
  const [cctp_text3, setcctp_text3] = React.useState("");
  const [cctp_text4, setcctp_text4] = React.useState("");

  useEffect(() => {
    category &&
      setValues((prev) => {
        prev.name = category.name;
        prev.cctp_text = [];
        return { ...prev };
      });
    category.cctp_text[0] && setcctp_text1(category.cctp_text[0]);
    category.cctp_text[1] && setcctp_text2(category.cctp_text[1]);
    category.cctp_text[2] && setcctp_text3(category.cctp_text[2]);
    category.cctp_text[3] && setcctp_text4(category.cctp_text[3]);
  }, [category]);

  // handle change function
  const handleChange = (name, value) => {
    setValues((prev) => {
      prev[name] = value;
      return { ...prev };
    });
  };

  // handle Submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    let data = values;
    data.cctp_text = [];
    cctp_text1 && data.cctp_text.push(cctp_text1);
    cctp_text2 && data.cctp_text.push(cctp_text2);
    cctp_text3 && data.cctp_text.push(cctp_text3);
    cctp_text4 && data.cctp_text.push(cctp_text4);
    const result = await api(
      "put",
      `/BookLibraries/update/editCategory/${category._id}`,
      data
    );
    toast.success(result.data.message);
    handleOpenEditCatgeoryModal();
  };

  // jsx
  return (
    <form className={classes.form} onSubmit={handleSubmit}>
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
      <div style={{ height: 210, marginBottom: -20 }}>
        <Grid container spacing={2}>
          <Grid item zeroMinWidth xs>
            <TextEditor
              onChange={(value) => setcctp_text1(value)}
              value={cctp_text1}
              label={"CCTP 1"}
            />
          </Grid>
          <Grid item zeroMinWidth xs>
            <TextEditor
              onChange={(value) => setcctp_text2(value)}
              value={cctp_text2}
              label={"CCTP 2"}
            />
          </Grid>
        </Grid>
      </div>
      <br />
      <br />
      <div style={{ height: 210 }}>
        <Grid container spacing={2}>
          <Grid item zeroMinWidth xs>
            <TextEditor
              onChange={(value) => setcctp_text3(value)}
              value={cctp_text3}
              label={"CCTP 3"}
            />
          </Grid>
          <Grid item zeroMinWidth xs>
            <TextEditor
              onChange={(value) => setcctp_text4(value)}
              value={cctp_text4}
              label={"CCTP 4"}
            />
          </Grid>
        </Grid>
      </div>
      <br />

      {/* create button */}
      <div style={{ width: "100%", textAlign: "right" }}>
        <Button variant="contained" className={classes.btn} type="submit">
          Update
        </Button>
      </div>
    </form>
  );
};

export default EditCategoryModal;
