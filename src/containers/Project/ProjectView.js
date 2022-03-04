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
import LayersIcon from "@mui/icons-material/Layers";
import { useTranslation } from "react-i18next";

// components
import Header from "../../components/Header";
import { Button, Box, Divider } from "@mui/material";
import InputWithLabel from "../../components/InputWithLabel";
import InputDropdown from "../../components/InputDropdown";
import NestedList from "./component/NestedList";
import Table from "./component/Table";
import Modal from "../../components/Modal";
import AddWorkDetailsModal from "./Modals/AddWorkDetailsModal";
import AddWorkModal from "./Modals/AddWorkModal";
import ReportEstimationModal from "./Modals/ReportEstimationModal";
import ReportDQEModal from "./Modals/ReportDQEModal";
import ReportBPUModal from "./Modals/ReportBPUModal";
import ReportCCTPModal from "./Modals/ReportCCTPModal";
import TracnhesModal from "./Modals/TranchesModal";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import PropertiesModal from "./Modals/PropertiesModal";
import CctpModal from "./Modals/CctpModal";
import DeleteModal from "../../components/DeleteModal";
import EditWorkModal from "./Modals/EditWorkModal";
import EditWorkDetailModal from "./Modals/EditWorkDetailModal";
import EditChap0Part2 from "./Modals/EditChap0Part2";
import Loader from "./component/Loader";

