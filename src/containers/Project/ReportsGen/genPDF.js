import jsPDF from "jspdf";
import "jspdf-autotable";

import {
  pdfXLSXHeadGen,
  pdfXLSXRowsGenEstimation,
  pdfXLSXRowsGenBPU,
  footerDataGen,
  pdfXLSXColumns,
  pdfXLSXFooterColumns,
  pdfXLSXColumnsBPU
} from "./data.js";

function exportPDFEstimation(data, currentProject, noPrice){

  const pdfXLSXHead = pdfXLSXHeadGen(
    `${noPrice ? "DQE" : "Estimation"}`,
    `${currentProject?.name ?? "N/A"}`
  );
  const realDataPDF = pdfXLSXRowsGenEstimation(data, noPrice); // It's the same thing in case of pdf plugin.
  const footerData = footerDataGen(data, currentProject, noPrice);

  const unit = "pt";
  const size = "A4"; // Use A1, A2, A3 or A4
  const orientation = "portrait"; // portrait or landscape

  const doc = new jsPDF(orientation, unit, size);

  doc.setFontSize(12);

  // Not used
  // doc.text(title, 40, 40);

  // It is important to draw tables one by one so that value of
  // doc.lastAutoTable.settings.startY is updated and synced.
  const contentHeadTable = {
    startY: 50,
    theme: 'plain',
    head: [pdfXLSXHead],
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
    head: [pdfXLSXColumns], // Lib requirement is that it is [][]
    body: realDataPDF,
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

      if (data.row.section === 'head') {
        s.fontSize = 12;
        s.fillColor = [191, 191, 191];
      } if (data.row.index === 0) {
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
    startY: doc.lastAutoTable.settings.startY + (30 * pdfXLSXColumns.length),
    theme: 'plain',
    head: [[
      pdfXLSXFooterColumns[0],
      footerData[0],
    ]],
    body: [
      [
        "",
        ""
      ],
      [
        pdfXLSXFooterColumns[1],
        footerData[1],
      ],
      [
        pdfXLSXFooterColumns[2],
        footerData[2],
      ],
      [
        pdfXLSXFooterColumns[3],
        footerData[3],
      ],
    ],
    theme: "plain",
    didParseCell: (data) => {
      const s = data.cell.styles;

      //global styling
      s.overflow = 'linebreak';
      s.columnWidth = 'wrap';
      s.font = 'helvetica';
      s.fontSize = 9;
      s.halign = 'right';
      s.cellPadding = 3;
      s.overflowColumns = 'linebreak';
      s.lineColor = [0, 0, 0];
      s.borders = "t";
      s.lineWidth = 0.1;
      s.fillColor = [255, 255, 255];

    },
  };

  doc.autoTable(contentFootTable);

  doc.save(`${currentProject?.name ?? "N/A"} - ${Date.now()} - ${noPrice ? "DQE" : "Estimation"}`);
}

function exportPDFBPU(data, currentProject){

  const pdfXLSXHead = pdfXLSXHeadGen(
    "BPU",
    `${currentProject?.name ?? "N/A"}`
  );

  const realDataPDF = pdfXLSXRowsGenBPU(data);

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
    head: [pdfXLSXHead],
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
    head: [pdfXLSXColumnsBPU], // Lib requirement is that it is [][]
    body: realDataPDF,
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
  exportPDFEstimation,
  exportPDFBPU,
}