const express = require("express");
const routes = express.Router();

const base = require('../controllers');
const auth = require('../controllers/AuthController');
const dokter = require('../controllers/DokterController');
const igd = require('../controllers/IgdController');
const ranap = require('../controllers/RanapController');
const ralan = require('../controllers/RalanController');
const kamar = require('../controllers/KamarController');

const middleware = require('../middlewares');

routes.get('/', base.home);

// routes.post('/auth/register', auth.register);
routes.post('/auth/login', auth.login);
routes.post('/auth/login/dokter', auth.dokter);
routes.get('/pasien/registasiawal',middleware.login, dokter.pasien);
routes.get('/pasien/rkm_medis',middleware.login, dokter.rkm_medis);
routes.get('/obat/cari',middleware.login, dokter.getObat);
routes.post('/igd/regis', middleware.login, igd.regis);
// routes.post('/ranap/regis', middleware.login, ranap.regis);
routes.post('/ranap/laporan', middleware.login, ranap.getRegLaporan);
// routes.post('/ralan/regis', middleware.login, igd.regis);
routes.post('/ralan/laporan', middleware.login, ralan.getRegLaporan);
routes.get('/kamar/list', middleware.login, kamar.getKamar);
routes.get('/kamar/kelasKosong', middleware.login, kamar.getkelasKosong);

module.exports = routes;