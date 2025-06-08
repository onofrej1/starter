"use server";

import path from "node:path";

import fs from 'node:fs';
const fsp = fs.promises;

const baseUploadDir = process.env.UPLOAD_DIR!;

export async function uploadFiles(formData: FormData, uploadDir: string | Record<string, string> = '') {
  const keys = Array.from(formData.keys());

  for (let i = 0; i < Number(keys.length); i++) {
    const file = formData.get(keys[i]) as File;

    /*if (!file || file.name === 'img4.jpg') {
      throw new Error("Missing file data:" + keys[i]);
    }*/

    const dir = typeof uploadDir === 'string' ? uploadDir : uploadDir?.[keys[i]];
    const targetPath = path.join(process.cwd(), baseUploadDir, dir);

    try {
      fs.mkdirSync(targetPath, { recursive: true });
      const filePath = path.join(targetPath, file.name);

      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      fs.writeFileSync(filePath, buffer);
    } catch (error) {
      console.log(error);
      return { status: 'error' };
    }
  }
  return { status: "success" };
}

export async function deleteFile(filePath: string) {
  const file = path.join(process.cwd(), baseUploadDir, filePath);
  if (!fs.existsSync(file)) {
    return { success: false, message: `File ${file} does not exists.`};
  }
  const fileToDelete = await fsp.readFile(file);
  if (fileToDelete) {
    await fsp.unlink(file);
  }
  return { success: true };
}

export async function readDirectory(dir: string) {
  const files = await fsp.readdir(dir, { withFileTypes: true });
  const data = [];
  for (const file of files) {
    const filePath = path.join(file.path, file.name);
    const f = await fsp.readFile(filePath, {
      encoding: "base64",
    });
    data.push({
      src: f,
      name: file.name,
      path: file.path,
    });
  }
  return data;
}
