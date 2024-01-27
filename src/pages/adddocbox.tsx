import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  Container,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
} from "@mui/material";
import { useRouter } from "next/router";
import axios from "axios";
import CloseIcon from "@mui/icons-material/Close";
import { useTheme } from "@mui/material/styles";
const AddDocBox: React.FC = () => {
  const theme = useTheme();
  const [isLoading, setIsLoading] = useState(false);
  const [docBoxData, setDocBoxData] = useState({
    name: "",
    description: "",
  });
  const [users, setUsers] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const router = useRouter();
  const { docbox_id } = router.query;

  useEffect(() => {
    fetchDocBoxDetails();
  }, [docbox_id]);

  const fetchUsers = async () => {
    try {
      const response = await axios.get(
        `http://localhost:3000/api/controllers/users`
      );
      console.log("usersssssssssssss", response.data);
      setUsers(response.data.data?.filter((x:any) => x.role === "user"));
    } catch (error) {
      console.error("Error fetching DocBox details:", error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchDocBoxDetails = async () => {
    if (docbox_id) {
      try {
        const response = await axios.get(
          `http://localhost:3000/api/controllers/docbox?id=${docbox_id}`
        );
        const { data } = response.data;
        setDocBoxData({
          name: data.name,
          description: data.description,
        });
        setSelectedUsers(data.userIds);
      } catch (error) {
        console.error("Error fetching DocBox details:", error);
      }
    }
  };

  // Adjust handleChange to handle changes for both docBoxData and selectedUsers
  const handleChange = (event: any) => {
    if (event.target.name === "selectedUsers") {
      setSelectedUsers(event.target.value);
    } else {
      setDocBoxData({ ...docBoxData, [event.target.name]: event.target.value });
    }
  };

  const handleDeleteUser = (userId: any) => {
    setSelectedUsers(selectedUsers.filter((user) => user !== userId));
  };

  const handleSubmit = async (event: any) => {
    setIsLoading(true);
    event.preventDefault();

    const payload = {
      ...docBoxData,
      userIds: selectedUsers,
    };

    try {
      if (docbox_id) {
        await axios.put(
          `http://localhost:3000/api/controllers/docbox?id=${docbox_id}`,
          payload,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
      } else {
        await axios.post(
          "http://localhost:3000/api/controllers/docbox",
          payload,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
      }
    } catch (error) {
      console.error("Error creating/updating DocBox:", error);
    } finally {
      setIsLoading(false);
      router.push("/docbox");
    }
  };

  return (
    <Container component="main" maxWidth="sm">
      <Box
        sx={{
          marginTop: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Typography component="h1" variant="h5">
          Create New DocBox
        </Typography>
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="name"
            label="Name"
            name="name"
            autoComplete="name"
            autoFocus
            value={docBoxData.name}
            onChange={handleChange}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            id="description"
            label="Description"
            name="description"
            autoComplete="description"
            value={docBoxData.description}
            onChange={handleChange}
          />
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5, mb: 2 }}>
            {selectedUsers.map((userId) => {
              const user: any = users.find((u: any) => u.id === userId);
              return (
                <Chip
                  key={userId}
                  label={user ? user.name : userId}
                  onDelete={() => handleDeleteUser(userId)}
                  deleteIcon={<CloseIcon />}
                />
              );
            })}
          </Box>

          {/* User Select Dropdown */}
          <FormControl fullWidth margin="normal">
            <InputLabel id="user-select-label">Users</InputLabel>
            <Select
              labelId="user-select-label"
              id="users"
              multiple
              value={selectedUsers}
              onChange={handleChange}
              name="selectedUsers"
            >
              {users.map((user: any) => (
                <MenuItem key={user.id} value={user.id}>
                  {user.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            sx={{ mt: 3, mb: 2 }}
          >
            {isLoading ? (
              <CircularProgress size={24} />
            ) : docbox_id ? (
              "Update"
            ) : (
              "Create"
            )}
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default AddDocBox;
