import { BiTimeFive } from 'react-icons/bi'
import albumsData from '../../data/photo.json'
import woodData from '../../data/wood.json'
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

export const woodworkingConfig = {
  sectionName: 'woodworking',
  title: 'WOODWORKING',
  urlParam: 'woodURL',
  filterFn: null,
  titleTransform: 'uppercase',
  metaFields: [
    { key: 'dimensions' },
    { key: 'materials' },
  ],
  data: woodData,
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
