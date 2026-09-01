import fs from 'fs'
import path from 'path'
import { createRequire } from 'module'
const require = createRequire(import.meta.url)

const PROJECT_ROOT = path.resolve(import.meta.dirname, '..')
const IMG_EXTENSIONS = ['.jpg', '.png', '.jpeg', '.JPG', '.PNG', '.JPEG']

function isImage(filename) {
  return IMG_EXTENSIONS.some((ext) => filename.endsWith(ext))
}

function toDashedLowerCase(str) {
  return str
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
}

function getDirs(dirPath) {
  return fs
    .readdirSync(dirPath)
    .filter((f) => fs.lstatSync(path.resolve(dirPath, f)).isDirectory())
}

// ── Photography ──

function fetchSubDirAlbums(pathname, dir, subDirs, isHighlight) {
  const albums = []
  let album_id = 0

  subDirs.forEach((subdir) => {
    album_id += 1
    const subdir_contents = fs.readdirSync(path.resolve(pathname, dir, subdir))
    const album = { id: album_id, imgList: [] }
    let img_count = 0

    const json_file = subdir_contents.find((f) => f === 'info.json')
    if (json_file) {
      const data = require(path.resolve(pathname, dir, subdir, json_file))
      album.title = data.title
      album.year = data.year
      album.description = data.description
      album.captions = data.captions
      album.url = toDashedLowerCase(data.title)
    } else {
      console.log(`Warning: info.json not found for ${subdir}`)
    }

    subdir_contents.forEach((content) => {
      if (json_file && isImage(content)) {
        img_count += 1
        const img_path = path.join(pathname, dir, subdir, content)
        const img = { id: '', src: img_path, index: null, description: '' }

        album.isHighlight = isHighlight

        if (content.includes('thumb')) {
          img_count--
          img.id = `${album.id}.0`
          album.thumbnail = img
        } else {
          img.id = `${album.id}.${img_count}`
          img.index = img_count - 1
          img.description = album.captions[img.index]
          album.imgList.push(img)
        }
      }

      if (content.includes('preview')) {
        album.preview = path.join(pathname, dir, subdir, content)
      }
    })

    album.numImages = img_count
    if (json_file && album.numImages !== album.captions.length) {
      console.log(
        `Warning: num imgs and captions mismatched for ${album.title}`,
      )
    }
    album.viewTime = Math.round((img_count * 30) / 60 + 1)
    albums.push(album)
  })
  return albums
}

function scanPhotography() {
  const pathname = 'photography'
  const dirs = getDirs(pathname)
  let all_albums = []

  dirs.forEach((dir) => {
    const subdirs = getDirs(path.resolve(pathname, dir))
    const isHighlight = dir.includes('Highlights')
    all_albums = all_albums.concat(
      fetchSubDirAlbums(pathname, dir, subdirs, isHighlight),
    )
  })

  const outPath = path.resolve(
    PROJECT_ROOT,
    'src/Components/Photography/albums.json',
  )
  fs.writeFileSync(outPath, JSON.stringify(all_albums, null, 1))
  console.log(`Photography: ${all_albums.length} albums -> ${outPath}`)
}

// ── Film ──

function fetchPressGallery(pathname, dir, subdir) {
  const subdir_contents = fs.readdirSync(path.resolve(pathname, dir, subdir))
  const album = { imgList: [] }
  let img_count = 0

  const json_file = subdir_contents.find((f) => f === 'info.json')
  if (json_file) {
    const data = require(path.resolve(pathname, dir, subdir, json_file))
    album.title = data.title
    album.captions = data.captions
  } else {
    console.log(`Warning: info.json not found for ${subdir}`)
  }

  subdir_contents.forEach((content) => {
    if (json_file && isImage(content)) {
      img_count += 1
      const img = {
        id: `${img_count}`,
        src: path.join(pathname, dir, subdir, content),
        index: img_count - 1,
        description: album.captions?.[img_count - 1] || '',
      }
      album.imgList.push(img)
    }
  })

  album.numImages = img_count
  if (json_file && album.numImages !== (album.captions?.length || 0)) {
    console.log(
      `Warning: num imgs and captions mismatched for ${album.title}`,
    )
  }
  return album
}

function scanFilm() {
  const pathname = 'film'
  const dirs = getDirs(pathname)
  const all_films = []
  let film_id = 0

  dirs.forEach((dir) => {
    film_id += 1
    const film = { id: film_id }
    const dir_contents = fs.readdirSync(path.resolve(pathname, dir))

    dir_contents.forEach((content) => {
      if (content === 'info.json') {
        const data = require(path.resolve(pathname, dir, 'info.json'))
        film.title = data.title
        film.year = data.year
        film.director = data.director
        film.runtime = data.runtime
        film.country = data.country
        film.language = data.language
        film.synopsis = data.synopsis
        film.description = [data.synopsis]
        film.recognition = data.recognition
        film.screenings = data.screenings
        film.youtube = data.youtube
        film.url = toDashedLowerCase(data.title) + `-${data.year}`
        film.availability = data.availability
      }

      if (isImage(content)) {
        const img_path = path.join(pathname, dir, content)
        if (content.includes('poster')) film.poster = img_path
        else if (content.includes('thumb'))
          film.thumbnail = { src: img_path }
        else if (content.includes('logo')) film.logo = img_path
      }

      if (content.includes('preview-landing'))
        film.previewLanding = path.join(pathname, dir, content)
      if (content.includes('preview-thumbnail')) {
        film.previewThumbnail = path.join(pathname, dir, content)
        film.preview = path.join(pathname, dir, content)
      }

      if (content === 'press_gallery') {
        film.pressGallery = fetchPressGallery(pathname, dir, content)
      }
    })
    all_films.push(film)
  })

  const outPath = path.resolve(
    PROJECT_ROOT,
    'src/Components/Film/films.json',
  )
  fs.writeFileSync(outPath, JSON.stringify(all_films, null, 1))
  console.log(`Film: ${all_films.length} films -> ${outPath}`)
}

// ── Woodworking ──

function scanWoodworking() {
  const pathname = './woodworking'
  const dirs = getDirs(pathname)
  const all_wood = []
  let id = 0

  dirs.forEach((dir) => {
    id += 1
    const wood = { id, imgList: [] }
    let img_count = 0
    const dir_contents = fs.readdirSync(path.resolve(pathname, dir))

    dir_contents.forEach((content) => {
      if (content === 'info.json') {
        const data = require(path.resolve(pathname, dir, 'info.json'))
        wood.title = data.title
        wood.description = data.description
        wood.year = data.year
        wood.dimensions = data.dimensions
        wood.materials = data.materials
        wood.url = toDashedLowerCase(data.title)
        wood.captions = data.captions
      }

      if (isImage(content)) {
        img_count += 1
        const img_path = path.join(pathname, dir, content)
        const img = { id: '', src: img_path, index: null, description: '' }

        if (content.includes('thumb')) {
          img_count--
          img.id = `${wood.id}.0`
          wood.thumbnail = img
        } else {
          img.id = `${wood.id}.${img_count}`
          img.index = img_count - 1
          wood.imgList.push(img)
        }
      }
    })
    wood.numImages = img_count
    all_wood.push(wood)
  })

  const outPath = path.resolve(
    PROJECT_ROOT,
    'src/Components/Woodworking/wood.json',
  )
  fs.writeFileSync(outPath, JSON.stringify(all_wood, null, 1))
  console.log(`Woodworking: ${all_wood.length} items -> ${outPath}`)
}

// ── Run all ──

console.log('Scanning all media...\n')
scanPhotography()
scanFilm()
scanWoodworking()
console.log('\nDone.')
