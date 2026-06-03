import { api } from './api';

interface UploadSignature {
  cloudName: string;
  apiKey: string;
  timestamp: number;
  folder: string;
  signature: string;
}

// Upload an image directly to Cloudinary using a signature minted by our backend
// (the API secret never reaches the browser). Returns the hosted secure URL.
export async function uploadImage(file: File): Promise<string> {
  const sig = await api.post<UploadSignature>('/uploads/signature', {});

  const form = new FormData();
  form.append('file', file);
  form.append('api_key', sig.apiKey);
  form.append('timestamp', String(sig.timestamp));
  form.append('folder', sig.folder);
  form.append('signature', sig.signature);

  const res = await fetch(
    `https://api.cloudinary.com/v1_1/${sig.cloudName}/image/upload`,
    { method: 'POST', body: form }
  );

  if (!res.ok) {
    let message = 'Upload failed';
    try {
      const body = await res.json();
      message = body?.error?.message ?? message;
    } catch {
      // no JSON body
    }
    throw new Error(message);
  }

  const data = (await res.json()) as { secure_url: string };
  return data.secure_url;
}
