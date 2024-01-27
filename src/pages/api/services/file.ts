import { UsersDocBoxes } from "../models";
import File from "../models/file";
import { getFileUrlFromS3 } from "../common/upload";
import { sendEmail } from "../common/mail";
export const createFileService = async (fileData: any, userData: any) => {
  try {
    const file: File = await File.create({
      created_by: userData.userId,
      ...fileData,
    });
    const fileUrl = await getFileUrlFromS3(file.file_url);
    await sendEmail({
      userMails: [process.env.AdminEmail],
      subject: `file created`,
      text: `a new file - ${fileData.name} created in docbox - ${fileData.doc_box} by user - ${userData.userId}`,
    });
    return {
      ...file.toJSON(),
      file_url: fileUrl,
    };
  } catch (error) {
    throw error;
  }
};

export const getAllFilesService = async (userData: any) => {
  try {
    let files;

    if (userData.role !== "admin") {
      const assignedDocBoxes = await UsersDocBoxes.findAll({
        where: { user_id: userData.userId },
        attributes: ["docbox_id"],
      });

      const assignedDocBoxIds = assignedDocBoxes.map((adb) => adb.docbox_id);

      files = await File.findAll({
        where: {
          doc_box: assignedDocBoxIds,
          deleted_at: null as any,
        },
        order: [["updated_at", "DESC"]],
      });
    } else {
      files = await File.findAll({
        where: { deleted_at: null as any },
        order: [["updated_at", "DESC"]],
      });
    }

    if (!files) {
      throw new Error("Files not found");
    }

    const filesWithUrls = await Promise.all(
      files.map(async (file) => {
        const fileUrl = await getFileUrlFromS3(file.file_url);
        return {
          ...file.toJSON(),
          file_url: fileUrl,
        };
      })
    );

    return filesWithUrls;
  } catch (error) {
    throw error;
  }
};

export const getFileByIdService = async (id: any) => {
  try {
    const file = await File.findByPk(id);
    if (!file) {
      throw new Error("File not found");
    }

    const fileUrl = await getFileUrlFromS3(file.file_url);

    return {
      ...file.toJSON(),
      file_url: fileUrl,
    };
  } catch (error) {
    throw error;
  }
};

export const getFileByDocBoxIdService = async (docbox_id: any) => {
  try {
    const files = await File.findAll({
      where: { doc_box: docbox_id, deleted_at: null as any },
    });
    if (!files) {
      throw new Error("Files not found");
    }

    const filesWithUrls = await Promise.all(
      files.map(async (file) => {
        const fileUrl = await getFileUrlFromS3(file.file_url);
        return {
          ...file.toJSON(),
          file_url: fileUrl,
        };
      })
    );

    return filesWithUrls;
  } catch (error) {
    throw error;
  }
};

export const updateFileService = async (
  id: any,
  updateData: any,
  userData: any
) => {
  try {
    const file = await File.findByPk(id);
    if (!file) {
      throw new Error("File not found");
    }
    await file.update({ updated_by: userData.userId, ...updateData });

    const fileUrl = await getFileUrlFromS3(file.file_url);

    return {
      ...file.toJSON(),
      file_url: fileUrl,
    };
  } catch (error) {
    throw error;
  }
};

export const deleteFileService = async (id: any, userData: any) => {
  try {
    const file = await File.findByPk(id);
    if (!file) {
      throw new Error("File not found");
    }
    await file.update({ deleted_by: userData.userId });
    await file.destroy();
    await sendEmail({
      userMails: [process.env.AdminEmail],
      subject: `file deleted`,
      text: `a file - ${file.name} was deleted in docbox - ${file.doc_box} by user - ${userData.userId}`,
    });
    return { message: "File deleted successfully" };
  } catch (error) {
    throw error;
  }
};
