// init
import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import api from "../../api";
import { useStyles } from "../../css/projectView";
import BuildIcon from "@mui/icons-material/Build";
import SaveIcon from "@mui/icons-material/Save";
import LogoutIcon from "@mui/icons-material/Logout";
import SearchIcon from "@mui/icons-material/Search";
import { Store } from "../../StoreContext";
import BorderColorIcon from "@mui/icons-material/BorderColor";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";

// components
import Header from "../../components/Header";
import { Button, Box, Divider } from "@mui/material";
import InputWithLabel from "../../components/InputWithLabel";
import NestedList from "./component/NestedList";
import Table from "./component/Table";
import Modal from "../../components/Modal";
import AddWorkDetailsModal from "./AddWork/AddWorkDetailsModal";
import AddWorkModal from "./AddWork/AddWorkModal";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";

const ProjectView = () => {
  const params = useParams();
  const { id } = params;
  const classes = useStyles();
  const store = Store();

  //   states
  const [currentProject, setCurrentProject] = useState({});
  const [generalLibrariesData, setGeneralLibrariesData] = useState();
  const [projectLibrariesData, setProjectGeneralLibrariesData] = useState();
  const [openWorkModal, setOpenWorkModal] = useState(false);
  const [openWorkDetailModal, setOpenWorkDetailModal] = useState(false);
  const [selectedWork, setSelectedWork] = useState();
  const [workDetails, setWorkDetails] = useState();
  const [selectedWorkDetail, setSelectedWorkDetail] = useState([]);
  const [projectWorkData, setProjectWorkData] = useState([]);
  const [totalHT, setTotalHT] = useState(0);
  const [anchorEl, setAnchorEl] = useState(null);

  useEffect(() => {
    getProject();
    getLibraries();
    getworks();
  }, [store.user, openWorkModal]);

  // func to get current project
  const getProject = async () => {
    const result = await api("get", `/project/${id}`);
    setCurrentProject(result?.data?.project);
  };

  // func to get current project
  const getworks = async () => {
    const result = await api("get", `/project/works/${id}`);
    let data = result?.data?.works;
    let temp = 0;
    data.map((item) => {
      console.log(temp);
      if (!item.workDetails) {
        temp += item.work.unit_price * item.work.quantity;
      } else {
        temp +=
          item.work.unit_price * item.work.quantity +
          item.workDetails.unit_price;
      }
    });
    setTotalHT(temp);
    setProjectWorkData(data);
  };

  // func to get all general libraries
  const getLibraries = async () => {
    const result = await api("get", `/BookLibraries/`);
    let data = result?.data?.bookLibraries;
    data?.map((dt) => {
      dt.categories = dt.categories.sort((a, b) => a.ranking - b.ranking);
      dt.works = dt.works.sort((a, b) => a.ranking - b.ranking);
      dt.work_details = dt.work_details.sort((a, b) => a.ranking - b.ranking);
    });
    setGeneralLibrariesData(data);

    const response =
      store?.user?._id &&
      (await api("get", `/BookLibraries/getByArchitectId/${store.user._id}`));
    let temp = response?.data?.bookLibrary;
    temp?.map((dt) => {
      dt.categories = dt.categories.sort((a, b) => a.ranking - b.ranking);
      dt.works = dt.works.sort((a, b) => a.ranking - b.ranking);
      dt.work_details = dt.work_details.sort((a, b) => a.ranking - b.ranking);
    });
    setProjectGeneralLibrariesData(temp);
  };

  // open modal func
  const openModal = (work, library) => {
    if (work.work_details.length === 0) {
      setSelectedWork(work);
      setOpenWorkModal(true);
    } else {
      let temp = [];
      library.work_details.map((item1) => {
        work.work_details.map((item2) => {
          if (item1._id === item2) {
            temp.push(item1);
          }
        });
      });
      setSelectedWork(work);
      setWorkDetails(temp);
      setOpenWorkDetailModal(true);
    }
  };
  // for dropdown menu

  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div className={classes.main_container}>
      <Header />
      <Modal
        title="Add a Work"
        open={openWorkModal}
        onClose={() => setOpenWorkModal(false)}
        component={
          <AddWorkModal
            selectedWork={selectedWork}
            selectedWorkDetail={selectedWorkDetail}
            setOpenWorkModal={setOpenWorkModal}
            projectWorkData={projectWorkData}
            currentProject={currentProject}
          />
        }
      />
      <Modal
        title="Select Work Details"
        open={openWorkDetailModal}
        onClose={() => setOpenWorkDetailModal(false)}
        component={
          <AddWorkDetailsModal
            selectedWork={selectedWork}
            workDetails={workDetails}
            selectedWorkDetail={selectedWorkDetail}
            setSelectedWorkDetail={setSelectedWorkDetail}
            setOpenWorkDetailModal={setOpenWorkDetailModal}
            setOpenWorkModal={setOpenWorkModal}
          />
        }
      />
      <div className={classes.container}>
        <div className={classes.flex_container}>
          <div>
            <Button
              variant="contained"
              className={classes.btn}
              startIcon={
                <BuildIcon style={{ color: "#f1966c", fontSize: 18 }} />
              }
            >
              Properties
            </Button>
            <Button
              variant="contained"
              className={classes.btn}
              startIcon={
                <SaveIcon style={{ color: "#f1966c", fontSize: 18 }} />
              }
            >
              Backup
            </Button>
            <span style={{ fontSize: 24 }}>
              <i>{currentProject?.name}</i>
            </span>
          </div>
          <div>
            <Button
              variant="contained"
              className={classes.btn}
              startIcon={
                <LogoutIcon style={{ color: "#f1966c", fontSize: 18 }} />
              }
            >
              To Leave
            </Button>
          </div>
        </div>
        <div
          style={{
            width: "100vw",
            display: "flex",
          }}
        >
          <div className={classes.left_container}>
            <div style={{ display: "flex" }}>
              <InputWithLabel
                placeholder="To Look For"
                required={true}
                name="prescriber"
                type="text"
                inputStyle={{ height: 40, backgroundColor: "white" }}
              />
              <Button
                variant="contained"
                style={{
                  backgroundColor: "lightgray",
                  height: 38,
                }}
              >
                <SearchIcon style={{ color: "black" }} />
              </Button>
            </div>
            <div>
              <div style={{ fontSize: 20, marginTop: 15, marginBottom: 15 }}>
                <i>General Libraries</i>
              </div>
              <NestedList
                level1={generalLibrariesData}
                width="100%"
                maxHeight="50vh"
                openModal={openModal}
              />
              <div style={{ fontSize: 20, marginTop: 15, marginBottom: 15 }}>
                <i>Project Libraries</i>
              </div>
              <NestedList
                level1={projectLibrariesData}
                width="100%"
                maxHeight="20vh"
                openModal={openModal}
              />
            </div>
          </div>
          <div className={classes.right_container}>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                padding: 10,
                marginLeft: -20,
              }}
            >
              <div
                style={{
                  marginRight: 10,
                  marginLeft: 10,
                  fontSize: 20,
                  color: "lightgray",
                }}
              >
                |
              </div>
              <BorderColorIcon
                sx={{
                  fontSize: 18,
                  cursor: "pointer",
                  "&:hover": {
                    color: "#f1966c",
                  },
                }}
              />
              <div
                style={{
                  marginRight: 10,
                  marginLeft: 10,
                  fontSize: 20,
                  color: "lightgray",
                }}
              >
                |
              </div>
              <Box
                id="demo-positioned-button"
                aria-controls={open ? "demo-positioned-menu" : undefined}
                aria-haspopup="true"
                aria-expanded={open ? "true" : undefined}
                onClick={handleClick}
                sx={{
                  "&:hover": {
                    color: "#f1966c",
                  },
                }}
              >
                <InsertDriveFileIcon
                  sx={{
                    fontSize: 18,
                    cursor: "pointer",
                    "&:hover": {
                      color: "#f1966c",
                    },
                  }}
                />
                <ArrowDropDownIcon
                  sx={{
                    fontSize: 18,
                    cursor: "pointer",
                    "&:hover": {
                      color: "#f1966c",
                    },
                  }}
                />
              </Box>
              <Menu
                id="demo-positioned-menu"
                aria-labelledby="demo-positioned-button"
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                anchorOrigin={{
                  vertical: "top",
                  horizontal: "left",
                }}
                transformOrigin={{
                  vertical: "top",
                  horizontal: "left",
                }}
                sx={{ mt: 2.5 }}
              >
                <MenuItem
                  style={{ width: 180, height: 28, fontSize: 15 }}
                  onClick={handleClose}
                >
                  Generate Estimate
                </MenuItem>
                <MenuItem
                  onClick={handleClose}
                  style={{ height: 28, fontSize: 15 }}
                >
                  Generate The DQE
                </MenuItem>
                <MenuItem
                  onClick={handleClose}
                  style={{ height: 28, fontSize: 15 }}
                >
                  Generate BPU
                </MenuItem>
                <MenuItem
                  onClick={handleClose}
                  style={{ height: 28, fontSize: 15 }}
                >
                  Generate DPGF
                </MenuItem>

                <Divider />
                <MenuItem
                  onClick={handleClose}
                  style={{ height: 25, fontSize: 15 }}
                >
                  Generate The CCTP
                </MenuItem>
                <Divider />
                <MenuItem
                  onClick={handleClose}
                  style={{ height: 25, fontSize: 15 }}
                >
                  Technical Doc
                </MenuItem>
              </Menu>
            </div>
            <div
              style={{
                backgroundColor: "white",
                height: "80vh",
                overflow: "hidden",
              }}
            >
              <div style={{ height: "68vh" }}>
                <Table projectWorkData={projectWorkData} />
              </div>
              <div
                style={{
                  height: "28vh",
                }}
              >
                <Divider style={{ backgroundColor: "lightgray" }} />
                <div
                  style={{
                    height: "100%",
                    display: "flex",
                    justifyContent: "flex-end",
                  }}
                >
                  <div
                    style={{
                      width: "30%",
                      padding: 20,
                    }}
                  >
                    <div className={classes.flex_container}>
                      <div className={classes.fotter_text}>Total HT:</div>
                      <div>{totalHT}</div>
                    </div>
                    <div className={classes.flex_container}>
                      <div className={classes.fotter_text}>Total VAT (%):</div>
                      <div>{currentProject?.vat?.value}</div>
                    </div>
                    <div className={classes.flex_container}>
                      <div className={classes.fotter_text}>Total Price:</div>
                      <div>
                        {totalHT * (1 + currentProject?.vat?.value / 100)}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectView;
