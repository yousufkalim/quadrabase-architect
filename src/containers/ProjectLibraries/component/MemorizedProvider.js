import React, { useState } from "react";

import InputWithLabel from "../../../components/InputWithLabel";
import { Button } from "@mui/material";
import InputDropdown from "../../../components/InputDropdown";
import api from "../../../api";

function Index(props) {
  const { ProviderOptions } = props;
  const [Name, setName] = useState("");
  const [documents, setDocuments] = useState([]);

  const [testErrorMessage, settestErrorMessage] = useState("");
  const [docErrorMessage, setdocErrorMessage] = useState("");

  const handleAdd = () => {
    // console.log(Name);
    if (!Name) {
      settestErrorMessage("Required");
    } else {
      settestErrorMessage("");

      let obj = { provider: Name, documents: documents };
      props.onAdd(obj);
      setName("");
    }
  };
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
    <div>
      <form>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            width: "90%",
            margin: "10px 0",
          }}
        >
          <div style={{ width: "40%" }}>
            <InputDropdown
              name="Name"
              label="Select Provider"
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
          <div style={{ width: "40%" }}>
            <InputWithLabel
              type="file"
              placeholder="Document"
              label="Document"
              name="document"
              handleChange={handleFileChange}
              multiple={true}
            />
            <div>
              <small>{docErrorMessage}</small>
            </div>
          </div>
          <div style={{ width: "18%" }}>
            <Button
              onClick={handleAdd}
              style={{ backgroundColor: "#3b373c", width: 150 }}
              variant="contained"
            >
              Add Provider
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
export const MemoizedIndex = React.memo(Index);
export default MemoizedIndex;
