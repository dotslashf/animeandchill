import axios from 'axios';
import cheerio from 'cheerio';
import * as dotenv from 'dotenv';
import { writeToCSV } from './utils/writeCsv';

dotenv.config();

const baseURL = process.env.BASE_URL;
const crawler = axios.create({
  baseURL,
});

interface Anime {
  title: string;
  url?: string;
}

export interface Episode extends Anime {
  nEpisode: number;
}

const episodeCrawler = async (anime: Anime) => {
  try {
    const response = await crawler.get(anime.url!);
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
  } catch (error) {
    console.log(`Error anime ${anime.title}`);
    writeToCSV('error', anime as Episode);
  }
};

const episodeUrlCrawler = async (episode: Episode) => {
  try {
    const response = await crawler.get(episode.url!);

    const html = response.data;

    const $ = cheerio.load(html);
    const exactEpisodeUrl = $('#pembed');
    const _url = $(exactEpisodeUrl).find('iframe').attr('src');
    episode.url = _url;
    writeToCSV('episode', episode);
  } catch (error) {
    console.log(`Error exact episode ${episode.title} ${episode.nEpisode}`);
    writeToCSV('error', episode);
  }
};

const main = async () => {
  for (let i = 293; i < 295; i++) {
    try {
      const response = await crawler.get(
        `/pencarian/?urutan=abjad&halaman=${i}`
      );

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
      console.log(`Scraping laman ${i}`);
    } catch (error) {
      const tempEpisode: Episode = {
        title: `Laman ${i}`,
        nEpisode: 0,
      };
      writeToCSV('error', tempEpisode);
      console.log(`Error laman ${i}`);
    }
  }
};

main().catch(err => {
  console.log(`🕷 Err: ${err}`);
});
