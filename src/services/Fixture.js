const cheerio = require('cheerio');
const chromium = require('chrome-aws-lambda');
const puppeteer = chromium.puppeteer;

const fetchFixtures = async (URL) => {
	try {
		const browser = await puppeteer.launch({
			args: chromium.args,
			defaultViewport: chromium.defaultViewport,
			executablePath: await chromium.executablePath,
			headless: chromium.headless,
		});

		const page = await browser.newPage();

		// Hacer que Puppeteer espere explícitamente un selector y aumentar el timeout
		await page.goto(URL, {waitUntil: 'networkidle2', timeout: 60000}); // 60 segundos
		await page.waitForSelector('.event__match', {timeout: 60000}); // Espera explícita

		const html = await page.content();
		const $ = cheerio.load(html);

		const matches = [];
		$('.event__match').each((_, element) => {
			const dateTime = $(element).find('.event__time').text().trim();
			const partsDateTime = dateTime.split('.');

			const date = `${partsDateTime[0]}-${partsDateTime[1]}-2025`;
			const time = partsDateTime[3] || '';

			const homeTeam = $(element)
				.find('.event__homeParticipant .wcl-name_3y6f5')
				.text()
				.trim();
			const awayTeam = $(element)
				.find('.event__awayParticipant .wcl-name_3y6f5')
				.text()
				.trim();

			const matchLink = $(element).find('a.eventRowLink').attr('href');
			const homeScore = $(element).find('.event__score--home').text().trim() || '-';
			const awayScore = $(element).find('.event__score--away').text().trim() || '-';

			matches.push({
				date,
				time,
				homeTeam,
				awayTeam,
				homeScore,
				awayScore,
				matchLink: `https://www.flashscore.es${matchLink}`,
			});
		});

		await browser.close();
		return matches;
	} catch (err) {
		console.error('❌ Error al obtener partidos:', err.message);
		throw err;
	}
};

const getAllFixtures = async () => {
	const tournaments = [
		{
			url: 'https://www.flashscore.es/futbol/bolivia/copa-pacena/partidos/',
		},
		{
			url: 'https://www.flashscore.es/futbol/bolivia/division-profesional/partidos/',
		},
		{
			url: 'https://www.flashscore.es/futbol/bolivia/copa-simon-bolivar/partidos/',
		},
		{
			url: 'https://www.flashscore.es/futbol/bolivia/torneo-amistoso-de-verano/partidos/',
		},
	];

	const allMatches = [];

	// Iteramos sobre cada torneo y obtenemos sus partidos
	for (const tournament of tournaments) {
		const matches = await fetchFixtures(tournament.url);
		allMatches.push(matches);
	}

	return allMatches;
};

module.exports = {fetchFixtures, getAllFixtures};
