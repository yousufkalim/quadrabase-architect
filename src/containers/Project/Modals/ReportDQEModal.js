// init
import React, { useState, useEffect } from "react";

import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import SummarizeIcon from '@mui/icons-material/Summarize';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';

// Reports
import { exportXLSXEstimation } from "../ReportsGen/genExcel";
import { exportPDFEstimation } from "../ReportsGen/genPDF";

function ReportDQEModal(props){

  const { projectWorkData, currentProject } = props;

  function generateExcel(){
    exportXLSXEstimation(projectWorkData, currentProject, true);
  }

  function generatePDF(){
    exportPDFEstimation(projectWorkData, currentProject, true);
  }

  return (
    <div style={{ width: "30vw"}}>
      <Stack direction="row" spacing={1}>
        <IconButton aria-label="Excel" onClick={generateExcel}>
          <SummarizeIcon />
        </IconButton>
        <IconButton aria-label="PDF" onClick={generatePDF}>
          <PictureAsPdfIcon />
        </IconButton>
      </Stack>
    </div>
  );

};

export default ReportDQEModal;
