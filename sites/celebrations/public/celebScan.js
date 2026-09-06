import fs from 'fs'
import path from 'path'
import { createRequire } from 'module'
import { imageSize } from 'image-size'
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
    .sort()
}

function scanCelebrations() {
  const dirs = getDirs('.')
  const allAlbums = []
  let albumId = 0

  dirs.forEach((dir) => {
    const dirContents = fs.readdirSync(path.resolve(dir))
    const jsonFile = dirContents.find((f) => f === 'info.json')
    if (!jsonFile) {
      console.log(`Skipping ${dir} — no info.json`)
      return
    }

    albumId += 1
    const data = require(path.resolve(dir, jsonFile))
    const album = {
      id: albumId,
      title: data.title,
      year: data.year,
      description: data.description,
      url: toDashedLowerCase(data.title),
      imgList: [],
    }

    const images = dirContents.filter(isImage).sort()
    let imgCount = 0

    images.forEach((content) => {
      imgCount += 1
      const imgPath = path.join(dir, content)
      const caption = data.captions?.[imgCount - 1] || ''
      const imgBuffer = fs.readFileSync(path.resolve(dir, content))
      const dimensions = imageSize(new Uint8Array(imgBuffer))
      const orientation =
        dimensions.height > dimensions.width ? 'vertical' : 'horizontal'
      const img = {
        id: `${albumId}.${imgCount}`,
        src: imgPath,
        index: imgCount - 1,
        description: caption || `Image ${imgCount}`,
        orientation,
      }

      if (imgCount === 1) {
        album.thumbnail = {
          id: `${albumId}.0`,
          src: imgPath,
          index: 0,
          description: '',
        }
      }

      album.imgList.push(img)
    })

    album.numImages = imgCount
    album.captions = data.captions
    allAlbums.push(album)
  })

  const outPath = path.resolve(PROJECT_ROOT, 'src/data/celebrations.json')
  const outDir = path.dirname(outPath)
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true })
  fs.writeFileSync(outPath, JSON.stringify(allAlbums, null, 1))
  console.log(`Celebrations: ${allAlbums.length} albums -> ${outPath}`)
}

console.log('Scanning celebrations...\n')
scanCelebrations()
console.log('\nDone.')
