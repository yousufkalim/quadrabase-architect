import jsPDF from "jspdf";
import "jspdf-autotable";

import {
  headGen,
  rowsGenSimpleEstimation,
  rowsGenTradesEstimation,
  rowsGenTradesAndTranchesEstimation,
  pdfParsedDataGenTradesEstimation,
  pdfParsedDataGenTradesAndTranchesEstimation,
  footerDataGenSimpleEstimation,
  rowsGenSimpleBPU,
  rowsGenTradesBPU,
  rowsGenTradesAndTranchesBPU,
  dataColumnsEstimation,
  footerColumnsSimpleEstimation,
  dataColumnsBPU
} from "./data.js";

function applyGlobalStyling(s){
  s.overflow = 'linebreak';
  s.columnWidth = 'wrap';
  s.font = 'helvetica';
  s.cellPadding = 3;
  s.overflowColumns = 'linebreak';
  s.lineColor = [0, 0, 0];
  s.borders = "t";
}

function exportPDFSimpleEstimation(data, currentProject, noPrice){

  const headArr = headGen(
    `${noPrice ? "DQE" : "Estimation"}`,
    `${currentProject?.name ?? "N/A"}`
  );
  const realDataPDF = rowsGenSimpleEstimation(data, noPrice); // It's the same thing in case of pdf plugin.
  const footerData = footerDataGenSimpleEstimation(data, currentProject, noPrice);

  const unit = "pt";
  const size = "A4"; // Use A1, A2, A3 or A4
  const orientation = "portrait"; // portrait or landscape

  const doc = new jsPDF(orientation, unit, size);

  doc.setFontSize(12);

  // It is important to draw tables one by one so that value of
  // doc.lastAutoTable.settings.startY is updated and synced.
  const contentHeadTable = {
    startY: 50,
    theme: 'plain',
    head: [headArr],
    theme: "plain",
    didParseCell: (data) => {
      const s = data.cell.styles;

      //global styling
      applyGlobalStyling(s);

      s.fontSize = 12;
      s.fillColor = [191, 191, 191];
      s.lineWidth = 0.1;

    },
  };

  doc.autoTable(contentHeadTable);

  const contentMainTable = {
    startY: doc.lastAutoTable.settings.startY + 32,
    pageBreak: 'avoid',
    head: [dataColumnsEstimation], // Lib requirement is that it is [][]
    body: realDataPDF,
    theme: 'plain',
    didParseCell: (data) => {
      const s = data.cell.styles;

      //global styling
      applyGlobalStyling(s);

      s.fontSize = 10;
      s.lineWidth = 0.1;

      if (data.row.section === 'head') {
        s.fontSize = 12;
        s.fillColor = [191, 191, 191];
      } else if (data.row.index === 0) {
        s.fontSize = 11;
        s.fillColor = [211, 211, 211];
      } else {
        s.fontSize = 10;
        s.fillColor = [255, 255, 255];
      }

    },
  };

  doc.autoTable(contentMainTable);

  const contentFootTable = {
    startY: (doc.lastAutoTable.settings.startY + (32 * realDataPDF.length )) - (2 * realDataPDF.length),
    theme: 'plain',
    head: [[
      footerColumnsSimpleEstimation[0],
      footerData[0],
    ]],
    body: [
      [
        "",
        ""
      ],
      [
        footerColumnsSimpleEstimation[1],
        footerData[1],
      ],
      [
        footerColumnsSimpleEstimation[2],
        footerData[2],
      ],
      [
        footerColumnsSimpleEstimation[3],
        footerData[3],
      ],
    ],
    theme: "plain",
    didParseCell: (data) => {
      const s = data.cell.styles;

      //global styling
      applyGlobalStyling(s);

      s.lineWidth = 0.1;
      s.fontSize = 9;
      s.fillColor = [255, 255, 255];
      s.halign = 'right';

    },
  };

  doc.autoTable(contentFootTable);

  doc.save(`${currentProject?.name ?? "N/A"} - ${Date.now()} - ${noPrice ? "DQE" : "Estimation"}`);
}

