// init
import React, { useState, useEffect } from "react";

import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';

// Reports
import { exportPDFBPU } from "../ReportsGen/genPDF";

function ReportBPUModal(props){

  const { projectWorkData, currentProject } = props;

  function generatePDF(){
    exportPDFBPU();
  }

  return (
    <div style={{ width: "30vw"}}>
      <Stack direction="row" spacing={1}>
        <IconButton aria-label="PDF" onClick={generatePDF}>
          <PictureAsPdfIcon />
        </IconButton>
      </Stack>
    </div>
  );

};

export default ReportBPUModal;
