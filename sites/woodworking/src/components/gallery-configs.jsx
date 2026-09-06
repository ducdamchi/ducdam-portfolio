import woodData from '../data/wood.json'

export const woodworkingConfig = {
  sectionName: '',
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
