
import XLSX from "xlsx-js-style";

import {
  pdfXLSXRowsGenEstimation,
  realDataXLSXGenEstimation,
  footerDataGen,
  pdfXLSXColumns,
  pdfXLSXFooterColumns
} from "./data.js";

const ABC = ["A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z"];

const exportXLSXEstimation = (data, currentProject, noPrice) => {

  const pdfXLSXRows = pdfXLSXRowsGenEstimation(data, noPrice);
  const realDataXLSX = realDataXLSXGenEstimation(pdfXLSXRows, pdfXLSXColumns);
  const footerData = footerDataGen(data, currentProject, noPrice);
  
  const bodyDataXLSX = realDataXLSX;

  const ws = XLSX.utils.json_to_sheet(bodyDataXLSX);

  // Set column widths
  var wscols = [
    {wch:10},
    {wch:35},
    {wch:10},
    {wch:10},
    {wch:10},
    {wch:10}
  ];
  ws['!cols'] = wscols;

  const Fill1 = {
    fill: {
      fgColor: { rgb: "FFBFBFBF" },
    },
    font: {
      bold: true
    }
  };

  const Fill2 = {
    fill: {
      fgColor: { rgb: "FFD3D3D3" },
    },
    font: {
      bold: true
    }
  };

  const BorderFirst2 = {
    border: {
      top: {
        style: "thin"
      },
      bottom: {
        style: "thin",
      },
      left: {
        style: "thin"
      },
      right: {
        style: "thin"
      }
    }
  };

  const BorderRestAll = {
    border: {
      top: {
        style: "dotted"
      },
      bottom: {
        style: "dotted",
      },
      left: {
        style: "thin"
      },
      right: {
        style: "thin"
      }
    }
  };

  // Apply styling to header rows
  applyRowStyle(ws, 1, {...Fill1, ...BorderFirst2} );
  applyRowStyle(ws, 2, {...Fill2, ...BorderFirst2} );

  // Apply styling to rows
  for( let i = 3; i < (pdfXLSXRows.length + 2); i++ ){
    applyRowStyle(ws, i, BorderRestAll);
  }

  // Do everything related to footer rows here
  handleFooter(ws, BorderFirst2, bodyDataXLSX, footerData);

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "SheetJS");
  XLSX.writeFile(wb, "sheetjs.xlsx");
};

function handleFooter(ws, style, bodyDataXLSX, footerData){

  let footerIndex = bodyDataXLSX.length + 2;

  // Populate footer cells
  XLSX.utils.sheet_add_aoa(ws, [[""]], {origin: `A${footerIndex}`});
  XLSX.utils.sheet_add_aoa(ws, [[pdfXLSXFooterColumns[0]]], {origin: `B${footerIndex}`});
  XLSX.utils.sheet_add_aoa(ws, [[""]], {origin: `C${footerIndex}`});
  XLSX.utils.sheet_add_aoa(ws, [[""]], {origin: `D${footerIndex}`});
  XLSX.utils.sheet_add_aoa(ws, [[""]], {origin: `E${footerIndex}`});
  XLSX.utils.sheet_add_aoa(ws, [[footerData[0]]], {origin: `F${footerIndex}`});

  XLSX.utils.sheet_add_aoa(ws, [[""]], {origin: `A${footerIndex + 2}`});
  XLSX.utils.sheet_add_aoa(ws, [[pdfXLSXFooterColumns[1]]], {origin: `B${footerIndex + 2}`});
  XLSX.utils.sheet_add_aoa(ws, [[""]], {origin: `C${footerIndex + 2}`});
  XLSX.utils.sheet_add_aoa(ws, [[""]], {origin: `D${footerIndex + 2}`});
  XLSX.utils.sheet_add_aoa(ws, [[""]], {origin: `E${footerIndex + 2}`});
  XLSX.utils.sheet_add_aoa(ws, [[footerData[1]]], {origin: `F${footerIndex + 2}`});

  XLSX.utils.sheet_add_aoa(ws, [[""]], {origin: `A${footerIndex + 3}`});
  XLSX.utils.sheet_add_aoa(ws, [[pdfXLSXFooterColumns[2]]], {origin: `B${footerIndex + 3}`});
  XLSX.utils.sheet_add_aoa(ws, [[""]], {origin: `C${footerIndex + 3}`});
  XLSX.utils.sheet_add_aoa(ws, [[""]], {origin: `D${footerIndex + 3}`});
  XLSX.utils.sheet_add_aoa(ws, [[""]], {origin: `E${footerIndex + 3}`});
  XLSX.utils.sheet_add_aoa(ws, [[footerData[2]]], {origin: `F${footerIndex + 3}`});

  XLSX.utils.sheet_add_aoa(ws, [[""]], {origin: `A${footerIndex + 4}`});
  XLSX.utils.sheet_add_aoa(ws, [[pdfXLSXFooterColumns[3]]], {origin: `B${footerIndex + 4}`});
  XLSX.utils.sheet_add_aoa(ws, [[""]], {origin: `C${footerIndex + 4}`});
  XLSX.utils.sheet_add_aoa(ws, [[""]], {origin: `D${footerIndex + 4}`});
  XLSX.utils.sheet_add_aoa(ws, [[""]], {origin: `E${footerIndex + 4}`});
  XLSX.utils.sheet_add_aoa(ws, [[footerData[3]]], {origin: `F${footerIndex + 4}`});
  // Populate footer cells

  // Style footer cells
  applyRowStyle(ws, footerIndex, style);
  applyRowStyle(ws, (footerIndex + 2), style);
  applyRowStyle(ws, (footerIndex + 3), style);
  applyRowStyle(ws, (footerIndex + 4), style);
  // Style footer cells

  let footerIndexForMerging = footerIndex - 1;
  // Merge footer cells - Merge must be done after styling
  const merge = [
    { s: { r: footerIndexForMerging, c: 1 }, e: { r: footerIndexForMerging, c: 4 } },
    { s: { r: (footerIndexForMerging + 2), c: 1 }, e: { r: (footerIndexForMerging + 2), c: 4 } },
    { s: { r: (footerIndexForMerging + 3), c: 1 }, e: { r: (footerIndexForMerging + 3), c: 4 } },
    { s: { r: (footerIndexForMerging + 4), c: 1 }, e: { r: (footerIndexForMerging + 4), c: 4 } },
  ];
  ws["!merges"] = merge;
  // Merge footer cells

}

function applyRowStyle(ws, RowNum, style){
  for( let i = 0; i < pdfXLSXColumns.length; i++ ){
    let char = ABC[i];
    ws[`${char}${RowNum}`].s = style;
  }
}

export {
  exportXLSXEstimation
}