import { z } from "zod";

export function isFile(input: unknown): input is File {
  return input instanceof File;
}
export const imageFile = z
  .unknown()
  .refine(isFile, "Must be a file")
  .nullable()
  .default(null);
