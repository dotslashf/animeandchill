import axios from 'axios';
import cheerio from 'cheerio';
import * as dotenv from 'dotenv';

dotenv.config();

const baseURL = process.env.BASE_URL;
const crawler = axios.create({
  baseURL,
});

interface Anime {
  title: string;
  url?: string;
}

interface Episode {
  title: string;
  url?: string;
  nEpisode: number;
}

const episodeCrawler = async (anime: Anime) => {
  const response = await crawler.get(anime.url!);
  if (response.status !== 200) {
    throw new Error(`Error Episode ${anime.url}`);
  }

  const html = response.data;

  const $ = cheerio.load(html);
  const listEpisode = $('#daftarepisode > li');
  listEpisode.each((_, elm) => {
    const li = $(elm).find('span.lchx');
    const url = $(li).find('a').attr('href');
    const nEpisode = $(li).find('a').text().split(' ');
    const n = nEpisode[nEpisode.length - 1];
    const episode: Episode = {
      title: anime.title,
      url: url,
      nEpisode: parseInt(n),
    };
    episodeUrlCrawler(episode);
  });
};

const episodeUrlCrawler = async (episode: Episode) => {
  const response = await crawler.get(episode.url!);
  if (response.status !== 200) {
    throw new Error(`Error Exact Episode ${episode.url}`);
  }

  const html = response.data;

  const $ = cheerio.load(html);
  const exactEpisodeUrl = $('#pembed');
  const _url = $(exactEpisodeUrl).find('iframe').attr('src');
  episode.url = _url;
  console.log(JSON.stringify(episode));
};

const main = async () => {
  const response = await crawler.get('/pencarian/?urutan=abjad&halaman=1');
  if (response.status !== 200) {
    throw new Error('Error Main Page');
  }
  const html = response.data;

  const $ = cheerio.load(html);
  const listAnime = $('.listupd.listupd_custompage > div');
  listAnime.each((_, elem) => {
    const animeElement = $(elem).find('.bs > .bsx');
    const url = $(animeElement).find('a').attr('href');
    const title = $(animeElement).find('.tt').text();
    const anime = { title, url };
    episodeCrawler(anime);
  });
};

main().catch(err => {
  console.log(`🕷 Err: ${err}`);
});
