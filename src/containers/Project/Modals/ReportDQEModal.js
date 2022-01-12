// init
import React, { useState, useEffect } from "react";

import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import SummarizeIcon from '@mui/icons-material/Summarize';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import TextSnippetIcon from '@mui/icons-material/TextSnippet';

// Reports
import { exportXLSXEstimation } from "../ReportsGen/genExcel";
import { exportPDFEstimation } from "../ReportsGen/genPDF";
import { exportDOCXestimation } from "../ReportsGen/genDocx";

function ReportDQEModal(props){

  const { projectWorkData, currentProject } = props;

  function generateExcel(){
    exportXLSXEstimation(projectWorkData, currentProject, true);
  }

  function generatePDF(){
    exportPDFEstimation(projectWorkData, currentProject, true);
  }

  function generateWord(){
    exportDOCXestimation(projectWorkData, currentProject, true);
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
        <IconButton aria-label="Word" onClick={generateWord}>
          <TextSnippetIcon />
        </IconButton>
      </Stack>
    </div>
  );

};

export default ReportDQEModal;
