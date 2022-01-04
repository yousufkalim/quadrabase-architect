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

const ProjectView = () => {
  const params = useParams();
  const { id } = params;
  const classes = useStyles();
  const store = Store();

  //   states
  const [currentProject, setCurrentProject] = useState({});
  const [generalLibrariesData, setGeneralLibrariesData] = useState();
  const [projectLibrariesData, setProjectGeneralLibrariesData] = useState();

  useEffect(() => {
    getProject();
    getLibraries();
  }, [store.user]);

  // func to get current project
  const getProject = async () => {
    const result = await api("get", `/project/${id}`);
    setCurrentProject(result?.data?.project);
  };

  // func to get all general libraries
  const getLibraries = async () => {
    const result = await api("get", `/BookLibraries/`);
    console.log("result: ", result);
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

  return (
    <div className={classes.main_container}>
      <Header />
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
              />
              <div style={{ fontSize: 20, marginTop: 15, marginBottom: 15 }}>
                <i>Project Libraries</i>
              </div>
              <NestedList
                level1={projectLibrariesData}
                width="100%"
                maxHeight="20vh"
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
            </div>
            <div
              style={{
                backgroundColor: "white",
                height: "80vh",
                overflow: "hidden",
              }}
            >
              <div style={{ height: "68vh" }}>
                <Table />
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
                      width: "20%",
                      padding: 20,
                    }}
                  >
                    <div className={classes.flex_container}>
                      <div className={classes.fotter_text}>Total HT:</div>
                      <div>500</div>
                    </div>
                    <div className={classes.flex_container}>
                      <div className={classes.fotter_text}>Total VAT (%):</div>
                      <div>10</div>
                    </div>
                    <div className={classes.flex_container}>
                      <div className={classes.fotter_text}>Total Price:</div>
                      <div>600</div>
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
