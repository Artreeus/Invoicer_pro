import { v2 as cloudinary } from 'cloudinary';

const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
const apiKey = process.env.CLOUDINARY_API_KEY;
const apiSecret = process.env.CLOUDINARY_API_SECRET;

cloudinary.config({
  cloud_name: cloudName,
  api_key: apiKey,
  api_secret: apiSecret,
});

export const cloudinaryConfigured = Boolean(cloudName && apiKey && apiSecret);

// Build the params a browser needs to upload directly to Cloudinary. The
// signature is computed server-side with the API secret, which never leaves here.
export function signUpload(folder) {
  const timestamp = Math.round(Date.now() / 1000);
  const signature = cloudinary.utils.api_sign_request({ timestamp, folder }, apiSecret);
  return { cloudName, apiKey, timestamp, folder, signature };
}

export { cloudinary };
