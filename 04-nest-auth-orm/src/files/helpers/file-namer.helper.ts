import { v4 as generateUUID } from 'uuid';

export const fileNamer = (
  req: Express.Request,
  file: Express.Multer.File,
  cb: (error: Error | null, filename: string) => void,
) => {
  if (!file) {
    return cb(new Error('File is not provided'), '');
  }

  const ext = file.originalname.split('.').pop();
  const fileName = `${generateUUID()}.${ext}`;

  cb(null, fileName);
};
