import { NextApiRequest, NextApiResponse } from "next";
import {
  createFileService,
  getAllFilesService,
  getFileByIdService,
  updateFileService,
  deleteFileService,
  getFileByDocBoxIdService,
} from "../services/file";
import { initializeDatabase } from "../models";
import multer from "multer";
import { uploadFileToS3 } from "../common/upload";
import getLoggedinUserData from "../middlewares/auth";

interface NextApiRequestWithFile extends NextApiRequest {
  file: Express.Multer.File;
}

const upload = multer({ dest: "uploads/" });

export const config = {
  api: {
    bodyParser: false,
  },
};

const multerSingle = upload.single("file");

export default function handler(
  req: NextApiRequestWithFile,
  res: NextApiResponse
) {
  const userData = getLoggedinUserData(req);
  multerSingle(req as any, res as any, async (err: any) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    try {
      await initializeDatabase();

      const {
        query: { id, docbox_id },
        method,
      } = req;

      switch (method) {
        case "GET":
          let files;
          if (id) {
            files = await getFileByIdService(id);
          } else if (docbox_id) {
            files = await getFileByDocBoxIdService(docbox_id);
          } else {
            files = await getAllFilesService(userData);
          }
          res.status(200).json({ data: files, success: true });
          break;

        case "POST":
          // Handle POST requests (File creation)
          console.log("????????????", req.file);
          if (!req.file) {
            return res.status(400).json({ error: "No file uploaded" });
          }
          const file_key = await uploadFileToS3(req.file);
          console.log("????????????", file_key);
          const fileData = {
            ...req.body, // Other file data from the request body
            file_url: file_key,
          };
          const createdFile = await createFileService(fileData, userData);
          res.status(201).json({ data: createdFile, success: true });
          break;

        case "PUT":
          if (!id) {
            return res
              .status(400)
              .json({ error: "File ID is required for update" });
          }

          let updatedFile;
          if (req.file) {
            const file_key = await uploadFileToS3(req.file);
            const fileData = {
              ...req.body,
              file_url: file_key,
            };
            updatedFile = await updateFileService(id, fileData, userData);
          } else {
            updatedFile = await updateFileService(id, req.body, userData);
          }

          res.status(200).json({ data: updatedFile, success: true });
          break;

        case "DELETE":
          // Handle DELETE requests (File deletion)
          if (!id) {
            return res
              .status(400)
              .json({ error: "File ID is required for deletion" });
          }
          await deleteFileService(id, userData);
          res.status(204).json({ success: true });
          break;

        default:
          // Handle other methods
          res.setHeader("Allow", ["GET", "POST", "PUT", "DELETE"]);
          res.status(405).end(`Method ${method} Not Allowed`);
      }
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });
}
