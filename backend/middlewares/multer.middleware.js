// import multer from "multer";

// const storage = multer.diskStorage({
//     destination: function (req, file, cb) {
//       cb(null,"./public/temp")
//     },

//     filename: function (req, file, cb) {
//       cb(null, `${Date.now()}-${file.originalname}`)
//     }

// })
  
// export const upload = multer({
//   storage,
// });

import multer from "multer";

// Ensure temp directory exists
import fs from "fs";
const tempDir = "./public/temp";
if (!fs.existsSync(tempDir)) {
    fs.mkdirSync(tempDir, { recursive: true });
}


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, tempDir);
    },
    filename: function (req, file, cb) {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});


export const upload = multer({ storage });
