// guidreportrscdata_models.js

import { client } from "../db_connection.js";
import { format } from 'date-fns';

const insertData = async (formData, files) => {


    // تحويل التاريخ إلى التنسيق المناسب
    function parseDate(input) {
        const [day, month, year] = input.split('-'); // تقسيم التاريخ بالتنسيق DD-MM-YYYY
        return new Date(`${year}-${month}-${day}`); // إعادة تنسيقه إلى YYYY-MM-DD
    }

    const formattedDate = formData.addeddate
        ? format(parseDate(formData.addeddate), 'yyyy-MM-dd')
        : null;

    // الحصول على مسارات الملفات
    const cameraImagePath = files && files['images_path'] ? files['images_path'][0].path : null;
    const surveyorSignaturePath = files && files['signature_surveyor_path'] ? files['signature_surveyor_path'][0].path : null;

    const query = `
    INSERT INTO tasalo7data (
        mo3aina_number,
        requester_name,
        phonenumber,
        gov,
        detailed_address,
        address_by_coordinate,
        latitude,
        longitude,
        middle_building_latitude,
        middle_building_longitude,
        height_building,
        height_building_roof,
        height_building_top_point,
        description_according_heights,
        description_building,
        surveyor_name,
        surveyor_nationalid,
        geha_name,
        used_tools,
        addeddate,
        notes,
        x_coordinate,
        y_coordinate,
        signature_surveyor_path,
        images_path
    ) VALUES (
        $1, 
        $2,
        $3, 
        $4, 
        $5, 
        $6, 
        $7, 
        $8, 
        $9, 
        $10, 
        $11, 
        $12, 
        $13, 
        $14, 
        $15, 
        $16, 
        $17, 
        $18, 
        $19, 
        $20,
        $21,
        $22,
        $23,
        $24,
        $25
    )
    `;

    const values = [
        formData.mo3aina_number,
        formData.requester_name,
        formData.phonenumber,
        formData.gov,
        formData.detailed_address,
        formData.address_by_coordinate,
        formData.latitude ? parseFloat(formData.latitude) : null,
        formData.longitude ? parseFloat(formData.longitude) : null,
        formData.middle_building_latitude ? parseFloat(formData.middle_building_latitude) : null,
        formData.middle_building_longitude ? parseFloat(formData.middle_building_longitude) : null,
        formData.height_building ? parseFloat(formData.height_building) : null,
        formData.height_building_roof ? parseFloat(formData.height_building_roof) : null,
        formData.height_building_top_point ? parseFloat(formData.height_building_top_point) : null,
        formData.description_according_heights,
        formData.description_building,
        formData.surveyor_name,
        formData.surveyor_nationalid,
        formData.geha_name,
        formData.used_tools,
        formattedDate,
        formData.notes,
        formData.x_coordinate,
        formData.y_coordinate,
        surveyorSignaturePath,
        cameraImagePath
    ];

    try {
        await client.query(query, values);
        return { success: true, message: 'Data and files uploaded successfully' };
    } catch (err) {
        console.error('Error inserting data:', err);
        return { success: false, error: 'Error inserting data', details: err };
    }
};

//GET ALL DATA FUNCTION
const selectAllData = async () => {
    try {
        const query = 'SELECT * FROM guidreportrscdata';
        const result = await client.query(query);
        return result.rows;
    } catch (error) {
        console.error('Error fetching data:', error);
        throw error;
    }
};

//Update ChangeStatus FUNCTION
const updateChangeStatus = async (requestNumber) => {
    const query = `
        UPDATE public.cert_data
        SET change_status_id = 3
        WHERE requestnumber = $1
        RETURNING *;
    `; // استخدام RETURNING لإعادة الصفوف التي تم تحديثها
    try {
        const result = await client.query(query, [requestNumber]);
        return { success: true, message: 'Change status updated successfully.', updatedRow: result.rows[0] };
    } catch (err) {
        console.error('Error updating change status:', err);
        return { success: false, error: 'Error updating change status', details: err };
    }
};


export { insertData, selectAllData, updateChangeStatus };

