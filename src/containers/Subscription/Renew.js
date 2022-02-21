// init
import React, { useState, useEffect } from "react";
import api from "../../api";
import SubscriptionCard from "./SubscriptionCard";
import { Button } from "@mui/material";
import { Store } from "../../StoreContext";
import { toast } from "react-toastify";
import { UpdateStore } from "../../StoreContext";
import { useTranslation } from "react-i18next";

// component
const BuySubscription = ({ mySubscription, handleRenewModalModal }) => {
  const { t } = useTranslation();
  const store = Store();
  const updateStore = UpdateStore();
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
  //       type: "renew",
  //       subscription: selected._id,
  //       licenseId: mySubscription._id,
  //     },
  //   };
  //   const result = await api("post", `/licenses/checkout/`, data);
  //   window.location = result.data.url;
  //   handleRenewModalModal();
  // };

  // on Buy Subscription click
  const handleClick = async () => {
    const data = {
      subscription: selected._id,
    };
    const result = await api(
      "put",
      `/licenses/renew/${mySubscription._id}`,
      data,
      t
    );
    toast.success(t(result.data.message));
    const response = await api("get", "/Architects/current/loggedIn");
    if (response.data.user) {
      updateStore({ loggedIn: true, user: response.data.user });
    }
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
          {t("Buy Credits")}
        </Button>
      </div>
    </>
  );
};

export default BuySubscription;
