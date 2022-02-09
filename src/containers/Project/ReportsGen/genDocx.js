
import { Packer } from "docx";
import { saveAs } from "file-saver";

import { 
  convertInchesToTwip,
  Document,
  Paragraph,
  TextRun,
  AlignmentType,
  Table,
  TableCell,
  TableRow,
  VerticalAlign
} from "docx";

import {
  headGen,
  rowsGenSimpleEstimation,
  rowsGenBPU,
  rowsGenCCTP,
  footerDataGenSimpleEstimation,
  textRunsSplitGen,
  dataColumnsEstimation,
  footerColumnsSimpleEstimation,
  dataColumnsBPU,
} from "./data.js";

const Spacer = new Paragraph({
  text: "",
});

function exportDOCXestimation(data, currentProject, noPrice){

  const pdfXLSXHead = headGen(
    `${noPrice ? "DQE" : "Estimation"}`,
    `${currentProject?.name ?? "N/A"}`
  );

  const pdfXLSXRows = rowsGenSimpleEstimation(data, noPrice);
  const footerData = footerDataGenSimpleEstimation(data, currentProject, noPrice);

  const tableHeader = [
    new Table({
      alignment: AlignmentType.CENTER,
      rows: [
        new TableRow({
          children: [
            new TableCell({
              children: [
                new Paragraph({
                  alignment: AlignmentType.START,
                  children: [
                    new TextRun({
                      text: pdfXLSXHead[0],
                      size: 22,
                    })
                  ]
                })
              ],
              verticalAlign: VerticalAlign.CENTER,
              margins: normalMargin,
              shading: {
                fill: "#C4C8CC"
              }
            }),
            new TableCell({
              children: [
                new Paragraph({
                  alignment: AlignmentType.CENTER,
                  children: [
                    new TextRun({
                      text: pdfXLSXHead[1],
                      size: 22,
                      bold: true
                    })
                  ]
                })
              ],
              verticalAlign: VerticalAlign.CENTER,
              margins: {
                top: convertInchesToTwip(0.06),
                bottom: convertInchesToTwip(0.06),
                left: convertInchesToTwip(0.24),
                right: convertInchesToTwip(0.24),
              },
              shading: {
                fill: "#C4C8CC"
              }
            }),
            new TableCell({
              children: [
                new Paragraph({
                  alignment: AlignmentType.END,
                  children: [
                    new TextRun({
                      text: pdfXLSXHead[2],
                      size: 22,
                    })
                  ]
                })
              ],
              verticalAlign: VerticalAlign.CENTER,
              margins: normalMargin,
              shading: {
                fill: "#C4C8CC"
              }
            }),
          ],
        }),
      ],
    }),
  ];

  const tableBodyColumns = [];

  for( let i = 0; i < dataColumnsEstimation.length; i++ ){

    const tableCell = new TableCell({
      children: [
        new Paragraph({
          alignment: AlignmentType.CENTER,
          children: [
            new TextRun({
              text: dataColumnsEstimation[i],
              size: 26,
            })
          ]
        })
      ],
      verticalAlign: VerticalAlign.CENTER,
      margins: i != 1 ? normalMargin : {
        top: convertInchesToTwip(0.06),
        bottom: convertInchesToTwip(0.06),
        left: convertInchesToTwip(0.72),
        right: convertInchesToTwip(0.72),
      },
      shading: {
        fill: "#DCDADA"
      }
    });

    tableBodyColumns.push(tableCell);

  }

  const tableBodyRows = [];

  for ( let i = 0; i < pdfXLSXRows.length; i++ ){
    const currentRow = pdfXLSXRows[i];
    const tableRowCells = [];
    for( let j = 0; j < currentRow.length; j++ ){
      const tableCell = new TableCell({
        children: [
          new Paragraph({
            text: `${currentRow[j]}`,
            alignment: AlignmentType.START,
          })
        ],
        verticalAlign: VerticalAlign.CENTER,
        margins: normalMargin,
        shading: i == 0 ? firstRowShade : null
      });
      tableRowCells.push(tableCell);
    }
    const tableRow = new TableRow({
      children: tableRowCells,
    });
    tableBodyRows.push(tableRow);
  }

  const tableBody = [
    new Table({
      alignment: AlignmentType.CENTER,
      rows: [
        new TableRow({
          children: tableBodyColumns,
        }),
        ...tableBodyRows
      ],
    }),
  ];

  const tableFooterRows = [];

  for( let i = 0; i < footerColumnsSimpleEstimation.length; i++ ){
    const tableRowCells = [];
    const tableCell1 = new TableCell({
      children: [
        new Paragraph({
          alignment: AlignmentType.END,
          children: [
            new TextRun({
              text: footerColumnsSimpleEstimation[i],
              bold: true
            })
          ]
        })
      ],
      verticalAlign: VerticalAlign.CENTER,
      margins: normalMargin,
      shading: i == 0 ? firstRowShade : null
    });
    const tableCell2 = new TableCell({
      children: [
        new Paragraph({
          alignment: AlignmentType.END,
          children: [
            new TextRun({
              text: `${footerData[i]}`,
              bold: true
            })
          ]
        })
      ],
      verticalAlign: VerticalAlign.CENTER,
      margins: normalMargin,
      shading: i == 0 ? firstRowShade : null
    });
    tableRowCells.push(tableCell1);
    tableRowCells.push(tableCell2);
    const tableRow = new TableRow({
      children: tableRowCells,
    });
    tableFooterRows.push(tableRow);
  }

  const tableFooter = [
    new Table({
      alignment: AlignmentType.RIGHT,
      rows: [
        ...tableFooterRows
      ],
    }),
  ];

  const children = [
    ...tableHeader,
    Spacer,
    ...tableBody,
    Spacer,
    ...tableFooter
  ];

  const sections = [{
    children: children
  }];

  const doc = new Document({
    sections: sections,
  });

  Packer.toBlob(doc).then(blob => {
    saveAs(blob, `${currentProject?.name ?? "N/A"} - ${Date.now()} - ${noPrice ? "DQE" : "Estimation"}`);
  });

}

