import { Request } from 'express';
// import multer from 'multer';
import { v4 as uuid } from 'uuid';

export const fileNamer = (
  req: Request,
  file: Express.Multer.File,
  //   callback: multer.FileFilterCallback,
  callback: Function,
) => {
  if (!file) return callback(new Error('No file provided'), false);

  const fileExtension = file.originalname.split('.').pop();

  const fileName = `${uuid()}.${fileExtension}`;

  callback(null, fileName);
};
