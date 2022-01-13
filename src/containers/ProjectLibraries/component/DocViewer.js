import React from "react";
import DocViewer, { DocViewerRenderers } from "react-doc-viewer";
import FastForwardIcon from "@mui/icons-material/FastForward";
import FastRewindIcon from "@mui/icons-material/FastRewind";
import { IconButton } from "@mui/material";
import { useStyles } from "../../../css/projectLibraries";

export default function Index(props) {
  const { documents } = props;
  const classes = useStyles();
  return (
    <div>
      <DocViewer
        pluginRenderers={DocViewerRenderers}
        documents={documents}
        config={{
          header: {
            overrideComponent: myHeader,
          },
        }}
        className={classes.docViewer}
      />
    </div>
  );
}

const myHeader = (state, previousDocument, nextDocument) => {
  if (!state.currentDocument || state.config?.header?.disableFileName) {
    return null;
  }

  return (
    <>
      <div>
        <div
          style={{ display: "flex", width: "100%", justifyContent: "flex-end" }}
        >
          <div>
            <IconButton
              onClick={previousDocument}
              disabled={state.currentFileNo === 0}
            >
              <FastRewindIcon />
            </IconButton>
          </div>
          <div>
            <IconButton
              onClick={nextDocument}
              disabled={state.currentFileNo >= state.documents.length - 1}
            >
              <FastForwardIcon />
            </IconButton>
          </div>
        </div>
      </div>
    </>
  );
};
