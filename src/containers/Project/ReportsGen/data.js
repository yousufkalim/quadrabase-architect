
import { 
  Paragraph,
  TextRun,
  UnderlineType
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