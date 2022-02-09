
import XLSX from "xlsx-js-style";

import {
  rowsGenSimpleEstimation,
  rowsGenTradesEstimation,
  rowsGenTradesAndTranchesEstimation,
  xlsxParsedDataGenSimpleEstimation,
  xlsxParsedDataGenTradesEstimation,
  xlsxParsedDataGenTradesAndTranchesEstimation,
  xlsxParsedFooterDataGenEstimation,
  calculateWSCols,
  footerDataGenSimpleEstimation,
  dataColumnsEstimation,
  footerColumnsSimpleEstimation,
} from "./data.js";

const ABC = ["A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z"];

// Styles
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

// For trades
const Fill3 = {
  fill: {
    fgColor: { rgb: "FFF1966C" },
  },
  font: {
    bold: true
  }
};

// For trades and tranches
const Fill4 = {
  fill: {
    fgColor: { rgb: "FFEBECF0" },
  },
};

// For trades total
const Fill5 = {
  fill: {
    fgColor: { rgb: "FFB1F2FF" },
  },
};

// For tranch total
const Fill6 = {
  fill: {
    fgColor: { rgb: "FF63E5FF" },
  },
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

const exportXLSXSimpleEstimation = (data, currentProject, noPrice) => {

  const rows = rowsGenSimpleEstimation(data, noPrice);

  let xlsxParsedData = [];
  const xlsxParsedBodyData = xlsxParsedDataGenSimpleEstimation(rows);
  const footerDataFloatsArr = footerDataGenSimpleEstimation(data, currentProject, noPrice, true);
  const xlsxParsedFooterData = xlsxParsedFooterDataGenEstimation(
    footerDataFloatsArr,
    footerColumnsSimpleEstimation
  );

  xlsxParsedData = xlsxParsedData.concat(xlsxParsedBodyData);
  xlsxParsedData = xlsxParsedData.concat(xlsxParsedFooterData);

  const ws = XLSX.utils.json_to_sheet(xlsxParsedData);

  // Set column widths
  const wscols = calculateWSCols(xlsxParsedData);
  ws['!cols'] = wscols

  let cursor = 1;
  let stopAt;

  // Header row style
  applyRowStyle(ws, cursor, {...Fill1, ...BorderFirst2} ); 
  cursor = cursor + 1;

  // Project title row style 
  applyRowStyle(ws, cursor, {...Fill2, ...BorderFirst2} ); 
  cursor = cursor + 1;

  // Apply styling to body
  stopAt = rows.length + cursor;
  for( let i = (cursor + 1); i < stopAt; i++ ){
    applyRowStyle(ws, i, BorderRestAll);
    cursor = cursor + 1;
  }

  // Apply styling to footer
  stopAt = footerDataFloatsArr.length + cursor;
  for( let i = (cursor + 1); i < stopAt; i++ ){
    applyRowStyle(ws, i, BorderFirst2);
  }

  // Make merger object
  const merge = [];
  stopAt = cursor - 1;
  for( let i = 0; i < footerDataFloatsArr.length; i++ ){
    const obj = {
      s: { r: stopAt + i, c: 1 },
      e: { r: stopAt + i, c: 4 }
    }
    merge.push(obj);
  }

  // Merge footer cells - Merge must be done after styling
  ws["!merges"] = merge;

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "SheetJS");
  XLSX.writeFile(wb, `${currentProject?.name ?? "N/A"} - ${Date.now()} - ${noPrice ? "DQE" : "Estimation"}.xlsx`);
};

