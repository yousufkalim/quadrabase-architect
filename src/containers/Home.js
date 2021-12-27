// Init
import React, { useState, useEffect } from "react";
import AddIcon from "@mui/icons-material/Add";
import { useStyles } from "../css/home";
import { SubscriptionheadCells } from "../utils/tableHeads";
import { Store } from "../StoreContext";
import api from "../api";
import { Divider } from "@mui/material";
import moment from "moment";
import RefreshIcon from "@mui/icons-material/Refresh";

// Importing Components
import Header from "../components/Header";
import { Button } from "@mui/material";
import SubscriptionTable from "../components/Tabel";
import Modal from "../components/Modal";
import BuySubscription from "./Subscription/BuySubscription";
import AssignSubscription from "./Subscription/AssignSubscription";
import BuyCredits from "./Subscription/BuyCredits";
import Renew from "./Subscription/Renew";

// Home Component
export default function Home() {
  const classes = useStyles();
  const store = Store();

  const [subscriptionsData, setSubscriptionsData] = useState([]);
  const [mySubscription, setMySubscription] = useState({});
  const [headCells, setheadCells] = useState("");
  const [buySubModal, setBuySubModal] = useState(false);
  const [assignSubModal, setAssignSubModal] = useState(false);
  const [buyCreditsModal, setBuyCreditsModal] = useState(false);
  const [renewModal, setRenewModal] = useState(false);
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
  }, [buySubModal, assignSubModal, buyCreditsModal, renewModal]);

  const getSubscriptions = async () => {
    try {
      const result = await api("get", `/licenses/${store.user._id}`);
      setSubscriptionsData(result.data.license);
      let current = result.data?.license?.find((item) => {
        return item?.assigned_to?._id === store?.user?._id;
      });
      setMySubscription(current);
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
  const handleBuyCreditsModal = () => setBuyCreditsModal(!buyCreditsModal);
  const handleRenewModalModal = () => setRenewModal(!renewModal);

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
      <Modal
        title="Buy Credits"
        open={buyCreditsModal}
        onClose={handleBuyCreditsModal}
        component={
          <BuyCredits
            mySubscription={mySubscription}
            handleBuyCreditsModal={handleBuyCreditsModal}
          />
        }
      />
      <Modal
        title="Renew Subscription"
        open={renewModal}
        onClose={handleRenewModalModal}
        component={
          <Renew
            mySubscription={mySubscription}
            handleRenewModalModal={handleRenewModalModal}
          />
        }
      />
      <div>
        <div className={classes.sub_container}>
          <div className={classes.flex_container}>
            <span style={{ fontSize: 24 }}>
              <i>Subscriptions</i>
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
          <span style={{ fontSize: 24 }}>
            <i>My Subscription</i>
          </span>
          <div className={classes.my_sub}>
            {!mySubscription ? (
              <span className={classes.my_sub_info}>
                No Subscription Assigned
              </span>
            ) : (
              <>
                <span className={classes.my_sub_info}>
                  <div>Name:</div>{" "}
                  <div>{mySubscription?.subscription?.name}</div>
                </span>
                <span className={classes.my_sub_info}>
                  <div>Number of remaining projects:</div>{" "}
                  <div>{mySubscription?.credit}</div>
                </span>
                {mySubscription?.assigned_to?._id === store?.user?._id && (
                  <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    style={{ backgroundColor: "#3b373c", marginBottom: 10 }}
                    onClick={handleBuyCreditsModal}
                  >
                    Buy Credits
                  </Button>
                )}
                <Divider variant="middle" style={{ marginBottom: 10 }} />
                <span className={classes.my_sub_info}>
                  <div>Subscription Valid until:</div>{" "}
                  <div>
                    {moment(mySubscription?.end_date).format("DD/MM/YYYY")}
                  </div>
                </span>
                {mySubscription?.assigned_to?._id === store?.user?._id && (
                  <Button
                    variant="contained"
                    startIcon={<RefreshIcon />}
                    style={{ backgroundColor: "#3b373c", marginBottom: 10 }}
                    onClick={handleRenewModalModal}
                  >
                    renew
                  </Button>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
