import express from 'express';
import cors from "cors";
import simpleGit from "simple-git";
import {generate} from "./utils";
import path from 'path';
import { getAllFiles } from './file';
import { uploadFile } from './aws';
import { createClient } from "redis";
import * as util from 'util';


const publisher = createClient();
publisher.connect();

const subscriber = createClient();
subscriber.connect();

const app = express();
app.use(cors());
app.use(express.json());

app.post("/deploy", async (req, res) => {
    const repoUrl = req.body.repoUrl;
    const id = generate();
    await simpleGit().clone(repoUrl, path.join(__dirname, `output/${id}`));
    const files = getAllFiles(path.join(__dirname, `output/${id}`));
    // uploading all files to S3
    // elements of file will be similar to users/aryanpandey/work/projects/starloom/output/1j34s/src/App.jsx 
    
    files.forEach(async file => {
        //  uploadFile(clean argurment(file path), localFilePath)
        await uploadFile(file.slice(__dirname.length + 1), file);
    });

    // you have to promisify the above function, here were are just introducing a time delay as an alternate solution 
    await new Promise((resolve) => setTimeout(resolve, 5000));

    publisher.lPush("vercel-build-queue", id);
    
    // store the current video id’s status as uploaded
    publisher.hSet("status", id, "uploaded");

    res.json({
        id: id,
    });

    app.get("/status", async (req, res) => {
        const id = req.query.id;
        const response = await subscriber.hGet("status", id as string);
        res.json({
            status : response
        })
    })   
})
app.listen(3000); 