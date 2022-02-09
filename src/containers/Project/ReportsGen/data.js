
import { 
  Paragraph,
  TextRun,
  UnderlineType
} from "docx";

function dateNowFormatted() {
  return "01/1/2022"
}

function headGen(headingName, projectName){

  const pdfXLSXHead = [];

  pdfXLSXHead.push(headingName);
  pdfXLSXHead.push(projectName);
  pdfXLSXHead.push(`${dateNowFormatted()}`);

  return pdfXLSXHead;

}

function rowsGenSimpleEstimation(data, noPrice){

  const pdfXLSXRows = [];

  pdfXLSXRows.push(
    [
      "'1",
      "Lot n°1",
      "",
      "",
      "",
      ""
    ],
  );

  rowsGenEstimationHandleWorksAndWorkDetails(
    pdfXLSXRows,
    data,
    `${1}`,
    noPrice
  );

  return pdfXLSXRows;

}

function rowsGenTradesEstimation(data, noPrice){

  const rows = [];

  for( let i = 0; i < data.length; i++){

    const dataRows = [];

    const title = data[i]._id;
    const tradeData = data[i].data;

    dataRows.push(
      [
        `${i+1}`,
        title,
        "",
        "",
        "",
        ""
      ],
    );

    rowsGenEstimationHandleWorksAndWorkDetails(
      dataRows,
      tradeData,
      `${i+1}`,
      noPrice
    );

    rows.push(dataRows);

  }

  return rows;

}

function rowsGenTradesAndTranchesEstimation(data, noPrice){
  const rows = [];

  for( let i = 0; i < data.length; i++){ // Trade for loop
    const tradeTitle = data[i]._id;
    const tradeData = data[i].data;
    const tranchesRows = [];
    const tradeObj = {};
    for(let j = 0; j < tradeData.length; j++){ // Tranch for loop
      const tranchTitle = tradeData[j].tranch;
      const tranchDataArr = tradeData[j].tranchData;
      const workAndDetailsRows = [];
      const tranchObj = {};
      rowsGenEstimationHandleWorksAndWorkDetails(
        workAndDetailsRows,
        tranchDataArr,
        `${i+1}.${j+1}`,
        noPrice
      );
      tranchObj.tranch = tranchTitle;
      tranchObj.rows = workAndDetailsRows;
      tranchesRows.push(tranchObj);
    }
    tradeObj.trade = tradeTitle;
    tradeObj.rows = tranchesRows;
    rows.push(tradeObj);
  }

  return rows;
}

function rowsGenEstimationHandleWorksAndWorkDetails(toBeModifiedArr, data, prefix, noPrice){

  let _id;

  for( let i = 0; i < data.length; i++ ){

    if(_id != data[i].work._id){

      const arr = [];

      arr.push(`${prefix}.${i+1}`);
      arr.push(data[i].work.name);
      arr.push(data[i].workUnit?.name ?? "");
      arr.push(data[i].work?.quantity ?? "");

      if(noPrice || (!data[i].workUnit?.name)){
        arr.push("");
        arr.push("");
      } else {
        arr.push(data[i].work?.unit_price ?? "0");
        arr.push((data[i].work?.unit_price ?? "0") * (data[i].work.quantity ?? "0"));
      }

      toBeModifiedArr.push(arr);

      if(data[i].workDetails){

        const arrD = [];
  
        arrD.push(`${prefix}.${i+1}`);
        arrD.push(data[i].workDetails.name);
        arrD.push(data[i].workDetailsUnit.name);
        arrD.push(data[i].workDetails.quantity);

        if(noPrice){
          arrD.push("");
          arrD.push("");
        } else {
          arrD.push(data[i].workDetails.unit_price);
          arrD.push(data[i].workDetails.unit_price * data[i].workDetails.quantity);
        }
  
        toBeModifiedArr.push(arrD);

      }

    } else {

      const arrD = [];

      arrD.push(`${prefix}.${i+1}`);
      arrD.push(data[i].workDetails.name);
      arrD.push(data[i].workDetailsUnit.name);
      arrD.push(data[i].workDetails.quantity);

      if(noPrice){
        arrD.push("");
        arrD.push("");
      } else {
        arrD.push(data[i].workDetails.unit_price);
        arrD.push(data[i].workDetails.unit_price * data[i].workDetails.quantity);
      }

      toBeModifiedArr.push(arrD);
      
    }

    _id = data[i].work._id;
  }

}

