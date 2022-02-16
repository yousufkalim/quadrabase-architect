import React, { useState, useEffect } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { styled, alpha } from "@mui/material/styles";
import api from "../../../api";

const StyledMenu = styled((props) => (
  <Menu
    elevation={0}
    anchorOrigin={{
      vertical: "bottom",
      horizontal: "left",
    }}
    transformOrigin={{
      vertical: "tp",
      horizontal: "left",
    }}
    {...props}
  />
))(({ theme }) => ({
  "& .MuiPaper-root": {
    borderRadius: 6,
    marginTop: theme.spacing(1),
    minWidth: 150,
    color:
      theme.palette.mode === "light"
        ? "rgb(55, 65, 81)"
        : theme.palette.grey[300],
    boxShadow:
      "rgb(255, 255, 255) 0px 0px 0px 0px, rgba(0, 0, 0, 0.05) 0px 0px 0px 1px, rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px",
    "& .MuiMenu-list": {
      padding: "4px 0",
    },
    "& .MuiMenuItem-root": {
      "& .MuiSvgIcon-root": {
        fontSize: 18,
        color: theme.palette.text.secondary,
        marginRight: theme.spacing(1.5),
      },
      "&:active": {
        backgroundColor: alpha(
          theme.palette.primary.main,
          theme.palette.action.selectedOpacity
        ),
      },
    },
  },
}));

