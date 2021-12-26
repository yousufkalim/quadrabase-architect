// Init
import React, { useState, useEffect } from "react";
import AddIcon from "@mui/icons-material/Add";
import { useStyles } from "../css/home";
import { SubscriptionheadCells } from "../utils/tableHeads";
import { Store } from "../StoreContext";
import api from "../api";

// Importing Components
import Header from "../components/Header";
import { Button } from "@mui/material";
import SubscriptionTable from "../components/Tabel";
import Modal from "../components/Modal";
import BuySubscription from "./Subscription/BuySubscription";
import AssignSubscription from "./Subscription/AssignSubscription";

// Home Component
export default function Home() {
  const classes = useStyles();
  const store = Store();

  const [subscriptionsData, setSubscriptionsData] = useState([]);
  const [headCells, setheadCells] = useState("");
  const [buySubModal, setBuySubModal] = useState(false);
  const [assignSubModal, setAssignSubModal] = useState(false);
  const [assignSub, setAssignSub] = useState({
    id: "",
    email: "",
  });

  useEffect(() => {
    let array = [];
    SubscriptionheadCells.slice(0, SubscriptionheadCells.length - 1).map(
      (cell) => array.push(cell.id)
    );
    setheadCells(array);
  }, []);

  useEffect(() => {
    getSubscriptions();
  }, [buySubModal, assignSubModal]);

  const getSubscriptions = async () => {
    try {
      const result = await api("get", `/licenses/${store.user._id}`);
      setSubscriptionsData(result.data.license);
    } catch (error) {
      if (error.response) console.log(error.response.data.message, "error ");
    }
  };

  const handleBuySubModal = () => setBuySubModal(!buySubModal);
  const handleAssignSubModal = (id, email) => {
    if (id && email) {
      setAssignSub({ id, email });
    } else if (id) {
      setAssignSub({ id });
    }
    setAssignSubModal(!assignSubModal);
  };

  return (
    <div>
      <Header />
      <Modal
        title="Buy Subscription"
        open={buySubModal}
        onClose={handleBuySubModal}
        component={<BuySubscription handleBuySubModal={handleBuySubModal} />}
      />
      <Modal
        title="Assign Subscription"
        open={assignSubModal}
        onClose={handleAssignSubModal}
        component={
          <AssignSubscription
            assignSub={assignSub}
            handleAssignSubModal={handleAssignSubModal}
          />
        }
      />
      <div>
        <div className={classes.sub_container}>
          <div className={classes.flex_container}>
            <span style={{ fontSize: 24 }}>
              <i>My Subscriptions</i>
            </span>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              style={{ backgroundColor: "#3b373c" }}
              onClick={handleBuySubModal}
            >
              Buy Subscriptiion
            </Button>
          </div>
          <div style={{ marginTop: 10 }}>
            <SubscriptionTable
              headCells={SubscriptionheadCells}
              data={subscriptionsData}
              rows={headCells}
              handleAssign={handleAssignSubModal}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