function exportPDFTradesEstimation(data, currentProject, noPrice){

  const headArr = headGen(
    `${noPrice ? "DQE" : "Estimation"}`,
    `${currentProject?.name ?? "N/A"}`
  );

  const unit = "pt";
  const size = "A4"; // Use A1, A2, A3 or A4
  const orientation = "portrait"; // portrait or landscape

  const doc = new jsPDF(orientation, unit, size);

  doc.setFontSize(12);

  // Draw head table
  const contentHeadTable = {
    startY: 50,
    theme: 'plain',
    head: [headArr],
    theme: "plain",
    didParseCell: (data) => {
      const s = data.cell.styles;

      //global styling
      applyGlobalStyling(s);

      s.fontSize = 12;
      s.fillColor = [191, 191, 191];
      s.lineWidth = 0.1;

    },
  };
  doc.autoTable(contentHeadTable);

  const rows = rowsGenTradesEstimation(data, noPrice);

  let pdfParsedData = [];

  for(let i = 0; i < rows.length; i++){
    const currentRow = rows[i];
    const currentRowXLSXParsedData = pdfParsedDataGenTradesEstimation(currentRow, (i+1));
    pdfParsedData = pdfParsedData.concat(currentRowXLSXParsedData);
  }

  const contentMainTable = {
    startY: doc.lastAutoTable.settings.startY + 32,
    pageBreak: 'avoid',
    head: [dataColumnsEstimation], // Lib requirement is that it is [][]
    body: pdfParsedData,
    theme: 'plain',
    didParseCell: (data) => {
      const s = data.cell.styles;

      //global styling
      applyGlobalStyling(s);

      s.fontSize = 10;
      s.lineWidth = 0.1;

      if (data.row.section === 'head') {
        s.fontSize = 12;
        s.fillColor = [191, 191, 191];
      } else {
        s.fontSize = 10;
        s.fillColor = [255, 255, 255];
      }

    },
  };

  doc.autoTable(contentMainTable);

  doc.save(`${currentProject?.name ?? "N/A"} - ${Date.now()} - ${noPrice ? "DQE" : "Estimation"}`);
}

function exportPDFTradesAndTranchesEstimation(data, currentProject, noPrice){

  const headArr = headGen(
    `${noPrice ? "DQE" : "Estimation"}`,
    `${currentProject?.name ?? "N/A"}`
  );

  const unit = "pt";
  const size = "A4"; // Use A1, A2, A3 or A4
  const orientation = "portrait"; // portrait or landscape

  const doc = new jsPDF(orientation, unit, size);

  doc.setFontSize(12);

  // Draw head table
  const contentHeadTable = {
    startY: 50,
    theme: 'plain',
    head: [headArr],
    theme: "plain",
    didParseCell: (data) => {
      const s = data.cell.styles;

      //global styling
      applyGlobalStyling(s);

      s.fontSize = 12;
      s.fillColor = [191, 191, 191];
      s.lineWidth = 0.1;

    },
  };
  doc.autoTable(contentHeadTable);

  const rows = rowsGenTradesAndTranchesEstimation(data, noPrice);

  let pdfparsedData = [];

  for(let i = 0; i < rows.length; i++){
    const currentRow = rows[i];
    const currentRowXLSXParsedData = pdfParsedDataGenTradesAndTranchesEstimation(currentRow, (i+1));
    pdfparsedData = pdfparsedData.concat(currentRowXLSXParsedData);
  }

  const contentMainTable = {
    startY: doc.lastAutoTable.settings.startY + 32,
    pageBreak: 'avoid',
    head: [dataColumnsEstimation], // Lib requirement is that it is [][]
    body: pdfparsedData,
    theme: 'plain',
    didParseCell: (data) => {
      const s = data.cell.styles;

      //global styling
      applyGlobalStyling(s);

      s.fontSize = 10;
      s.lineWidth = 0.1;

      if (data.row.section === 'head') {
        s.fontSize = 12;
        s.fillColor = [191, 191, 191];
      } else {
        s.fontSize = 10;
        s.fillColor = [255, 255, 255];
      }

    },
  };

  doc.autoTable(contentMainTable);

  doc.save(`${currentProject?.name ?? "N/A"} - ${Date.now()} - ${noPrice ? "DQE" : "Estimation"}`);
}

function exportPDFSimpleBPU(data, currentProject){

  const headArr = headGen(
    "BPU",
    `${currentProject?.name ?? "N/A"}`
  );

  const unit = "pt";
  const size = "A4"; // Use A1, A2, A3 or A4
  const orientation = "portrait"; // portrait or landscape

  const doc = new jsPDF(orientation, unit, size);

  doc.setFontSize(12);

  // It is important to draw tables one by one so that value of
  // doc.lastAutoTable.settings.startY is updated and synced.
  const contentHeadTable = {
    startY: 50,
    theme: 'plain',
    head: [headArr],
    theme: "plain",
    didParseCell: (data) => {
      const s = data.cell.styles;

      //global styling
      s.overflow = 'linebreak';
      s.columnWidth = 'wrap';
      s.font = 'helvetica';
      s.fontSize = 12;
      s.cellPadding = 3;
      s.overflowColumns = 'linebreak';
      s.lineColor = [0, 0, 0];
      s.borders = "t";
      s.lineWidth = 0.1;
      s.fillColor = [191, 191, 191];

    },
  };

  doc.autoTable(contentHeadTable);

  const pdfParsedPDF = rowsGenSimpleBPU(data);

  const contentMainTable = {
    startY: doc.lastAutoTable.settings.startY + 32,
    pageBreak: 'avoid',
    head: [dataColumnsBPU], // Lib requirement is that it is [][]
    body: pdfParsedPDF,
    theme: 'plain',
    didParseCell: (data) => {
      const s = data.cell.styles;

      //global styling
      s.overflow = 'linebreak';
      s.columnWidth = 'wrap';
      s.font = 'helvetica';
      s.fontSize = 10;
      s.cellPadding = 3;
      s.overflowColumns = 'linebreak';
      s.lineColor = [0, 0, 0];
      s.borders = "t";
      s.lineWidth = 0.1;

    },
  };

  doc.autoTable(contentMainTable);

  doc.save(`${currentProject?.name ?? "N/A"} - ${Date.now()} - BPU`);
}