function xlsxParsedDataGenSimpleAndTradesEstimation(rows, dataColumns){

  const xlsxParsedData = [];

  // Populate data in xlsxParsedData
  for( let i = 0; i < rows.length; i++ ){
    let obj = {};
    for( let j = 0; j < dataColumns.length; j++ ){
      obj[dataColumns[j]] = rows[i][j];
    }
    xlsxParsedData.push(obj);
  }

  return xlsxParsedData;

}

function xlsxParsedDataGenTradesAndTranchesEstimation(trade, dataColumns, index){

  const xlsxParsedData = [];

  const tradeObj = {};
  for( let i = 0; i < dataColumns.length; i++ ){
    if(i == 0){
      tradeObj[dataColumns[i]] = `${index}`;
    } else if (i == 1){
      tradeObj[dataColumns[i]] = trade.trade;
    } else {
      tradeObj[dataColumns[i]] = "";
    }
  }
  xlsxParsedData.push(tradeObj);

  const trachesRows = trade.rows;
  let tradeTotal = null; // null is okay, undefined is not.
  for( let i = 0; i < trachesRows.length; i++ ){

    const currentObj = trachesRows[i];

    const tranchObj = {};
    for( let j = 0; j < dataColumns.length; j++ ){
      if(j == 0){
        tranchObj[dataColumns[j]] = `${index}.${i+1}`;
      } else if (j == 1){
        tranchObj[dataColumns[j]] = currentObj.tranch;
      } else {
        tranchObj[dataColumns[j]] = "";
      }
    }
    xlsxParsedData.push(tranchObj);

    const workAndWorkDetailsRows = currentObj.rows;

    // Populate data in xlsxParsedData
    for( let j = 0; j < workAndWorkDetailsRows.length; j++ ){
      let obj = {};
      for( let k = 0; k < dataColumns.length; k++ ){
        obj[dataColumns[k]] = workAndWorkDetailsRows[j][k];
      }
      xlsxParsedData.push(obj);
    }

    const trancheTotalHT = calculateTrancheTotalHT(workAndWorkDetailsRows);

    const trancheTotalHTObj = {};
    for( let j = 0; j < dataColumns.length; j++ ){
      if(j == 1){
        trancheTotalHTObj[dataColumns[j]] = `Tranche Total`;
      } else if (j == 5){
        trancheTotalHTObj[dataColumns[j]] = trancheTotalHT ?? "";
      } else {
        trancheTotalHTObj[dataColumns[j]] = "";
      }
    }
    xlsxParsedData.push(trancheTotalHTObj);

    if(trancheTotalHT){
      tradeTotal = tradeTotal + trancheTotalHT;
    }

  }

  const tradeTotalHTObj = {};
  for( let j = 0; j < dataColumns.length; j++ ){
    if(j == 1){
      tradeTotalHTObj[dataColumns[j]] = `Trade Total`;
    } else if (j == 5){
      tradeTotalHTObj[dataColumns[j]] = tradeTotal ?? "";
    } else {
      tradeTotalHTObj[dataColumns[j]] = "";
    }
  }
  xlsxParsedData.push(tradeTotalHTObj);

  return xlsxParsedData;

}

function calculateTrancheTotalHT(data, noPrice){

  if(noPrice){
    return;
  }

  let totalHT = 0;

  for(let i = 0; i < data.length; i++){
    const currentArr = data[i];

    if(!currentArr[5]){
      continue;
    }

    const ht = parseInt(currentArr[5]);
    totalHT = totalHT + ht;
  }

  return totalHT;

}

function footerDataGenSimpleEstimation(data, currentProject, noPrice, addSpace){

  let footerData = [];

  let totalHT = 0;

  data.map((item, index) => {
    if (!item.workDetails) {
      totalHT += item.work.unit_price * item.work.quantity;
    } else {
      if (item.work._id !== data[index - 1]?.work._id) {
        totalHT += item.workDetails.quantity * item.workDetails.unit_price;
      } else {
        totalHT += item.workDetails.quantity * item.workDetails.unit_price;
      }
    }
  });

  if(!noPrice){
    footerData = [
      totalHT,
      totalHT,
      currentProject?.vat?.value,
      Math.floor(
        totalHT * (1 + currentProject?.vat?.value / 100)
      )
    ];
  } else {
    footerData = [
      "",
      "",
      "",
      ""
    ];
  }

  if(addSpace){
    footerData.splice(1, 0, "");
  }

  return footerData;

}

