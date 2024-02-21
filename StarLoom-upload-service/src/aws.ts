import { S3 } from "aws-sdk";
import fs from "fs";
import dotenv from "dotenv";

dotenv.config();

const s3: S3 = new S3({
    accessKeyId: process.env.ACCESS_KEY_ID,
    secretAccessKey: process.env.SECRET_ACCESS_KEY,
    endpoint: process.env.ENDPOINT
});


// fileName:  output/1j34s/src/App.jsx
// filePath: users/aryanpandey/work/projects/starloom/output/1j34s/src/App.jsx
export const uploadFile = async (fileName: string, localFilePath: string) => {
    console.log("Uploading");
    const fileContent = fs.readFileSync(localFilePath);
    const response = await s3.upload({
        Body: fileContent,
        Bucket: "vercel",
        Key: fileName,
    }).promise();
    console.log(response);
}