// init
import React, { useState, useEffect } from "react";
import api from "../../api";
import InputWithLabel from "../../components/InputWithLabel";
import { Button } from "@mui/material";
import { toast } from "react-toastify";
import { UpdateStore } from "../../StoreContext";
import { useTranslation } from "react-i18next";

// component
const BuySubscription = ({ assignSub, handleAssignSubModal }) => {
  const { t } = useTranslation();
  const updateStore = UpdateStore();
  const [email, setEmail] = useState("");

  useEffect(() => {
    setEmail(assignSub?.email);
  }, []);

  // on Buy Subscription click
  const onSubmit = async (e) => {
    e.preventDefault();
    const data = {
      email: email,
    };
    const result = await api("put", `/licenses/${assignSub.id}`, data);
    const response = await api("get", "/Architects/current/loggedIn");
    if (response.data.user) {
      updateStore({ loggedIn: true, user: response.data.user });
    }
    toast.success(result.data.message);
    handleAssignSubModal();
  };
  return (
    <div>
      {/* Login form */}
      <form onSubmit={onSubmit}>
        <br />
        <InputWithLabel
          value={email}
          label="Email"
          name="email"
          type="email"
          handleChange={(e) => setEmail(e.target.value)}
          style={{ width: 450 }}
        />
        <br />
        <br />
        <div style={{ width: "104.5%", textAlign: "right" }}>
          <Button
            variant="contained"
            color="primary"
            style={{
              marginRight: 20,
              backgroundColor: "#3b373c",
            }}
            type="submit"
          >
            {t("Assign Subscription")}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default BuySubscription;
