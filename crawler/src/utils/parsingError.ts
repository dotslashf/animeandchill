import { episodeUrlCrawler } from './../index';
import fs from 'fs';
import path from 'path';
import neatCsv from 'neat-csv';
import { Episode } from '../index';

function removeBadChars(title: string, episode: string): string {
  let temp = title.replace(/[\W_]+/g, ' ');
  temp = temp.split(' ').join('-').toLowerCase();

  if (episode === 'NaN') {
    return `/nonton${temp}`;
  }
  return `/nonton${temp}-episode-${episode}`;
}

const readCSV = async (content: Buffer) => {
  return await neatCsv(content);
};

(async () => {
  const file = fs.readFileSync(
    path.join(__dirname + './../files/errorList.csv')
  );
  const fileCSV = await readCSV(file);
  fileCSV.map(async anime => {
    const episode: Episode = {
      title: anime.Title,
      nEpisode: parseInt(anime.E),
      url: removeBadChars(anime.Title, anime.E),
    };
    await episodeUrlCrawler(episode);
    // console.log(episode.url);
  });
})();
