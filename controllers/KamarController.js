var jwt = require('jsonwebtoken');
const { getKamarKosong, getKamarKelasKosong } = require('../model/kamar');
module.exports = {
    getKamar: async (req, res) => {
        const secretKey = process.env.JWT_SECRET_KEY;
        try {
            // const { from, until, } = req.body;
            let data = await getKamarKosong();
            console.log(data);
            return res.status(200).json({
                error: false,
                message: 'list kamar tersedia',
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
    getkelasKosong: async (req, res) => {
        const secretKey = process.env.JWT_SECRET_KEY;
        try {
            const { bangsal } = req.body;
            let data = await getKamarKelasKosong(bangsal);
            console.log(data);
            return res.status(200).json({
                error: false,
                message: 'list kelas yang tersedia',
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