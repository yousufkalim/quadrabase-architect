import * as React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";

export default function DenseTable({ projectWorkData }) {
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
          {projectWorkData.map((row) => {
            if (!row.workDetails) {
              return (
                <TableRow hover>
                  <TableCell
                    component="th"
                    scope="row"
                    style={{
                      borderRight: "1px solid lightgray",
                      width: "35vw",
                    }}
                  >
                    {row.work.name}
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
                  <TableRow hover>
                    <TableCell
                      style={{
                        borderRight: "1px solid lightgray",
                        width: "35vw",
                      }}
                    >
                      {row.work.name}
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
                  <TableRow hover style={{ backgroundColor: "#eeeeee" }}>
                    <TableCell
                      component="th"
                      scope="row"
                      style={{
                        borderRight: "1px solid lightgray",
                        width: "35vw",
                      }}
                    >
                      &nbsp;&nbsp;&nbsp;{row.workDetails.name}
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
                      1
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
                      {row.workDetails.unit_price}
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
