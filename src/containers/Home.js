// Init
import React, { useState, useEffect } from "react";
import AddIcon from "@mui/icons-material/Add";
import { useStyles } from "../css/home";
import { SubscriptionheadCells } from "../utils/tableHeads";
import { ProjectheadCells } from "../utils/tableHeads";
import { Store } from "../StoreContext";
import api from "../api";
import { Divider } from "@mui/material";
import moment from "moment";
import RefreshIcon from "@mui/icons-material/Refresh";
import { useHistory } from "react-router-dom";

// Importing Components
import Header from "../components/Header";
import { Button } from "@mui/material";
import Table from "../components/Tabel";
import Modal from "../components/Modal";
import BuySubscription from "./Subscription/BuySubscription";
import AssignSubscription from "./Subscription/AssignSubscription";
import BuyCredits from "./Subscription/BuyCredits";
import Renew from "./Subscription/Renew";
import AddProjectModal from "./Project/AddProjectModal";

// Home Component
export default function Home() {
  const classes = useStyles();
  const store = Store();
  const history = useHistory();

  const [subscriptionsData, setSubscriptionsData] = useState([]);
  const [mySubscription, setMySubscription] = useState({});
  const [subscriptionHeadCells, setSubscriptionHeadCells] = useState("");
  const [projectHeadCells, setProjectHeadCells] = useState("");
  const [buySubModal, setBuySubModal] = useState(false);
  const [assignSubModal, setAssignSubModal] = useState(false);
  const [buyCreditsModal, setBuyCreditsModal] = useState(false);
  const [renewModal, setRenewModal] = useState(false);
  const [assignSub, setAssignSub] = useState({
    id: "",
    email: "",
  });
  const [addProjectModal, setAddProjectModal] = useState(false);
  const [projectData, setProjectData] = useState([]);

  useEffect(() => {
    let array = [];
    SubscriptionheadCells.slice(0, SubscriptionheadCells.length - 1).map(
      (cell) => array.push(cell.id)
    );
    setSubscriptionHeadCells(array);
    let temp = [];
    ProjectheadCells.slice(0, ProjectheadCells.length - 1).map((cell) =>
      temp.push(cell.id)
    );
    setProjectHeadCells(temp);
  }, []);

  useEffect(() => {
    getSubscriptions();
  }, [buySubModal, assignSubModal, buyCreditsModal, renewModal]);

  useEffect(() => {
    getProjects();
  }, [addProjectModal]);

  const getSubscriptions = async () => {
    const result = await api("get", `/licenses/${store.user._id}`);
    setSubscriptionsData(result.data.license);
    setMySubscription(store?.user?.subscriptions.license);
  };

  const getProjects = async () => {
    const result = await api("get", `/project/byArchitect/${store.user._id}`);
    setProjectData(result?.data?.project);
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
  const handleAddProjectModal = () => setAddProjectModal(!addProjectModal);

  const handleView = (id) => {
    history.push(`/projectview/${id}`);
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
      <Modal
        title="Add Project"
        open={addProjectModal}
        onClose={handleAddProjectModal}
        component={
          <AddProjectModal handleAddProjectModal={handleAddProjectModal} />
        }
      />
      <div className={classes.container}>
        <div className={classes.left_container}>
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
            <Table
              headCells={SubscriptionheadCells}
              data={subscriptionsData}
              rows={subscriptionHeadCells}
              handleAssign={handleAssignSubModal}
            />
          </div>
          <span style={{ fontSize: 24 }}>
            <i>My Subscription</i>
          </span>
          <div className={classes.my_sub}>
            {!mySubscription.architect ? (
              <span className={classes.my_sub_info}>
                No Subscription Assigned
              </span>
            ) : (
              <>
                <span className={classes.my_sub_info}>
                  <div>{mySubscription?.subscription?.name}</div>
                </span>
                <span className={classes.my_sub_info}>
                  <div>Number of remaining projects:</div>{" "}
                  <div>{mySubscription?.credit}</div>
                </span>
                {mySubscription?.architect === store?.user?._id && (
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
                {mySubscription?.architect === store?.user?._id && (
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
        <div className={classes.right_container}>
          <div className={classes.flex_container}>
            <span style={{ fontSize: 24 }}>
              <i>
                My Projects({store?.user?.projects?.length}/
                {mySubscription?.credit})
              </i>
            </span>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              style={{
                backgroundColor:
                  store?.user?.projects?.length >= mySubscription?.credit
                    ? "lightgray"
                    : "#3b373c",
              }}
              onClick={handleAddProjectModal}
              disabled={store?.user?.projects?.length >= mySubscription?.credit}
            >
              New Project
            </Button>
          </div>
          <div style={{ marginTop: 10 }}>
            <Table
              headCells={ProjectheadCells}
              data={projectData}
              rows={projectHeadCells}
              handleView={true}
              handleView={handleView}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