const exportXLSXTradesEstimation = (data, currentProject, noPrice) => {

  const rows = rowsGenTradesEstimation(data, noPrice);

  let xlsxParsedData = [];

  for(let i = 0; i < rows.length; i++){
    const currentRow = rows[i];
    const currentRowXLSXParsedData = xlsxParsedDataGenTradesEstimation(currentRow, (i+1));
    xlsxParsedData = xlsxParsedData.concat(currentRowXLSXParsedData);
  }

  const ws = XLSX.utils.json_to_sheet(xlsxParsedData);

  // Set column widths
  const wscols = calculateWSCols(xlsxParsedData);
  ws['!cols'] = wscols;

  let cursor = 1;
  const merge = [];

  // Header row style
  applyRowStyle(ws, cursor, {...Fill1, ...BorderFirst2} ); 
  cursor = cursor + 1;

  // Trades styling
  for(let i = 0; i < rows.length; i++){
    const tradeRow = rows[i];
    // Trade label row style 
    applyRowStyle(ws, cursor, {...Fill3, ...BorderFirst2} );
    cursor = cursor + 1;
    const workAndWorkDetailsRows = tradeRow.rows;
    for( let j = 0; j < workAndWorkDetailsRows.length; j++ ){
      // WorkAndWorkDetail row style 
      applyRowStyle(ws, cursor, BorderRestAll);
      cursor = cursor + 1;
    }
    // Trade total row style 
    applyRowStyle(ws, cursor, {...Fill6, ...BorderFirst2} );
    merge.push({
      s: { r: cursor-1, c: 1 },
      e: { r: cursor-1, c: 4 }
    });
    cursor = cursor + 1;
  }

  // Merge footer cells - Merge must be done after styling
  ws["!merges"] = merge;

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, `Sheet_1`);
  XLSX.writeFile(wb, `${currentProject?.name ?? "N/A"} - ${Date.now()} - ${noPrice ? "DQE" : "Estimation"}.xlsx`);
};

const exportXLSXTradesAndTranchesEstimation = (data, currentProject, noPrice) => {

  const rows = rowsGenTradesAndTranchesEstimation(data, noPrice);

  let xlsxParsedData = [];

  for(let i = 0; i < rows.length; i++){
    const currentRow = rows[i];
    const currentRowXLSXParsedData = xlsxParsedDataGenTradesAndTranchesEstimation(currentRow, (i+1));
    xlsxParsedData = xlsxParsedData.concat(currentRowXLSXParsedData);
  }

  const ws = XLSX.utils.json_to_sheet(xlsxParsedData);

  // Set column widths
  const wscols = calculateWSCols(xlsxParsedData);
  ws['!cols'] = wscols;

  let cursor = 1;
  const merge = [];

  // Header row style
  applyRowStyle(ws, cursor, {...Fill1, ...BorderFirst2} ); 
  cursor = cursor + 1;

  // Trades styling
  for(let i = 0; i < rows.length; i++){
    const tradeRow = rows[i];
    // Trade label row style 
    applyRowStyle(ws, cursor, {...Fill3, ...BorderFirst2} );
    cursor = cursor + 1;
    const trancheRows = tradeRow.rows;
    for(let j = 0; j < trancheRows.length; j++){
      const tranchRow = trancheRows[j];
      // Tranch label row style 
      applyRowStyle(ws, cursor, {...Fill4, ...BorderFirst2} );
      cursor = cursor + 1;
      const workAndWorkDetailsRows = tranchRow.rows;
      for( let k = 0; k < workAndWorkDetailsRows.length; k++ ){
        // WorkAndWorkDetail row style 
        applyRowStyle(ws, cursor, BorderRestAll);
        cursor = cursor + 1;
      }
      // Tranch total row style 
      applyRowStyle(ws, cursor, {...Fill5, ...BorderFirst2} );
      merge.push({
        s: { r: cursor-1, c: 1 },
        e: { r: cursor-1, c: 4 }
      });
      cursor = cursor + 1;
    }
    // Trde total row style 
    applyRowStyle(ws, cursor, {...Fill6, ...BorderFirst2} );
    merge.push({
      s: { r: cursor-1, c: 1 },
      e: { r: cursor-1, c: 4 }
    });
    cursor = cursor + 1;
  }

  // Merge footer cells - Merge must be done after styling
  ws["!merges"] = merge;

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, `Sheet_1`);
  XLSX.writeFile(wb, `${currentProject?.name ?? "N/A"} - ${Date.now()} - ${noPrice ? "DQE" : "Estimation"}.xlsx`);
};

function applyRowStyle(ws, RowNum, style){
  for( let i = 0; i < dataColumnsEstimation.length; i++ ){
    let char = ABC[i];
    ws[`${char}${RowNum}`].s = style;
  }
}

export {
  exportXLSXSimpleEstimation,
  exportXLSXTradesEstimation,
  exportXLSXTradesAndTranchesEstimation
}