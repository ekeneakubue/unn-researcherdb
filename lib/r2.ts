import "server-only";

import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { randomUUID } from "node:crypto";

/**
 * Required env:
 * R2_ACCOUNT_ID, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY,
 * R2_BUCKET_NAME, R2_PUBLIC_URL
 */

export const R2_FOLDERS = {
  researchDocuments: "research-documents",
  equipmentPhotos: "equipment-photos",
  profileImages: "profile-images",
} as const;

export const IMAGE_MIME_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
] as const;

export const DOCUMENT_MIME_TYPES = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
] as const;

export const IMAGE_MAX_BYTES = 5 * 1024 * 1024;
export const DOCUMENT_MAX_BYTES = 15 * 1024 * 1024;

export type UploadPublicFileInput = {
  file: File;
  folder: string;
  allowedMimeTypes: readonly string[];
  maxBytes: number;
};

export type UploadedPublicFile = {
  key: string;
  url: string;
  name: string;
  contentType: string;
  size: number;
};

function requireEnv(name: string): string {
  const value = process.env[name]?.trim();
  if (!value) {
    throw new Error(`Missing ${name} for Cloudflare R2 uploads.`);
  }
  return value;
}

function getR2Client() {
  const accountId = requireEnv("R2_ACCOUNT_ID");
  return new S3Client({
    region: "auto",
    endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
    credentials: {
      accessKeyId: requireEnv("R2_ACCESS_KEY_ID"),
      secretAccessKey: requireEnv("R2_SECRET_ACCESS_KEY"),
    },
  });
}

function publicBaseUrl() {
  return requireEnv("R2_PUBLIC_URL").replace(/\/+$/, "");
}

function safeFilename(name: string) {
  const base = name.split(/[/\\]/).pop() ?? "file";
  return base.replace(/[^a-zA-Z0-9._-]+/g, "-").replace(/-+/g, "-").slice(0, 120) || "file";
}

export async function uploadPublicFile(
  input: UploadPublicFileInput,
): Promise<UploadedPublicFile> {
  const { file, folder, allowedMimeTypes, maxBytes } = input;

  if (!(file instanceof File) || file.size <= 0) {
    throw new Error("Choose a file to upload.");
  }
  if (file.size > maxBytes) {
    const mb = Math.round(maxBytes / (1024 * 1024));
    throw new Error(`File is too large. Maximum size is ${mb}MB.`);
  }
  if (!allowedMimeTypes.includes(file.type)) {
    throw new Error("This file type is not allowed.");
  }

  const year = new Date().getUTCFullYear();
  const key = `${folder}/${year}/${randomUUID()}-${safeFilename(file.name)}`;
  const body = Buffer.from(await file.arrayBuffer());

  await getR2Client().send(
    new PutObjectCommand({
      Bucket: requireEnv("R2_BUCKET_NAME"),
      Key: key,
      Body: body,
      ContentType: file.type,
    }),
  );

  return {
    key,
    url: `${publicBaseUrl()}/${key}`,
    name: file.name,
    contentType: file.type,
    size: file.size,
  };
}

export async function uploadResearchDocument(file: File) {
  return uploadPublicFile({
    file,
    folder: R2_FOLDERS.researchDocuments,
    allowedMimeTypes: DOCUMENT_MIME_TYPES,
    maxBytes: DOCUMENT_MAX_BYTES,
  });
}

export async function uploadEquipmentPhoto(file: File) {
  return uploadPublicFile({
    file,
    folder: R2_FOLDERS.equipmentPhotos,
    allowedMimeTypes: IMAGE_MIME_TYPES,
    maxBytes: IMAGE_MAX_BYTES,
  });
}

export async function uploadProfileImage(file: File) {
  return uploadPublicFile({
    file,
    folder: R2_FOLDERS.profileImages,
    allowedMimeTypes: IMAGE_MIME_TYPES,
    maxBytes: IMAGE_MAX_BYTES,
  });
}
