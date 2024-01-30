import React, { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  IconButton,
  Typography,
  TableContainer,
  Paper,
  Tooltip,
  // ... other Material-UI imports
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import GetAppIcon from "@mui/icons-material/GetApp";
import VisibilityIcon from "@mui/icons-material/Visibility";
import moment from "moment";
import ConfirmationModal from "./confirmation-model";
import { useUser } from "@clerk/nextjs";
import axios from "axios";

interface FileRowData {
  id: string;
  name: string;
  updated_at: string;
  file_url: string;
  doc_box: string;
  created_by: string;
  description: string;
  fencing_start_date: Date;
  fencing_end_date: Date;
}

interface FilesTableProps {
  data: FileRowData[];
  onDelete: any;
  onView: (fileUrl: string) => void;
}

const FilesTable: React.FC<FilesTableProps> = ({ data, onDelete, onView }) => {
  const handleDownload = (fileUrl: any) => {
    const link = document.createElement("a");
    link.href = fileUrl;
    link.setAttribute("download", "filename");
    document.body.appendChild(link);
    link.click();
  };
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);

  const { user, isLoaded, isSignedIn } = useUser();

  const role = user?.publicMetadata?.role ?? "user";
  const [users, setUsers] = useState<any[]>([]);
  const handleDeleteClick = (itemId: string) => {
    setSelectedItemId(itemId);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteConfirm = () => {
    onDelete(selectedItemId || "");
    setIsDeleteModalOpen(false);
    setSelectedItemId(null);
  };

  const handleDeleteModalClose = () => {
    setIsDeleteModalOpen(false);
    setSelectedItemId(null);
  };

  const fetchUsers = async () => {
    try {
      const response = await axios.get(
        `http://localhost:3000/api/controllers/users`
      );
      console.log("usersssssssssssss", response.data);
      setUsers(response.data.data);
    } catch (error) {
      console.error("Error fetching DocBox details:", error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>S.No</TableCell>
            <TableCell>Name</TableCell>
            <TableCell>DocBox</TableCell>
            <TableCell>Created By</TableCell>
            <TableCell>Last Updated</TableCell>
            <TableCell>Action</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5}>
                <Typography variant="body2" style={{ textAlign: "center" }}>
                  No files found
                </Typography>
              </TableCell>
            </TableRow>
          ) : (
            data.map((file, index) => (
              <TableRow key={file.id}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>
                  {" "}
                  <Tooltip title={file.description} arrow>
                    <span>
                      {file.name.charAt(0).toUpperCase() +
                        file.name.slice(1).toLowerCase()}
                    </span>
                  </Tooltip>
                </TableCell>
                <TableCell>{file.doc_box}</TableCell>
                <TableCell>
                  {file.created_by === user?.id
                    ? "Me"
                    : users?.find((x: any) => x.id === file.created_by)?.name}
                </TableCell>
                <TableCell>
                  {moment(file.updated_at).format("MMMM D, YYYY")}
                </TableCell>

                <TableCell>
                  {!(
                    new Date() >= new Date(file.fencing_start_date) &&
                    new Date() <= new Date(file.fencing_end_date)
                  ) || role === "admin" ? (
                    <>
                      <IconButton onClick={() => onView(file.file_url)}>
                        <VisibilityIcon />
                      </IconButton>
                      <IconButton onClick={() => handleDownload(file.file_url)}>
                        <GetAppIcon />
                      </IconButton>

                      {(role === "admin" || file.created_by === user?.id) && (
                        <>
                          <IconButton href={`/addfiles?file_id=${file.id}`}>
                            <EditIcon />
                          </IconButton>
                          <IconButton
                            onClick={() => handleDeleteClick(file.id)}
                          >
                            <DeleteIcon />
                          </IconButton>{" "}
                        </>
                      )}
                    </>
                  ) : (
                    <span>No actions available (fencing period)</span>
                  )}
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
        <ConfirmationModal
          open={isDeleteModalOpen}
          onClose={handleDeleteModalClose}
          onConfirm={handleDeleteConfirm}
          docboxName={
            data.find((item) => item.id === selectedItemId)?.name || ""
          }
          numFiles={0}
          type="file"
        />
      </Table>
    </TableContainer>
  );
};

export default FilesTable;
