// init
import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import api from "../../api";
import { useStyles } from "../../css/projectView";
import BuildIcon from "@mui/icons-material/Build";
import LogoutIcon from "@mui/icons-material/Logout";
import SearchIcon from "@mui/icons-material/Search";
import { Store } from "../../StoreContext";
import BorderColorIcon from "@mui/icons-material/BorderColor";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import { toast } from "react-toastify";
import { useHistory } from "react-router";

// components
import Header from "../../components/Header";
import { Button, Box, Divider } from "@mui/material";
import InputWithLabel from "../../components/InputWithLabel";
import NestedList from "./component/NestedList";
import Table from "./component/Table";
import Modal from "../../components/Modal";
import AddWorkDetailsModal from "./Modals/AddWorkDetailsModal";
import AddWorkModal from "./Modals/AddWorkModal";
import ReportEstimationModal from "./Modals/ReportEstimationModal";
import ReportDQEModal from "./Modals/ReportDQEModal";
import ReportBPUModal from "./Modals/ReportBPUModal";
import ReportCCTPModal from "./Modals/ReportCCTPModal";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import PropertiesModal from "./Modals/PropertiesModal";
import CctpModal from "./Modals/CctpModal";
import DeleteModal from "../../components/DeleteModal";
import EditWorkModal from "./Modals/EditWorkModal";
import EditWorkDetailModal from "./Modals/EditWorkDetailModal";
import EditChap0Part2 from "./Modals/EditChap0Part2";

