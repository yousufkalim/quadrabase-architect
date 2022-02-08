// init
import React, { useState, useEffect } from "react";

import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import SummarizeIcon from '@mui/icons-material/Summarize';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import TextSnippetIcon from '@mui/icons-material/TextSnippet';

// Reports
import {
  exportXLSXSimpleEstimation,
  exportXLSXTradesEstimation,
  exportXLSXTradesAndTranchesEstimation
} from "../ReportsGen/genExcel";
import { exportPDFEstimation } from "../ReportsGen/genPDF";
import { exportDOCXestimation } from "../ReportsGen/genDocx";

import { toast } from "react-toastify";

function ReportEstimationModal(props){

  const { projectWorkData, currentProject } = props;

  function generateExcel(){
    try{

      if(currentProject.market_type == "Simple"){
        exportXLSXSimpleEstimation(projectWorkData, currentProject);
      } else if(currentProject.market_type == "Trades"){
        exportXLSXTradesEstimation(projectWorkData, currentProject);
      } else if(currentProject.market_type == "TradesAndTranches"){
        exportXLSXTradesAndTranchesEstimation(projectWorkData, currentProject);
      } else {
        console.trace("Show me");
      }
      
    }catch(e){
      toast.error("Could not generate report successfully.");
      console.trace(e);
    }
  }

  function generatePDF(){
    try{
      exportPDFEstimation(projectWorkData, currentProject);
    }catch(e){
      toast.error("Could not generate report successfully.");
      console.trace(e);
    }
  }

  function generateWord(){
    try{
      exportDOCXestimation(projectWorkData, currentProject);
    }catch(e){
      toast.error("Could not generate report successfully.");
      console.trace(e);
    }
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

export default ReportEstimationModal;
