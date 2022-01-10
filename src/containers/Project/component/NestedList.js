import React, { useState } from "react";
import List from "@mui/material/List";
import ListItemIcon from "@mui/material/ListItemIcon";
import { ListItem } from "@mui/material";
import ListItemText from "@mui/material/ListItemText";
import Collapse from "@mui/material/Collapse";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import { IconButton } from "@mui/material";
import BookmarkBorderOutlinedIcon from "@mui/icons-material/BookmarkBorderOutlined";
import FolderIcon from "@mui/icons-material/Folder";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import AddCircleRoundedIcon from "@mui/icons-material/AddCircleRounded";
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

export default function NestedList(props) {
  // for opening level 1
  const [openListLevel1, setOpenListLevel1] = useState();

  const handleOpenListLevel1Click = (id) => {
    if (id) {
      setOpenListLevel1(id);
    } else {
      setOpenListLevel1();
    }
  };

  // for opening level 2
  const [openListLevel2, setOpenListLevel2] = useState();

  const handleOpenListLevel2Click = (id) => {
    if (id) {
      setOpenListLevel2(id);
    } else {
      setOpenListLevel2();
    }
  };

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
    <List
      sx={{
        width: props.width,
        maxHeight: props.maxHeight,
        minHeight: "2vh",
        postion: "relative",
        overflow: "scroll",
        overflowX: "hidden",
        backgroundColor: "#e3e2e5",
        boxShadow:
          "rgba(0, 0, 0, 0.12) 0px 1px 3px, rgba(0, 0, 0, 0.24) 0px 1px 2px",
        paddingTop: 0,
        paddingBottom: 0,
      }}
      component="nav"
      aria-labelledby="nested-list-subheader"
    >
      {/* level 1 */}
      {props.level1 &&
        props.level1.map((item) => {
          return (
            <>
              <ListItem
                style={{
                  height: 40,
                }}
              >
                <div style={{ marginRight: 7 }}>
                  <FolderIcon style={{ color: "#f1966c", fontSize: 20 }} />
                </div>
                {/* label */}
                <ListItemText
                  primary={
                    <div
                      style={{
                        fontSize: 15,
                        display: "flex",
                        alignItems: "center",
                      }}
                    >
                      {item.name.substring(0, 30)}
                      {item.name.length > 30 && "..."}
                      <ArrowDropDownIcon
                        id="demo-positioned-button"
                        aria-controls={
                          openLevel0 ? "demo-positioned-menu" : undefined
                        }
                        aria-haspopup="true"
                        aria-expanded={openLevel0 ? "true" : undefined}
                        onClick={(e) => handleAnchorElLevel0Click(e, item)}
                        sx={{
                          fontSize: 18,
                          cursor: "pointer",
                        }}
                      />
                      {/* drop down level 0 */}
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
                        {menuItem0?.cctp_text?.map((cctp, index) => {
                          return (
                            <MenuItem
                              onClick={() => {
                                props.handleOpenCctpModal(cctp);
                                handleAnchorElLevel0Close();
                              }}
                            >
                              Text CCTP {index + 1}
                            </MenuItem>
                          );
                        })}
                      </StyledMenu>
                    </div>
                  }
                />
                {/* right icon */}
                <ListItemIcon sx={{ mr: -4 }}>
                  {openListLevel1 === item._id ? (
                    <IconButton onClick={() => handleOpenListLevel1Click()}>
                      <ExpandLess />
                    </IconButton>
                  ) : (
                    <IconButton
                      onClick={() => handleOpenListLevel1Click(item._id)}
                    >
                      <ExpandMore />
                    </IconButton>
                  )}
                </ListItemIcon>
              </ListItem>
              {/* level 2 */}
              <Collapse in={openListLevel1 === item._id}>
                {item?.categories?.map((category) => {
                  return (
                    <>
                      <ListItem
                        sx={{ pl: 2.5 }}
                        style={{
                          height: 40,
                        }}
                      >
                        <div>
                          {openListLevel2 === category._id ? (
                            <IconButton
                              onClick={() => handleOpenListLevel2Click()}
                            >
                              <ExpandLess
                                style={{ color: "#f1966c", fontSize: 20 }}
                              />
                            </IconButton>
                          ) : (
                            <IconButton
                              onClick={() =>
                                handleOpenListLevel2Click(category._id)
                              }
                            >
                              <ChevronRightIcon
                                style={{ color: "#f1966c", fontSize: 20 }}
                              />
                            </IconButton>
                          )}
                        </div>
                        {/* label */}
                        <ListItemText
                          primary={
                            <div
                              style={{
                                fontSize: 14,
                                display: "flex",
                                alignItems: "center",
                              }}
                            >
                              {category.name.substring(0, 30)}
                              {category.name.length > 30 && "..."}
                              <ArrowDropDownIcon
                                id="demo-positioned-button"
                                aria-controls={
                                  openLevel1
                                    ? "demo-positioned-menu"
                                    : undefined
                                }
                                aria-haspopup="true"
                                aria-expanded={openLevel1 ? "true" : undefined}
                                onClick={(e) =>
                                  handleAnchorElLevel1Click(e, category)
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
                                {menuItem1?.cctp_text?.map((cctp, index) => {
                                  return (
                                    <MenuItem
                                      onClick={() => {
                                        props.handleOpenCctpModal(cctp);
                                        handleAnchorElLevel1Close();
                                      }}
                                    >
                                      Text CCTP {index + 1}
                                    </MenuItem>
                                  );
                                })}
                              </StyledMenu>
                            </div>
                          }
                        />
                        {/* right icon */}
                      </ListItem>
                      {/* level 3 */}
                      <Collapse in={openListLevel2 === category._id}>
                        {item?.works?.map((work) => {
                          if (work.category === openListLevel2) {
                            return (
                              <>
                                <ListItem
                                  sx={{ pl: 5 }}
                                  style={{
                                    height: 40,
                                  }}
                                >
                                  <div style={{ marginRight: 10 }}>
                                    <BookmarkBorderOutlinedIcon
                                      style={{
                                        color: "#f1966c",
                                        fontSize: 20,
                                      }}
                                    />
                                  </div>
                                  {/* label */}
                                  <ListItemText
                                    primary={
                                      <div style={{ fontSize: 15 }}>
                                        {work.name.substring(0, 30)}
                                        {work.name.length > 30 && "..."}
                                        <ArrowDropDownIcon
                                          id="demo-positioned-button"
                                          aria-controls={
                                            openLevel2
                                              ? "demo-positioned-menu"
                                              : undefined
                                          }
                                          aria-haspopup="true"
                                          aria-expanded={
                                            openLevel2 ? "true" : undefined
                                          }
                                          onClick={(e) =>
                                            handleAnchorElLevel2Click(e, work)
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
                                          {menuItem2?.cctp_text?.map(
                                            (cctp, index) => {
                                              return (
                                                <MenuItem
                                                  onClick={() => {
                                                    props.handleOpenCctpModal(
                                                      cctp
                                                    );
                                                    handleAnchorElLevel2Close();
                                                  }}
                                                >
                                                  Text CCTP {index + 1}
                                                </MenuItem>
                                              );
                                            }
                                          )}
                                        </StyledMenu>
                                      </div>
                                    }
                                  />
                                  <ListItemIcon
                                    sx={{
                                      mr: -4,
                                    }}
                                  >
                                    <IconButton>
                                      <AddCircleRoundedIcon
                                        style={{
                                          color: "#f1966c",
                                          fontSize: 20,
                                        }}
                                        onClick={() =>
                                          props.openModal(work, item)
                                        }
                                      />
                                    </IconButton>
                                  </ListItemIcon>
                                </ListItem>
                              </>
                            );
                          }
                        })}
                      </Collapse>
                    </>
                  );
                })}
              </Collapse>
            </>
          );
        })}
    </List>
  );
}
