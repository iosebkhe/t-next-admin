import { DeleteObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { mongooseConnect } from "@/lib/mongoose";
import { isAdminRequest } from "@/pages/api/auth/[...nextauth]";

const bucketName = 'vtadmin1';

export default async function handle(req, res) {
  await mongooseConnect();
  await isAdminRequest(req, res);

  if (req.method === 'POST') {
    const { key } = req.body; // The key (filename) of the file to delete

    if (!key) {
      return res.status(400).json({ error: 'Key is required' });
    }

    const client = new S3Client({
      region: 'eu-north-1',
      credentials: {
        accessKeyId: process.env.S3_ACCESS_KEY,
        secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
      },
    });

    try {
      await client.send(new DeleteObjectCommand({
        Bucket: bucketName,
        Key: key, // The filename (key) of the object to be deleted
      }));

      return res.status(200).json({ message: 'File deleted successfully' });
    } catch (error) {
      console.error('Error deleting file:', error);
      return res.status(500).json({ error: 'Failed to delete file' });
    }
  } else {
    return res.status(405).json({ error: 'Method not allowed' });
  }
}

export const config = {
  api: { bodyParser: true },
};
