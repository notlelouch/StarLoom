import express from 'express';
import { S3 } from 'aws-sdk';
import dotenv from "dotenv";

dotenv.config();

const s3: S3 = new S3({
    accessKeyId: process.env.ACCESS_KEY_ID,
    secretAccessKey: process.env.SECRET_ACCESS_KEY,
    endpoint: process.env.ENDPOINT
});


const app = express();

// "/*" means irrespective of what request is coming, it will hit this callback
app.get('/*', async (req, res) => {
    // eg host: id.starloom.com
    const host = req.hostname;
    const id = host.split(".")[0];
    const filePath = req.path;

    const contents = await s3.getObject({
        Bucket: "vercel",
        Key: `dist/${id}${filePath}`
    }).promise();

    const type = filePath.endsWith("html") ? "text/html" : filePath.endsWith("css") ? "text/css" : "application/javascript"
    res.set("Content-Type", type);

    res.send(contents.Body);

})
 
app.listen(3001);