function exportPDFTradesBPU(data, currentProject){

  const headArr = headGen(
    "BPU",
    `${currentProject?.name ?? "N/A"}`
  );

  const unit = "pt";
  const size = "A4"; // Use A1, A2, A3 or A4
  const orientation = "portrait"; // portrait or landscape

  const doc = new jsPDF(orientation, unit, size);

  doc.setFontSize(12);

  // Draw head table
  const contentHeadTable = {
    startY: 50,
    theme: 'plain',
    head: [headArr],
    theme: "plain",
    didParseCell: (data) => {
      const s = data.cell.styles;

      //global styling
      s.overflow = 'linebreak';
      s.columnWidth = 'wrap';
      s.font = 'helvetica';
      s.fontSize = 12;
      s.cellPadding = 3;
      s.overflowColumns = 'linebreak';
      s.lineColor = [0, 0, 0];
      s.borders = "t";
      s.lineWidth = 0.1;
      s.fillColor = [191, 191, 191];

    },
  };
  doc.autoTable(contentHeadTable);

  const pdfParsedData = rowsGenTradesBPU(data);

  const contentMainTable = {
    startY: doc.lastAutoTable.settings.startY + 32,
    pageBreak: 'avoid',
    head: [dataColumnsBPU], // Lib requirement is that it is [][]
    body: pdfParsedData,
    theme: 'plain',
    didParseCell: (data) => {
      const s = data.cell.styles;

      //global styling
      s.overflow = 'linebreak';
      s.columnWidth = 'wrap';
      s.font = 'helvetica';
      s.fontSize = 10;
      s.cellPadding = 3;
      s.overflowColumns = 'linebreak';
      s.lineColor = [0, 0, 0];
      s.borders = "t";
      s.lineWidth = 0.1;

    },
  };

  doc.autoTable(contentMainTable);

  doc.save(`${currentProject?.name ?? "N/A"} - ${Date.now()} - BPU`);
}

function exportPDFTradesAndTranchesBPU(data, currentProject){

  const headArr = headGen(
    "BPU",
    `${currentProject?.name ?? "N/A"}`
  );

  const pdfParsedData = rowsGenTradesAndTranchesBPU(data);

  const unit = "pt";
  const size = "A4"; // Use A1, A2, A3 or A4
  const orientation = "portrait"; // portrait or landscape

  const doc = new jsPDF(orientation, unit, size);

  doc.setFontSize(12);

  // Draw head table
  const contentHeadTable = {
    startY: 50,
    theme: 'plain',
    head: [headArr],
    theme: "plain",
    didParseCell: (data) => {
      const s = data.cell.styles;

      //global styling
      s.overflow = 'linebreak';
      s.columnWidth = 'wrap';
      s.font = 'helvetica';
      s.fontSize = 12;
      s.cellPadding = 3;
      s.overflowColumns = 'linebreak';
      s.lineColor = [0, 0, 0];
      s.borders = "t";
      s.lineWidth = 0.1;
      s.fillColor = [191, 191, 191];

    },
  };
  doc.autoTable(contentHeadTable);

  const contentMainTable = {
    startY: doc.lastAutoTable.settings.startY + 32,
    pageBreak: 'avoid',
    head: [dataColumnsBPU], // Lib requirement is that it is [][]
    body: pdfParsedData,
    theme: 'plain',
    didParseCell: (data) => {
      const s = data.cell.styles;

      //global styling
      s.overflow = 'linebreak';
      s.columnWidth = 'wrap';
      s.font = 'helvetica';
      s.fontSize = 10;
      s.cellPadding = 3;
      s.overflowColumns = 'linebreak';
      s.lineColor = [0, 0, 0];
      s.borders = "t";
      s.lineWidth = 0.1;

    },
  };

  doc.autoTable(contentMainTable);

  doc.save(`${currentProject?.name ?? "N/A"} - ${Date.now()} - BPU`);
}

export {
  exportPDFSimpleEstimation,
  exportPDFTradesEstimation,
  exportPDFTradesAndTranchesEstimation,
  exportPDFSimpleBPU,
  exportPDFTradesBPU,
  exportPDFTradesAndTranchesBPU
}