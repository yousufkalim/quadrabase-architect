// init
import React, { useState, useEffect } from "react";
import api from "../../api";
import SubscriptionCard from "./SubscriptionCard";
import { Button } from "@mui/material";
import { Store } from "../../StoreContext";
import { toast } from "react-toastify";
// component
const BuySubscription = ({ mySubscription, handleRenewModalModal }) => {
  const store = Store();
  // states
  const [subscriptions, setSubscriptions] = useState();
  const [selected, setSelected] = useState(""); ///state for selected subscription

  // useEffetct
  useEffect(() => {
    getAllSubscriptions();
  }, []);

  // function to get all subs
  const getAllSubscriptions = async () => {
    try {
      const result = await api("get", `/Subscriptions/getAll/architect`);
      setSubscriptions(result?.data?.subscription);
    } catch (error) {
      console.log(error?.response?.data?.message, "error ");
    }
  };

  // on Buy Subscription click
  const handleClick = async () => {
    const data = {
      subscription: selected,
    };
    const result = await api(
      "put",
      `/licenses/renew/${mySubscription._id}`,
      data
    );
    toast.success(result.data.message);
    handleRenewModalModal();
  };

  return (
    <>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        {subscriptions?.map((item) => (
          <SubscriptionCard
            subscription={item}
            selected={selected}
            setSelected={setSelected}
            component="renew"
          />
        ))}
      </div>
      <div style={{ width: "100%", textAlign: "right" }}>
        <Button
          variant="contained"
          color="primary"
          style={{
            marginRight: 20,
            backgroundColor: !selected ? "lightgray" : "#3b373c",
          }}
          disabled={!selected}
          onClick={handleClick}
        >
          Buy Credits
        </Button>
      </div>
    </>
  );
};

export default BuySubscription;
