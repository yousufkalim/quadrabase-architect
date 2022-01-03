// init
import React, { useState } from "react";
import api from "../../../api";
import { toast } from "react-toastify";
import { Store } from "../../../StoreContext";

// component
import InputWithLabel from "../../../components/InputWithLabel";
import { useStyles } from "../../../css/projectLibraries";
import { Button, Grid } from "@mui/material";
import TextEditor from "../../../components/TextEditor";

// component
const AddCategoryModal = ({
  handleOpenAddCatgeoryModal,
  categoryData,
  library,
}) => {
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
    data.libraryId = library;
    data.ranking = categoryData ? categoryData.length : 0;
    const result = await api("post", `/BookLibraries/add/Category`, data);
    toast.success(result.data.message);
    handleOpenAddCatgeoryModal();
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
          Create
        </Button>
      </div>
    </form>
  );
};

export default AddCategoryModal;
