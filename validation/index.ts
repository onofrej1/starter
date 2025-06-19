import { z } from "zod";

const many2many = z
  .array(z.object({ value: z.number(), label: z.string() }))
  .transform((arr) => {
    return arr.map((v) => v.value);
  })
  .optional()
  .default([]);

const richText = z
  .object({ type: z.string(), content: z.array(z.any()) })
  .transform((obj) => {
    return JSON.stringify(obj);
  });

const stringValue = z.string().trim().min(1);
const numberValue = z.coerce.number();
const dateValue = z.coerce.date();

export const RegisterUser = z.object({
  firstName: stringValue,
  lastName: stringValue,
  email: z.string().email(),
  password: stringValue,
});

export const LoginUser = z.object({
  email: z.string().email(),
  password: z.string().min(2),
});

export const CreateCategory = z.object({
  id: z.number().optional(),
  name: stringValue,
});

export const CreateTag = z.object({
  id: z.number().optional(),
  title: stringValue,
});

export const CreatePost = z.object({
  id: z.number().optional(),
  title: stringValue,
  //status: stringValue,
  //content: richText,
  //authorId: stringValue,
  //categories: many2many,
  //tags: many2many,
  cover: stringValue,
  categoryId: stringValue,
  //cover: z.record(z.string(), z.any()).optional(), //z.string().optional().nullable(),
});

export const ContactForm = z.object({
  name: stringValue,
  email: z.string().email(),
  message: stringValue,
});

export const ResetPasswordRequest = z.object({
  email: z.string().email(),
});

export const ResetPassword = z.object({
  password: z.string().email(),
});

export const ChangePassword = z.object({
  password: stringValue,
  confirmPassword: stringValue,
});

export type Rules =
  | typeof RegisterUser
  | typeof LoginUser
  | typeof ChangePassword
  | typeof CreatePost
  | typeof CreateCategory
  | typeof CreateTag
  | typeof ResetPasswordRequest
  | typeof ContactForm
  | typeof ResetPassword

export type RegisterUserType = z.infer<typeof RegisterUser>;
export type LoginUserType = z.infer<typeof LoginUser>;
export type ChangePasswordType = z.infer<typeof ChangePassword>;
export type CreatePostType = z.infer<typeof CreatePost>;
export type CreateCategoryType = z.infer<typeof CreateCategory>;
export type CreateTagType = z.infer<typeof CreateTag>;
export type ResetPasswordRequestType = z.infer<typeof ResetPasswordRequest>;
export type ContactFormType = z.infer<typeof ContactForm>;
export type ResetPasswordType = z.infer<typeof ResetPassword>;
