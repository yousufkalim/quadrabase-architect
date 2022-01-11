
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

        workDetailIndex = workDetailIndex + 1;
      }

      workIndex = workIndex + 1;
    } else {
      // Just add WorkDetail here.

      workDetailIndex = 1;

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

      workDetailIndex = workDetailIndex + 1;
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
  data.map((item) => {
    if (!item.workDetails) {
      totalHT += item.work.unit_price * item.work.quantity;
    } else {
      totalHT += item.workDetails.unit_price
        ? item.work.unit_price * item.work.quantity +
          item.workDetails.quantity * item.workDetails.unit_price
        : item.work.unit_price * item.work.quantity;
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

const pdfXLSXRowsBPU = [
  [
    `1.1`,
    `Réalisation des plans d'exécution
    Ce prix rémunère, au forfait, la réalisation des études et des plans d’exécution de
    l'ensemble des ouvrages à réaliser, conformément aux prescriptions du CCTP.
    Il comprend notamment :
    - La réalisation des études et notes de calcul des ouvrages à réaliser sur la base de la
    réglementation et des normes applicables,
    - L’établissement de tous les plans d’exécution, de nivellement et les carnets de détails
    nécessaires à la bonne réalisation des ouvrages,
    - Les notices des modes opératoires, process de réalisation et de montage sur chantier,
    - Le descriptif définissant la nature, la qualité et la provenance des matériaux utilisés,
    - Les documentations techniques des fournisseurs ainsi que les guides et
    recommandations de pose, de réglage et d'utilisation des ouvrages,
    - Le programme d'exécution, les essais, les résultats d'essais préalables.
    Toutes sujétions de fournitures et de main d’oeuvre comprises.
    LE FORFAIT (EN TOUTES LETTRES):`,
    `PU HT
    (en chiffres)`
  ],
  [
    `1.2`,
    `Travaux de dégagement partiel ou total des réseaux enterrés
    Ce prix rémunère, au mètre cube, les travaux de dégagement partiel ou total des
    réseaux enterrés situés dans la tranchée ou à proximité de celle-ci, exécutés par tous
    moyens mécaniques et manuels appropriés, conformément au guide technique.
    Il comprend notamment :
    - L'amenée sur site et le repliement des matériels nécessaires aux fouilles,
    - L'extraction des matériaux,
    - Les opérations de relevés,
    - Le chargement et l’évacuation des matériaux excédentaires ou jugés non réutilisables
    suivant les prescriptions du SOGED.
    Toutes sujétions de fournitures et de main d’oeuvre comprises.
    LE MÈTRE CUBE (EN TOUTES LETTRES):`,
    `PU HT
    (en chiffres)`
  ],
  [
    `1.3`,
    `Clôtures fixes de chantier grillage simple torsion galvanisé - Maille 50x50
    Ce prix rémunère, au mètre linéaire, la fourniture et la mise en place autour du chantier
    d’une clôture provisoire grillagée sur piquets, maille losange 50x50, fil galvanisé simple
    torsion Classe C, Ø2.7mm, conformément aux prescriptions du CCTP.
    Il comprend notamment :
    - La fourniture à pied d’oeuvre du grillage, fils tendeurs, tendeurs et clips de fixation,
    - La fourniture et la pose des piquets,
    - Le montage des fils tendeurs, tendeurs et mise en tension,
    - Le montage du grillage et fixation, y compris coupes et ajustement.
    - Le démontage et le repliement en fin de travaux.
    Toutes sujétions de fournitures et de main d’oeuvre comprises.`,
    ``
  ]
];

export {
  pdfXLSXHeadGen,
  pdfXLSXRowsGenEstimation,
  realDataXLSXGenEstimation,
  footerDataGen,
  pdfXLSXColumns,
  pdfXLSXFooterColumns,
  pdfXLSXColumnsBPU,
  pdfXLSXRowsBPU
}