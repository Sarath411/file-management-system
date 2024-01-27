import React from "react";
import { Modal, Box, Typography, Button } from "@mui/material";

const ConfirmationModal: React.FC<{
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  docboxName: string;
  numFiles: number;
  type: string;
}> = ({ open, onClose, onConfirm, docboxName, numFiles, type }) => {
  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          backgroundColor: "white",
          padding: "20px",
          borderRadius: "8px",
          textAlign: "center",
          width: "300px",
        }}
      >
        {type === "docbox" ? (
          <Typography variant="h6" sx={{ color: "black", marginBottom: 5 }}>
            Are you sure you want to delete {docboxName} with {numFiles} files?
          </Typography>
        ) : (
          <Typography variant="h6" sx={{ color: "black", marginBottom: 5 }}>
            Are you sure you want to delete file?
          </Typography>
        )}

        <Button
          onClick={onClose}
          color="secondary"
          sx={{ color: "black", backgroundColor: "yellow", marginRight: 5 }}
        >
          Cancel
        </Button>
        <Button
          onClick={onConfirm}
          color="primary"
          sx={{ color: "white", backgroundColor: "blue" }}
        >
          Confirm
        </Button>
      </Box>
    </Modal>
  );
};

export default ConfirmationModal;
