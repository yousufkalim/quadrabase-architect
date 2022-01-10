import React, { useState } from "react";
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
}) {
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

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} size="small" aria-label="a dense table">
        <TableHead>
          <TableRow>
            <TableCell style={{ fontWeight: 900, fontSize: 16 }}>
              Name
            </TableCell>
            <TableCell align="right" style={{ fontWeight: 900, fontSize: 16 }}>
              Unity
            </TableCell>
            <TableCell align="right" style={{ fontWeight: 900, fontSize: 16 }}>
              Qty
            </TableCell>
            <TableCell align="right" style={{ fontWeight: 900, fontSize: 16 }}>
              PU HT
            </TableCell>
            <TableCell align="right" style={{ fontWeight: 900, fontSize: 16 }}>
              Total HT
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {projectWorkData.map((row, index) => {
            if (!row.workDetails) {
              return (
                <TableRow hover>
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
                    {row.work.name.substring(0, 50)}
                    {row.work.name.length > 50 && "..."}
                    <ArrowDropDownIcon
                      id="demo-positioned-button"
                      aria-controls={
                        openLevel0 ? "demo-positioned-menu" : undefined
                      }
                      aria-haspopup="true"
                      aria-expanded={openLevel0 ? "true" : undefined}
                      onClick={(e) => handleAnchorElLevel0Click(e, row.work)}
                      sx={{
                        fontSize: 18,
                        cursor: "pointer",
                      }}
                    />
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
                          handleOpenDeleteWorkModal(menuItem0._id);
                          handleAnchorElLevel0Close();
                        }}
                      >
                        To Delete
                      </MenuItem>
                      <MenuItem
                        onClick={() => {
                          handleOpenEditWorkModal(menuItem0);
                          handleAnchorElLevel0Close();
                        }}
                      >
                        To Modify
                      </MenuItem>
                    </StyledMenu>
                  </TableCell>
                  <TableCell
                    align="right"
                    style={{
                      borderRight: "1px solid lightgray",
                      width: "10vw",
                    }}
                  >
                    {row.workUnit.name}
                  </TableCell>
                  <TableCell
                    align="right"
                    style={{
                      borderRight: "1px solid lightgray",
                      width: "10vw",
                    }}
                  >
                    {row.work.quantity}
                  </TableCell>
                  <TableCell
                    align="right"
                    style={{
                      borderRight: "1px solid lightgray",
                      width: "10vw",
                    }}
                  >
                    {row.work.unit_price}
                  </TableCell>
                  <TableCell
                    align="right"
                    style={{
                      borderRight: "1px solid lightgray",
                      width: "10vw",
                    }}
                  >
                    {row.work.unit_price * row.work.quantity}
                  </TableCell>
                </TableRow>
              );
            } else {
              return (
                <>
                  {row.work._id !== projectWorkData[index - 1]?.work._id && (
                    <TableRow hover>
                      <TableCell
                        style={{
                          borderRight: "1px solid lightgray",
                          width: "35vw",
                          display: "flex",
                          alignItems: "center",
                        }}
                      >
                        {row.work.name.substring(0, 50)}
                        {row.work.name.length > 50 && "..."}
                        <ArrowDropDownIcon
                          id="demo-positioned-button"
                          aria-controls={
                            openLevel1 ? "demo-positioned-menu" : undefined
                          }
                          aria-haspopup="true"
                          aria-expanded={openLevel1 ? "true" : undefined}
                          onClick={(e) =>
                            handleAnchorElLevel1Click(e, row.work)
                          }
                          sx={{
                            fontSize: 18,
                            cursor: "pointer",
                          }}
                        />
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
                          <MenuItem
                            onClick={() => {
                              handleOpenDeleteWorkModal(menuItem1._id);
                              handleAnchorElLevel1Close();
                            }}
                          >
                            To Delete
                          </MenuItem>
                          <MenuItem
                            onClick={() => {
                              handleOpenEditWorkModal(menuItem1);
                              handleAnchorElLevel1Close();
                            }}
                          >
                            To Modify
                          </MenuItem>
                        </StyledMenu>
                      </TableCell>
                      <TableCell
                        align="right"
                        style={{
                          borderRight: "1px solid lightgray",
                          width: "10vw",
                        }}
                      >
                        {row.workUnit.name}
                      </TableCell>
                      <TableCell
                        align="right"
                        style={{
                          borderRight: "1px solid lightgray",
                          width: "10vw",
                        }}
                      >
                        {row.work.quantity}
                      </TableCell>
                      <TableCell
                        align="right"
                        style={{
                          borderRight: "1px solid lightgray",
                          width: "10vw",
                        }}
                      >
                        {row.work.unit_price}
                      </TableCell>
                      <TableCell
                        align="right"
                        style={{
                          borderRight: "1px solid lightgray",
                          width: "10vw",
                        }}
                      >
                        {row.work.unit_price * row.work.quantity}
                      </TableCell>
                    </TableRow>
                  )}

                  <TableRow hover style={{ backgroundColor: "#eeeeee" }}>
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
                      &nbsp;&nbsp;&nbsp;{row.workDetails.name.substring(0, 50)}
                      {row.workDetails.name.length > 50 && "..."}
                      <ArrowDropDownIcon
                        id="demo-positioned-button"
                        aria-controls={
                          openLevel2 ? "demo-positioned-menu" : undefined
                        }
                        aria-haspopup="true"
                        aria-expanded={openLevel2 ? "true" : undefined}
                        onClick={(e) =>
                          handleAnchorElLevel2Click(e, row.workDetails)
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
                            handleOpenDeleteWorkDetailModal(menuItem2._id);
                            handleAnchorElLevel2Close();
                          }}
                        >
                          To Delete
                        </MenuItem>
                        <MenuItem
                          onClick={() => {
                            handleOpenEditWorkDetailModal(menuItem2);
                            handleAnchorElLevel2Close();
                          }}
                        >
                          To Modify
                        </MenuItem>
                      </StyledMenu>
                    </TableCell>
                    <TableCell
                      align="right"
                      style={{
                        borderRight: "1px solid lightgray",
                        width: "10vw",
                      }}
                    >
                      {row.workDetailsUnit.name}
                    </TableCell>
                    <TableCell
                      align="right"
                      style={{
                        borderRight: "1px solid lightgray",
                        width: "10vw",
                      }}
                    >
                      {row.workDetails.quantity}
                    </TableCell>
                    <TableCell
                      align="right"
                      style={{
                        borderRight: "1px solid lightgray",
                        width: "10vw",
                      }}
                    >
                      {row.workDetails.unit_price}
                    </TableCell>
                    <TableCell
                      align="right"
                      style={{
                        borderRight: "1px solid lightgray",
                        width: "10vw",
                      }}
                    >
                      {row.workDetails.quantity * row.workDetails.unit_price}
                    </TableCell>
                  </TableRow>
                </>
              );
            }
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
