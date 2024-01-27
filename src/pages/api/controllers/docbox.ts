import { NextApiRequest, NextApiResponse } from "next";
import {
  createDocBoxService,
  getAllDocBoxesService,
  getDocBoxByIdService,
  updateDocBoxService,
  deleteDocBoxService,
} from "../services/docbox";
import { initializeDatabase } from "../models";

//for user role and id
import getLoggedinUserData from "../middlewares/auth";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    await initializeDatabase();
    const userData = getLoggedinUserData(req);
    console.log("userDATA//////////////////", userData?.userId, userData?.role);
    const {
      query: { id },
      method,
    } = req;

    switch (method) {
      case "GET":
        // Handle GET requests
        const docBoxes = id
          ? await getDocBoxByIdService(id, userData)
          : await getAllDocBoxesService(userData);
        res.status(200).json({ data: docBoxes, success: true });
        break;

      case "POST":
        // Handle POST requests (DocBox creation)
        const createdDocBox = await createDocBoxService(req.body, userData);
        res.status(201).json({ data: createdDocBox, success: true });
        break;

      case "PUT":
        // Handle PUT requests (DocBox update)
        if (!id) {
          return res
            .status(400)
            .json({ error: "DocBox ID is required for update" });
        }
        const updatedDocBox = await updateDocBoxService(id, req.body, userData);
        res.status(200).json({ data: updatedDocBox, success: true });
        break;

      case "DELETE":
        // Handle DELETE requests (DocBox deletion)
        if (!id) {
          return res
            .status(400)
            .json({ error: "DocBox ID is required for deletion" });
        }
        await deleteDocBoxService(id, userData);
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
}
