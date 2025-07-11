const {fetchFixtures} = require('./src/services/Fixture');

const test = async () => {
	try {
		const URL = 'https://www.flashscore.es/futbol/bolivia/copa-pacena/partidos/';
		const matches = await fetchFixtures(URL);
		console.log(matches); // Aquí obtendrás el array con los partidos de la Copa Pacena
	} catch (err) {
		console.error('❌ Error al procesar las solicitudes:', err.message);
	}
};
test();
