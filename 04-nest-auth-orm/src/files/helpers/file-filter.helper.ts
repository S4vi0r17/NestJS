export const fileFilter = (
  req: Express.Request,
  file: Express.Multer.File,
  cb: (error: Error | null, acceptFile: boolean) => void,
) => {
  if (!file) {
    return cb(new Error('File is not provided'), false);
  }

  const fileExtension = file.mimetype.split('/')[1];
  const allowedExtensions = ['png', 'jpg', 'jpeg', 'gif'];
  const isValidExtension = allowedExtensions.includes(fileExtension);

  if (!isValidExtension) {
    return cb(new Error('Invalid file type'), false);
  }

  cb(null, true);
};
