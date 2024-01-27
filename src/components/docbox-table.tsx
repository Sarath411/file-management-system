import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  IconButton,
  Typography,
  Tooltip,
  Modal,
  Box,
  Button,
  TableContainer,
  Paper,
  // ... other Material-UI imports
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import FolderOpenIcon from "@mui/icons-material/FolderOpen";

import moment from "moment";
import Link from "next/link";
import ConfirmationModal from "./confirmation-model";
import { useUser } from "@clerk/nextjs";

interface RowData {
  id: string;
  name: string;
  description: string;
  updated_at: string;
  files: FileRowData[];
  created_by: string;
}

interface FileRowData {
  id: string;
  name: string;
  updated_at: string;
  file_url: string;
  doc_box: string;
}

interface DocboxTableProps {
  data: RowData[];
  onDelete: any;
}

const DocboxTable: React.FC<DocboxTableProps> = ({ data, onDelete }) => {
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  const { user, isLoaded, isSignedIn } = useUser();

  const role = user?.publicMetadata?.role ?? "user";
  const [isUserAssignmentModalOpen, setIsUserAssignmentModalOpen] =
    useState(false);
  const [currentDocBoxId, setCurrentDocBoxId] = useState<string | null>(null);
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

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>ID</TableCell>
            <TableCell>Name</TableCell>
            <TableCell>Last Updated</TableCell>
            <TableCell>No. of Files</TableCell>
            <TableCell>Action</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5}>
                <Typography variant="body2">No data found</Typography>
              </TableCell>
            </TableRow>
          ) : (
            data.map((row) => (
              <TableRow key={row.id}>
                <TableCell>{row.id}</TableCell>
                <TableCell>
                  <Tooltip title={row.description} arrow>
                    <span>{row.name}</span>
                  </Tooltip>
                </TableCell>
                <TableCell>
                  {moment(row.updated_at).format("MMMM D, YYYY")}
                </TableCell>
                <TableCell>{row?.files?.length}</TableCell>
                <TableCell>
                  <Link href={`/files?docbox_id=${row.id}`} passHref>
                    <IconButton>
                      <FolderOpenIcon />
                    </IconButton>
                  </Link>
                  {(role === "admin" || row.created_by === user?.id) && (
                    <>
                      <IconButton href={`/adddocbox?docbox_id=${row.id}`}>
                        <EditIcon />
                      </IconButton>
                      <IconButton onClick={() => handleDeleteClick(row.id)}>
                        <DeleteIcon />
                      </IconButton>
                    </>
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
          numFiles={
            data.find((item) => item.id === selectedItemId)?.files.length || 0
          }
          type="docbox"
        />
      </Table>
    </TableContainer>
  );
};

export default DocboxTable;
