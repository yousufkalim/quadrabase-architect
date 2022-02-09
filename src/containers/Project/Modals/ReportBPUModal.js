// init
import React from "react";

import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import TextSnippetIcon from '@mui/icons-material/TextSnippet';

// Reports
import {
  exportPDFSimpleBPU,
  exportPDFTradesBPU,
  exportPDFTradesAndTranchesBPU
} from "../ReportsGen/genPDF";
import { exportDOCXBPU } from "../ReportsGen/genDocx";

import { toast } from "react-toastify";

function ReportBPUModal(props){

  const { projectWorkData, currentProject } = props;

  function generatePDF(){
    try{

      if(currentProject.market_type == "Simple"){
        exportPDFSimpleBPU(projectWorkData, currentProject);
      } else if(currentProject.market_type == "Trades"){
        exportPDFTradesBPU(projectWorkData, currentProject);
      } else if(currentProject.market_type == "TradesAndTranches"){
        exportPDFTradesAndTranchesBPU(projectWorkData, currentProject);
      } else {
        console.trace("Show me");
      }

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
