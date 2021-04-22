import axios from 'axios';
import cheerio from 'cheerio';
import * as dotenv from 'dotenv';

dotenv.config();

const baseURL = process.env.BASE_URL;
const crawler = axios.create({
  baseURL,
});

const main = async () => {
  const response = await crawler.get('/pencarian/?urutan=abjad&halaman=1');
  if (response.status !== 200) {
    throw new Error('Error response');
  }
  const html = response.data;

  const $ = cheerio.load(html);
  const listAnime = $('.listupd.listupd_custompage > div');
  listAnime.each((_, elem) => {
    const animeElement = $(elem).find('.bs > .bsx');
    const url = $(animeElement).find('a').attr('href');
    const title = $(animeElement).find('.tt').text();
    const episode = $(animeElement).find('.limit > .bt > span.epx').text();
    console.log(url, title, episode);
  });
};

main().catch(err => {
  console.log(`🕷 Err: ${err}`);
});
