const { con } = require('./index.js');
var getLaporan = async function (from, until, jk, golongan) {
	var b=''
	if (jk!='') {
		b+='AND pasien.jk="'+jk+'"'
	}
	if (golongan!='') {
		b+='AND penjab.kd_pj="'+golongan+'"'
	}
    var sql = `
	SELECT
	reg_periksa.no_rawat AS no_rawat, 
	DATE_FORMAT(tgl_registrasi, "%Y-%m-%d") AS tgl_registrasi, 
	reg_periksa.jam_reg AS jam_reg, 
	reg_periksa.no_rkm_medis AS no_rkm_medis, 
	pasien.no_ktp AS no_ktp, 
	pasien.no_peserta AS no_peserta, 
	pasien.nm_pasien AS nm_pasien, 
	pasien.jk AS jk, 
	pasien.agama AS agama, 
	pasien.suku_bangsa AS suku_bangsa, 
	pasien.pekerjaan AS pekerjaan, 
	pasien.pnd AS pnd, 
	DATE_FORMAT(pasien.tgl_lahir, "%Y-%m-%d") AS tgl_lahir, 
	pasien.umur AS umur, 
	pasien.alamat AS alamat, 
	kelurahan.nm_kel AS nm_kel, 
	kecamatan.nm_kec AS nm_kec, 
	kabupaten.nm_kab AS nm_kab, 
	propinsi.nm_prop AS nm_prop, 
	pasien.no_tlp AS no_tlp, 
	poliklinik.nm_poli AS nm_poli, 
	dokter.nm_dokter AS nm_dokter, 
	penjab.png_jawab AS png_jawab, 
	reg_periksa.stts_daftar AS kunjungan, 
	reg_periksa.status_poli AS pengunjung
FROM
	(
		(
			(
				(
					(
						(
							(
								(
									(
										(
											(
												(
													reg_periksa
													join
													pasien
													ON 
														(
															reg_periksa.no_rkm_medis = pasien.no_rkm_medis
														)
												)
												join
												penjab
												ON 
													(
														reg_periksa.kd_pj = penjab.kd_pj
													)
											)
											join
											dokter
											ON 
												(
													reg_periksa.kd_dokter = dokter.kd_dokter
												)
										)
									)
								)
								join
								poliklinik
								ON 
									(
										reg_periksa.kd_poli = poliklinik.kd_poli
									)
							)
							join
							kelurahan
							ON 
								(
									pasien.kd_kel = kelurahan.kd_kel
								)
						)
						join
						kecamatan
						ON 
							(
								pasien.kd_kec = kecamatan.kd_kec
							)
					)
					join
					propinsi
					ON 
						(
							pasien.kd_prop = propinsi.kd_prop
						)
				)
				join
				kabupaten
				ON 
					(
						pasien.kd_kab = kabupaten.kd_kab
					)
			)
		)
	)
WHERE
	reg_periksa.tgl_registrasi BETWEEN ? AND ? AND
	reg_periksa.status_lanjut = 'Ralan' `+b+`
	`;
	
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

var sql5 = `
SELECT DISTINCT
mutasi_berkas.status, 
DATE_FORMAT(mutasi_berkas.dikirim, "%d-%m-%Y") AS dikirim,
DATE_FORMAT(mutasi_berkas.diterima, "%d-%m-%Y") AS diterima,
DATE_FORMAT(mutasi_berkas.kembali, "%d-%m-%Y") AS tgl_kembali,
DATE_FORMAT(mutasi_berkas.kembali, "%H:%i") AS jam_kembali,
DATE_FORMAT(mutasi_berkas.tidakada, "%d-%m-%Y") AS tidakada,
DATE_FORMAT(mutasi_berkas.ranap, "%d-%m-%Y") AS ranap
FROM
	mutasi_berkas
WHERE
	mutasi_berkas.no_rawat = ? 
`;

	var a = [];
	var valueToPush = [];
    const result = await con.query(sql, [from, until]);
	
	for (const iterator of result) {
		const icd10 = await con.query(sql2, [iterator.no_rawat]);
		const icd9 = await con.query(sql3, [iterator.no_rawat]);
		const mutasi_berkas = await con.query(sql5, [iterator.no_rawat]);
		valueToPush=iterator
		valueToPush['icd10']=icd10
		valueToPush['icd9']=icd9
		valueToPush['mutasi_berkas']=mutasi_berkas
		a.push(valueToPush)
	}
	// console.log(a);
    return a;
};

module.exports = {
    getLaporan
}