// guidreportrsc.controller.js
import { insertData, selectAllData ,updateChangeStatus} from "../../../Database/models/guidreportrscdata_models.js";
import { upload } from "../../middleware/fileUpload.js";

// وظيفة لحفظ البيانات
const saveData = async (req, res) => {
    upload(req, res, async (err) => {
        if (err) {
            return res.status(500).json({ error: 'Error uploading files', details: err });
        }

        const formData = req.body;
        const files = req.files;

        // إدراج البيانات باستخدام الـ model
        const result = await insertData(formData, files);

        if (result.success) {
            res.status(200).json({ message: result.message, files });
        } else {
            res.status(500).json({ error: result.error, details: result.details });
        }
    });
};

// عرض البيانات
const getAllData = async (req, res) => {
    try {
      const allData = await selectAllData();
      res.status(200).json(allData);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching data', error: error.message });
    }
};

const updateStatus = async (req, res) => {
    const { requestnumber } = req.body;

    if (!requestnumber) {
        return res.status(400).json({ error: 'Request number is required.' });
    }

    const result = await updateChangeStatus(requestnumber);

    if (result.success) {
        res.status(200).json({ 
            message: result.message,
            updatedData: result.updatedRow // إرجاع البيانات المحدثة
        });
    } else {
        res.status(500).json({ error: result.error, details: result.details });
    }
};

export { saveData, getAllData , updateStatus};