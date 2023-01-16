var jwt = require('jsonwebtoken');
const { getLaporan } = require('../model/ralan');
module.exports = {
    getRegLaporan: async (req, res) => {
        const secretKey = process.env.JWT_SECRET_KEY;
        try {
            const { from, until, jk, golongan } = req.body;
            // console.log(jk+", g: "+golongan);
             let data = await getLaporan(from, until, jk, golongan);
             return res.status(200).json({
            error: false,
            message: 'Laporan Rawat Jalan',
            record: data.length,
            data: data
        });
        } catch (error) {
            return res.status(404).json({
                error: true,
                message: 'Masukan tanggal awal dan akhir',
                // record: data.length,
                data: "from, until",
            });
        }
    },
}