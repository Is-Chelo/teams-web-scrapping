const axios = require('axios');
const cheerio = require('cheerio');

exports.handler = async (event) => {
	const URL = 'https://www.xscores.com/soccer/bolivia/primera-division/fixtures';

	try {
		const {data} = await axios.get(URL, {
			headers: {
				'User-Agent': 'Mozilla/5.0', // evitar bloqueos por parte del sitio
			},
		});

		const $ = cheerio.load(data);
		const matches = [];

		$('a.ind_match_wrapper').each((_, el) => {
			const matchElement = $(el);

			// Extraer la fecha desde el href
			const href = matchElement.attr('href') || '';
			const dateMatch = href.match(/\d{2}-\d{2}-\d{4}/);
			const date = dateMatch ? dateMatch[0] : null;

			// Extraer equipos
			const home = matchElement.find('.match_home .wrap').first().text().trim();
			const away = matchElement.find('.match_away .wrap').first().text().trim();

			// Agregar si los datos están completos
			if (home && away && date) {
				matches.push({date, home, away});
			}
		});

		return {
			statusCode: 200,
			body: JSON.stringify({matches}),
		};
	} catch (err) {
		return {
			statusCode: 500,
			body: JSON.stringify({error: err.message}),
		};
	}
};
