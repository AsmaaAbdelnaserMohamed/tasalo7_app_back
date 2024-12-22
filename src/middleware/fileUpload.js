// fileUpload.js file 

import multer from "multer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from 'url';
import moment from "moment";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const mo3aina_number = req.body['mo3aina_number'];
        if (!mo3aina_number) {
            return cb(new Error('mo3aina_number is required'));
        }
        // \\192.168.129.82\images  --------->laptop work edge-pro
        //  \\10.100.102.86\images  --------->laptop work msd
        // \\192.168.1.96\images
        // Network path with path.join for cross-platform compatibility
        const dir = path.join('\\\\192.168.1.96\\images', mo3aina_number);

        // Check if directory exists, if not create it
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }

        cb(null, dir);
    },
    filename: (req, file, cb) => {
        const mo3aina_number = req.body['mo3aina_number'];
        if (!mo3aina_number) {
            return cb(new Error('mo3aina_number is required'));
        }

        const dateTime = moment().format('YYYY-MM-DD-h-mm-ss A');
        let newFileName;

        switch (file.fieldname) {
            case 'images_path':
                newFileName = `img-${mo3aina_number}-${dateTime}${path.extname(file.originalname)}`;
                break;
            case 'signature_surveyor_path':
                newFileName = `S-${mo3aina_number}-${dateTime}${path.extname(file.originalname)}`;
                break;

            default:
                newFileName = `${mo3aina_number}-${dateTime}${path.extname(file.originalname)}`;
        }
        cb(null, newFileName);
    }
});

// Middleware for file uploads
const upload = multer({ storage: storage }).fields([
    { name: 'images_path', maxCount: 1 },
    { name: 'signature_surveyor_path', maxCount: 1 }
]);

// Middleware for handling non-file form data
const uploadNone = multer().none();

export { upload, uploadNone };