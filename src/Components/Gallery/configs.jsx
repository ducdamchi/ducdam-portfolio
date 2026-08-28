import { BiTimeFive } from 'react-icons/bi'
import albumsData from '../Photography/albums.json'
import woodData from '../Woodworking/wood.json'

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
