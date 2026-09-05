import { BiTimeFive } from 'react-icons/bi'
import albumsData from '../../data/photo.json'
import filmsData from '../../data/film.json'

export const photographyConfig = {
  sectionName: 'photography',
  title: 'PHOTOGRAPHY',
  urlParam: 'photoURL',
  filterFn: (item) => item.isHighlight === true,
  titleTransform: 'capitalize normal-case',
  metaFields: [
    { key: 'viewTime', format: (v) => `${v} mins`, Icon: BiTimeFive },
  ],
  data: albumsData,
}

export const filmConfig = {
  sectionName: 'film',
  title: 'FILM',
  urlParam: 'filmURL',
  filterFn: null,
  titleTransform: 'uppercase',
  metaFields: [],
  cardImage: (item) => item.poster,
  cardSubtitle: (item) =>
    `${item.year} | ${item.country} | ${item.runtime} mins`,
  data: filmsData,
}
