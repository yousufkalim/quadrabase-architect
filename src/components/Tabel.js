import * as React from "react";
import PropTypes from "prop-types";
import { alpha } from "@mui/material/styles";
import Box from "@mui/material/Box";
import moment from "moment";

import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import TableSortLabel from "@mui/material/TableSortLabel";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import FilterListIcon from "@mui/icons-material/FilterList";
import { visuallyHidden } from "@mui/utils";
import AssignmentIndIcon from "@mui/icons-material/AssignmentInd";
import PageviewIcon from "@mui/icons-material/Pageview";

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === "desc"
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

// This method is created for cross-browser compatibility, if you don't
// need to support IE11, you can use Array.prototype.sort() directly
function stableSort(array, comparator) {
  const stabilizedThis = array?.map((el, index) => [el, index]);
  stabilizedThis?.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) {
      return order;
    }
    return a[1] - b[1];
  });
  return stabilizedThis?.map((el) => el[0]);
}

function EnhancedTableHead(props) {
  const {
    order,
    orderBy,

    onRequestSort,
  } = props;
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };
  return (
    <TableHead>
      <TableRow>
        {props.headCells &&
          props?.headCells?.map((headCell) => (
            <TableCell
              key={headCell.id}
              align={"left"}
              padding={headCell.disablePadding ? "none" : "normal"}
              sortDirection={orderBy === headCell.id ? order : false}
            >
              <TableSortLabel
                active={orderBy === headCell.id}
                direction={orderBy === headCell.id ? order : "asc"}
                onClick={createSortHandler(headCell.id)}
              >
                {props.translate
                  ? props.translate(`${headCell.label}`)
                  : headCell.label}
                {orderBy === headCell.id ? (
                  <Box component="span" sx={visuallyHidden}>
                    {order === "desc"
                      ? "sorted descending"
                      : "sorted ascending"}
                  </Box>
                ) : null}
              </TableSortLabel>
            </TableCell>
          ))}
      </TableRow>
    </TableHead>
  );
}

EnhancedTableHead.propTypes = {
  numSelected: PropTypes.number.isRequired,
  onRequestSort: PropTypes.func.isRequired,
  onSelectAllClick: PropTypes.func.isRequired,
  order: PropTypes.oneOf(["asc", "desc"]).isRequired,
  orderBy: PropTypes.string.isRequired,
  rowCount: PropTypes.number.isRequired,
};

const EnhancedTableToolbar = (props) => {
  const { numSelected } = props;

  return (
    <Toolbar
      sx={{
        pl: { sm: 2 },
        pr: { xs: 1, sm: 1 },
        ...(numSelected > 0 && {
          bgcolor: (theme) =>
            alpha(
              theme.palette.primary.main,
              theme.palette.action.activatedOpacity
            ),
        }),
      }}
    >
      {numSelected > 0 ? (
        <Typography
          sx={{ flex: "1 1 100%" }}
          color="inherit"
          variant="subtitle1"
          component="div"
        >
          {numSelected} selected
        </Typography>
      ) : (
        <Typography
          sx={{ flex: "1 1 100%" }}
          variant="h6"
          id="tableTitle"
          component="div"
        >
          Nutrition
        </Typography>
      )}

      {numSelected > 0 ? (
        <Tooltip title="Delete">
          <IconButton>
            <DeleteIcon />
          </IconButton>
        </Tooltip>
      ) : (
        <Tooltip title="Filter list">
          <IconButton>
            <FilterListIcon />
          </IconButton>
        </Tooltip>
      )}
    </Toolbar>
  );
};

EnhancedTableToolbar.propTypes = {
  numSelected: PropTypes.number.isRequired,
};

