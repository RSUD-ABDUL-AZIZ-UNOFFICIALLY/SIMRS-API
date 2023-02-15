var jwt = require('jsonwebtoken');
const { getLaporan } = require('../model/ranap');
module.exports = {
    getRegLaporan: async (req, res) => {
        const secretKey = process.env.JWT_SECRET_KEY;
        try {
            const { from, until, kfrom, kuntil, jk, golongan } = req.body;
        let data = await getLaporan(from, until, kfrom, kuntil, jk, golongan);
       return res.status(200).json({
            error: false,
            message: 'Laporan Rawat Inap',
            record: data.length,
            data: data
        });
        } catch (error) {
            return res.status(404).json({
                error: true,
                message: error,
                // record: data.length,
                // data: "from, until",
            });
        }
    },
}