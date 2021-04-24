import { createObjectCsvWriter } from 'csv-writer';
import path from 'path';
import { Episode } from '../index';

export const writeToCSV = (type: 'episode' | 'error', data: Episode) => {
  const animeEpisodeFile = './../files/titleList.csv';
  const errorListFile = './../files/errorList.csv';

  if (type === 'episode') {
    const writer = createObjectCsvWriter({
      path: path.join(__dirname + animeEpisodeFile),
      header: [
        { id: 'title', title: 'Title' },
        { id: 'url', title: 'URL' },
        { id: 'nEpisode', title: 'E' },
      ],
      append: true,
    });

    writer
      .writeRecords([data])
      .then(() => {
        console.log(
          `Write ${data.title}-${data.nEpisode} ${new Date().toString()}`
        );
      })
      .catch(err => {
        console.log(err);
      });
  }

  if (type === 'error') {
    const writer = createObjectCsvWriter({
      path: path.join(__dirname + errorListFile),
      header: [
        { id: 'title', title: 'Title' },
        { id: 'nEpisode', title: 'E' },
      ],
      append: true,
    });

    writer
      .writeRecords([{ title: data.title, nEpisode: data.nEpisode }])
      .then(() => {
        console.log(
          `Write Error ${data.title}-${data.nEpisode} ${new Date().toString()}`
        );
      })
      .catch(err => {
        console.log(err);
      });
  }
};
