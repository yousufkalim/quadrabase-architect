// init
import React from "react";

import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import TextSnippetIcon from '@mui/icons-material/TextSnippet';

// Reports
import { exportPDFBPU } from "../ReportsGen/genPDF";
import { exportDOCXBPU } from "../ReportsGen/genDocx";

import { toast } from "react-toastify";

function ReportBPUModal(props){

  const { projectWorkData, currentProject } = props;

  function generatePDF(){
    try{
      exportPDFBPU(projectWorkData, currentProject);
    }catch(e){
      toast.error("Could not generate report successfully.");
      console.trace(e);
    }
  }

  function generateWord(){
    try{
      exportDOCXBPU(projectWorkData, currentProject);
    }catch(e){
      toast.error("Could not generate report successfully.");
      console.trace(e);
    }
  }

  return (
    <div style={{ width: "30vw"}}>
      <Stack direction="row" spacing={1}>
        <IconButton aria-label="PDF" onClick={generatePDF}>
          <PictureAsPdfIcon />
        </IconButton>
        <IconButton aria-label="PDF" onClick={generateWord}>
          <TextSnippetIcon />
        </IconButton>
      </Stack>
    </div>
  );

};

export default ReportBPUModal;
