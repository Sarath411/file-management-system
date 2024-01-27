import React, { useEffect, useState } from "react";
import FilesTable from "@/components/files-table";
import axios from "axios";
import { Button, Box, Typography } from "@mui/material";
import Link from "next/link";
import { useRouter } from "next/router";
import FileViewerModal from "@/components/file-view";

const FoldersPage: React.FC = () => {
  const [files, setFiles] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentFileUrl, setCurrentFileUrl] = useState("");
  const router = useRouter();

  const { docbox_id } = router.query;

  useEffect(() => {
    let url = `http://localhost:3000/api/controllers/file`;
    if (docbox_id) {
      url = `http://localhost:3000/api/controllers/file?docbox_id=${docbox_id}`;
    }
    axios
      .get(url)
      .then((response) => setFiles(response.data.data))
      .catch((error) => console.error("Error fetching files:", error));
  }, [docbox_id]);

  const handleDeleteFile = (fileId: string) => {
    axios
      .delete(`http://localhost:3000/api/controllers/file?id=${fileId}`)
      .then((response) =>
        console.error("Error fetching folders:", response.data.data.message)
      )
      .catch((error) => console.error("Error fetching folders:", error));
    const updatedFilesData = files.filter((file: any) => file.id !== fileId);
    setFiles(updatedFilesData);
  };

  const handleViewFile = (fileUrl: any) => {
    setCurrentFileUrl(fileUrl);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div style={{ marginTop: "20px", marginLeft: "20px", marginRight: "20px" }}>
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Typography variant="h4">
          {docbox_id ? `${docbox_id} - Files` : `Files`}
        </Typography>
        <Link
          href={docbox_id ? `/addfiles?docbox_id=${docbox_id}` : `/addfiles`}
          passHref
        >
          <Button
            variant="contained"
            color="primary"
            style={{ marginLeft: "10px" }}
          >
            Create
          </Button>
        </Link>
      </Box>
      <FilesTable
        data={files}
        onDelete={handleDeleteFile}
        onView={handleViewFile}
      />
      <FileViewerModal
        open={isModalOpen}
        fileUrl={currentFileUrl}
        onClose={handleCloseModal}
      />
    </div>
  );
};

export default FoldersPage;
