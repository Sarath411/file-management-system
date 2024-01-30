import DocBox from "../models/docbox";
import Files from "../models/file";
import UsersDocBoxes from "../models/uses_docboxes";
import { getFileUrlFromS3 } from "../common/upload";
import { createOrUpdateUserDocBoxService } from "./usersdocboxes";


const createDocBoxService = async (docBoxData: any, userData: any) => {
  try {
    const lastDocBox = await DocBox.findOne({
      order: [["created_at", "DESC"]],
      paranoid: false,
    });
    console.log(":::::::::::::::", lastDocBox);
    let newId = "DocBox-10001";
    if (lastDocBox && lastDocBox.id) {
      const lastIdNumber = parseInt(lastDocBox.id.split("-")[1]);
      newId = `DocBox-${lastIdNumber + 1}`;
    }
    console.log(":::::::::::::::", docBoxData, newId);
    const newDocBox = await DocBox.create({
      id: newId,
      created_by: String(userData?.userId),
      ...docBoxData,
    });
    if (docBoxData.userIds && docBoxData.userIds?.length > 0) {
      createOrUpdateUserDocBoxService({
        docBoxId: newId,
        userIds: docBoxData.userIds,
      });
    }
    return newDocBox;
  } catch (error) {
    console.log("errorrr", error);
    throw error;
  }
};

const getAllDocBoxesService = async (userData: any) => {
  try {
    let docBoxes;
    if (userData.role !== "admin") {
      const assignedDocBoxes = await UsersDocBoxes.findAll({
        where: { user_id: userData.userId },
        attributes: ["docbox_id"],
      });

      const assignedDocBoxIds = assignedDocBoxes.map((adb) => adb.docbox_id);

      docBoxes = await DocBox.findAll({
        where: {
          id: assignedDocBoxIds,
          deleted_at: null as any,
        },
        order: [["created_at", "DESC"]],
        include: [{ model: Files, as: "files" }],
      });
    } else {
      docBoxes = await DocBox.findAll({
        where: { deleted_at: null as any },
        order: [["created_at", "DESC"]],
        include: [{ model: Files, as: "files" }],
      });
    }

    const docBoxesWithFileUrls = await Promise.all(
      docBoxes.map(async (docBox: any) => {
        // Resolve all promises for the file URLs
        const filesWithUrls = await Promise.all(
          docBox.files.map(async (file: any) => {
            const fileUrl = await getFileUrlFromS3(file.file_url);
            return {
              ...file.toJSON(),
              file_url: fileUrl,
            };
          })
        );

        return {
          ...docBox.toJSON(),
          files: filesWithUrls,
        };
      })
    );

    return {
      data: docBoxesWithFileUrls,
      success: true,
    };
  } catch (error) {
    throw error;
  }
};

// Get a single DocBox by ID
const getDocBoxByIdService = async (id: any, userData: any) => {
  try {
    console.log("??????????", id);
    const docBox: any = await DocBox.findByPk(id, {
      include: [
        {
          model: Files,
          as: "files",
        },
        {
          model: UsersDocBoxes,
          as: "userDocBoxes",
        },
      ],
    });

    if (!docBox) {
      throw new Error("DocBox not found");
    }
    // Resolve all promises for the file URLs
    const filesWithUrls = await Promise.all(
      docBox.files.map(async (file: any) => {
        const fileUrl = await getFileUrlFromS3(file.file_url);
        return {
          ...file.toJSON(),
          file_url: fileUrl,
        };
      })
    );

    const userIds = docBox.userDocBoxes.map(
      (userDocBox: any) => userDocBox.user_id
    );

    return {
      ...docBox.toJSON(),
      files: filesWithUrls,
      userIds: userIds,
    };
  } catch (error) {
    throw error;
  }
};

// Update a DocBox
const updateDocBoxService = async (id: any, updateData: any, userData: any) => {
  try {
    const docBox = await DocBox.findByPk(id);
    if (!docBox) {
      throw new Error("DocBox not found");
    }
    await docBox.update({
      updated_by: userData?.userId,
      ...updateData,
    });
    if (updateData.userIds && updateData.userIds?.length > 0) {
      createOrUpdateUserDocBoxService({
        docBoxId: id,
        userIds: updateData.userIds,
      });
    }
    return docBox;
  } catch (error) {
    throw error;
  }
};

// Delete a DocBox
const deleteDocBoxService = async (id: any, userData: any) => {
  try {
    const docBox: any = await DocBox.findByPk(id, {
      include: [{ model: Files, as: "files" }],
    });

    if (!docBox) {
      throw new Error("DocBox not found");
    }
    if (docBox.files && docBox.files.length > 0) {
      await Promise.all(
        docBox.files.map((file: any) =>
          file.update({ deleted_by: userData.userId })
        )
      );

      await Promise.all(docBox.files.map((file: any) => file.destroy()));
    }
    await docBox.update({ deleted_by: userData.userId });
    await docBox.destroy();
    return { message: "DocBox and associated files deleted successfully" };
  } catch (error) {
    console.error("///////// Error deleting DocBox:", error);
    throw error;
  }
};

export {
  createDocBoxService,
  getAllDocBoxesService,
  getDocBoxByIdService,
  updateDocBoxService,
  deleteDocBoxService,
};