const ProjectView = () => {
  const { t } = useTranslation();
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
  const [works, setworks] = useState([]);
  const [tradeTotal, setTradeTotal] = useState([]);
  const [openTranchesModal, setOpenTranchesModal] = useState(false);
  const [options, setOptions] = useState();
  const [selectedFamily, setSelectedFamily] = useState();
  const [generalCategories, setGeneralCategories] = useState();

  // loader states
  const [loading, setLoading] = useState(true); // main loader
  const [libraryLoading, setLibraryLoading] = useState(false); // main loader
  const [loadingLevel, setLoadingLevel] = useState(""); // work level loading

  useEffect(() => {
    getProject();
  }, []);

  useEffect(() => {
    currentProject.name && getworks();
  }, [currentProject]);

  useEffect(() => {
    getProjectLibraries();
  }, [store.user]);

  useEffect(() => {
    selectedFamily && getGeneralLib();
  }, [selectedFamily]);

  // useEffect to get all families
  useEffect(() => {
    getFamilies();
  }, []);

  const getFamilies = async () => {
    const result = await api("get", `/Families/architect/getAll`);
    setSelectedFamily(result.data.families[0]._id);
    setOptions(result.data.families);
  };

  // func to get current project
  const getProject = async () => {
    const result = await api("get", `/project/${id}`);
    setCurrentProject(result?.data?.project);
  };

  // func to get current project
  const getworks = async () => {
    if (currentProject.market_type === "TradesAndTranches") {
      const result = await api("get", `/project/worksByTranches/${id}`);
      let data = result?.data?.works.sort((a, b) => a.ranking - b.ranking);
      let tempAmount = 0;
      let tempArray = [];
      data.map((dat, index1) => {
        let tempSum = 0;
        dat.data.map((item, index) => {
          let temp = 0;
          if (!item.workDetails) {
            temp += item.work.unit_price * item.work.quantity;
          } else {
            if (item?.work?._id !== data[index - 1]?.work?._id) {
              temp += item.workDetails.quantity * item.workDetails.unit_price;
            } else {
              temp += item.workDetails.quantity * item.workDetails.unit_price;
            }
          }
          tempSum += temp;
          tempAmount += temp;
        });
        tempArray[index1] = tempSum;
      });
      setTradeTotal(tempArray);
      setTotalHT(tempAmount.toFixed(2));

      if (currentProject.market_type === "TradesAndTranches") {
        data.map((item) => {
          let tempArray2 = [];
          item.data.map((item2) => {
            let tempObject = {};
            tempObject.tranch = item2.tranch.name;
            tempObject.ranking = item2.tranch.ranking;
            tempObject.tranchData = [];
            let existingTranch = "";
            if (tempArray2.length > 0) {
              existingTranch = tempArray2.find(
                ({ tranch }) => tranch === tempObject.tranch
              );
            }
            if (!existingTranch) {
              let amountTranch = 0;
              item.data.map((item3, index) => {
                if (item3.tranch.name === tempObject.tranch) {
                  let temp = 0;
                  if (!item3.workDetails) {
                    temp += item3.work.unit_price * item3.work.quantity;
                  } else {
                    if (item3?.work?._id !== data[index - 1]?.work?._id) {
                      temp +=
                        item3.workDetails.quantity *
                        item3.workDetails.unit_price;
                    } else {
                      temp +=
                        item3.workDetails.quantity *
                        item3.workDetails.unit_price;
                    }
                  }
                  amountTranch += temp;

                  tempObject.tranchData.push(item3);
                }
              });
              tempObject.tranchAmount = amountTranch;
              tempArray2.push(tempObject);
            }
          });
          item.data = tempArray2.sort((a, b) => a.ranking - b.ranking);
        });
      }

      setProjectWorkData(data);
    } else if (currentProject.market_type === "Trades") {
      const result = await api("get", `/project/worksByTrades/${id}`);
      let data = result?.data?.works.sort((a, b) => a.ranking - b.ranking);
      let tempAmount = 0;
      let tempArray = [];
      data.map((dat, index1) => {
        let tempSum = 0;
        dat.data.map((item, index) => {
          let temp = 0;
          if (!item.workDetails) {
            temp += item.work.unit_price * item.work.quantity;
          } else {
            if (item?.work?._id !== data[index - 1]?.work?._id) {
              temp += item.workDetails.quantity * item.workDetails.unit_price;
            } else {
              temp += item.workDetails.quantity * item.workDetails.unit_price;
            }
          }
          tempSum += temp;
          tempAmount += temp;
        });
        tempArray[index1] = tempSum;
      });
      setTradeTotal(tempArray);
      setTotalHT(tempAmount.toFixed(2));
      setProjectWorkData(data);
    } else {
      const result = await api("get", `/project/works/${id}`);
      let data = result?.data?.works;
      let temp = 0;
      data.map((item, index) => {
        if (!item.workDetails) {
          temp += item.work.unit_price * item.work.quantity;
        } else {
          if (item.work._id !== data[index - 1]?.work._id) {
            temp += item.workDetails.quantity * item.workDetails.unit_price;
          } else {
            temp += item.workDetails.quantity * item.workDetails.unit_price;
          }
        }
      });
      setTotalHT(temp);
      setProjectWorkData(data);
    }
  };

  // func to get all general libraries
  const getProjectLibraries = async () => {
    const response =
      store?.user?._id &&
      (await api(
        "get",
        `/BookLibraries/getTwoLevelsByArchitectId/${store.user._id}`
      ));
    let temp = response?.data?.bookLibrary.sort(
      (a, b) => a.ranking - b.ranking
    );
    temp?.map((dt) => {
      dt.categories = dt.categories.sort((a, b) => a.ranking - b.ranking);
    });

    setProjectGeneralLibrariesData(temp);
  };

  // func to get all general libraries
  const getGeneralLib = async () => {
    try {
      setLibraryLoading(true);
      setGeneralLibrariesData([]);
      setGeneralCategories([]);
      setworks([]);
      const result = await api(
        "get",
        `/BookLibraries/getByFamily/${selectedFamily}`
      );

      let data = result?.data?.bookLibraries.sort(
        (a, b) => a.ranking - b.ranking
      );
      setGeneralLibrariesData(data);
      setLibraryLoading(false);
      setLoading(false);
    } catch (err) {
      setLibraryLoading(false);
      setLoading(false);
    }
  };

  // func to get all general libraries
  const getGeneralCategories = async (id) => {
    try {
      setLoadingLevel(id);
      setGeneralCategories([]);
      setworks([]);
      const result = await api("get", `/BookLibraries/getLevel2/${id}`);
      let data = result.data.categories.sort((a, b) => a.ranking - b.ranking);
      setGeneralCategories(data);
      setLoadingLevel("");
    } catch (err) {
      setLoadingLevel("");
    }
  };

  // delete work func
  const handleDeleteWork = async () => {
    const response = await api(
      "delete",
      `/project/deleteWork/${currentProject._id}`,
      {
        data: { workId: deleteWorkId },
      },
      t
    );
    handleOpenDeleteWorkModal();
    toast.success(t(response.data.message));
    getworks();
  };

  // delete work Detail func
  const handleDeleteWorkDetail = async () => {
    const response = await api(
      "delete",
      `/project/deleteWorkDetail/${currentProject._id}`,
      {
        data: { workDetailId: deleteWorkDetailId },
      },
      t
    );
    handleOpenDeleteWorkDetailModal();
    toast.success(t(response.data.message));
    getworks();
  };

  // open modal func
  const openModal = async (work, library) => {
    if (work.work_details.length === 0) {
      setSelectedWork(work);
      setOpenWorkModal(true);
    } else {
      const result = await api("get", `/BookLibraries/getLevel4/${work._id}`);
      setSelectedWork(work);
      setWorkDetails(result.data.workDetails);
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

  const handleTranchesModal = () => setOpenTranchesModal(!openTranchesModal);

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
    setGeneralLibrariesData(data);
  };

  const getLevel3 = async (id) => {
    try {
      setLoadingLevel(id);
      const result = await api("get", `/BookLibraries/getLevel3/${id}`);
      setworks(result.data.works);
      setLoadingLevel("");
    } catch (err) {
      setLoadingLevel("");
    }
  };

  return (
    <div className={classes.main_container}>
      {loading ? (
        <Loader />
      ) : (
        <>
          <Header />
          <Modal
            title={t("Add a Work")}
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
                getworks={getworks}
              />
            }
          />
          <Modal
            title={t("Select Work Details")}
            open={openWorkDetailModal}
            onClose={() => setOpenWorkDetailModal(false)}
            component={
              <AddWorkDetailsModal
                selectedWork={selectedWork}
                setSelectedWork={setSelectedWork}
                workDetails={workDetails}
                selectedWorkDetail={selectedWorkDetail}
                setSelectedWorkDetail={setSelectedWorkDetail}
                setOpenWorkDetailModal={setOpenWorkDetailModal}
                currentProject={currentProject}
                getworks={getworks}
              />
            }
          />
          <Modal
            title={t("Project Properties")}
            open={openPropertiesModal}
            onClose={handleOpenPropertiesModal}
            component={
              <PropertiesModal
                handleOpenPropertiesModal={handleOpenPropertiesModal}
                currentProject={currentProject}
                getProject={getProject}
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
            title={t("Edit a Work")}
            open={openEditWorkModal}
            onClose={handleOpenEditWorkModal}
            component={
              <EditWorkModal
                handleOpenEditWorkModal={handleOpenEditWorkModal}
                selectedWork={editWork}
                currentProject={currentProject}
                getworks={getworks}
              />
            }
          />
          <Modal
            title={t("Edit a Work Detail")}
            open={openEditWorkDetailModal}
            onClose={handleOpenEditWorkDetailModal}
            component={
              <EditWorkDetailModal
                handleOpenEditWorkDetailModal={handleOpenEditWorkDetailModal}
                selectedWorkDetail={editWorkDetail}
                currentProject={currentProject}
                getworks={getworks}
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
            title={t("Edit Chap. 0 part 2")}
            open={openEditChap0Part2Modal}
            onClose={handleOpenEditChap0Part2Modal}
            component={
              <EditChap0Part2
                handleOpenEditChap0Part2Modal={handleOpenEditChap0Part2Modal}
                editChap0Part2={editChap0Part2}
                currentProject={currentProject}
                getProject={getProject}
              />
            }
          />
          <Modal
            title={t("Manage Tranches")}
            open={openTranchesModal}
            onClose={handleTranchesModal}
            component={<TracnhesModal />}
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
                  {t("Properties")}
                </Button>
                <Button
                  variant="contained"
                  className={classes.btn}
                  startIcon={
                    <LogoutIcon style={{ color: "#f1966c", fontSize: 18 }} />
                  }
                  onClick={() => history.push("/")}
                >
                  {t("To Leave")}
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
                {/* <div style={{ display: "flex", marginBottom: 15 }}>
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
                </div> */}
                <InputDropdown
                  options={options}
                  value={selectedFamily}
                  onChange={(e) => setSelectedFamily(e.target.value)}
                  height={40}
                  backgroundColor="white"
                />

                <div>
                  <div
                    style={{ fontSize: 20, marginTop: 15, marginBottom: 15 }}
                  >
                    <i>{t("General Libraries")}</i>
                  </div>
                  <NestedList
                    level1={generalLibrariesData}
                    width="100%"
                    maxHeight="50vh"
                    openModal={openModal}
                    handleOpenCctpModal={handleOpenCctpModal}
                    getLevel2={getGeneralCategories}
                    setLevel2={setGeneralCategories}
                    level2={generalCategories}
                    getLevel3={getLevel3}
                    level3={works}
                    setworks={setworks}
                    loading={loadingLevel}
                    libraryLoading={libraryLoading}
                  />
                  <div
                    style={{
                      fontSize: 20,
                      marginTop: 15,
                      marginBottom: 15,
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <div>
                      <i>{t("Project Libraries")}</i>
                    </div>
                    <div>
                      <i>
                        <Button
                          variant="contained"
                          className={classes.btn}
                          onClick={() => history.push("/libraries")}
                        >
                          {t("Add New")}
                        </Button>
                      </i>
                    </div>
                  </div>
                  <NestedList
                    level1={projectLibrariesData}
                    width="100%"
                    maxHeight="20vh"
                    openModal={openModal}
                    handleOpenCctpModal={handleOpenCctpModal}
                    getLevel2={getGeneralCategories}
                    setLevel2={setGeneralCategories}
                    level2={generalCategories}
                    getLevel3={getLevel3}
                    level3={works}
                    setworks={setworks}
                    loading={loadingLevel}
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
                  {currentProject.market_type === "TradesAndTranches" && (
                    <LayersIcon
                      sx={{
                        fontSize: 18,
                        cursor: "pointer",
                        "&:hover": {
                          color: "#f1966c",
                        },
                      }}
                      onClick={handleTranchesModal}
                    />
                  )}

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
                      {t("Generate Estimate")}
                    </MenuItem>
                    <MenuItem
                      onClick={openDQEModal}
                      style={{ height: 28, fontSize: 15 }}
                    >
                      {t("Generate The DQE")}
                    </MenuItem>
                    <MenuItem
                      onClick={openBPUModal}
                      style={{ height: 28, fontSize: 15 }}
                    >
                      {t("Generate BPU")}
                    </MenuItem>
                    <MenuItem
                      onClick={handleClose}
                      style={{ height: 28, fontSize: 15 }}
                    >
                      {t("Generate DPGF")}
                    </MenuItem>

                    <Divider />
                    <MenuItem
                      onClick={openCCTPModal}
                      style={{ height: 25, fontSize: 15 }}
                    >
                      {t("Generate The CCTP")}
                    </MenuItem>
                    <Divider />
                    <MenuItem
                      onClick={handleClose}
                      style={{ height: 25, fontSize: 15 }}
                    >
                      {t("Technical Doc")}
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
                    {currentProject.market_type === "Trades" ? (
                      projectWorkData.map((item, index) => {
                        return (
                          <>
                            <div
                              style={{
                                width: "100%",
                                backgroundColor: "#f1966c",
                                padding: "10px 15px",
                                fontWeight: 600,
                              }}
                            >
                              {t("Trade")} n°{index + 1} - {item._id}
                            </div>
                            <Table
                              projectWorkData={item.data}
                              handleOpenDeleteWorkModal={
                                handleOpenDeleteWorkModal
                              }
                              handleOpenDeleteWorkDetailModal={
                                handleOpenDeleteWorkDetailModal
                              }
                              handleOpenEditWorkModal={handleOpenEditWorkModal}
                              handleOpenEditWorkDetailModal={
                                handleOpenEditWorkDetailModal
                              }
                              currentProject={currentProject}
                              getworks={getworks}
                            />
                            <div
                              style={{
                                width: "100%",
                                padding: "10px 15px",
                                display: "flex",
                                justifyContent: "flex-end",
                                fontWeight: 600,
                              }}
                            >
                              Total {t("Trade")} n°{index + 1} - {item._id}{" "}
                              &nbsp;&nbsp;&nbsp;
                              {tradeTotal[index].toFixed(2)}
                            </div>
                            <br />
                          </>
                        );
                      })
                    ) : currentProject.market_type === "TradesAndTranches" ? (
                      projectWorkData.map((item, index) => {
                        return (
                          <>
                            <div
                              style={{
                                width: "100%",
                                backgroundColor: "#f1966c",
                                padding: "10px 15px",
                                fontWeight: 600,
                              }}
                            >
                              {t("Trade")} n°{index + 1} - {item._id}
                            </div>
                            {item.data.map((item2, index2) => {
                              return (
                                <>
                                  <div
                                    style={{
                                      width: "100%",
                                      padding: "10px 15px",
                                      fontWeight: 600,
                                      borderBottom: "3px solid lightgray",
                                    }}
                                  >
                                    Tranche {item2.tranch}
                                  </div>
                                  <Table
                                    projectWorkData={item2.tranchData}
                                    handleOpenDeleteWorkModal={
                                      handleOpenDeleteWorkModal
                                    }
                                    handleOpenDeleteWorkDetailModal={
                                      handleOpenDeleteWorkDetailModal
                                    }
                                    handleOpenEditWorkModal={
                                      handleOpenEditWorkModal
                                    }
                                    handleOpenEditWorkDetailModal={
                                      handleOpenEditWorkDetailModal
                                    }
                                    currentProject={currentProject}
                                    getworks={getworks}
                                  />
                                  <div
                                    style={{
                                      width: "100%",
                                      padding: "10px 15px",
                                      display: "flex",
                                      justifyContent: "flex-end",
                                      fontWeight: 600,
                                      borderBottom: "3px solid lightgray",
                                    }}
                                  >
                                    Total Tranche {item2.tranch}
                                    &nbsp;&nbsp;&nbsp;
                                    {item2.tranchAmount.toFixed(2)}
                                  </div>
                                </>
                              );
                            })}

                            <div
                              style={{
                                width: "100%",
                                padding: "10px 15px",
                                display: "flex",
                                justifyContent: "flex-end",
                                fontWeight: 600,
                              }}
                            >
                              Total {t("Trade")} n°{index + 1} - {item._id}{" "}
                              &nbsp;&nbsp;&nbsp;
                              {tradeTotal[index].toFixed(2)}
                            </div>
                            <br />
                          </>
                        );
                      })
                    ) : (
                      <Table
                        projectWorkData={projectWorkData}
                        handleOpenDeleteWorkModal={handleOpenDeleteWorkModal}
                        handleOpenDeleteWorkDetailModal={
                          handleOpenDeleteWorkDetailModal
                        }
                        handleOpenEditWorkModal={handleOpenEditWorkModal}
                        handleOpenEditWorkDetailModal={
                          handleOpenEditWorkDetailModal
                        }
                        currentProject={currentProject}
                        getworks={getworks}
                      />
                    )}
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
                          <div className={classes.fotter_text}>
                            {t("Total HT")}:
                          </div>
                          <div>{parseInt(totalHT).toFixed(2)}</div>
                        </div>
                        <div className={classes.flex_container}>
                          <div className={classes.fotter_text}>
                            {t("Total VAT")} (%):
                          </div>
                          <div>{currentProject?.vat?.value.toFixed(2)}</div>
                        </div>
                        <div className={classes.flex_container}>
                          <div className={classes.fotter_text}>
                            {t("Total Price")}:
                          </div>
                          <div>
                            {(
                              totalHT *
                              (1 + currentProject?.vat?.value / 100)
                            ).toFixed(2)}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ProjectView;
