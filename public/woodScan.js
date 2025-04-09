import fs from "fs";
import path from "path";
import { createRequire } from 'module';
const require = createRequire(import.meta.url);

/*************** CLASSES **************/
class Wood {
  constructor(id, title, year, dimensions, materials, thumbnail) {
    this.id = id; //int, unique id of each wood project, starting from 1
    this.title = title; //str
    this.year = year; //str
    this.dimensions = dimensions; //str
    this.materials = materials; //str
    this.thumbnail = thumbnail;
  }
}

/* Given a path to a 'Wood' folder, 
read all its subfolders and return a list of Wood objects 
@params: pathname, a string
@return: list of Film objects */
function fetchWood(pathname) {

  let all_wood = [];
  let id = 0;
  const imgExtentions = ['.jpg', '.png', ',jpeg', '.JPG', '.PNG', '.JPEG'];

  /* Read all files and dirs that pathname led to */
  const contents = fs.readdirSync(pathname); 

  /* Only pick directories, filter out files */
  const dirs = contents.filter(content => fs.lstatSync(path.resolve(pathname, content)).isDirectory());

  /* For each Wood folder */
  dirs.forEach(dir => {

    id += 1;
    let wood = new Wood(id);

    /* Read content of each folder */
    const dir_contents = fs.readdirSync(path.resolve(pathname, dir));

    /* For each content in a wood folder */
    dir_contents.forEach(content => {

      /* If content is the info.json file, extract wood metadata */
      if (content.includes("info.json")) {
        const json_path = path.resolve(pathname, dir, 'info.json');
        // console.log(json_path);
        const data = require(json_path);
        wood.title = data.title;
        wood.year = data.year;
        wood.dimensions = data.dimensions;
        wood.materials = data.materials;
      } 

      /* If content is an image file (poster), extract path */
      if (imgExtentions.some(extension => content.includes(extension))) {
        if (content.includes("thumb")) {
          let img_path = path.join(pathname, dir, content); 
          wood.thumbnail = img_path;
        }

      }
    })
    all_wood.push(wood);
  })
  return all_wood;
}

const all_wood = fetchWood("./woodworking");
fs.writeFileSync('/Users/ddam1/Desktop/Duc/Projects/personal-web-react/src/Components/Woodworking/wood.json', JSON.stringify(all_wood, null, 1))

