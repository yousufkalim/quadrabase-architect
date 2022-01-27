// init
import React from "react";

import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import TextSnippetIcon from '@mui/icons-material/TextSnippet';

// Reports
import { exportDOCXCCTP } from "../ReportsGen/genDocx";

import { toast } from "react-toastify";

function ReportCCTPModal(props){

  const { projectWorkData, currentProject } = props;

  function generateWord(){
    try{
      exportDOCXCCTP(projectWorkData, currentProject);
    }catch(e){
      toast.error("Could not generate report successfully.");
      console.trace(e);
    }
  }

  return (
    <div style={{ width: "30vw"}}>
      <Stack direction="row" spacing={1}>
        <IconButton aria-label="Word" onClick={generateWord}>
          <TextSnippetIcon />
        </IconButton>
      </Stack>
    </div>
  );

};

export default ReportCCTPModal;
