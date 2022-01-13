
import { 
  TextRun,
} from "docx";

function dateNowFormatted() {
  return "01/1/2022"
}

function pdfXLSXHeadGen(headingName, projectName){

  const pdfXLSXHead = [];

  pdfXLSXHead.push(headingName);
  pdfXLSXHead.push(projectName);
  pdfXLSXHead.push(`${dateNowFormatted()}`);

  return pdfXLSXHead;

}

function pdfXLSXRowsGenEstimation(data, noPrice){

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

  let _id;
  let workIndex = 1;
  let workDetailIndex = 1;
  for( let i = 0; i < data.length; i++ ){

    if(_id != data[i].work._id){

      workDetailIndex = 1; // We know that for sure.
      
      const arr = [];

      arr.push(`${workIndex}.${workDetailIndex}`);
      arr.push(data[i].work.name);
      arr.push(data[i].workUnit.name);
      arr.push(data[i].work.quantity);

      if(noPrice){
        arr.push("");
        arr.push("");
      } else {
        arr.push(data[i].work.unit_price);
        arr.push(data[i].work.unit_price * data[i].work.quantity);
      }

      pdfXLSXRows.push(arr);

      if(data[i].workDetails){

        workDetailIndex = workDetailIndex + 1; // Start adding WorkDetails

        const arrD = [];
  
        arrD.push(`${workIndex}.${workDetailIndex}`);
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
  
        pdfXLSXRows.push(arrD);

      }

      workIndex = workIndex + 1;
    } else {
      // Just add WorkDetail here.

      workDetailIndex = workDetailIndex + 1; // Well it immediately becomes sub task.

      const arrD = [];

      arrD.push(`${workIndex}.${workDetailIndex}`);
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

      pdfXLSXRows.push(arrD);

      
    }

    _id = data[i].work._id;
  }

  return pdfXLSXRows;

}

function realDataXLSXGenEstimation(pdfXLSXRows, pdfXLSXColumns){

  const realDataXLSX = [];

  // Populate data in realDataXLSX
  for( let i = 0; i < pdfXLSXRows.length; i++ ){
    let obj = {};
    for( let j = 0; j < pdfXLSXColumns.length; j++ ){
      obj[pdfXLSXColumns[j]] = pdfXLSXRows[i][j];
    }
    realDataXLSX.push(obj);
  }

  return realDataXLSX;

}

function footerDataGen(data, currentProject, noPrice){

  let footerData = [];

  let totalHT = 0;
  data.map((item, index) => {
    if (!item.workDetails) {
      totalHT += item.work.unit_price * item.work.quantity;
    } else {
      if (item.work._id !== data[index - 1]?.work._id) {
        totalHT += item.workDetails.unit_price
          ? item.work.unit_price * item.work.quantity +
            item.workDetails.quantity * item.workDetails.unit_price
          : item.work.unit_price * item.work.quantity;
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

  return footerData;

}

function pdfXLSXRowsGenBPU(data){

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

function pdfXLSXRowsGenCCTP(data){

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

  return textRunArr;

}

const pdfXLSXColumns = [
  "No #",
  "Name",
  "Unity",
  "Qty",
  "PU HT",
  "Total HT"
];

const pdfXLSXFooterColumns = [
  "Total Lot n°1 :",
  "Total HT :",
  "Total VAT (%) :",
  "Total Price :",
];

const pdfXLSXColumnsBPU = [
  "'1",
  "Lot n°1",
  "",
];

export {
  pdfXLSXHeadGen,
  pdfXLSXRowsGenEstimation,
  realDataXLSXGenEstimation,
  pdfXLSXRowsGenBPU,
  pdfXLSXRowsGenCCTP,
  footerDataGen,
  textRunsSplitGen,
  pdfXLSXColumns,
  pdfXLSXFooterColumns,
  pdfXLSXColumnsBPU,
}