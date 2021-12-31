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

  // for opening level 1
  const [openListLevel1, setOpenListLevel1] = React.useState();

  const handleOpenListLevel1Click = (id) => {
    if (id) {
      setOpenListLevel1(id);
    } else {
      setOpenListLevel1();
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
                  <IconButton>
                    {openListLevel1 === item._id ? (
                      <ExpandLess onClick={() => handleOpenListLevel1Click()} />
                    ) : (
                      <ExpandMore
                        onClick={() => handleOpenListLevel1Click(item._id)}
                      />
                    )}
                  </IconButton>
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
                <List component="div">
                  <ListItem sx={{ pl: 4 }}>
                    <ListItemIcon>
                      <StarBorder />
                    </ListItemIcon>
                    <ListItemText primary="Starred" />
                  </ListItem>
                </List>
              </Collapse>
            </>
          );
        })}
    </List>
  );
}