function footerDataGenTradesEstimation(data, noPrice){

  let footerData = [];

  let totalHT = 0;

  data.map((item, index) => {
    if (!item.workDetails) {
      totalHT += item.work.unit_price * item.work.quantity;
    } else {
      if (item.work._id !== data[index - 1]?.work._id) {
        totalHT += item.workDetails.quantity * item.workDetails.unit_price;
      } else {
        totalHT += item.workDetails.quantity * item.workDetails.unit_price;
      }
    }
  });

  if(!noPrice){
    footerData = [
      totalHT,
    ];
  } else {
    footerData = [
      "",
    ];
  }

  return footerData;

}

function xlsxParsedFooterDataGenEstimation(
  floatsRow,
  footerColumns,
  dataColumns
){

  const xlsxParsedData = [];

  for(let i = 0; i < footerColumns.length; i++){
    const obj = {};
    for(let j = 0; j < dataColumns.length; j++){
      if(j == 1){
        obj[dataColumns[j]] = footerColumns[i];
      } else if( j == 5 ) {
        obj[dataColumns[j]] = floatsRow[i];
      } else {
        obj[dataColumns[j]] = "";
      }
    }
    xlsxParsedData.push(obj);
  }
  
  return xlsxParsedData;

}

function rowsGenBPU(data){

  const pdfXLSXRows = [];

  let workIndex = 1;
  for( let i = 0; i < data.length; i++ ){
    if(data[i].work.bpu_text.length == 0){
      continue;
    }
    const arr = [];
    arr.push(`${workIndex}.1`);
    arr.push(`${data[i].work.name}\n${data[i].work.bpu_text}`);
    arr.push(data[i].work.unit_price ? "PU HT \n(en chiffres)" : "");
    pdfXLSXRows.push(arr);
    workIndex = workIndex + 1;
  }

  return pdfXLSXRows;

}

function rowsGenCCTP(data){

  const pdfXLSXRows = [];

  for( let i = 0; i < data.length; i++ ){
    const CCTPArr = data[i].work.cctp_text;
    if(CCTPArr.length == 0){
      continue;
    }
    const obj = {
      "title": `${i+1}. ${data[i].work.name}`,
      "cctp_arr": CCTPArr
    };
    pdfXLSXRows.push(obj);
  }

  return pdfXLSXRows;

}

function textRunsSplitGen(str){

  let strSingle = String(str);

  let textRunArr = [];
  if(strSingle.includes("</")){ // .includes("</") is a better check than [0]="<"
    textRunArr = handleBuiltInCCTPs(str);
  } else {
    textRunArr = handleImportedCCTPs(str);
  }

  return textRunArr;

}

function handleImportedCCTPs(str){

  let strSingle = String(str);
  let strArr = strSingle.split("\n");

  const textRunArr = [];
  for(let i = 0; i < strArr.length; i++){
    textRunArr.push(
      new TextRun({
        text: strArr[i],
        size: 24,
        break: i == 0 ? 0 : 1 // If first string then no line breaks
      })
    );
  }

  const objsArr = [
    new Paragraph({
      children: [
        ...textRunArr
      ]
    })
  ];

  return objsArr;

}

function handleBuiltInCCTPs(str){

  let strSingle = String(str);

  const elMain = document.createElement("div");
  elMain.innerHTML = strSingle;
  let htmlCollectionMain = elMain.children;

  const parsedObjsArr = [];
  for( let i = 0; i < htmlCollectionMain.length; i++ ){
    const obj = parseHTMLTag(htmlCollectionMain[i]);
    parsedObjsArr.push(obj);
  }

  const docxObjsArr = [];
  for( let i = 0; i < parsedObjsArr.length; i++ ){
    let currentObj = parsedObjsArr[i];
    let docxObj = tagsToDocxMap[currentObj.tagName] && tagsToDocxMap[currentObj.tagName](currentObj);
    if(docxObj){
      if(Array.isArray(docxObj)){
        docxObjsArr.push(...docxObj);
      } else {
        docxObjsArr.push(docxObj);
      }
    }
  }

  return docxObjsArr;

}

