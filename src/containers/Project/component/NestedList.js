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
                  height: 50,
                }}
              >
                <div style={{ marginRight: 7 }}>
                  <FolderIcon style={{ color: "#f1966c", fontSize: 20 }} />
                </div>
                {/* label */}
                <ListItemText
                  primary={<div style={{ fontSize: 14 }}>{item.name}</div>}
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
                          height: 50,
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
                        <ListItemText primary={category.name} />
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
                                    height: 50,
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
                                  <ListItemText primary={work.name} />
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