function exportDOCXBPU(data, currentProject){

  const pdfXLSXHead = headGen(
    "BPU",
    `${currentProject?.name ?? "N/A"}`
  );

  const pdfXLSXRows = rowsGenBPU(data);

  const tableHeader = [
    new Table({
      rows: [
        new TableRow({
          children: [
            new TableCell({
              children: [
                new Paragraph({
                  text: pdfXLSXHead[0],
                  style: "bold",
                  alignment: AlignmentType.START,
                })
              ],
              verticalAlign: VerticalAlign.CENTER,
              margins: normalMargin,
              shading: {
                fill: "#C4C8CC"
              }
            }),
            new TableCell({
              children: [
                new Paragraph({
                  text: pdfXLSXHead[1],
                  style: "bold",
                  alignment: AlignmentType.CENTER,
                })
              ],
              verticalAlign: VerticalAlign.CENTER,
              margins: {
                top: convertInchesToTwip(0.06),
                bottom: convertInchesToTwip(0.06),
                left: convertInchesToTwip(0.24),
                right: convertInchesToTwip(0.24),
              },
              shading: {
                fill: "#C4C8CC"
              }
            }),
            new TableCell({
              children: [
                new Paragraph({
                  text: pdfXLSXHead[2],
                  style: "bold",
                  alignment: AlignmentType.END,
                })
              ],
              verticalAlign: VerticalAlign.CENTER,
              margins: normalMargin,
              shading: {
                fill: "#C4C8CC"
              }
            }),
          ],
        }),
      ],
    }),
  ];

  const tableBodyColumns = [];

  for( let i = 0; i < dataColumnsBPU.length; i++ ){

    const tableCell = new TableCell({
      children: [
        new Paragraph({
          text: dataColumnsEstimation[i],
          alignment: AlignmentType.START,
        })
      ],
      verticalAlign: VerticalAlign.CENTER,
      margins: i != 1 ? normalMargin : {
        top: convertInchesToTwip(0.06),
        bottom: convertInchesToTwip(0.06),
        left: convertInchesToTwip(0.72),
        right: convertInchesToTwip(0.72),
      },
      shading: {
        fill: "#DCDADA"
      }
    });

    tableBodyColumns.push(tableCell);

  }

  const tableBodyRows = [];

  for ( let i = 0; i < pdfXLSXRows.length; i++ ){
    const currentRow = pdfXLSXRows[i];
    const tableRowCells = [];
    for( let j = 0; j < currentRow.length; j++ ){
      let docxObjs = textRunsSplitGen(currentRow[j]);
      const tableCell = new TableCell({
        children: docxObjs,
        verticalAlign: VerticalAlign.CENTER,
        margins: normalMargin,
      });
      tableRowCells.push(tableCell);
    }
    const tableRow = new TableRow({
      children: tableRowCells,
    });
    tableBodyRows.push(tableRow);
  }

  const tableBody = [
    new Table({
      rows: [
        new TableRow({
          children: tableBodyColumns,
        }),
        ...tableBodyRows
      ],
    }),
  ];

  const children = [
    ...tableHeader,
    ...tableBody,
  ];

  const sections = [{
    children: children
  }];

  const doc = new Document({
    sections: sections,
  });

  Packer.toBlob(doc).then(blob => {
    saveAs(blob, `${currentProject?.name ?? "N/A"} - ${Date.now()} - BPU`);
  });

}