const ProjectView = () => {
  const params = useParams();
  const history = useHistory();
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
  const [searchQuery, setSearchQuery] = useState(null);
  const [openPropertiesModal, setOpenPropertiesModal] = useState(false);
  const [openCctpModal, setOpenCctpModal] = useState(false);
  const [cctp_text, setCctp_text] = useState();
  const [openDeleteWorkModal, setOpenDeleteWorkModal] = useState(false);
  const [deleteWorkId, setDeleteWorkId] = useState();
  const [openDeleteWorkDetailModal, setOpenDeleteWorkDetailModal] =
    useState(false);
  const [deleteWorkDetailId, setDeleteWorkDetailId] = useState();
  const [openEditWorkModal, setOpenEditWorkModal] = useState(false);
  const [editWork, setEditWork] = useState();
  const [openEditWorkDetailModal, setOpenEditWorkDetailModal] = useState(false);
  const [editWorkDetail, seteditWorkDetail] = useState();
  const [openEditChap0Part2Modal, setOpenEditChap0Part2Modal] = useState(false);
  const [editChap0Part2, setEditChap0Part2] = useState();

  const [openEstimationReportModal, setOpenEstimationReportModal] =
    useState(false);
  const [openDQEReportModal, setOpenDQEReportModal] = useState(false);
  const [openBPUReportModal, setOpenBPUReportModal] = useState(false);
  const [openCCTPReportModal, setOpenCCTPReportModal] = useState(false);

  useEffect(() => {
    getProject();
    getLibraries();
    getworks();
  }, [
    store.user,
    openWorkModal,
    openPropertiesModal,
    openDeleteWorkModal,
    openDeleteWorkDetailModal,
    openEditWorkModal,
    openEditWorkDetailModal,
    openEditChap0Part2Modal,
  ]);

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
    data.map((item, index) => {
      if (!item.workDetails) {
        temp += item.work.unit_price * item.work.quantity;
      } else {
        if (item.work._id !== data[index - 1]?.work._id) {
          temp += item.workDetails.unit_price
            ? item.work.unit_price * item.work.quantity +
              item.workDetails.quantity * item.workDetails.unit_price
            : item.work.unit_price * item.work.quantity;
        } else {
          temp += item.workDetails.quantity * item.workDetails.unit_price;
        }
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

  // delete work func
  const handleDeleteWork = async () => {
    const response = await api(
      "delete",
      `/project/deleteWork/${currentProject._id}`,
      {
        data: { workId: deleteWorkId },
      }
    );
    handleOpenDeleteWorkModal();
    toast.success(response.data.message);
  };

  // delete work Detail func
  const handleDeleteWorkDetail = async () => {
    const response = await api(
      "delete",
      `/project/deleteWorkDetail/${currentProject._id}`,
      {
        data: { workDetailId: deleteWorkDetailId },
      }
    );
    handleOpenDeleteWorkDetailModal();
    toast.success(response.data.message);
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

  const handleOpenPropertiesModal = () =>
    setOpenPropertiesModal(!openPropertiesModal);

  const handleOpenCctpModal = (cctp) => {
    if (cctp) {
      setCctp_text(cctp);
    }
    setOpenCctpModal(!openCctpModal);
  };

  const handleOpenDeleteWorkModal = (id) => {
    if (id) {
      setDeleteWorkId(id);
    }
    setOpenDeleteWorkModal(!openDeleteWorkModal);
  };

  const handleOpenDeleteWorkDetailModal = (id) => {
    if (id) {
      setDeleteWorkDetailId(id);
    }
    setOpenDeleteWorkDetailModal(!openDeleteWorkDetailModal);
  };

  const handleOpenEditWorkModal = (work) => {
    if (work) {
      setEditWork(work);
    }
    setOpenEditWorkModal(!openEditWorkModal);
  };

  const handleOpenEditWorkDetailModal = (workDetail) => {
    if (workDetail) {
      seteditWorkDetail(workDetail);
    }
    setOpenEditWorkDetailModal(!openEditWorkDetailModal);
  };

  const handleOpenEditChap0Part2Modal = () => {
    if (currentProject.chap0part2) {
      setEditChap0Part2(currentProject.chap0part2);
      setOpenEditChap0Part2Modal(!openEditChap0Part2Modal);
    } else {
      alert("Please select a chap. 0 part 2 from properties");
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
  const openEstimationModal = () => {
    handleClose();
    setOpenEstimationReportModal(true);
  };
  const openDQEModal = () => {
    handleClose();
    setOpenDQEReportModal(true);
  };
  const openBPUModal = () => {
    handleClose();
    setOpenBPUReportModal(true);
  };
  const openCCTPModal = () => {
    handleClose();
    setOpenCCTPReportModal(true);
  };

  const handleSearch = async () => {
    const result = await api(
      "get",
      `/BookLibraries/search/getlibraries?q=${searchQuery}`
    );
    let data = result?.data?.bookLibraries;
    data?.map((dt) => {
      dt.categories = dt.categories.sort((a, b) => a.ranking - b.ranking);
      dt.works = dt.works.sort((a, b) => a.ranking - b.ranking);
      dt.work_details = dt.work_details.sort((a, b) => a.ranking - b.ranking);
    });
    setGeneralLibrariesData(data);
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
            setSelectedWork={setSelectedWork}
            selectedWorkDetail={selectedWorkDetail}
            setSelectedWorkDetail={setSelectedWorkDetail}
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
      <Modal
        title="Project Properties"
        open={openPropertiesModal}
        onClose={handleOpenPropertiesModal}
        component={
          <PropertiesModal
            handleOpenPropertiesModal={handleOpenPropertiesModal}
            currentProject={currentProject}
          />
        }
      />
      <Modal
        title="CCTP"
        open={openCctpModal}
        onClose={handleOpenCctpModal}
        component={
          <CctpModal
            handleOpenCctpModal={handleOpenCctpModal}
            cctp_text={cctp_text}
          />
        }
      />
      <Modal
        open={openDeleteWorkModal}
        onClose={handleOpenDeleteWorkModal}
        component={
          <DeleteModal
            handleCancel={handleOpenDeleteWorkModal}
            handleDelete={handleDeleteWork}
          />
        }
      />

      <Modal
        open={openDeleteWorkDetailModal}
        onClose={handleOpenDeleteWorkDetailModal}
        component={
          <DeleteModal
            handleCancel={handleOpenDeleteWorkDetailModal}
            handleDelete={handleDeleteWorkDetail}
          />
        }
      />
      <Modal
        title="Edit a Work"
        open={openEditWorkModal}
        onClose={handleOpenEditWorkModal}
        component={
          <EditWorkModal
            handleOpenEditWorkModal={handleOpenEditWorkModal}
            selectedWork={editWork}
            currentProject={currentProject}
          />
        }
      />
      <Modal
        title="Edit a Work Detail"
        open={openEditWorkDetailModal}
        onClose={handleOpenEditWorkDetailModal}
        component={
          <EditWorkDetailModal
            handleOpenEditWorkDetailModal={handleOpenEditWorkDetailModal}
            selectedWorkDetail={editWorkDetail}
            currentProject={currentProject}
          />
        }
      />
      <Modal
        title="Estimation"
        open={openEstimationReportModal}
        onClose={() => setOpenEstimationReportModal(false)}
        component={
          <ReportEstimationModal
            currentProject={currentProject}
            projectWorkData={projectWorkData}
          />
        }
      />
      <Modal
        title="DQE"
        open={openDQEReportModal}
        onClose={() => setOpenDQEReportModal(false)}
        component={
          <ReportDQEModal
            currentProject={currentProject}
            projectWorkData={projectWorkData}
          />
        }
      />
      <Modal
        title="BPU"
        open={openBPUReportModal}
        onClose={() => setOpenBPUReportModal(false)}
        component={
          <ReportBPUModal
            currentProject={currentProject}
            projectWorkData={projectWorkData}
          />
        }
      />
      <Modal
        title="CCTP"
        open={openCCTPReportModal}
        onClose={() => setOpenCCTPReportModal(false)}
        component={
          <ReportCCTPModal
            currentProject={currentProject}
            projectWorkData={projectWorkData}
          />
        }
      />
      <Modal
        title="Edit Chap. 0 part 2"
        open={openEditChap0Part2Modal}
        onClose={handleOpenEditChap0Part2Modal}
        component={
          <EditChap0Part2
            handleOpenEditChap0Part2Modal={handleOpenEditChap0Part2Modal}
            editChap0Part2={editChap0Part2}
            currentProject={currentProject}
          />
        }
      />
      <div className={classes.container}>
        <div className={classes.flex_container}>
          <div>
            <span style={{ fontSize: 24 }}>
              <i>{currentProject?.name}</i>
            </span>
          </div>
          <div>
            <Button
              variant="contained"
              className={classes.btn}
              startIcon={
                <BuildIcon style={{ color: "#f1966c", fontSize: 18 }} />
              }
              onClick={handleOpenPropertiesModal}
            >
              Properties
            </Button>
            <Button
              variant="contained"
              className={classes.btn}
              startIcon={
                <LogoutIcon style={{ color: "#f1966c", fontSize: 18 }} />
              }
              onClick={() => history.push("/")}
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
                value={searchQuery}
                handleChange={(e) => setSearchQuery(e.target.value)}
              />
              <Button
                variant="contained"
                onClick={handleSearch}
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
                handleOpenCctpModal={handleOpenCctpModal}
              />
              <div style={{ fontSize: 20, marginTop: 15, marginBottom: 15 }}>
                <i>Project Libraries</i>
              </div>
              <NestedList
                level1={projectLibrariesData}
                width="100%"
                maxHeight="20vh"
                openModal={openModal}
                handleOpenCctpModal={handleOpenCctpModal}
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
                onClick={handleOpenEditChap0Part2Modal}
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
                  onClick={openEstimationModal}
                  style={{ width: 180, height: 28, fontSize: 15 }}
                >
                  Generate Estimate
                </MenuItem>
                <MenuItem
                  onClick={openDQEModal}
                  style={{ height: 28, fontSize: 15 }}
                >
                  Generate The DQE
                </MenuItem>
                <MenuItem
                  onClick={openBPUModal}
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
                  onClick={openCCTPModal}
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
              <div style={{ height: "80%", overflow: "auto" }}>
                <Table
                  projectWorkData={projectWorkData}
                  handleOpenDeleteWorkModal={handleOpenDeleteWorkModal}
                  handleOpenDeleteWorkDetailModal={
                    handleOpenDeleteWorkDetailModal
                  }
                  handleOpenEditWorkModal={handleOpenEditWorkModal}
                  handleOpenEditWorkDetailModal={handleOpenEditWorkDetailModal}
                />
              </div>
              <div
                style={{
                  height: "20%",
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
                        {Math.floor(
                          totalHT * (1 + currentProject?.vat?.value / 100)
                        )}
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