function parseHTMLTag(tag){

  const tagName = tag.tagName;
  const innerHTML = tag.innerHTML;
  const classList = tag.classList;

  const embedded = [];

  if(innerHTML[0] == "<"){

    const elMain = document.createElement("div");
    elMain.innerHTML = innerHTML;
    let htmlCollection = elMain.children;

    for( let i = 0; i < htmlCollection.length; i++ ){
      const obj = parseHTMLTag(htmlCollection[i]);
      embedded.push(obj);
    }
  }

  return {
    "tagName": tagName,
    "innerHTML": innerHTML,
    "classList": classList,
    "embedded": embedded
  };

}

const tagsToDocxMap = {
  "P": function(_){
    const text = _.innerHTML;

    if(_.embedded.length == 0){
      return new Paragraph({
        children: [
          new TextRun({
            text: text,
            size: 24,
          })
        ]
      });
    } else {
      const obj = _.embedded[0]; // Well incase of "P". We will be dealing with first embedded entry only.
      return tagsToDocxMap[obj.tagName] && tagsToDocxMap[obj.tagName](obj);
    }
  },
  "BR": function(_){
    return new Paragraph({
      children: [
        new TextRun({
          text: "", // We know this for sure
        })
      ]
    });
  },
  "STRONG": function(_){
    const text = _.innerHTML;

    return new Paragraph({
      children: [
        new TextRun({
          text: text,
          bold: true,
        })
      ]
    });
  },
  "EM": function(_){
    const text = _.innerHTML;

    return new Paragraph({
      children: [
        new TextRun({
          text: text,
          italics: true,
        })
      ]
    });
  },
  "U": function(_){
    const text = _.innerHTML;

    return new Paragraph({
      children: [
        new TextRun({
          text: text,
          underline: {
            color: "#f2f2f2",
            type: UnderlineType.DASH
          },
        })
      ]
    });
  },
  "S": function(_){
    const text = _.innerHTML;

    return new Paragraph({
      children: [
        new TextRun({
          text: text,
          strike: true,
        })
      ]
    });
  },
  "OL": function(_){
    const embeddedArr = _.embedded;

    const listItemsArr = [];
    for( let i = 0; i < embeddedArr.length; i++ ){
      const obj = embeddedArr[i];
      const objElm = tagsToDocxMap[obj.tagName] && tagsToDocxMap[obj.tagName](obj);
      if(objElm){
        listItemsArr.push(objElm);
      }
    }

    return listItemsArr;
  },
  "UL": function(_){
    const embeddedArr = _.embedded;

    const listItemsArr = [];
    for( let i = 0; i < embeddedArr.length; i++ ){
      const obj = embeddedArr[i];
      const objElm = tagsToDocxMap[obj.tagName] && tagsToDocxMap[obj.tagName](obj);
      if(objElm){
        listItemsArr.push(objElm);
      }
    }

    return listItemsArr;
  },
  "LI": function(_){
    const text = _.innerHTML;

    return new Paragraph({
      text: text,
      bullet: {
        level: 0
      }
    });
  },
  "SPAN": function(_){
    const text = _.innerHTML;
    const classList = _.classList;

    let size;
    if(classList == "ql-size-small"){
      size = 20;
    } else if(classList == "ql-size-large"){
      size = 40;
    } else if(classList == "ql-size-huge"){
      size = 60;
    }

    return new Paragraph({
      children: [
        new TextRun({
          text: text,
          size: size
        })
      ]
    });
  },
};

const dataColumnsEstimation = [
  "No #",
  "Name",
  "Unity",
  "Qty",
  "PU HT",
  "Total HT"
];

const footerColumnsSimpleEstimation = [
  "Total Lot n°1 :",
  "",
  "Total HT :",
  "Total VAT (%) :",
  "Total Price :",
];

const footerColumnsTradesEstimation = [
  "Trade Total :",
];

const dataColumnsBPU = [
  "'1",
  "Lot n°1",
  "",
];

export {
  headGen,
  rowsGenSimpleEstimation,
  rowsGenTradesEstimation,
  rowsGenTradesAndTranchesEstimation,
  xlsxParsedDataGenSimpleAndTradesEstimation,
  xlsxParsedDataGenTradesAndTranchesEstimation,
  xlsxParsedFooterDataGenEstimation,
  rowsGenBPU,
  rowsGenCCTP,
  footerDataGenSimpleEstimation,
  footerDataGenTradesEstimation,
  textRunsSplitGen,
  dataColumnsEstimation,
  footerColumnsSimpleEstimation,
  footerColumnsTradesEstimation,
  dataColumnsBPU,
}