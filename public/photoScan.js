import fs from "fs";
import path from "path";
import { createRequire } from 'module';
const require = createRequire(import.meta.url);

/*************** CLASSES **************/
class Image {
  constructor(id, src, index, description) {
    this.id = id; //str, unique id of the image within an album. Ex: 2.4 = album 2, image 4
    this.src = src; //str, source of image
    this.index = index; //int, for indexing purposes within an album
    this.description = description; //str, description of the image
  }
}

class Album {
  constructor(id, title, year, description, numImages, isHighlight, thumbnail, imgList) {
    this.id = id; //int, unique id of the album among all albums, starting from x.1
    this.title = title; //string, tile of project
    this.year = year //string, year of project ('2018-2020', '2013-current', etc.)
    this.description = description; //string, album description
    this.numImages = numImages; //int, number of images in the album, excluding the thumbnail
    this.isHighlight = isHighlight; //boolean, is the album put in the Highlights folder?
    this.thumbnail = thumbnail; //Image object, store info about thumbnail. Has ID x.0
    this.imgList = imgList; //list of Image objects
  }
}

function fetchSubDirAlbums (pathname, dir, subDirs, isHighlight) {

  const imgExtentions = ['.jpg', '.png', ',jpeg', '.JPG', '.PNG', '.JPEG'];
  const subDirAlbums = [];
  let album_id = 0;

  // For each Album folder
  subDirs.forEach(subdir => {
    album_id += 1;
    const subdir_contents = fs.readdirSync(path.resolve(pathname, dir, subdir));
    let album = new Album(album_id);
    let album_imgs = [];
    let img_count = 0;
  
    // For each Image in the Album folder
    subdir_contents.forEach(content => {

      // If content is the info.json file, extract album metadata
      if (content.includes("info.json")) {
        const json_path = path.resolve(pathname, dir, subdir, 'info.json');
        const album_data = require(json_path);
        album.title = album_data.title;
        album.year = album_data.year;
        album.description = album_data.description;
      }

      // Check if content of dir has valid image extensions.
      if (imgExtentions.some(extension => content.includes(extension))) {
        img_count += 1;

        /* 
        The browser reads from project folder, so use path.join to create relative path 
        Ex: src="http://localhost:51xx/photography/Highlights/..."
        (instead of path.resolve, which will return absolute path)
         */
        let img_path = path.join(pathname, dir, subdir, content); 

        /* pathname/dir/subdir/content = ./photography/Highlights/ex2/DCD345.JPG */
        let img = new Image(0, img_path, null, '');

        // Set album isHighlight
        if (isHighlight) {
          album.isHighlight = true;
        } else {
          album.isHighlight = false;
        }

        // Set album thumbnail
        if (img.src.includes('thumb')) {
          img_count--; //exclude thumbnail from image
          img.id = `${album.id}.0`; 
          album.thumbnail = img;
        } else {
          img.id = `${album.id}.${img_count}`;
          img.index = img_count -1;
          album_imgs.push(img);
        }
      }
    })

    // Set album numImages and imgList
    album.numImages = img_count;
    album.imgList = album_imgs;
    subDirAlbums.push(album);
  })
  return subDirAlbums;
}

/* Given a path to a 'Photography' folder, 
read all its subfolders and return a list of Album objects 
@params: pathname, a string
@return: list of Album objects */
function fetchAlbums (pathname) {

  // Read all files and dirs that pathname led to
  const contents = fs.readdirSync(pathname); 

  // Only pick directories, filter out files
  const dirs = contents.filter(content => fs.lstatSync(path.resolve(pathname, content)).isDirectory());
  let all_albums = [];

  // For Highlight or Other folder
  dirs.forEach(dir => {

    // Read all content of each folder
    const subdirs = fs.readdirSync(path.resolve(pathname, dir));

    // Only pick directories, filter out files
    const subdirs_filtered = subdirs.filter(subdir => fs.lstatSync(path.resolve(pathname, dir, subdir)).isDirectory()); 

    // Collect all albums in Highlights folder
    if (dir.includes("Highlights")) {
      const albums = fetchSubDirAlbums(pathname, dir, subdirs_filtered, true);
      all_albums = all_albums.concat(albums);
    
    // Collect all albums in Others folder
    } else {
      const albums = fetchSubDirAlbums(pathname, dir, subdirs_filtered, false);
      all_albums = all_albums.concat(albums);
    }
  })
  return all_albums;
}

const all_albums = fetchAlbums("./photography");
fs.writeFileSync('/Users/ddam1/Desktop/Duc/Projects/personal-web-react/src/Components/Photography/albums.json', JSON.stringify(all_albums, null, 1))

