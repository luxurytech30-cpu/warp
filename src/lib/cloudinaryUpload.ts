// src/lib/cloudinaryUpload.ts
import { getUploadSignature } from "./api";

export async function uploadProductImageSigned(file: File) {
  const sig = await getUploadSignature();

  const form = new FormData();
  form.append("file", file);
  form.append("api_key", sig.apiKey);
  form.append("timestamp", String(sig.timestamp));
  form.append("signature", sig.signature);
  form.append("folder", sig.folder);

  const res = await fetch(
    `https://api.cloudinary.com/v1_1/${sig.cloudName}/image/upload`,
    { method: "POST", body: form }
  );

  const data = await res.json();
  if (!res.ok) throw new Error(data?.error?.message || "Upload failed");

  return data.secure_url as string; // save this in Product.image
}
