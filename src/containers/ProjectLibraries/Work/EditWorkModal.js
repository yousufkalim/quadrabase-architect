// init
import React, { useState, useEffect } from "react";
import api from "../../../api";
import { toast } from "react-toastify";
import { Store } from "../../../StoreContext";

// component
import InputWithLabel from "../../../components/InputWithLabel";
import { useStyles } from "../../../css/projectLibraries";
import { Button, Grid } from "@mui/material";
import TextEditor from "../../../components/TextEditor";
import InputDropdown from "../../../components/InputDropdown";
import AddMemoizedProvider from "../component/MemorizedProvider";
import AddMemoizedProviders from "../component/MemoizedProviders";
import DocViewer from "../component/DocViewer";

// component
const EditWorkModal = ({ handleOpenEditWorkModal, work }) => {
  const classes = useStyles();
  // states
  const [values, setValues] = useState({
    name: "",
    unit: "",
    unit_price: "",
    cctp_text: [],
    bpu_text: [],
  });
  const [options, setOptions] = useState([]);
  const [ProviderOptions, setProviderOptions] = React.useState([]);
  const [cctp_text1, setcctp_text1] = useState("");
  const [cctp_text2, setcctp_text2] = useState("");
  const [cctp_text3, setcctp_text3] = useState("");
  const [bpu_text1, setbpu_text1] = useState("");
  const [bpu_text2, setbpu_text2] = useState("");
  const [bpu_text3, setbpu_text3] = useState("");
  const [ProviderDataArr, setProviderDataArr] = React.useState([]);
  // useEffect to set intial data
  useEffect(() => {
    work &&
      setValues((prev) => {
        prev.name = work.name;
        prev.unit = work.unit;
        prev.unit_price = work.unit_price;
        prev.cctp_text = [];
        prev.bpu_text = [];
        return { ...prev };
      });
    work.cctp_text[0] && setcctp_text1(work.cctp_text[0]);
    work.cctp_text[1] && setcctp_text2(work.cctp_text[1]);
    work.cctp_text[2] && setcctp_text3(work.cctp_text[2]);
    work.bpu_text[0] && setbpu_text1(work.bpu_text[0]);
    work.bpu_text[1] && setbpu_text2(work.bpu_text[1]);
    work.bpu_text[2] && setbpu_text3(work.bpu_text[2]);
    work.providers && setProviderDataArr(work.providers);
  }, [work]);
  // useEffect to get all units
  useEffect(() => {
    getUnits();
    getAllProviders();
  }, []);

  // func to getAll Units
  const getUnits = async () => {
    const result = await api("get", `/Units/get`);
    setOptions(result.data.units);
  };

  // func to getAll Providers
  const getAllProviders = async () => {
    const result = await api("get", `/Providers/get/all`);
    setProviderOptions(result.data.providers);
  };

  // handle change function
  const handleChange = (name, value) => {
    setValues((prev) => {
      prev[name] = value;
      return { ...prev };
    });
  };

  const handleAdd = (obj) => {
    setProviderDataArr([...ProviderDataArr, obj]);
  };

  const handleDelete = async (id) => {
    let filteredData = ProviderDataArr.filter((dt) => dt.provider !== id);
    setProviderDataArr(filteredData);
  };

  const handleUpdate = (obj) => {
    let filteredIndex = ProviderDataArr.findIndex(
      (dt) => dt.provider == obj.provider
    );
    setProviderDataArr((prev) => {
      prev[filteredIndex] = obj;
      return [...prev];
    });
  };

  // handle Submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    let data = values;
    data.cctp_text = [];
    data.bpu_text = [];
    cctp_text1 && data.cctp_text.push(cctp_text1);
    cctp_text2 && data.cctp_text.push(cctp_text2);
    cctp_text3 && data.cctp_text.push(cctp_text3);
    bpu_text1 && data.bpu_text.push(bpu_text1);
    bpu_text2 && data.bpu_text.push(bpu_text2);
    bpu_text3 && data.bpu_text.push(bpu_text3);
    data.providers = ProviderDataArr;
    const result = await api(
      "put",
      `/BookLibraries/edit/Work/${work._id}`,
      data
    );
    toast.success(result.data.message);
    handleOpenEditWorkModal();
  };

  // jsx
  return (
    <form className={classes.form} onSubmit={handleSubmit}>
      {/* All fields */}
      <br />
      <Grid container spacing={2}>
        <Grid item zeroMinWidth xs>
          <InputWithLabel
            label="Name"
            required={true}
            name="name"
            type="text"
            value={values.name}
            handleChange={(e) => handleChange(e.target.name, e.target.value)}
            required={true}
          />
        </Grid>
        <Grid item zeroMinWidth xs>
          <InputWithLabel
            name="unit_price"
            label="PU HT"
            value={values.unit_price}
            handleChange={(e) => handleChange(e.target.name, e.target.value)}
            required={true}
          />
        </Grid>
        <Grid item zeroMinWidth xs>
          <InputDropdown
            name="unit"
            label="Unit"
            value={values.unit}
            onChange={(e) => handleChange(e.target.name, e.target.value)}
            options={options}
          />
        </Grid>
      </Grid>

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
          <Grid item zeroMinWidth xs>
            <TextEditor
              onChange={(value) => setcctp_text3(value)}
              value={cctp_text3}
              label={"CCTP 3"}
            />
          </Grid>
        </Grid>
      </div>
      <br />
      <br />
      <br />
      <div style={{ height: 210 }}>
        <Grid container spacing={2}>
          <Grid item zeroMinWidth xs>
            <TextEditor
              onChange={(value) => setbpu_text1(value)}
              value={bpu_text1}
              label={"BPU 1"}
            />
          </Grid>
          <Grid item zeroMinWidth xs>
            <TextEditor
              onChange={(value) => setbpu_text2(value)}
              value={bpu_text2}
              label={"BPU 2"}
            />
          </Grid>
          <Grid item zeroMinWidth xs>
            <TextEditor
              onChange={(value) => setbpu_text3(value)}
              value={bpu_text3}
              label={"BPU 3"}
            />
          </Grid>
        </Grid>
      </div>
      <br />
      <br />
      <div>
        <AddMemoizedProvider
          ProviderOptions={ProviderOptions}
          onAdd={handleAdd}
        />
      </div>
      <br />
      <div>
        {console.log(ProviderDataArr)}
        {ProviderDataArr && ProviderDataArr.length > 0 ? (
          <>
            <div
              style={{
                width: "100%",
                border: "1px solid lightgray",
                padding: 20,
                marginBottom: 20,
              }}
            >
              {ProviderDataArr &&
                ProviderDataArr.map(({ documents, provider }, index) => (
                  <div key={index} className="mt-2">
                    <AddMemoizedProviders
                      _id={index}
                      name={provider}
                      documents={documents}
                      ProviderOptions={ProviderOptions}
                      onDelete={() => handleDelete(provider)}
                      handleUpdate={handleUpdate}
                    />
                    {documents && (
                      <div>
                        <DocViewer
                          documents={documents}
                          style={{ maxHeight: "200px" }}
                        />
                      </div>
                    )}
                  </div>
                ))}
            </div>
          </>
        ) : (
          ""
        )}
      </div>

      {/* create button */}
      <div style={{ width: "100%", textAlign: "right" }}>
        <Button variant="contained" className={classes.btn} type="submit">
          Update
        </Button>
      </div>
    </form>
  );
};

export default EditWorkModal;
