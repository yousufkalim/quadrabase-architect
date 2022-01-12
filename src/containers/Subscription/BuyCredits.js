// init
import React, { useState, useEffect } from "react";
import api from "../../api";
import SubscriptionCard from "./SubscriptionCard";
import { Button } from "@mui/material";
import { Store } from "../../StoreContext";
import { toast } from "react-toastify";
// component
const BuySubscription = ({ mySubscription, handleBuyCreditsModal }) => {
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
    const result = await api("get", `/Subscriptions/getAll/architect`);
    setSubscriptions(result?.data?.subscription);
  };

  // on Buy Subscription click
  // const handleClick = async () => {
  //   const data = {
  //     line_items: [
  //       {
  //         price_data: {
  //           currency: "eur",
  //           product_data: {
  //             name: selected.name,
  //           },
  //           unit_amount: parseInt(selected.price) * 100,
  //         },
  //         quantity: 1,
  //       },
  //     ],
  //     metaData: {
  //       type: "buy credits",
  //       subscription: selected._id,
  //       licenseId: mySubscription._id,
  //     },
  //   };
  //   const result = await api("post", `/licenses/checkout/`, data);
  //   window.location = result.data.url;
  //   handleBuyCreditsModal();
  // };

  // on Buy Subscription click
  const handleClick = async () => {
    const data = {
      subscription: selected._id,
    };
    const result = await api(
      "put",
      `/licenses/buycredits/${mySubscription._id}`,
      data
    );
    toast.success(result.data.message);
    handleBuyCreditsModal();
  };

  return (
    <>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        {subscriptions?.map((item) => (
          <SubscriptionCard
            subscription={item}
            selected={selected}
            setSelected={setSelected}
            component="buy Credits"
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
