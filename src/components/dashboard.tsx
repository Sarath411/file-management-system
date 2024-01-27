import React, { useEffect, useState } from "react";
import {
  Box,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableContainer,
  TableRow,
  Typography,
  IconButton,
  useTheme,
  useMediaQuery,
  Link,
} from "@mui/material";
import FolderIcon from "@mui/icons-material/Folder";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import GetAppIcon from "@mui/icons-material/GetApp";
import axios from "axios";
import moment from "moment";
import { useUser } from "@clerk/nextjs";

const DashBoard: React.FC = () => {
  const [docboxes, setDocboxes] = useState([]);
  const [files, setFiles] = useState([]);
  const [users, setUsers] = useState<any[]>([]);
  const { user, isLoaded, isSignedIn } = useUser();

  const role = user?.publicMetadata?.role ?? "user";
  console.log("?????????????????????/", user?.id, role);
  useEffect(() => {
    axios
      .get("http://localhost:3000/api/controllers/docbox")
      .then((response) => setDocboxes(response.data.data.data.slice(0, 4)))
      .catch((error) => console.error("Error fetching folders:", error));

    axios
      .get("http://localhost:3000/api/controllers/file")
      .then((response) => setFiles(response.data.data.slice(0, 4)))
      .catch((error) => console.error("Error fetching folders:", error));
  }, []);

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

  const handleDownload = (fileUrl: any) => {
    const link = document.createElement("a");
    link.href = fileUrl;
    link.setAttribute("download", "filename");
    document.body.appendChild(link);
    link.click();
  };

  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <Box p={2}>
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Typography variant="h5" gutterBottom>
          {role === `admin` ? `Recent Folders` : `My Folders`}
        </Typography>
        <Box display="flex" justifyContent="flex-end">
          <Link
            href="docbox"
            color="primary"
            sx={{ cursor: "pointer", textDecoration: "none" }}
          >
            View All
          </Link>
        </Box>
      </Box>
      <Grid container spacing={2}>
        {docboxes?.map((folder: any, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Paper elevation={2} sx={{ p: 2, textAlign: "center" }}>
              <FolderIcon color="warning" sx={{ fontSize: "4rem" }} />
              <Typography>{folder.name}</Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>
      <Typography variant="h5" gutterBottom sx={{ mt: 4 }}>
        Recent Files
      </Typography>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>DocBox</TableCell>
              <TableCell>Created By</TableCell>
              <TableCell>Modified</TableCell>
              <TableCell align="right">Download</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {files?.map((file: any, index) => (
              <TableRow key={index}>
                <TableCell>
                  <Box display="flex" alignItems="center">
                    <InsertDriveFileIcon color="primary" sx={{ mr: 1 }} />
                    <Typography variant={isSmallScreen ? "body2" : "body1"}>
                      {file.name}
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell>
                  <Typography variant={isSmallScreen ? "body2" : "body1"}>
                    {file.doc_box}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant={isSmallScreen ? "body2" : "body1"}>
                    {file.created_by === user?.id
                      ? "Me"
                      : users?.find((x: any) => x.id === file.created_by)?.name}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant={isSmallScreen ? "body2" : "body1"}>
                    {moment(file.updated_at).format("MMMM D, YYYY")}
                  </Typography>
                </TableCell>
                <TableCell align="right">
                  <IconButton onClick={() => handleDownload(file.file_url)}>
                    <GetAppIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Box display="flex" justifyContent="flex-end" mt={2}>
        <Link
          href="files"
          color="primary"
          sx={{ cursor: "pointer", textDecoration: "none" }}
        >
          View All
        </Link>
      </Box>
    </Box>
  );
};

export default DashBoard;