function exportDOCXCCTP(data, currentProject){

  const pdfXLSXHead = headGen(
    "CCTP",
    `${currentProject?.name ?? "N/A"}`
  );

  const pdfXLSXRows = rowsGenCCTP(data);

  const tableHeader = [
    new Table({
      rows: [
        new TableRow({
          children: [
            new TableCell({
              children: [
                new Paragraph({
                  text: pdfXLSXHead[0],
                  style: "bold",
                  alignment: AlignmentType.START,
                })
              ],
              verticalAlign: VerticalAlign.CENTER,
              margins: normalMargin,
              shading: {
                fill: "#C4C8CC"
              }
            }),
            new TableCell({
              children: [
                new Paragraph({
                  text: pdfXLSXHead[1],
                  style: "bold",
                  alignment: AlignmentType.CENTER,
                })
              ],
              verticalAlign: VerticalAlign.CENTER,
              margins: {
                top: convertInchesToTwip(0.06),
                bottom: convertInchesToTwip(0.06),
                left: convertInchesToTwip(0.72),
                right: convertInchesToTwip(0.72),
              },
              shading: {
                fill: "#C4C8CC"
              }
            }),
            new TableCell({
              children: [
                new Paragraph({
                  text: pdfXLSXHead[2],
                  style: "bold",
                  alignment: AlignmentType.END,
                })
              ],
              verticalAlign: VerticalAlign.CENTER,
              margins: normalMargin,
              shading: {
                fill: "#C4C8CC"
              }
            }),
          ],
        }),
      ],
    }),
  ];

  const bodyChild = [];

  for(let i = 0; i < pdfXLSXRows.length; i++){

    bodyChild.push(
      new Paragraph({
        spacing: {
          before: i == 0 ? 120 : 80,
          after: 60
        },
        children: [
          new TextRun({
            text: pdfXLSXRows[i].title,
            size: 42,
            bold: true
          }),
        ],
      })
    );

    const CCTPArr = pdfXLSXRows[i].cctp_arr;

    for( let j = 0; j < CCTPArr.length; j++ ){
      let docxObjs = textRunsSplitGen(CCTPArr[j]);
      bodyChild.push(
        ...docxObjs
      );
    }
  }

  const children = [
    ...tableHeader,
    ...bodyChild
  ];

  const sections = [{
    children: children
  }];

  const doc = new Document({
    sections: sections,
  });

  Packer.toBlob(doc).then(blob => {
    saveAs(blob, `${currentProject?.name ?? "N/A"} - ${Date.now()} - CCTP`);
  });

}

const normalMargin = {
  top: convertInchesToTwip(0.03),
  bottom: convertInchesToTwip(0.03),
  left: convertInchesToTwip(0.12),
  right: convertInchesToTwip(0.12),
};

const firstRowShade = {
  fill: "#DCDADA"
};

export {
  exportDOCXestimation,
  exportDOCXBPU,
  exportDOCXCCTP
}