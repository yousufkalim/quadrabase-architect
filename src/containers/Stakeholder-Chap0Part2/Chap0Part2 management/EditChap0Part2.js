// init
import React, { useState, useEffect } from "react";
import api from "../../../api";
import { Button, Grid } from "@mui/material";
import { Store } from "../../../StoreContext";
import { toast } from "react-toastify";
import InputWithLabel from "../../../components/InputWithLabel";
import { useStyles } from "../../../css/addStakeholder";
import RichTextEditor from "../../../components/RichTextEditor";
import { useTranslation } from "react-i18next";

// component
const EditChap0Part2 = ({ handleEditChap0Part2Modal, Chap0Part2 }) => {
  const { t } = useTranslation();
  const store = Store();
  const classes = useStyles();
  // states
  const [title, setTitle] = useState("");
  const [text, setText] = useState("");

  // useEffect to set values
  useEffect(() => {
    setTitle(Chap0Part2.title);
    setText(Chap0Part2.text);
  }, [Chap0Part2]);

  // handle Submit function
  const handleSubmit = async (e) => {
    e.preventDefault();
    let data = {
      title,
      text,
    };
    const result = await api("put", `/ArchitectsChap0/${Chap0Part2._id}`, data);
    toast.success(result.data.message);
    handleEditChap0Part2Modal();
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
          <label htmlFor="grid-first-name">{t("Text")}</label>
          <br />
          <br />
          <RichTextEditor value={Chap0Part2.text} setValue={setText} />
          <br />

          {/* create button */}
          <div style={{ width: "100%", textAlign: "right" }}>
            <Button variant="contained" className={classes.btn} type="submit">
              {t("Update")}
            </Button>
          </div>
        </form>
      </div>
    </>
  );
};

export default EditChap0Part2;
