import fs from "fs";
import path from "path";

/*************** CLASSES **************/
class Image {
  constructor(id, src, index, description) {
    this.id = id;
    this.src = src;
    this.index = index;
    this.description = description;
  }
}

class Album {
  /* 
  imgList: a list of Image objects
  thumbnail: Image object
  */
  constructor(id, numImages, imgList, thumbnail, description, isHighlight) {
    this.id = id;
    this.numImages = numImages;
    this.imgList = imgList;
    this.thumbnail = thumbnail;
    this.description = description;
    this.isHighlight = isHighlight;
  }
}

/* 
TODO:
- Successfully scanned and fetched all albums
*/
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

function fetchAlbums (pathname) {
  const contents = fs.readdirSync(pathname); //read all files and dirs
  const dirs = contents.filter(content => fs.lstatSync(path.resolve(pathname, content)).isDirectory()); //
  let all_albums = [];

  // For Highlight or Other folder
  dirs.forEach(dir => {
    const subdirs = fs.readdirSync(path.resolve(pathname, dir));
    const subdirs_filtered = subdirs.filter(subdir => fs.lstatSync(path.resolve(pathname, dir, subdir)).isDirectory()); 

    if (dir.includes("Highlights")) {
      const albums = fetchSubDirAlbums(pathname, dir, subdirs_filtered, true);
      all_albums = all_albums.concat(albums);
    } else {
      const albums = fetchSubDirAlbums(pathname, dir, subdirs_filtered, false);
      all_albums = all_albums.concat(albums);
    }
  })
  return all_albums;
}

const all_albums = fetchAlbums("./photography");
fs.writeFileSync('/Users/ddam1/Desktop/Duc/Projects/personal-web-react/src/albums.json', JSON.stringify(all_albums, null, 1))