export default function EnhancedTable(props) {
  const [order, setOrder] = React.useState("asc");
  const [orderBy, setOrderBy] = React.useState("calories");
  const [selected, setSelected] = React.useState([]);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = props?.data?.map((n) => n.name);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event, name) => {
    const selectedIndex = selected.indexOf(name);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, name);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected?.slice(1));
    } else if (selectedIndex === selected?.length - 1) {
      newSelected = newSelected.concat(selected?.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected?.slice(0, selectedIndex),
        selected?.slice(selectedIndex + 1)
      );
    }

    setSelected(newSelected);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const isSelected = (name) => selected.indexOf(name) !== -1;

  // Avoid a layout jump when reaching the last page with empty props.data.
  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - props?.data?.length) : 0;

  return (
    <Box sx={{ width: "100%" }}>
      <Paper sx={{ width: "100%", mb: 2 }}>
        <TableContainer>
          <Table aria-labelledby="tableTitle">
            <EnhancedTableHead
              numSelected={selected?.length}
              order={order}
              translate={props.translate}
              headCells={props.headCells}
              orderBy={orderBy}
              onSelectAllClick={handleSelectAllClick}
              onRequestSort={handleRequestSort}
              rowCount={props?.data?.length}
            />
            <TableBody>
              {/* if you don't need to support IE11, you can replace the `stableSort` call with:
                 props.data.slice().sort(getComparator(order, orderBy)) */}
              {stableSort(props.data, getComparator(order, orderBy))
                ?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                ?.map((row, index) => {
                  const isItemSelected = isSelected(row._id);

                  return (
                    <TableRow
                      hover
                      onClick={(event) => handleClick(event, row._id)}
                      role="checkbox"
                      aria-checked={isItemSelected}
                      tabIndex={-1}
                      key={row._id}
                      selected={isItemSelected}
                    >
                      {props?.rows?.map((record, index) =>
                        record == "subscriptionEndDate" ? (
                          <TableCell
                            align="left"
                            title={row?.subscription?.end_date}
                          >
                            {row?.end_date
                              ? moment(row?.end_date).format("DD/MM/YYYY")
                              : "N/A"}
                          </TableCell>
                        ) : record === "subscriptionName" ? (
                          <TableCell
                            key={index}
                            align="left"
                            title={row?.subscriptions?.name}
                          >
                            {row?.subscription?.name
                              ? row?.subscription?.name?.length > 20
                                ? row?.subscription?.name.substring(0, 20) +
                                  "..."
                                : row?.subscription?.name
                              : "N/A"}
                          </TableCell>
                        ) : record == "assignedToName" ? (
                          <TableCell
                            align="left"
                            title={row?.assigned_to?.first_name}
                          >
                            {row?.assigned_to?.first_name
                              ? row?.assigned_to?.first_name?.length > 20
                                ? row?.assigned_to?.first_name.substring(
                                    0,
                                    20
                                  ) + "..."
                                : row?.assigned_to?.first_name
                              : "N/A"}
                          </TableCell>
                        ) : record === "createdAt" ? (
                          <TableCell
                            align="left"
                            title={row?.subscription?.end_date}
                          >
                            {row?.createdAt
                              ? moment(row?.end_date).format("DD/MM/YYYY")
                              : "N/A"}
                          </TableCell>
                        ) : record === "vat" ? (
                          <TableCell
                            key={index}
                            align="left"
                            title={row?.vat?.value}
                          >
                            {row?.vat?.value
                              ? row?.vat?.value?.length > 20
                                ? row?.vat?.value.substring(0, 20) + "..."
                                : row?.vat?.value
                              : "N/A"}
                            %
                          </TableCell>
                        ) : (
                          <TableCell
                            key={index}
                            align="left"
                            title={row[record]}
                          >
                            {row[record]
                              ? row[record]?.length > 20
                                ? row[record].substring(0, 20) + "..."
                                : row[record]
                              : "N/A"}
                          </TableCell>
                        )
                      )}

                      <TableCell align="left">
                        {props.handleAssign ? (
                          <IconButton
                            color="info"
                            aria-label="edit"
                            onClick={() =>
                              props.handleAssign(
                                row?._id,
                                row?.assigned_to?.email
                              )
                            }
                          >
                            <AssignmentIndIcon />
                          </IconButton>
                        ) : props.handleView ? (
                          <IconButton
                            color="info"
                            aria-label="edit"
                            onClick={props.handleView}
                          >
                            <PageviewIcon />
                          </IconButton>
                        ) : (
                          <>
                            <IconButton
                              color="info"
                              aria-label="edit"
                              onClick={() => props.handleEdit(row)}
                            >
                              <EditIcon />
                            </IconButton>
                            <IconButton
                              color="error"
                              aria-label="delete"
                              onClick={() => props.handleDelete(row._id)}
                            >
                              <DeleteIcon />
                            </IconButton>
                          </>
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })}
              {emptyRows > 0 && (
                <TableRow
                  style={{
                    height: 33 * emptyRows,
                  }}
                >
                  <TableCell colSpan={6} />
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 15, 20]}
          component="div"
          labelRowsPerPage={
            props.translate ? props.translate("Rows per page:") : ""
          }
          count={props?.data?.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
    </Box>
  );
}
