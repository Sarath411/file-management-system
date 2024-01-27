import React from "react";
import { Dialog, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

const FileViewerModal = ({ open, fileUrl, onClose }: any) => {
  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="lg">
      <IconButton
        aria-label="close"
        onClick={onClose}
        style={{ position: "absolute", right: 8, top: 8 }}
      >
        <CloseIcon />
      </IconButton>
      {fileUrl && (
        // <iframe
        //   src={fileUrl}
        //   title="File Viewer"
        //   style={{ width: "100%", height: "500px", border: "none" }}
        //   onError={(e) => {
        //     e.currentTarget.style.display = "none";
        //   }}
        // />
        <object data={fileUrl} width="100%" height="500px"></object>
      )}
    </Dialog>
  );
};

export default FileViewerModal;
