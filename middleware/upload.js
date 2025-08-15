const multer = require('multer');
const path  = require('path');
//slugify giúp loại bỏ dấu tiếng Việt và ký tự đặc biệt.
const slugify = require('slugify');

// cb là callback 
//Tham số đầu tiên: error (null nếu không lỗi).
//Tham số thứ hai: giá trị bạn muốn trả về cho multer (ví dụ: tên file, đường dẫn, hoặc true/false trong fileFilter).
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '..', 'uploads'));
  },
  filename: (req, file, cb) => {
    const name = slugify(path.parse(file.originalname).name, { lower: true, strict: true });
    cb(null, `${name}-${Date.now()}${path.extname(file.originalname)}`);
}
});


const fileFilter = (req, file, cb) =>{
    const allowedTypes = /jpg|jpeg|png|gif/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if(extname && mimetype){
        cb(null, true);
    }else{
        cb(new Error('chỉ được upload ảnh!'));
    }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB
});

module.exports = upload;
