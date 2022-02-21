// init
import React, { useState, useEffect } from "react";
import api from "../../../api";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";

// component
import InputWithLabel from "../../../components/InputWithLabel";
import RichTextEditor from "../../../components/RichTextEditor";
import { Button } from "@mui/material";

const EditChap0Part2 = ({
  handleOpenEditChap0Part2Modal,
  editChap0Part2,
  currentProject,
  getProject,
}) => {
  const { t } = useTranslation();
  const [title, setTitle] = useState("");
  const [text, setText] = useState("");

  useEffect(() => {
    editChap0Part2 && setTitle(editChap0Part2.id.title);
    editChap0Part2 && setText(editChap0Part2.id.text);
  }, [editChap0Part2]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    let data = {
      title,
      text,
      status: editChap0Part2.status,
    };
    const result = await api(
      "put",
      `/ArchitectsChap0/updateByProject/${currentProject._id}/${editChap0Part2.id._id}`,
      data,
      t
    );
    toast.success(t(result.data.message));
    handleOpenEditChap0Part2Modal();
    getProject();
  };

  return (
    <div style={{ width: "45vw", maxHeight: 600, overflow: "auto" }}>
      <form onSubmit={handleSubmit}>
        {/* All fields */}
        <br />
        <InputWithLabel
          label={t("Title")}
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
        <RichTextEditor value={editChap0Part2.id.text} setValue={setText} />
        <br />

        {/* create button */}
        <div style={{ width: "100%", textAlign: "right" }}>
          <Button
            variant="contained"
            style={{
              backgroundColor: "#3b373c",
              height: "35px",
            }}
            type="submit"
          >
            {t("Update")}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default EditChap0Part2;
