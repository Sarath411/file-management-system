import React, { useEffect, useState } from "react";
import DocboxTable from "@/components/docbox-table";
import axios from "axios";
import { Button, Box, Typography } from "@mui/material";
import Link from "next/link";

const FoldersPage: React.FC = () => {
  const [docboxes, setDocboxes] = useState([]);

  useEffect(() => {
    // Fetch folders data from your API
    axios
      .get("http://localhost:3000/api/controllers/docbox")
      .then((response) => setDocboxes(response.data.data.data))
      .catch((error) => console.error("Error fetching folders:", error));
  }, []);

  const handleDeleteDocbox = (docboxId: string) => {
    axios
      .delete(`http://localhost:3000/api/controllers/docbox?id=${docboxId}`)
      .then((response) =>
        console.error("Error fetching folders:", response.data.data.message)
      )
      .catch((error) => console.error("Error fetching folders:", error));
    const updatedDocboxData = docboxes.filter(
      (docbox: any) => docbox.id !== docboxId
    );
    setDocboxes(updatedDocboxData);
  };
  return (
    <div style={{ marginTop: "20px", marginLeft: "20px", marginRight: "20px" }}>
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Typography variant="h4">Docboxes</Typography>
        <Link href="/adddocbox" passHref>
          <Button variant="contained" color="primary">
            Create
          </Button>
        </Link>
      </Box>
      <DocboxTable data={docboxes} onDelete={handleDeleteDocbox} />
    </div>
  );
};

export default FoldersPage;
