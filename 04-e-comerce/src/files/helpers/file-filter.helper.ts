import { Request } from 'express';
// import multer from 'multer';

export const fileFilter = (
  req: Request,
  file: Express.Multer.File,
  //   callback: multer.FileFilterCallback,
  callback: Function,
) => {
  if (!file) return callback(new Error('No file provided'), false);

  const fileExtension = file.originalname.split('.').pop();
  const allowedExtensions = ['jpg', 'jpeg', 'png', 'gif'];

  if (!allowedExtensions.includes(fileExtension)) {
    return callback(new Error('File type not allowed'), false);
  }

  callback(null, true);
};
