exports.handler = async (event) => {
	let url = 'https://www.flashscore.es/futbol/bolivia/copa-pacena/partidos/'; // URL por defecto

	// Verificar si la URL es proporcionada en el body o como parámetro de la URL
	if (event.body) {
		try {
			const parsed = typeof event.body === 'string' ? JSON.parse(event.body) : event.body;
			url = parsed.url || url; 
		} catch (err) {
			url = event.body; // Si el body no es JSON, considerar el body como una URL
		}
	} else if (event.queryStringParameters && event.queryStringParameters.url) {
		url = event.queryStringParameters.url;
	}

	// Llamar a la función principal para hacer scraping
	try {
		const result = await fetchFixtures(url, 'Torneo'); // 'Torneo' es el nombre por defecto del torneo
		return {
			statusCode: 200,
			body: JSON.stringify(result),
		};
	} catch (error) {
		console.error('Error al obtener los fixtures:', error);
		return {
			statusCode: 500,
			body: JSON.stringify({error: 'Error al obtener los fixtures'}),
		};
	}
};
