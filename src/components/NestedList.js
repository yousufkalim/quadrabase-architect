import React, { useState } from "react";
import List from "@mui/material/List";
import ListItemIcon from "@mui/material/ListItemIcon";
import { ListItem } from "@mui/material";
import ListItemText from "@mui/material/ListItemText";
import Collapse from "@mui/material/Collapse";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import StarBorder from "@mui/icons-material/StarBorder";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { IconButton } from "@mui/material";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import ListSubheader from "@mui/material/ListSubheader";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { Divider } from "@mui/material";

export default function NestedList(props) {
  // for level 0 dropdown menu
  const [anchorElLevel0, setAnchorElLevel0] = useState(null);
  const openLevel0 = Boolean(anchorElLevel0);
  const handleAnchorElLevel0Click = (event) => {
    setAnchorElLevel0(event.currentTarget);
  };
  const handleAnchorElLevel0Close = () => {
    setAnchorElLevel0(null);
  };

  // for level 1 dropdown menu
  const [anchorElLevel1, setAnchorElLevel1] = useState(null);
  const [itemLevel1, setItemLevel1] = useState();
  const openLevel1 = Boolean(anchorElLevel1);
  const handleAnchorElLevel1Click = (event, item) => {
    if (item) {
      setItemLevel1(item);
    }
    setAnchorElLevel1(event.currentTarget);
  };
  const handleAnchorElLevel1Close = () => {
    setAnchorElLevel1(null);
  };

  // for level 2 dropdown menu
  const [anchorElLevel2, setAnchorElLevel2] = useState(null);
  const [itemLevel2, setItemLevel2] = useState();
  const openLevel2 = Boolean(anchorElLevel2);
  const handleAnchorElLevel2Click = (event, item) => {
    if (item) {
      setItemLevel2(item);
    }
    setAnchorElLevel2(event.currentTarget);
  };
  const handleAnchorElLevel2Close = () => {
    setAnchorElLevel2(null);
  };

  // for level 3 dropdown menu
  const [anchorElLevel3, setAnchorElLevel3] = useState(null);
  const [itemLevel3, setItemLevel3] = useState();
  const openLevel3 = Boolean(anchorElLevel3);
  const handleAnchorElLevel3Click = (event, item) => {
    if (item) {
      setItemLevel3(item);
    }
    setAnchorElLevel3(event.currentTarget);
  };
  const handleAnchorElLevel3Close = () => {
    setAnchorElLevel3(null);
  };

  // for opening level 1
  const [openListLevel1, setOpenListLevel1] = React.useState();

  const handleOpenListLevel1Click = (id) => {
    if (id) {
      setOpenListLevel1(id);
    } else {
      setOpenListLevel1();
    }
  };

  // for opening level 2
  const [openListLevel2, setOpenListLevel2] = React.useState();

  const handleOpenListLevel2Click = (id) => {
    if (id) {
      setOpenListLevel2(id);
    } else {
      setOpenListLevel2();
    }
  };

  // for opening level 3
  const [openListLevel3, setOpenListLevel3] = React.useState();

  const handleOpenListLevel3Click = (id) => {
    if (id) {
      setOpenListLevel3(id);
    } else {
      setOpenListLevel3();
    }
  };

  return (
    <List
      sx={{
        width: "100%",
        maxWidth: "70%",
        bgcolor: "background.paper",
        boxShadow:
          "rgba(0, 0, 0, 0.12) 0px 1px 3px, rgba(0, 0, 0, 0.24) 0px 1px 2px",
      }}
      component="nav"
      aria-labelledby="nested-list-subheader"
      subheader={
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            backgroundColor: "#F5F5F5",
          }}
        >
          <ListSubheader
            component="div"
            id="nested-list-subheader"
            sx={{ fontSize: 18, fontWeight: 600, backgroundColor: "#F5F5F5" }}
          >
            {props?.label}
          </ListSubheader>
          <IconButton
            id="demo-positioned-button"
            aria-controls={openLevel0 ? "demo-positioned-menu" : undefined}
            aria-haspopup="true"
            aria-expanded={openLevel0 ? "true" : undefined}
            onClick={handleAnchorElLevel0Click}
          >
            <MoreVertIcon onClick={() => console.log("on icon click")} />
          </IconButton>
          {/* drop down level 0 */}
          <Menu
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
            sx={{ mt: 4.5 }}
          >
            <MenuItem
              style={{ width: 200 }}
              onClick={props?.handleOpenLibrariesModal}
            >
              Add Libraries
            </MenuItem>
            <MenuItem onClick={props?.handleOpenFamiliesModal}>
              Manage Families
            </MenuItem>
          </Menu>
        </div>
      }
    >
      {/* level 1 */}
      {props.level1 &&
        props.level1.map((item) => {
          return (
            <>
              <ListItem>
                {/* left Icon */}
                <div style={{ marginRight: 25 }}>
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
                </div>
                {/* label */}
                <ListItemText primary={item.name} />
                {/* right icon */}
                <ListItemIcon sx={{ mr: -4 }}>
                  <IconButton
                    id="demo-positioned-button"
                    aria-controls={
                      openLevel1 ? "demo-positioned-menu" : undefined
                    }
                    aria-haspopup="true"
                    aria-expanded={openLevel1 ? "true" : undefined}
                    onClick={(e) => handleAnchorElLevel1Click(e, item)}
                  >
                    <MoreVertIcon />
                  </IconButton>
                </ListItemIcon>
                {/* drop down level 1 */}
                <Menu
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
                  sx={{ mt: 4.5 }}
                >
                  <MenuItem
                    style={{ width: 200 }}
                    onClick={() =>
                      props.handleOpenEditLibrariesModal(itemLevel1)
                    }
                  >
                    <EditIcon style={{ marginRight: 10 }} />
                    Edit
                  </MenuItem>
                  <MenuItem
                    onClick={() =>
                      props.handleDeleteLibraryModal(itemLevel1._id)
                    }
                  >
                    <DeleteIcon style={{ marginRight: 10 }} />
                    Delete
                  </MenuItem>
                  <MenuItem>Up</MenuItem>
                  <MenuItem>Down</MenuItem>
                  <Divider />
                  <MenuItem
                    onClick={() =>
                      props.handleOpenAddCatgeoryModal(itemLevel1._id)
                    }
                  >
                    Add Category
                  </MenuItem>
                </Menu>
              </ListItem>
              {/* level 2 */}
              <Collapse in={openListLevel1 === item._id}>
                {item?.categories?.map((category) => {
                  return (
                    <>
                      <ListItem sx={{ pl: 4 }}>
                        {/* left Icon */}
                        <div style={{ marginRight: 25 }}>
                          {openListLevel2 === category._id ? (
                            <IconButton
                              onClick={() => handleOpenListLevel2Click()}
                            >
                              <ExpandLess />
                            </IconButton>
                          ) : (
                            <IconButton
                              onClick={() =>
                                handleOpenListLevel2Click(category._id)
                              }
                            >
                              <ExpandMore />
                            </IconButton>
                          )}
                        </div>
                        {/* label */}
                        <ListItemText primary={category.name} />
                        {/* right icon */}
                        <ListItemIcon sx={{ mr: -4 }}>
                          <IconButton
                            id="demo-positioned-button"
                            aria-controls={
                              openLevel2 ? "demo-positioned-menu" : undefined
                            }
                            aria-haspopup="true"
                            aria-expanded={openLevel2 ? "true" : undefined}
                            onClick={(e) =>
                              handleAnchorElLevel2Click(e, category)
                            }
                          >
                            <MoreVertIcon />
                          </IconButton>
                        </ListItemIcon>
                        {/* drop down level 2 */}
                        <Menu
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
                          sx={{ mt: 4.5 }}
                        >
                          <MenuItem
                            style={{ width: 200 }}
                            onClick={() =>
                              props.handleOpenEditCatgeoryModal(itemLevel2)
                            }
                          >
                            <EditIcon style={{ marginRight: 10 }} />
                            Edit
                          </MenuItem>
                          <MenuItem
                            onClick={() =>
                              props.handleDeleteCategoryModal(itemLevel2._id)
                            }
                          >
                            <DeleteIcon style={{ marginRight: 10 }} />
                            Delete
                          </MenuItem>
                          <MenuItem>Up</MenuItem>
                          <MenuItem>Down</MenuItem>
                          <Divider />
                          <MenuItem
                            onClick={() =>
                              props.handleOpenAddWorkModal(itemLevel2._id)
                            }
                          >
                            Add Work
                          </MenuItem>
                        </Menu>
                      </ListItem>
                      {/* level 3 */}
                      <Collapse in={openListLevel2 === category._id}>
                        {item?.works?.map((work) => {
                          if (work.category === openListLevel2) {
                            return (
                              <>
                                <ListItem sx={{ pl: 8 }}>
                                  {/* left Icon */}
                                  <div style={{ marginRight: 25 }}>
                                    {openListLevel3 === work._id ? (
                                      <IconButton
                                        onClick={() =>
                                          handleOpenListLevel3Click()
                                        }
                                      >
                                        <ExpandLess />
                                      </IconButton>
                                    ) : (
                                      <IconButton
                                        onClick={() =>
                                          handleOpenListLevel3Click(work._id)
                                        }
                                      >
                                        <ExpandMore />
                                      </IconButton>
                                    )}
                                  </div>
                                  {/* label */}
                                  <ListItemText primary={work.name} />
                                  {/* right icon */}
                                  <ListItemIcon sx={{ mr: -4 }}>
                                    <IconButton
                                      id="demo-positioned-button"
                                      aria-controls={
                                        openLevel3
                                          ? "demo-positioned-menu"
                                          : undefined
                                      }
                                      aria-haspopup="true"
                                      aria-expanded={
                                        openLevel3 ? "true" : undefined
                                      }
                                      onClick={(e) =>
                                        handleAnchorElLevel3Click(e, work)
                                      }
                                    >
                                      <MoreVertIcon />
                                    </IconButton>
                                  </ListItemIcon>
                                  {/* drop down level 2 */}
                                  <Menu
                                    id="demo-positioned-menu"
                                    aria-labelledby="demo-positioned-button"
                                    anchorEl={anchorElLevel3}
                                    open={openLevel3}
                                    onClose={handleAnchorElLevel3Close}
                                    anchorOrigin={{
                                      vertical: "top",
                                      horizontal: "left",
                                    }}
                                    transformOrigin={{
                                      vertical: "top",
                                      horizontal: "left",
                                    }}
                                    sx={{ mt: 4.5 }}
                                  >
                                    <MenuItem
                                      style={{ width: 200 }}
                                      onClick={() =>
                                        props.handleOpenEditWorkModal(
                                          itemLevel3
                                        )
                                      }
                                    >
                                      <EditIcon style={{ marginRight: 10 }} />
                                      Edit
                                    </MenuItem>
                                    <MenuItem
                                      onClick={() =>
                                        props.handleOpenDeleteWorkModal(
                                          itemLevel3._id
                                        )
                                      }
                                    >
                                      <DeleteIcon style={{ marginRight: 10 }} />
                                      Delete
                                    </MenuItem>
                                    <MenuItem>Up</MenuItem>
                                    <MenuItem>Down</MenuItem>
                                    <Divider />
                                    <MenuItem
                                      onClick={() =>
                                        props.handleOpenAddWorkModal(
                                          itemLevel2._id
                                        )
                                      }
                                    >
                                      Add Work Detail
                                    </MenuItem>
                                  </Menu>
                                </ListItem>
                                {/* level 4 */}
                                <Collapse in={openListLevel3 === work._id}>
                                  <List component="div">
                                    <ListItem sx={{ pl: 12 }}>
                                      <ListItemIcon>
                                        <StarBorder />
                                      </ListItemIcon>
                                      <ListItemText primary="Starred" />
                                    </ListItem>
                                  </List>
                                </Collapse>
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
