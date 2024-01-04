import "../../init";
import React from "react";
import { InboxOutlined } from "@ant-design/icons";
// import type { UploadProps } from "antd";
import { message, Upload, Button } from "antd";
import { UploadFile, UploadProps } from "antd/lib/upload/interface";

import AWS from "aws-sdk";
import { useState } from "react";

interface UploadFileProps {
  // onUploadSuccess: (fileName: string) => void;
  onUploadComplete: (fileUrls: string[]) => void;
}

const { Dragger } = Upload;

const UploadUserFile: React.FC<UploadFileProps> = ({ onUploadComplete }) => {
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [, setUploadedFileUrls] = useState<string[]>([]);

  // S3 Configuration
  const S3_BUCKET = import.meta.env.VITE_AWS_S3_BUCKET;
  const REGION = import.meta.env.VITE_AWS_REGION;
  const s3BaseUrl = `https://${S3_BUCKET}.s3.${REGION}.amazonaws.com`;

  AWS.config.update({
    accessKeyId: import.meta.env.VITE_AWS_ACCESS_KEY,
    secretAccessKey: import.meta.env.VITE_AWS_SECRET_KEY,
  });
  const s3 = new AWS.S3({
    region: REGION,
  });

  // Function to upload file to S3
  const uploadToS3 = (file: any, onUpload: (url: string) => void) => {
    const params = {
      Bucket: S3_BUCKET,
      Key: file.name,
      Body: file,
    };

    s3.upload(params, (err: any) => {
      if (err) {
        console.error("Error uploading file to cloud: ", err);
        message.error(`${file.name} file upload to cloud failed.`);
      } else {
        const fileUrl = `${s3BaseUrl}/${encodeURIComponent(file.name)}`;
        onUpload(fileUrl);
        message.success(`${file.name} file uploaded successfully to cloud.`);
      }
    });
  };

  const handleUpload = async () => {
    let uploadedUrls: string[] = [];
    let uploadCount = 0;

    const onSingleUploadComplete = (url: string) => {
      uploadedUrls.push(url);
      uploadCount++;

      if (uploadCount === fileList.length) {
        setUploadedFileUrls(uploadedUrls);
        onUploadComplete(uploadedUrls);
      }
    };

    fileList.forEach((file) => uploadToS3(file, onSingleUploadComplete));
  };

  const props: UploadProps = {
    name: "file",
    multiple: true,
    beforeUpload: (file: any) => {
      setFileList((prevList) => [...prevList, file]);
      console.log(fileList);
      return false;
    },
    onRemove: (file: any) => {
      setFileList((prevList) =>
        prevList.filter((item) => item.uid !== file.uid),
      );
      setUploadedFileUrls((prevUrls) =>
        prevUrls.filter((url) => !url.includes(file.name)),
      );
    },
    fileList,
  };

  return (
    <div>
      <Dragger {...props}>
        <p className="ant-upload-drag-icon">
          <InboxOutlined />
        </p>
        <p className="ant-upload-text">
          Click or drag file to this area to upload
        </p>
      </Dragger>

      <Button
        type="primary"
        onClick={handleUpload}
        disabled={!fileList.length}
        style={{ marginTop: 16 }}
      >
        Upload to Cloud
      </Button>
    </div>
  );
};
export default UploadUserFile;
