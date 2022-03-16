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
const TradesModal = () => {
  const { t } = useTranslation();
  const classes = useStyles();
  const [name, setName] = useState();
  const [tradesData, setTradesData] = useState();
  const [updateTrade, setUpdateTrade] = useState();

  // useEffect to get all Trades
  useEffect(() => {
    getTrades();
  }, []);

  const getTrades = async () => {
    const result = await api("get", `/Trades/`);
    console.log("result", result);
    setTradesData(result.data.trades);
  };

  // handle update
  const handleUpdate = async () => {
    const result = await api(
      "put",
      `/Trades/${updateTrade._id}`,
      {
        name: updateTrade.name,
      },
      t
    );
    toast.success(t(result.data.message));
    setUpdateTrade();
    getTrades();
  };

  // handle delete
  const handleDelete = async (id) => {
    const result = await api("delete", `/Trades/${id}`, {}, t);
    toast.success(t(result.data.message));
    setUpdateTrade();
    getTrades();
  };

  // handle submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await api(
      "post",
      `/Trades/create`,
      {
        name,
        ranking:
          tradesData?.length > 0
            ? tradesData[tradesData.length - 1].ranking + 1
            : 0,
      },
      t
    );
    toast.success(t(result.data.message));
    setName();
    getTrades();
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
        {tradesData?.map((trade) => {
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
                  !updateTrade || updateTrade?._id !== trade._id
                    ? trade.name
                    : updateTrade.name
                }
                handleChange={(e) =>
                  setUpdateTrade((prev) => {
                    prev.name = e.target.value;
                    return { ...prev };
                  })
                }
                style={{ marginRight: 10 }}
                disabled={!updateTrade || updateTrade?._id !== trade._id}
              />
              {!updateTrade || updateTrade?._id !== trade._id ? (
                <Button
                  variant="contained"
                  className={classes.btn2}
                  onClick={() => setUpdateTrade(trade)}
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
                onClick={() => handleDelete(trade._id)}
              >
                {t("Delete")}
              </Button>
            </div>
          );
        })}
      </div>
      <h2>{t("Add Trade")}</h2>
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
            {t("Add Trade")}
          </Button>
        </div>
      </form>
    </>
  );
};

export default TradesModal;
