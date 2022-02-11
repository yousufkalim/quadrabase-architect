
import { 
  Paragraph,
  TextRun,
  UnderlineType
} from "docx";

function dateNowFormatted() {
  return "01/1/2022"
}

function headGen(headingName, projectName){

  const headArr = [];

  headArr.push(headingName);
  headArr.push(projectName);
  headArr.push(`${dateNowFormatted()}`);

  return headArr;

}

function rowsGenSimpleEstimation(data, noPrice){

  const rows = [];

  rows.push(
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
    rows,
    data,
    `${1}`,
    noPrice
  );

  return rows;

}

function rowsGenTradesEstimation(data, noPrice){

  const rows = [];

  for( let i = 0; i < data.length; i++){ // Trade for loop
    const tradeTitle = data[i]._id;
    const tradeData = data[i].data;
    const workAndDetailsRows = [];
    const tradeObj = {};
    rowsGenEstimationHandleWorksAndWorkDetails(
      workAndDetailsRows,
      tradeData,
      `${i+1}`,
      noPrice
    );
    tradeObj.trade = tradeTitle;
    tradeObj.rows = workAndDetailsRows;
    rows.push(tradeObj);
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

function xlsxParsedDataGenSimpleEstimation(rows){

  const xlsxParsedData = [];

  // Populate body data in xlsxParsedData
  for( let i = 0; i < rows.length; i++ ){
    let obj = {};
    for( let j = 0; j < dataColumnsEstimation.length; j++ ){
      obj[dataColumnsEstimation[j]] = rows[i][j];
    }
    xlsxParsedData.push(obj);
  }

  return xlsxParsedData;

}

function xlsxParsedDataGenTradesEstimation(trade, index){

  const xlsxParsedData = [];

  // Populate trade title in xlsxParsedData
  const tradeObj = {};
  for( let i = 0; i < dataColumnsEstimation.length; i++ ){
    if(i == 0){
      tradeObj[dataColumnsEstimation[i]] = `${index}`;
    } else if (i == 1){
      tradeObj[dataColumnsEstimation[i]] = trade.trade;
    } else {
      tradeObj[dataColumnsEstimation[i]] = "";
    }
  }
  xlsxParsedData.push(tradeObj);

  const workAndWorkDetailsRows = trade.rows;
  
  // Populate body data in xlsxParsedData
  for( let j = 0; j < workAndWorkDetailsRows.length; j++ ){
    let obj = {};
    for( let k = 0; k < dataColumnsEstimation.length; k++ ){
      obj[dataColumnsEstimation[k]] = workAndWorkDetailsRows[j][k];
    }
    xlsxParsedData.push(obj);
  }

  const tradeTotal = calculateTotalHT(workAndWorkDetailsRows);

  // Populate trade total in xlsxParsedData
  const tradeTotalHTObj = {};
  for( let j = 0; j < dataColumnsEstimation.length; j++ ){
    if(j == 1){
      tradeTotalHTObj[dataColumnsEstimation[j]] = `Trade Total: `;
    } else if (j == 5){
      tradeTotalHTObj[dataColumnsEstimation[j]] = tradeTotal ?? "";
    } else {
      tradeTotalHTObj[dataColumnsEstimation[j]] = "";
    }
  }
  xlsxParsedData.push(tradeTotalHTObj);

  return xlsxParsedData;

}

function xlsxParsedDataGenTradesAndTranchesEstimation(trade, index){

  const xlsxParsedData = [];

  // Populate trade title in xlsxParsedData
  const tradeObj = {};
  for( let i = 0; i < dataColumnsEstimation.length; i++ ){
    if(i == 0){
      tradeObj[dataColumnsEstimation[i]] = `${index}`;
    } else if (i == 1){
      tradeObj[dataColumnsEstimation[i]] = trade.trade;
    } else {
      tradeObj[dataColumnsEstimation[i]] = "";
    }
  }
  xlsxParsedData.push(tradeObj);

  const trachesRows = trade.rows;
  let tradeTotal = null; // null is okay, undefined is not.
  for( let i = 0; i < trachesRows.length; i++ ){

    const currentObj = trachesRows[i];

    // Populate tranch title in xlsxParsedData
    const tranchObj = {};
    for( let j = 0; j < dataColumnsEstimation.length; j++ ){
      if(j == 0){
        tranchObj[dataColumnsEstimation[j]] = `${index}.${i+1}`;
      } else if (j == 1){
        tranchObj[dataColumnsEstimation[j]] = currentObj.tranch;
      } else {
        tranchObj[dataColumnsEstimation[j]] = "";
      }
    }
    xlsxParsedData.push(tranchObj);

    const workAndWorkDetailsRows = currentObj.rows;

    // Populate body data in xlsxParsedData
    for( let j = 0; j < workAndWorkDetailsRows.length; j++ ){
      let obj = {};
      for( let k = 0; k < dataColumnsEstimation.length; k++ ){
        obj[dataColumnsEstimation[k]] = workAndWorkDetailsRows[j][k];
      }
      xlsxParsedData.push(obj);
    }

    const trancheTotalHT = calculateTotalHT(workAndWorkDetailsRows);

    // Populate tranch total in xlsxParsedData
    const trancheTotalHTObj = {};
    for( let j = 0; j < dataColumnsEstimation.length; j++ ){
      if(j == 1){
        trancheTotalHTObj[dataColumnsEstimation[j]] = `Tranche Total:`;
      } else if (j == 5){
        trancheTotalHTObj[dataColumnsEstimation[j]] = trancheTotalHT ?? "";
      } else {
        trancheTotalHTObj[dataColumnsEstimation[j]] = "";
      }
    }
    xlsxParsedData.push(trancheTotalHTObj);

    if(trancheTotalHT){
      tradeTotal = tradeTotal + trancheTotalHT;
    }

  }

  // Populate trade total in xlsxParsedData
  const tradeTotalHTObj = {};
  for( let j = 0; j < dataColumnsEstimation.length; j++ ){
    if(j == 1){
      tradeTotalHTObj[dataColumnsEstimation[j]] = `Trade Total:`;
    } else if (j == 5){
      tradeTotalHTObj[dataColumnsEstimation[j]] = tradeTotal ?? "";
    } else {
      tradeTotalHTObj[dataColumnsEstimation[j]] = "";
    }
  }
  xlsxParsedData.push(tradeTotalHTObj);

  return xlsxParsedData;

}

function pdfParsedDataGenTradesEstimation(trade, index){

  const pdfParsedData = [];

  // Populate trade title in xlsxParsedData
  const tradeArr = [];
  for( let i = 0; i < dataColumnsEstimation.length; i++ ){
    if(i == 0){
      tradeArr[i] = `${index}`;
    } else if (i == 1){
      tradeArr[i] = trade.trade;
    } else {
      tradeArr[i] = "";
    }
  }
  pdfParsedData.push(tradeArr);

  const workAndWorkDetailsRows = trade.rows;
  
  // Populate body data in xlsxParsedData
  for( let j = 0; j < workAndWorkDetailsRows.length; j++ ){
    let arr = [];
    for( let k = 0; k < dataColumnsEstimation.length; k++ ){
      arr[k] = workAndWorkDetailsRows[j][k];
    }
    pdfParsedData.push(arr);
  }

  const tradeTotal = calculateTotalHT(workAndWorkDetailsRows);

  // Populate trade total in xlsxParsedData
  const tradeTotalHTArr = [];
  for( let j = 0; j < dataColumnsEstimation.length; j++ ){
    if(j == 1){
      tradeTotalHTArr[j] = `Trade Total:`;
    } else if (j == 5){
      tradeTotalHTArr[j] = tradeTotal ?? "";
    } else {
      tradeTotalHTArr[j] = "";
    }
  }
  pdfParsedData.push(tradeTotalHTArr);

  return pdfParsedData;

}

function pdfParsedDataGenTradesAndTranchesEstimation(trade, index){

  const pdfParsedData = [];

  // Populate trade title in pdfParsedData
  const tradeArr = [];
  for( let i = 0; i < dataColumnsEstimation.length; i++ ){
    if(i == 0){
      tradeArr[i] = `${index}`;
    } else if (i == 1){
      tradeArr[i] = trade.trade;
    } else {
      tradeArr[i] = "";
    }
  }
  pdfParsedData.push(tradeArr);

  const trachesRows = trade.rows;
  let tradeTotal = null; // null is okay, undefined is not.
  for( let i = 0; i < trachesRows.length; i++ ){

    const currentObj = trachesRows[i];

    // Populate tranch title in pdfParsedData
    const tranchArr = [];
    for( let j = 0; j < dataColumnsEstimation.length; j++ ){
      if(j == 0){
        tranchArr[j] = `${index}.${i+1}`;
      } else if (j == 1){
        tranchArr[j] = currentObj.tranch;
      } else {
        tranchArr[j] = "";
      }
    }
    pdfParsedData.push(tranchArr);

    const workAndWorkDetailsRows = currentObj.rows;

    // Populate body data in pdfParsedData
    for( let j = 0; j < workAndWorkDetailsRows.length; j++ ){
      let arr = [];
      for( let k = 0; k < dataColumnsEstimation.length; k++ ){
        arr[k] = workAndWorkDetailsRows[j][k];
      }
      pdfParsedData.push(arr);
    }

    const trancheTotalHT = calculateTotalHT(workAndWorkDetailsRows);

    // Populate tranch total in pdfParsedData
    const trancheTotalHTObj = [];
    for( let j = 0; j < dataColumnsEstimation.length; j++ ){
      if(j == 1){
        trancheTotalHTObj[j] = `Tranche Total:`;
      } else if (j == 5){
        trancheTotalHTObj[j] = trancheTotalHT ?? "";
      } else {
        trancheTotalHTObj[j] = "";
      }
    }
    pdfParsedData.push(trancheTotalHTObj);

    if(trancheTotalHT){
      tradeTotal = tradeTotal + trancheTotalHT;
    }

  }

  // Populate trade total in pdfParsedData
  const tradeTotalHTObj = [];
  for( let j = 0; j < dataColumnsEstimation.length; j++ ){
    if(j == 1){
      tradeTotalHTObj[j] = `Trade Total:`;
    } else if (j == 5){
      tradeTotalHTObj[j] = tradeTotal ?? "";
    } else {
      tradeTotalHTObj[j] = "";
    }
  }
  pdfParsedData.push(tradeTotalHTObj);

  return pdfParsedData;

}

function docxParsedDataGenTradesEstimation(trade, index){

  const docxParsedData = [];

  // Populate trade title in xlsxParsedData
  const tradeArr = [];
  for( let i = 0; i < dataColumnsEstimation.length; i++ ){
    if(i == 0){
      tradeArr[i] = `${index}`;
    } else if (i == 1){
      tradeArr[i] = trade.trade;
    } else {
      tradeArr[i] = "";
    }
  }
  docxParsedData.push(tradeArr);

  const workAndWorkDetailsRows = trade.rows;
  
  // Populate body data in xlsxParsedData
  for( let j = 0; j < workAndWorkDetailsRows.length; j++ ){
    let arr = [];
    for( let k = 0; k < dataColumnsEstimation.length; k++ ){
      arr[k] = workAndWorkDetailsRows[j][k];
    }
    docxParsedData.push(arr);
  }

  const tradeTotal = calculateTotalHT(workAndWorkDetailsRows);

  // Populate trade total in xlsxParsedData
  const tradeTotalHTArr = [];
  for( let j = 0; j < dataColumnsEstimation.length; j++ ){
    if(j == 1){
      tradeTotalHTArr[j] = `Trade Total:`;
    } else if (j == 5){
      tradeTotalHTArr[j] = tradeTotal ?? "";
    } else {
      tradeTotalHTArr[j] = "";
    }
  }
  docxParsedData.push(tradeTotalHTArr);

  return docxParsedData;

}

function docxParsedDataGenTradesAndTranchesEstimation(trade, index){

  const docxParsedData = [];

  // Populate trade title in pdfParsedData
  const tradeArr = [];
  for( let i = 0; i < dataColumnsEstimation.length; i++ ){
    if(i == 0){
      tradeArr[i] = `${index}`;
    } else if (i == 1){
      tradeArr[i] = trade.trade;
    } else {
      tradeArr[i] = "";
    }
  }
  docxParsedData.push(tradeArr);

  const trachesRows = trade.rows;
  let tradeTotal = null; // null is okay, undefined is not.
  for( let i = 0; i < trachesRows.length; i++ ){

    const currentObj = trachesRows[i];

    // Populate tranch title in pdfParsedData
    const tranchArr = [];
    for( let j = 0; j < dataColumnsEstimation.length; j++ ){
      if(j == 0){
        tranchArr[j] = `${index}.${i+1}`;
      } else if (j == 1){
        tranchArr[j] = currentObj.tranch;
      } else {
        tranchArr[j] = "";
      }
    }
    docxParsedData.push(tranchArr);

    const workAndWorkDetailsRows = currentObj.rows;

    // Populate body data in pdfParsedData
    for( let j = 0; j < workAndWorkDetailsRows.length; j++ ){
      let arr = [];
      for( let k = 0; k < dataColumnsEstimation.length; k++ ){
        arr[k] = workAndWorkDetailsRows[j][k];
      }
      docxParsedData.push(arr);
    }

    const trancheTotalHT = calculateTotalHT(workAndWorkDetailsRows);

    // Populate tranch total in pdfParsedData
    const trancheTotalHTObj = [];
    for( let j = 0; j < dataColumnsEstimation.length; j++ ){
      if(j == 1){
        trancheTotalHTObj[j] = `Tranche Total:`;
      } else if (j == 5){
        trancheTotalHTObj[j] = trancheTotalHT ?? "";
      } else {
        trancheTotalHTObj[j] = "";
      }
    }
    docxParsedData.push(trancheTotalHTObj);

    if(trancheTotalHT){
      tradeTotal = tradeTotal + trancheTotalHT;
    }

  }

  // Populate trade total in pdfParsedData
  const tradeTotalHTObj = [];
  for( let j = 0; j < dataColumnsEstimation.length; j++ ){
    if(j == 1){
      tradeTotalHTObj[j] = `Trade Total:`;
    } else if (j == 5){
      tradeTotalHTObj[j] = tradeTotal ?? "";
    } else {
      tradeTotalHTObj[j] = "";
    }
  }
  docxParsedData.push(tradeTotalHTObj);

  return docxParsedData;

}

function calculateTotalHT(data, noPrice){

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

function xlsxParsedFooterDataGenEstimation(
  floatsRow,
  footerColumns
){

  const xlsxParsedData = [];

  for(let i = 0; i < footerColumns.length; i++){
    const obj = {};
    for(let j = 0; j < dataColumnsEstimation.length; j++){
      if(j == 1){
        obj[dataColumnsEstimation[j]] = footerColumns[i];
      } else if( j == 5 ) {
        obj[dataColumnsEstimation[j]] = floatsRow[i];
      } else {
        obj[dataColumnsEstimation[j]] = "";
      }
    }
    xlsxParsedData.push(obj);
  }
  
  return xlsxParsedData;

}

const calculateWSCols = (arr) => {
  let nameL = null;
  let unitL = null;
  for(let i = 0; i < arr.length; i++){
    const currentObj = arr[i];
    const values = Object.values(currentObj);
    if(values[1].length > nameL){
      nameL = values[1].length
    }
    if(values[2].length > unitL){
      unitL = values[2].length
    }
  }

  const wscols = [
    {wch:10},
    {wch:nameL},
    {wch:unitL},
    {wch:10},
    {wch:10},
    {wch:10}
  ];

  return wscols;
}

function rowsGenSimpleBPU(data){

  const rows = [];

  let workIndex = 1;
  for( let i = 0; i < data.length; i++ ){
    if(data[i].work.bpu_text.length == 0){
      continue;
    }
    const arr = [];
    arr.push(`${workIndex}.1`);
    arr.push(`${data[i].work.name}\n${data[i].work.bpu_text}`);
    arr.push(data[i].work.unit_price ? "PU HT \n(en chiffres)" : "");
    rows.push(arr);
    workIndex = workIndex + 1;
  }

  return rows;

}

function rowsGenTradesBPU(data){

  const rows = [];

  let workIndex = 1;
  for( let i = 0; i < data.length; i++ ){
    const worksAndWorkDetailsArr = data[i].data;
    for( let j = 0; j < worksAndWorkDetailsArr.length; j++ ){
      const currentObj = worksAndWorkDetailsArr[j];
      if(currentObj.work.bpu_text.length == 0){
        continue;
      }
      const arr = [];
      arr.push(`${workIndex}.1`);
      arr.push(`${currentObj.work.name}\n${currentObj.work.bpu_text}`);
      arr.push(currentObj.work.unit_price ? "PU HT \n(en chiffres)" : "");
      rows.push(arr);
      workIndex = workIndex + 1;
    }
  }

  return rows;

}

function rowsGenTradesAndTranchesBPU(data){

  const rows = [];

  let workIndex = 1;
  for( let i = 0; i < data.length; i++ ){
    const tradesArr = data[i].data;
    for( let j = 0; j < tradesArr.length; j++ ){
      const worksAndWorkDetailsArr = tradesArr[j].tranchData;
      for( let k = 0; k < worksAndWorkDetailsArr.length; k++ ){
        const currentObj = worksAndWorkDetailsArr[k];
        if(currentObj.work.bpu_text.length == 0){
          continue;
        }
        const arr = [];
        arr.push(`${workIndex}.1`);
        arr.push(`${currentObj.work.name}\n${currentObj.work.bpu_text}`);
        arr.push(currentObj.work.unit_price ? "PU HT \n(en chiffres)" : "");
        rows.push(arr);
        workIndex = workIndex + 1;
      }
    } 
  }

  return rows;

}

function rowsGenSimpleCCTP(data){

  const rows = [];

  for( let i = 0; i < data.length; i++ ){
    const cctpArr = data[i].work.cctp_text;
    if(cctpArr.length == 0){
      continue;
    }
    const obj = {
      "title": `${i+1}. ${data[i].work.name}`,
      "cctp_arr": cctpArr
    };
    rows.push(obj);
  }

  return rows;

}

function rowsGenTradesCCTP(data){

  const rows = [];

  for( let i = 0; i < data.length; i++ ){
    const currentObjTrade = data[i];
    const workAndWorkDetailsArr = currentObjTrade.data;
    for( let j = 0; j < workAndWorkDetailsArr.length; j++ ){
      const currentObjWork = workAndWorkDetailsArr[j];
      const cctpArr = currentObjWork.work.cctp_text;
      if(cctpArr.length == 0){
        continue;
      }
      const obj = {
        "title": `${i+1}.${j+1}. ${currentObjWork.work.name}`,
        "cctp_arr": cctpArr
      };
      rows.push(obj);
    }
  }

  return rows;

}

function rowsGenTradesAndTranchesCCTP(data){

  const rows = [];

  for( let i = 0; i < data.length; i++ ){
    const currentObjTrade = data[i];
    const tranchesArr = currentObjTrade.data;
    for( let j = 0; j < tranchesArr.length; j++ ){
      const currentObjTranch = tranchesArr[j];
      const workAndWorkDetailsArr = currentObjTranch.tranchData;
      for( let k = 0; k < workAndWorkDetailsArr.length; k++ ){
        const currentObjWork = workAndWorkDetailsArr[k];
        const cctpArr = currentObjWork.work.cctp_text;
        if(cctpArr.length == 0){
          continue;
        }
        const obj = {
          "title": `${i+1}.${j+1}.${k+1}. ${currentObjWork.work.name}`,
          "cctp_arr": cctpArr
        };
        rows.push(obj);
      }
    }
  }

  return rows;

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
  xlsxParsedDataGenSimpleEstimation,
  xlsxParsedDataGenTradesEstimation,
  xlsxParsedDataGenTradesAndTranchesEstimation,
  xlsxParsedFooterDataGenEstimation,
  pdfParsedDataGenTradesEstimation,
  pdfParsedDataGenTradesAndTranchesEstimation,
  docxParsedDataGenTradesEstimation,
  docxParsedDataGenTradesAndTranchesEstimation,
  calculateWSCols,
  rowsGenSimpleBPU,
  rowsGenTradesBPU,
  rowsGenTradesAndTranchesBPU,
  rowsGenSimpleCCTP,
  rowsGenTradesCCTP,
  rowsGenTradesAndTranchesCCTP,
  footerDataGenSimpleEstimation,
  textRunsSplitGen,
  dataColumnsEstimation,
  footerColumnsSimpleEstimation,
  dataColumnsBPU,
}