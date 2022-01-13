import React, { useState, useEffect } from "react";

import InputWithLabel from "../../../components/InputWithLabel";
import { Button } from "@mui/material";
import InputDropdown from "../../../components/InputDropdown";
import api from "../../../api";

function Index(props) {
  const { isLoading, ProviderOptions } = props;

  const [Name, setName] = useState("");
  const [Edit, setEdit] = useState(false);
  const [testErrorMessage, settestErrorMessage] = useState("");
  const [docErrorMessage, setdocErrorMessage] = useState("");
  const [documents, setDocuments] = useState([]);

  const handleUpdate = () => {
    setEdit(!Edit);
    if (Edit == false) {
      return;
    }
    if (!Name) {
      settestErrorMessage("Required");
    } else {
      setdocErrorMessage("");
      settestErrorMessage("");
      let obj = { provider: Name, documents: documents };
      props.handleUpdate(obj, props._id);
    }
  };

  useEffect(() => {
    setName(props.name);
    setDocuments(props.documents);
  }, [props]);
  const handleFileChange = async (e) => {
    const files = e.target.files;
    let form_data = new FormData();

    for (let i = 0; i < files.length; i++) {
      form_data.append(`file`, files[i]);
    }
    const response = await api("post", `/fileUploader`, form_data);
    let documents = response.data.files;
    setDocuments(documents);
  };
  return (
    <div
      style={{
        marginTop: 25,
        marginBottom: 20,
      }}
    >
      <form>
        <div
          style={{
            display: "flex",
            justifyContent: "space-around",
            alignItems: "center",
            width: "100%",
          }}
        >
          <div style={{ width: "38.5%" }}>
            <InputDropdown
              name="Name"
              label="Select Provider"
              disabled={Edit ? false : true}
              value={Name}
              onChange={(e) => {
                setName(e.target.value);
                settestErrorMessage("");
              }}
              options={ProviderOptions}
            />
            <div style={{ color: "red" }}>
              <small>{testErrorMessage}</small>
            </div>
          </div>
          <div style={{ width: "38.5%" }}>
            <InputWithLabel
              type="file"
              placeholder="Document"
              label="Document"
              name="documents"
              disabled={Edit ? false : true}
              handleChange={handleFileChange}
              value={documents}
              multiple={true}
            />
            <div>
              <small>{docErrorMessage}</small>
            </div>
          </div>
          <div>
            <div
              style={{
                width: 162,
                display: "flex",
                justifyContent: "space-around",
              }}
            >
              <Button
                onClick={handleUpdate}
                disabled={isLoading}
                default={true}
                style={{ backgroundColor: "#3b373c", width: 75 }}
                variant="contained"
              >
                {Edit ? "Update" : "Edit"}
              </Button>
              <Button
                onClick={props.onDelete}
                disabled={isLoading}
                label={"Delete"}
                default={false}
                style={{ backgroundColor: "#3b373c", width: 75 }}
                variant="contained"
              >
                Delete
              </Button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
export default Index;
