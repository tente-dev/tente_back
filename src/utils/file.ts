import {Request} from '@loopback/rest';
import multer from 'multer';
import path from 'path';
import {File} from '../models';
import {FileRepository} from '../repositories';

const FILES_DOMAIN =
  (process.env.FILES_DOMAIN as string) ?? '';

console.log('FILES_DOMAIN', FILES_DOMAIN);

export const UPLOADS_FOLDER = '/uploads';

export const UPLOADS_DESTINATION = path.join(
  __dirname,
  `../..${UPLOADS_FOLDER}`,
);

export const multerOptions: multer.Options = {
  storage: multer.diskStorage({
    destination: UPLOADS_DESTINATION,
    // Use the original file name as is
    filename: (req, file, cb) => {
      cb(null, getFileName(req, file));
    },
  }),
};

export const getFileName = (req: Request, file: Express.Multer.File) => {
  return (
    Date.now() +
    '.' +
    file.originalname.slice(
      ((file.originalname.lastIndexOf('.') - 1) >>> 0) + 2,
    )
  );
};

type Resolve = (value: object | PromiseLike<object>) => void;

type Reject = (reason?: object) => void;

export const errorHandler = (
  err: unknown,
  resolve: Resolve,
  reject: Reject,
  request: Request,
) => {
  if (err) reject(err);
  else {
    resolve(getFilesAndFields(request));
  }
};

export const getFilesAndFields = (request: Request) => {
  const uploadedFiles = request.files;
  const mapper = (f: globalThis.Express.Multer.File) => ({
    fieldname: f.fieldname,
    originalname: f.originalname,
    filename: f.filename,
    encoding: f.encoding,
    mimetype: f.mimetype,
    size: f.size,
  });
  let files: object[] = [];
  if (Array.isArray(uploadedFiles)) {
    files = uploadedFiles.map(mapper);
  } else {
    for (const filename in uploadedFiles) {
      files.push(...uploadedFiles[filename].map(mapper));
    }
  }
  return {files, fields: request.body};
};

export const createFile = async (
  request: Request,
  file: globalThis.Express.Multer.File,
  uploadedBy: number,
  fileRepository: FileRepository,
) => {
  const filePath = `${FILES_DOMAIN}${UPLOADS_FOLDER}/${file.filename}`;
  const name = file.originalname;
  const type = file.mimetype;
  const fileRequest: Omit<File, 'id'> = {
    name,
    path: filePath,
    type,
    uploadedBy,
  };
  const createdFile = await fileRepository.create(fileRequest);
  return createdFile;
};
