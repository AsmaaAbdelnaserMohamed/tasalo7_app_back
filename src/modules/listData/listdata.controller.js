import { getDataByUserId } from "../../../Database/models/listdata.model.js";

const getData = async (req, res) => {
    const userId = req.userId;

    // معالجة الصفحة الحالية
    const pageNumber = parseInt(req.query.currentPage, 10) || 1;
    if (pageNumber <= 0) pageNumber = 1;

    const limit = 5; // (records) لكل صفحة
    const offset = (pageNumber - 1) * limit; // حساب الإزاحة بناءً على الصفحة الحالية(skip)

    const search = req.query.search || '';

    try {
        const { data, total, filteredTotal } = await getDataByUserId(userId, search, limit, offset);

        if (data.length === 0) {
            return res.status(404).json({ message: 'لا توجد بيانات.' });
        }

        res.json({
            pagination: {
                total,
                filteredTotal,
                limit,
                offset,
                currentPage: pageNumber,
                totalPages: Math.ceil(total / limit),
                filteredTotalPages: Math.ceil(filteredTotal / limit)
            },
            data
        });
    } catch (error) {
        console.error('Error fetching data:', error.message);
        res.status(500).json({ error: 'حدث خطأ في استعلام قاعدة البيانات.' });
    }
};

export { getData };