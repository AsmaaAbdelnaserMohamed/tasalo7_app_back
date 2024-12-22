// guidreportrscdata_routes.js

import express from "express";
import { saveData, updateStatus } from "./guidreportrsc.controller.js";
import { upload } from "../../middleware/fileUpload.js";
import authenticateToken from "../../middleware/auth.middleware.js";


const router = express.Router();

router.post('/api/saveData', authenticateToken, saveData);

router.post('/api/uploadImage', upload, (req, res) => {
    res.json({ success: true, message: 'successful for uploaded files!' });
});

router.put('/api/updateStatus', authenticateToken, updateStatus);


export default router;