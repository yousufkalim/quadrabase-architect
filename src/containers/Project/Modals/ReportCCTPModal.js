// init
import React, { useState, useEffect } from "react";

import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import TextSnippetIcon from '@mui/icons-material/TextSnippet';

// Reports
import { exportDOCXCCTP } from "../ReportsGen/genDocx";

function ReportCCTPModal(props){

  const { projectWorkData, currentProject } = props;

  function generateWord(){
    exportDOCXCCTP(projectWorkData, currentProject);
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
