const { con } = require('./index.js');
var getLaporan = async function (from, until) {
    var sql = `
	SELECT DISTINCT
	reg_periksa.no_rawat, 
	reg_periksa.no_rkm_medis, 
	pasien.no_ktp, 
	pasien.no_peserta, 
	pasien.nm_pasien, 
	pasien.agama, 
	pasien.suku_bangsa, 
	pasien.pekerjaan, 
	pasien.pnd, 
	DATE_FORMAT(pasien.tgl_lahir, "%d-%m-%Y") AS tgl_lahir, 
	pasien.umur, 
	pasien.jk AS jk,
	pasien.alamat, 
	pasien.no_tlp, 
	kelurahan.nm_kel, 
	kecamatan.nm_kec, 
	kabupaten.nm_kab, 
	propinsi.nm_prop, 
	DATE_FORMAT(reg_periksa.tgl_registrasi, "%d-%m-%Y") AS tgl_registrasi, 
	reg_periksa.kd_poli, 
	dokter.nm_dokter, 
	DATE_FORMAT(kamar_inap.tgl_masuk, "%d-%m-%Y") AS tgl_masuk, 
	kamar_inap.jam_masuk, 
	DATE_FORMAT(kamar_inap.tgl_keluar, "%d-%m-%Y") AS tgl_keluar, 
	kamar_inap.jam_keluar, 
	kamar_inap.diagnosa_akhir, 
	kamar_inap.diagnosa_awal, 
	kamar_inap.ttl_biaya, 
	kamar_inap.stts_pulang, 
	kamar_inap.kd_kamar, 
	bangsal.nm_bangsal, 
	reg_periksa.stts_daftar AS kunjungan,
	kamar.kelas,
	poliklinik.nm_poli AS masuk_melalui, 
	suku_bangsa.nama_suku_bangsa, 
	penjab.png_jawab
FROM
	reg_periksa
	INNER JOIN
	pasien
	ON 
		reg_periksa.no_rkm_medis = pasien.no_rkm_medis
	INNER JOIN
	kelurahan
	ON 
		pasien.kd_kel = kelurahan.kd_kel
	INNER JOIN
	kecamatan
	ON 
		pasien.kd_kec = kecamatan.kd_kec
	INNER JOIN
	kabupaten
	ON 
		pasien.kd_kab = kabupaten.kd_kab
	INNER JOIN
	propinsi
	ON 
		pasien.kd_prop = propinsi.kd_prop
	INNER JOIN
	dokter
	ON 
		reg_periksa.kd_dokter = dokter.kd_dokter
	INNER JOIN
	kamar_inap
	ON 
		reg_periksa.no_rawat = kamar_inap.no_rawat
	INNER JOIN
	kamar
	ON 
		kamar_inap.kd_kamar = kamar.kd_kamar
	INNER JOIN
	bangsal
	ON 
		kamar.kd_bangsal = bangsal.kd_bangsal
	INNER JOIN
	poliklinik
	ON 
		reg_periksa.kd_poli = poliklinik.kd_poli
	INNER JOIN
	suku_bangsa
	ON 
		pasien.suku_bangsa = suku_bangsa.id
	INNER JOIN
	penjab
	ON 
		pasien.kd_pj = penjab.kd_pj AND
		reg_periksa.kd_pj = penjab.kd_pj
	WHERE
	reg_periksa.tgl_registrasi BETWEEN ? AND ? AND
	reg_periksa.status_lanjut = 'Ranap' AND
	kamar_inap.stts_pulang NOT LIKE 'Pindah Kamar'
		`;

    // const result = await con.query(sql, [from, until]);
    // return result;
	var sql2 = `
SELECT DISTINCT
	diagnosa_pasien.kd_penyakit AS kode_icd10, 
	diagnosa_pasien.no_rawat, 
	diagnosa_pasien.status_penyakit AS kasus,
	penyakit.nm_penyakit AS deskripsi_icd10
FROM
	diagnosa_pasien
	INNER JOIN
	penyakit
	ON 
		diagnosa_pasien.kd_penyakit = penyakit.kd_penyakit
WHERE
	diagnosa_pasien.no_rawat = ?
ORDER BY
	diagnosa_pasien.prioritas ASC
LIMIT 3`;

var sql3 = `
SELECT DISTINCT
	prosedur_pasien.kode AS kode_icd9, 
	icd9.deskripsi_pendek AS deskripsi_icd9, 
	prosedur_pasien.no_rawat, 
	reg_periksa.no_reg
FROM
	prosedur_pasien
	LEFT JOIN
	icd9
	ON 
		prosedur_pasien.kode = icd9.kode
	INNER JOIN
	reg_periksa
	ON 
		prosedur_pasien.no_rawat = reg_periksa.no_rawat
WHERE
	prosedur_pasien.no_rawat = ? 
ORDER BY
	prosedur_pasien.prioritas ASC
LIMIT 1`;

	var a = [];
	var valueToPush = [];
    const result = await con.query(sql, [from, until]);
	
	for (const iterator of result) {
		const icd10 = await con.query(sql2, [iterator.no_rawat]);
		const icd9 = await con.query(sql3, [iterator.no_rawat]);
		valueToPush=iterator
		valueToPush['icd10']=icd10
		valueToPush['icd9']=icd9
		a.push(valueToPush)
	}
	// console.log(a);
    return a;
};

module.exports = {
    getLaporan
}