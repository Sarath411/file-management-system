import React, { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import {
  Box,
  Button,
  TextField,
  Typography,
  Container,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  IconButton,
  InputAdornment,
} from "@mui/material";
import { useRouter } from "next/router";
import axios from "axios";
import CloseIcon from "@mui/icons-material/Close";

const fileSchema = Yup.object().shape({
  name: Yup.string().required("Name is required"),
  description: Yup.string().required("Description is required"),
  docbox_id: Yup.string().required("DocBox selection is required"),
  existingFileUrl: Yup.string(),
  file: Yup.mixed().test("required", "File is required", function (value) {
    const { existingFileUrl } = this.parent;
    // Require file only if there is no existing file URL
    if (!existingFileUrl && !value) {
      return false;
    }
    return true;
  }),
  fencing_start_date: Yup.mixed()
    .nullable()
    .test("end-date-test", "Fencing Start Date is required", function (value) {
      const { fencing_end_date } = this.parent;
      if (fencing_end_date) {
        if (!value) {
          return false;
        }
      }
      return true;
    }),
  fencing_end_date: Yup.mixed()
    .nullable()
    .test("end-date-test", "Fencing End Date is required", function (value) {
      const { fencing_start_date } = this.parent;
      if (fencing_start_date) {
        if (!value) {
          return false;
        }
      }
      return true;
    }),
});

const AddFile: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [docBoxes, setDocBoxes] = useState([]);
  const [existingFile, setExistingFile] = useState<string | null>(null);
  const router = useRouter();
  const { file_id, docbox_id } = router.query;
  console.log("???????????????////", file_id);
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    setValue,
    trigger,
    getValues,
  } = useForm({
    resolver: yupResolver(fileSchema),
  });

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      setValue("file", files);
      trigger("file");
    }
  };

  const handleRemoveExistingFile = () => {
    setExistingFile(null);
    setValue("file", null as any);
  };

  useEffect(() => {
    axios
      .get("http://localhost:3000/api/controllers/docbox")
      .then((response) => setDocBoxes(response.data.data.data))
      .catch((error) => console.error("Error fetching docBoxes:", error));
  }, []);

  useEffect(() => {
    fetchFileDetails();
  }, [file_id]);

  const fetchFileDetails = async () => {
    if (file_id) {
      axios
        .get(`http://localhost:3000/api/controllers/file/?id=${file_id}`)
        .then((response) => {
          const fileData = response.data.data;
          setValue("name", fileData.name);
          setValue("description", fileData.description);
          setValue("docbox_id", fileData.doc_box);
          setValue("existingFileUrl", fileData.file_url);
          setExistingFile(fileData.file_url);
          setValue(
            "fencing_start_date",
            fileData.fencing_start_date
              ? new Date(fileData.fencing_start_date)
                  .toISOString()
                  .split("T")[0]
              : null
          );
          setValue(
            "fencing_end_date",
            fileData.fencing_end_date
              ? new Date(fileData.fencing_end_date).toISOString().split("T")[0]
              : null
          );
        })
        .catch((error) => console.error("Error fetching file data:", error));
    }
  };

  const onSubmit = async (data: any) => {
    setIsLoading(true);
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("description", data.description);
    formData.append("doc_box", data.docbox_id);
    !existingFile && formData.append("file", data.file[0]);
    console.log(
      "??????????dateeeeee",
      data.fencing_start_date,
      typeof data.fencing_start_date
    );
    formData.append(
      "fencing_start_date",
      data.fencing_start_date === "" ? null : data.fencing_start_date
    );
    formData.append(
      "fencing_end_date",
      data.fencing_end_date === "" ? null : data.fencing_end_date
    );

    try {
      if (file_id) {
        await axios.put(
          `http://localhost:3000/api/controllers/file?id=${file_id}`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
      } else {
        await axios.post(
          "http://localhost:3000/api/controllers/file",
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
      }
      !docbox_id
        ? router.push("/files")
        : router.push(`/files?docbox_id=${docbox_id}`);
      // router.push("/files");
    } catch (error) {
      console.error("Error creating/updating file:", error);
    } finally {
      setIsLoading(false);
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
          {file_id ? "Edit File" : "Create New File"}
        </Typography>
        <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ mt: 3 }}>
          <Controller
            name="name"
            control={control}
            defaultValue=""
            render={({ field }) => (
              <TextField
                margin="normal"
                fullWidth
                id="name"
                label="Name"
                autoComplete="name"
                autoFocus
                error={!!errors.name}
                helperText={errors.name?.message}
                {...field}
              />
            )}
          />
          <Controller
            name="description"
            control={control}
            defaultValue=""
            render={({ field }) => (
              <TextField
                margin="normal"
                fullWidth
                id="description"
                label={"Description"}
                autoComplete="description"
                error={!!errors.description}
                helperText={errors.description?.message}
                {...field}
              />
            )}
          />
          <FormControl fullWidth margin="normal">
            <InputLabel id="docbox-label">DocBox</InputLabel>
            <Controller
              name="docbox_id"
              control={control}
              // defaultValue=""
              defaultValue={docbox_id ?? ("" as any)}
              render={({ field }) => (
                <Select
                  labelId="docbox-label"
                  id="docbox_id"
                  {...field}
                  label="DocBox"
                  error={!!errors.docbox_id}
                >
                  {docBoxes.map((docBox: any) => (
                    <MenuItem key={docBox.id} value={docBox.id}>
                      {docBox.name}
                    </MenuItem>
                  ))}
                </Select>
              )}
            />
            {errors.docbox_id && (
              <Typography color="error" variant="body2">
                {errors.docbox_id.message}
              </Typography>
            )}
          </FormControl>
          {/* <FormControl fullWidth margin="normal">
            <TextField
              type="file"
              label={"file"}
              name="file"
              InputLabelProps={{ shrink: true }}
              onInput={handleFileChange}
              inputProps={{
                accept:
                  "application/pdf, application/vnd.openxmlformats-officedocument.wordprocessingml.document, image/jpeg, image/png",
              }}
              error={!!errors.file}
              helperText={
                errors.file?.message ??
                "Accepted file type: PDF, DOCX, JPEG, or PNG file"
              }
            />
          </FormControl> */}
          <FormControl fullWidth margin="normal">
            {existingFile ? (
              <TextField
                fullWidth
                margin="normal"
                variant="outlined"
                label="Current File"
                InputLabelProps={{
                  shrink: !!existingFile,
                }}
                InputProps={{
                  readOnly: true,
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={handleRemoveExistingFile}>
                        <CloseIcon />
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                value={existingFile.split("/").pop()?.split("?")[0]}
              />
            ) : (
              <TextField
                type="file"
                label="File"
                InputLabelProps={{ shrink: true }}
                onChange={handleFileChange}
                inputProps={{
                  accept:
                    "application/pdf, application/vnd.openxmlformats-officedocument.wordprocessingml.document, image/jpeg, image/png",
                }}
                error={!!errors.file}
                helperText={
                  errors.file?.message ??
                  "Accepted file type: PDF, DOCX, JPEG, or PNG file"
                }
              />
            )}
          </FormControl>

          <Controller
            name="fencing_start_date"
            control={control}
            defaultValue={null}
            render={({ field }) => (
              <TextField
                margin="normal"
                fullWidth
                type="date"
                label="Fencing Start Date"
                InputLabelProps={{ shrink: true }}
                onSelect={() => {
                  trigger("fencing_end_date");
                }}
                error={!!errors.fencing_start_date}
                helperText={errors.fencing_start_date?.message}
                {...field}
                inputProps={{
                  min: new Date().toISOString().split("T")[0],
                }}
              />
            )}
          />

          <Controller
            name="fencing_end_date"
            control={control}
            defaultValue={null}
            render={({ field }) => (
              <TextField
                margin="normal"
                fullWidth
                type="date"
                label="Fencing End Date"
                InputLabelProps={{ shrink: true }}
                error={!!errors.fencing_end_date}
                helperText={errors.fencing_end_date?.message}
                onSelect={() => {
                  trigger("fencing_start_date");
                }}
                {...field}
                inputProps={{
                  min: new Date().toISOString().split("T")[0],
                }}
              />
            )}
          />

          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            sx={{ mt: 3, mb: 2 }}
            disabled={isLoading}
          >
            {isLoading ? (
              <CircularProgress size={24} />
            ) : file_id ? (
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

export default AddFile;
