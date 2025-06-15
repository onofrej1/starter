import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function random(list: unknown[]) {
  return list[Math.floor(Math.random() * list.length)];
}

function isErrorWithMessage(error: unknown): error is ErrorWithMessage {
  return (
    typeof error === "object" &&
    error !== null &&
    "message" in error &&
    typeof (error as Record<string, unknown>).message === "string"
  );
}

export function getErrorMessage(error: unknown) {
  return toErrorWithMessage(error).message;
}

type ErrorWithMessage = {
  message: string;
};

export function parseJson(json: string, defaultData = {}) {
  try { 
    return JSON.parse(json);
  } catch {
    return defaultData;
  }
}

function toErrorWithMessage(maybeError: unknown): ErrorWithMessage {
  if (isErrorWithMessage(maybeError)) return maybeError;

  try {
    return new Error(JSON.stringify(maybeError));
  } catch {
    // fallback in case there's an error stringifying the maybeError
    // like with circular references for example.
    return new Error(String(maybeError));
  }
}

export function generateVideoThumbnail(file: File): Promise<string> {
  return new Promise((resolve) => {
    const canvas = document.createElement("canvas");
    const video = document.createElement("video");

    // this is important
    video.autoplay = true;
    video.muted = true;
    video.src = URL.createObjectURL(file);

    video.onloadeddata = () => {
      const ctx = canvas.getContext("2d");

      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      ctx?.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);
      video.pause();
      return resolve(canvas.toDataURL("image/png"));
    };
  });
}

export const formatFileSize = (fileSize: number) => {
  let size = Math.abs(fileSize);

  if (Number.isNaN(size)) {
    return "Invalid file size";
  }

  if (size === 0) {
    return "0 bytes";
  }

  const units = ["bytes", "kB", "MB", "GB", "TB"];
  let quotient = Math.floor(Math.log10(size) / 3);
  quotient = quotient < units.length ? quotient : units.length - 1;
  size /= 1000 ** quotient;

  return `${+size.toFixed(2)} ${units[quotient]}`;
};

export async function urlToFile(
  url: string,
  filename: string,
  mimeType: "image/png"
) {
  const response = await fetch(url);
  const buffer = await response.arrayBuffer();
  return new File([buffer], filename, { type: mimeType });
}

