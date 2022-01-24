// init
import React, { useState } from "react";
import api from "../../../api";
import { Button, Grid } from "@mui/material";
import { Store } from "../../../StoreContext";
import { toast } from "react-toastify";
import InputWithLabel from "../../../components/InputWithLabel";
import { useStyles } from "../../../css/addStakeholder";
import RichTextEditor from "../../../components/RichTextEditor";

// component
const AddChap0Part2 = ({ handleAddChap0Part2Modal }) => {
  const store = Store();
  const classes = useStyles();
  // states
  const [title, setTitle] = useState("");
  const [text, setText] = useState("");

  // handle Submit function
  const handleSubmit = async (e) => {
    e.preventDefault();
    let data = {
      title,
      text,
    };
    data.architect = store.user._id;
    const result = await api("post", `/ArchitectsChap0/create/`, data);
    toast.success(result.data.message);
    handleAddChap0Part2Modal();
  };

  // jsx
  return (
    <>
      <div
        className={classes.container}
        style={{ maxHeight: 600, overflow: "auto" }}
      >
        <form className={classes.form} onSubmit={handleSubmit}>
          {/* All fields */}
          <br />
          <InputWithLabel
            label="Title"
            required={true}
            name="title"
            type="text"
            value={title}
            handleChange={(e) => setTitle(e.target.value)}
          />
          <br />
          <br />
          <label htmlFor="grid-first-name">Text</label>
          <br />
          <br />
          <RichTextEditor value={text} setValue={setText} />
          <br />

          {/* create button */}
          <div style={{ width: "100%", textAlign: "right" }}>
            <Button variant="contained" className={classes.btn} type="submit">
              Create
            </Button>
          </div>
        </form>
      </div>
    </>
  );
};

export default AddChap0Part2;
