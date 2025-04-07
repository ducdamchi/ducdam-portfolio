import fs from "fs";
import path from "path";
import { createRequire } from 'module';
const require = createRequire(import.meta.url);

/*************** CLASSES **************/
class Film {
  constructor(id, title, year, director, runtime, language, synopsis, recognition, screenings, poster, youtube) {
    this.id = id; //int, unique id of each film, starting from 1
    this.title = title; //str, tile of project
    this.year = year //str, year of release
    this.director = director; //str, director's name
    this.runtime = runtime; //str, runtime in minutes
    this.language = language; //str, languages spoken
    this.synopsis = synopsis; //str, synopsis
    this.recognition = recognition; //str, awards, nominations, etc.
    this.screenings = screenings; //str, past screenings
    this.poster = poster; //str, src to film poster
    this.youtube = youtube; //link to a youtube video. right now, either trailer or full film
  }
}

// function fetchSubDirAlbums (pathname, dir, subDirs, isHighlight) {

//   const imgExtentions = ['.jpg', '.png', ',jpeg', '.JPG', '.PNG', '.JPEG'];
//   const subDirAlbums = [];
//   let album_id = 0;

//   // For each Album folder
//   subDirs.forEach(subdir => {
//     album_id += 1;
//     const subdir_contents = fs.readdirSync(path.resolve(pathname, dir, subdir));
//     let album = new Album(album_id);
//     let album_imgs = [];
//     let img_count = 0;
  
//     // For each Image in the Album folder
//     subdir_contents.forEach(content => {

//       // If content is the info.json file, extract album metadata
//       if (content.includes("info.json")) {
//         const json_path = path.resolve(pathname, dir, subdir, 'info.json');
//         const album_data = require(json_path);
//         album.title = album_data.title;
//         album.year = album_data.year;
//         album.description = album_data.description;
//       }

//       // Check if content of dir has valid image extensions.
//       if (imgExtentions.some(extension => content.includes(extension))) {
//         img_count += 1;

//         /* 
//         The browser reads from project folder, so use path.join to create relative path 
//         Ex: src="http://localhost:51xx/photography/Highlights/..."
//         (instead of path.resolve, which will return absolute path)
//          */
//         let img_path = path.join(pathname, dir, subdir, content); 

//         /* pathname/dir/subdir/content = ./photography/Highlights/ex2/DCD345.JPG */
//         let img = new Image(0, img_path, null, '');

//         // Set album isHighlight
//         if (isHighlight) {
//           album.isHighlight = true;
//         } else {
//           album.isHighlight = false;
//         }

//         // Set album thumbnail
//         if (img.src.includes('thumb')) {
//           img_count--; //exclude thumbnail from image
//           img.id = `${album.id}.0`; 
//           album.thumbnail = img;
//         } else {
//           img.id = `${album.id}.${img_count}`;
//           img.index = img_count -1;
//           album_imgs.push(img);
//         }
//       }
//     })

//     // Set album numImages and imgList
//     album.numImages = img_count;
//     album.imgList = album_imgs;
//     subDirAlbums.push(album);
//   })
//   return subDirAlbums;
// }

/* Given a path to a 'Film' folder, 
read all its subfolders and return a list of Film objects 
@params: pathname, a string
@return: list of Film objects */
function fetchFilms (pathname) {

  let all_films = [];
  let film_id = 0;
  const imgExtentions = ['.jpg', '.png', ',jpeg', '.JPG', '.PNG', '.JPEG'];

  /* Read all files and dirs that pathname led to */
  const contents = fs.readdirSync(pathname); 

  /* Only pick directories, filter out files */
  const dirs = contents.filter(content => fs.lstatSync(path.resolve(pathname, content)).isDirectory());

  /* For each Film folder */
  dirs.forEach(dir => {

    film_id += 1;
    let film = new Film(film_id);

    /* Read content of each folder */
    const dir_contents = fs.readdirSync(path.resolve(pathname, dir));

    /* For each content in a film folder */
    dir_contents.forEach(content => {

      /* If content is the info.json file, extract film metadata */
      if (content.includes("info.json")) {
        const json_path = path.resolve(pathname, dir, 'info.json');
        const film_data = require(json_path);
        film.title = film_data.title;
        film.year = film_data.year;
        film.director = film_data.director;
        film.runtime = film_data.runtime;
        film.duration = film_data.duration;
        film.language = film_data.language;
        film.synopsis = film_data.synopsis;
        film.recognition = film_data.recognition;
        film.screenings = film_data.screenings;
        film.youtube = film_data.youtube;
      } 

      /* If content is an image file (poster), extract path */
      if (imgExtentions.some(extension => content.includes(extension))) {
        let img_path = path.join(pathname, dir, content); 
        film.poster = img_path;
      }
    })
    all_films.push(film);
  })
  return all_films;
}

const all_films = fetchFilms("./film");
fs.writeFileSync('/Users/ddam1/Desktop/Duc/Projects/personal-web-react/src/Components/Film/films.json', JSON.stringify(all_films, null, 1))

