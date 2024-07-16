import { CardTitle, CardDescription, CardHeader, CardContent, Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import axios from "axios";
import React from "react";
import { WavyBackground } from "./ui/wavy-background";

const BACKEND_UPLOAD_URL = "http://localhost:3000";

export function Landing() {
  const [repoUrl, setRepoUrl] = useState("");
  const [uploadId, setUploadId] = useState("");
  const [uploading, setUploading] = useState(false);
  const [deployed, setDeployed] = useState(false);

  return (
    <WavyBackground className="max-w-4xl mx-auto pb-40">
      <p className="text-2xl md:text-4xl lg:text-7xl text-white font-bold inter-var text-center">
        Hero waves are cool
      </p>
      <p className="text-base md:text-lg mt-4 text-white font-normal inter-var text-center">
        Leverage the power of canvas to create a beautiful hero section
      </p>
      <main className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-black to-grey p-4">
        
        <Card className="w-full max-w-md bg-white shadow-lg rounded-lg">
          <CardHeader>
            <CardTitle className="text-3xl text-gray-800 font-semibold">Deploy your GitHub Repository</CardTitle>
            <CardDescription className="text-gray-600">Enter the URL of your GitHub repository to deploy it</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="github-url" className="text-gray-600">GitHub Repository URL</Label>
                <Input 
                  id="github-url"
                  onChange={(e) => {
                    setRepoUrl(e.target.value);
                  }} 
                  placeholder="https://github.com/username/repo" 
                />
              </div>
              <Button onClick={async () => {
                setUploading(true);
                const res = await axios.post(`${BACKEND_UPLOAD_URL}/deploy`, {
                  repoUrl: repoUrl
                });
                setUploadId(res.data.id);
                setUploading(false);
                const interval = setInterval(async () => {
                  const response = await axios.get(`${BACKEND_UPLOAD_URL}/status?id=${res.data.id}`);

                  if (response.data.status === "deployed") {
                    clearInterval(interval);
                    setDeployed(true);
                  }
                }, 3000)
              }} disabled={uploadId !== "" || uploading} className="w-full" type="submit">
                {uploadId ? `Deploying (${uploadId})` : uploading ? "Uploading..." : "Upload"}
              </Button>
            </div>
          </CardContent>
        </Card>
        {deployed && <Card className="w-full max-w-md mt-8 bg-white shadow-lg rounded-lg">
          <CardHeader>
            <CardTitle className="text-3xl text-gray-800 font-semibold">Deployment Status</CardTitle>
            <CardDescription className="text-gray-600">Your website is successfully deployed!</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Label htmlFor="deployed-url" className="text-gray-600">Deployed URL</Label>
              <Input id="deployed-url" readOnly type="url" value={`http://${uploadId}.starloom.com:3001/index.html`} />
            </div>
            <br />
            <Button className="w-full" variant="outline">
              <a href={`http://${uploadId}.starloom.com:3001/index.html`} target="_blank">
                Visit Website
              </a>
            </Button>
          </CardContent>
        </Card>}
      </main>
    </WavyBackground>  
  );
}
