import AWS from "aws-sdk";
import fs from "fs";

AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY,
  secretAccessKey: process.env.AWS_SECRET_KEY,
  region: process.env.AWS_REGION,
});

const s3 = new AWS.S3();
export const uploadFileToS3 = async (file: Express.Multer.File) => {
  const fileContent = fs.readFileSync(file.path);
  const params = {
    Bucket: process.env.AWS_S3_BUCKET,
    Key: `${file.originalname}`,
    Body: fileContent,
    ContentDisposition: "inline",
  } as any;

  const uploadResult = await s3.upload(params).promise();
  fs.unlinkSync(file.path);
  return uploadResult.Key;
};

export const getFileUrlFromS3 = async (fileKey: string): Promise<string> => {
  const params = {
    Bucket: process.env.AWS_S3_BUCKET,
    Key: fileKey,
  };

  try {
    const url = await s3.getSignedUrlPromise("getObject", params);

    return url;
  } catch (error) {
    console.error("Error getting file URL from S3:", error);
    throw error;
  }
};
