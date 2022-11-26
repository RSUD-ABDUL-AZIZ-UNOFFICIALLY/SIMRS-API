const { con } = require('./index.js');
var getKamarKosong = async function () {
    var sql = `
	SELECT
	bangsal.nm_bangsal, 
	COUNT(kamar.status) AS Kosong, 
	kamar.status
FROM
	kamar
	INNER JOIN
	bangsal
	ON 
		kamar.kd_bangsal = bangsal.kd_bangsal
WHERE
	kamar.statusdata = '1' AND
	kamar.status = 'KOSONG'
GROUP BY
	bangsal.nm_bangsal, 
	kamar.status
    `;
    const result = await con.query(sql, []);
    return result;
};
var getKamarKelasKosong = async function (bangsal) {
    var sql = `
	SELECT
	bangsal.nm_bangsal, 
	COUNT(kamar.status) AS Kosong, 
	kamar.status, 
	kamar.kelas
FROM
	kamar
	INNER JOIN
	bangsal
	ON 
		kamar.kd_bangsal = bangsal.kd_bangsal
WHERE
	kamar.statusdata = '1' AND
	kamar.status = 'KOSONG' AND
	bangsal.nm_bangsal = ?
GROUP BY
	bangsal.nm_bangsal, 
	kamar.status, 
	kamar.kelas
    `;
    const result = await con.query(sql, [bangsal]);
    return result;
};

module.exports = {
    getKamarKosong,
    getKamarKelasKosong
}