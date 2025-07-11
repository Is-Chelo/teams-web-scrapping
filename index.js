const axios = require('axios');
const cheerio = require('cheerio');

exports.handler = async (event) => {
	const URL = 'https://www.espn.com.ar/futbol/calendario/_/liga/bol.1';
	try {
		const {data} = await axios.get(URL, {
			headers: {
				'User-Agent': 'Mozilla/5.0',
				'Accept-Language': 'es-ES,es;q=0.9',
			},
		});

		const matches = [];
		const $ = cheerio.load(data);

		$('.ScheduleTables.mb5.ScheduleTables--.ScheduleTables--soccer').each((_, el) => {
			const date = $(el).find('.Table__Title').first().text().trim();

			$(el)
				.find('table tbody tr')
				.each((_, row) => {
					const teams = $(row).find('.Table__Team');
					const time = $(row).find('.date__col').text().trim();
					const stage = $(row).find('.venue__col').text().trim();
					if (teams.length >= 1) {
						const away = $(teams[1]).text().trim();
						const home = $(teams[0]).text().trim();

						matches.push({
							date,
							home,
							away,
							time,
							stage,
						});
					}
				});
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
