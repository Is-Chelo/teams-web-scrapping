const axios = require('axios');
const cheerio = require('cheerio');

exports.handler = async (event) => {
  const URL = 'https://www.xscores.com/soccer/bolivia/primera-division/fixtures';

  try {
    const { data } = await axios.get(URL, {
      headers: {
        'User-Agent': 'Mozilla/5.0', // importante para evitar bloqueo
      },
    });

    const $ = cheerio.load(data);
    const matches = [];

    $('div.content table.soccer tbody tr').each((_, el) => {
      const date = $(el).find('td.date').text().trim();
      const time = $(el).find('td.time').text().trim();
      const home = $(el).find('td.team-home a').text().trim();
      const away = $(el).find('td.team-away a').text().trim();

      if (home && away) {
        matches.push({ date, time, home, away });
      }
    });

    return {
      statusCode: 200,
      body: JSON.stringify({ matches }),
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message }),
    };
  }
};