export default function DenseTable({
  projectWorkData,
  handleOpenDeleteWorkModal,
  handleOpenDeleteWorkDetailModal,
  handleOpenEditWorkModal,
  handleOpenEditWorkDetailModal,
  currentProject,
}) {
  const [work, setWork] = useState([]);
  const [workDetails, setWorkDetails] = useState([]);
  // for sorting work and workDetails
  useEffect(() => {
    let tempWork = [];
    let tempWorkDetails = [];
    projectWorkData?.map((item) => {
      let tempWorkObject = item.work;
      tempWorkObject.unit = item.workUnit;
      tempWork.parentId = item._id;
      tempWork.push(tempWorkObject);
      if (item.workDetails) {
        let tempObject = item.workDetails;
        tempObject.parentId = item.work._id;
        tempObject.unit = item.workDetailsUnit;
        tempWorkDetails.push(tempObject);
      }
    });
    tempWork = tempWork.sort((a, b) => a.ranking - b.ranking);
    tempWorkDetails = tempWorkDetails.sort((a, b) => a.ranking - b.ranking);
    setWork(tempWork);
    setWorkDetails(tempWorkDetails);
  }, [projectWorkData]);

  // for level 0 dropdown menu
  const [anchorElLevel0, setAnchorElLevel0] = useState(null);
  const [menuItem0, setMenuItem0] = useState([]);
  const openLevel0 = Boolean(anchorElLevel0);
  const handleAnchorElLevel0Click = (event, item) => {
    setMenuItem0(item);
    setAnchorElLevel0(event.currentTarget);
  };
  const handleAnchorElLevel0Close = () => {
    setAnchorElLevel0(null);
  };

  // for level 1 dropdown menu
  const [anchorElLevel1, setAnchorElLevel1] = useState(null);
  const [menuItem1, setMenuItem1] = useState([]);
  const openLevel1 = Boolean(anchorElLevel1);
  const handleAnchorElLevel1Click = (event, item) => {
    setMenuItem1(item);
    setAnchorElLevel1(event.currentTarget);
  };
  const handleAnchorElLevel1Close = () => {
    setAnchorElLevel1(null);
  };

  // for level 2 dropdown menu
  const [anchorElLevel2, setAnchorElLevel2] = useState(null);
  const [menuItem2, setMenuItem2] = useState([]);
  const openLevel2 = Boolean(anchorElLevel2);
  const handleAnchorElLevel2Click = (event, item) => {
    setMenuItem2(item);
    setAnchorElLevel2(event.currentTarget);
  };
  const handleAnchorElLevel2Close = () => {
    setAnchorElLevel2(null);
  };

  //WorkUp
  const handleWorkUp = async (id) => {
    let filteredIndex = work.findIndex((dt) => dt._id == id);
    if (filteredIndex != 0) {
      let minRanking = Math.min.apply(
        Math,
        work.map((item) => {
          return item.ranking ? item.ranking : 0;
        })
      );
      console.log("min ranking", minRanking, id);
      api("put", `/project/updateWorkRanking/${currentProject._id}`, {
        workId: id,
        ranking: minRanking - 1,
      }).then(() => {
        let tempArr = [...work];
        tempArr[filteredIndex].ranking = minRanking - 1;
        tempArr = tempArr.sort((a, b) => a.ranking - b.ranking);
        setWork(tempArr);
      });
    }
  };

  //Work Down
  const handleWorkDown = async (id) => {
    let filteredIndex = work.findIndex((dt) => dt._id == id);
    if (filteredIndex !== work.length - 1) {
      let maxRanking = Math.max.apply(
        Math,
        work.map((item) => {
          return item.ranking;
        })
      );
      console.log(id, maxRanking);

      api("put", `/project/updateWorkRanking/${currentProject._id}`, {
        workId: id,
        ranking: maxRanking + 1,
      }).then(() => {
        let tempArr = [...work];
        tempArr[filteredIndex].ranking = maxRanking + 1;
        tempArr = tempArr.sort((a, b) => a.ranking - b.ranking);
        setWork(tempArr);
      });
    }
  };

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} size="small" aria-label="a dense table">
        <TableHead>
          <TableRow>
            <TableCell style={{ fontWeight: 900, fontSize: 16 }}>
              Designation
            </TableCell>
            <TableCell align="center" style={{ fontWeight: 900, fontSize: 16 }}>
              Unity
            </TableCell>
            <TableCell align="center" style={{ fontWeight: 900, fontSize: 16 }}>
              Qty
            </TableCell>
            <TableCell align="center" style={{ fontWeight: 900, fontSize: 16 }}>
              PU HT
            </TableCell>
            <TableCell align="center" style={{ fontWeight: 900, fontSize: 16 }}>
              Total HT
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {work.map((row, index) => {
            if (workDetails.length === 0) {
              return (
                <TableRow>
                  <TableCell
                    component="th"
                    scope="row"
                    style={{
                      borderRight: "1px solid lightgray",
                      width: "35vw",
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    {row.name.substring(0, 75)}
                    {row.name.length > 75 && "..."}
                    <ArrowDropDownIcon
                      id="demo-positioned-button"
                      aria-controls={
                        openLevel0 ? "demo-positioned-menu" : undefined
                      }
                      aria-haspopup="true"
                      aria-expanded={openLevel0 ? "true" : undefined}
                      onClick={(e) => handleAnchorElLevel0Click(e, row)}
                      sx={{
                        fontSize: 18,
                        cursor: "pointer",
                      }}
                    />
                    {row._id === menuItem0._id && (
                      <StyledMenu
                        id="demo-positioned-menu"
                        aria-labelledby="demo-positioned-button"
                        anchorEl={anchorElLevel0}
                        open={openLevel0}
                        onClose={handleAnchorElLevel0Close}
                        anchorOrigin={{
                          vertical: "top",
                          horizontal: "left",
                        }}
                        transformOrigin={{
                          vertical: "top",
                          horizontal: "left",
                        }}
                        sx={{ mt: 1 }}
                      >
                        <MenuItem
                          onClick={() => {
                            handleOpenEditWorkModal(menuItem0);
                            handleAnchorElLevel0Close();
                          }}
                        >
                          To Modify
                        </MenuItem>
                        <MenuItem
                          onClick={() => {
                            handleOpenDeleteWorkModal(menuItem0._id);
                            handleAnchorElLevel0Close();
                          }}
                        >
                          To Delete
                        </MenuItem>
                        <MenuItem>Duplicate</MenuItem>
                        <MenuItem
                          onClick={() => {
                            handleWorkUp(menuItem0._id);
                            handleAnchorElLevel0Close();
                          }}
                        >
                          Up
                        </MenuItem>
                        <MenuItem
                          onClick={() => {
                            handleWorkDown(menuItem0._id);
                            handleAnchorElLevel0Close();
                          }}
                        >
                          Down
                        </MenuItem>
                      </StyledMenu>
                    )}
                  </TableCell>
                  <TableCell
                    align="center"
                    style={{
                      borderRight: "1px solid lightgray",
                      width: "10vw",
                    }}
                  >
                    {row?.unit?.symbol}
                  </TableCell>
                  <TableCell
                    align="center"
                    style={{
                      borderRight: "1px solid lightgray",
                      width: "10vw",
                    }}
                  >
                    {parseInt(row.quantity).toFixed(2)}
                  </TableCell>
                  <TableCell
                    align="center"
                    style={{
                      borderRight: "1px solid lightgray",
                      width: "10vw",
                    }}
                  >
                    {parseInt(row.unit_price).toFixed(2)}
                  </TableCell>
                  <TableCell
                    align="center"
                    style={{
                      borderRight: "1px solid lightgray",
                      width: "10vw",
                    }}
                  >
                    {parseInt(row.unit_price * row.quantity).toFixed(2)}
                  </TableCell>
                </TableRow>
              );
            } else if (
              workDetails.length > 0 &&
              row._id !== work[index - 1]?._id
            ) {
              return (
                <>
                  <TableRow>
                    <TableCell
                      style={{
                        borderRight: "1px solid lightgray",
                        width: "35vw",
                        display: "flex",
                        alignItems: "center",
                      }}
                    >
                      {row?.name?.substring(0, 75)}
                      {row?.name?.length > 75 && "..."}
                      <ArrowDropDownIcon
                        id="demo-positioned-button"
                        aria-controls={
                          openLevel1 ? "demo-positioned-menu" : undefined
                        }
                        aria-haspopup="true"
                        aria-expanded={openLevel1 ? "true" : undefined}
                        onClick={(e) => handleAnchorElLevel1Click(e, row)}
                        sx={{
                          fontSize: 18,
                          cursor: "pointer",
                        }}
                      />
                      {row._id === menuItem1._id && (
                        <StyledMenu
                          id="demo-positioned-menu"
                          aria-labelledby="demo-positioned-button"
                          anchorEl={anchorElLevel1}
                          open={openLevel1}
                          onClose={handleAnchorElLevel1Close}
                          anchorOrigin={{
                            vertical: "top",
                            horizontal: "left",
                          }}
                          transformOrigin={{
                            vertical: "top",
                            horizontal: "left",
                          }}
                          sx={{ mt: 1 }}
                        >
                          {row._id === menuItem1._id && row.unit_price && (
                            <MenuItem
                              onClick={() => {
                                handleOpenEditWorkModal(menuItem1);
                                handleAnchorElLevel0Close();
                              }}
                            >
                              To Modify
                            </MenuItem>
                          )}
                          <MenuItem
                            onClick={() => {
                              handleOpenDeleteWorkModal(menuItem1._id);
                              handleAnchorElLevel1Close();
                            }}
                          >
                            To Delete
                          </MenuItem>
                          <MenuItem>Duplicate</MenuItem>
                          <MenuItem
                            onClick={() => {
                              handleWorkUp(menuItem1._id);
                              handleAnchorElLevel1Close();
                            }}
                          >
                            Up
                          </MenuItem>
                          <MenuItem
                            onClick={() => {
                              handleWorkDown(menuItem1._id);
                              handleAnchorElLevel1Close();
                            }}
                          >
                            Down
                          </MenuItem>
                        </StyledMenu>
                      )}
                    </TableCell>
                    <TableCell
                      align="center"
                      style={{
                        borderRight: "1px solid lightgray",
                        width: "10vw",
                      }}
                    >
                      {row?.unit?.symbol}
                    </TableCell>
                    <TableCell
                      align="center"
                      style={{
                        borderRight: "1px solid lightgray",
                        width: "10vw",
                      }}
                    >
                      {row.quantity && parseInt(row.quantity).toFixed(2)}
                    </TableCell>
                    <TableCell
                      align="center"
                      style={{
                        borderRight: "1px solid lightgray",
                        width: "10vw",
                      }}
                    >
                      {row.unit_price && parseInt(row.unit_price).toFixed(2)}
                    </TableCell>
                    <TableCell
                      align="center"
                      style={{
                        borderRight: "1px solid lightgray",
                        width: "10vw",
                      }}
                    >
                      {row.unit_price &&
                        row.quantity &&
                        parseInt(row.unit_price * row.quantity).toFixed(2)}
                    </TableCell>
                  </TableRow>
                  {workDetails.map((row2, index) => {
                    return (
                      row2.parentId === row._id && (
                        <TableRow style={{ backgroundColor: "#eeeeee" }}>
                          <TableCell
                            component="th"
                            scope="row"
                            style={{
                              borderRight: "1px solid lightgray",
                              width: "35vw",
                              display: "flex",
                              alignItems: "center",
                            }}
                          >
                            &nbsp;&nbsp;&nbsp;
                            <i>
                              {" "}
                              {row2.name?.substring(0, 50)}
                              {row2.name?.length > 50 && "..."}
                            </i>
                            <ArrowDropDownIcon
                              id="demo-positioned-button"
                              aria-controls={
                                openLevel2 ? "demo-positioned-menu" : undefined
                              }
                              aria-haspopup="true"
                              aria-expanded={openLevel2 ? "true" : undefined}
                              onClick={(e) =>
                                handleAnchorElLevel2Click(e, row2)
                              }
                              sx={{
                                fontSize: 18,
                                cursor: "pointer",
                              }}
                            />
                            <StyledMenu
                              id="demo-positioned-menu"
                              aria-labelledby="demo-positioned-button"
                              anchorEl={anchorElLevel2}
                              open={openLevel2}
                              onClose={handleAnchorElLevel2Close}
                              anchorOrigin={{
                                vertical: "top",
                                horizontal: "left",
                              }}
                              transformOrigin={{
                                vertical: "top",
                                horizontal: "left",
                              }}
                              sx={{ mt: 1 }}
                            >
                              <MenuItem
                                onClick={() => {
                                  handleOpenEditWorkDetailModal(menuItem2);
                                  handleAnchorElLevel2Close();
                                }}
                              >
                                To Modify
                              </MenuItem>
                              <MenuItem
                                onClick={() => {
                                  handleOpenDeleteWorkDetailModal(
                                    menuItem2._id
                                  );
                                  handleAnchorElLevel2Close();
                                }}
                              >
                                To Delete
                              </MenuItem>
                              <MenuItem>Duplicate</MenuItem>
                              <MenuItem>Up</MenuItem>
                              <MenuItem>Down</MenuItem>
                            </StyledMenu>
                          </TableCell>
                          <TableCell
                            align="center"
                            style={{
                              borderRight: "1px solid lightgray",
                              width: "10vw",
                            }}
                          >
                            {row2?.unit?.symbol}
                          </TableCell>
                          <TableCell
                            align="center"
                            style={{
                              borderRight: "1px solid lightgray",
                              width: "10vw",
                            }}
                          >
                            {parseInt(row2.quantity).toFixed(2)}
                          </TableCell>
                          <TableCell
                            align="center"
                            style={{
                              borderRight: "1px solid lightgray",
                              width: "10vw",
                            }}
                          >
                            {parseInt(row2.unit_price).toFixed(2)}
                          </TableCell>
                          <TableCell
                            align="center"
                            style={{
                              borderRight: "1px solid lightgray",
                              width: "10vw",
                            }}
                          >
                            {parseInt(row2.quantity * row2.unit_price)}
                          </TableCell>
                        </TableRow>
                      )
                    );
                  })}
                </>
              );
            }
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
