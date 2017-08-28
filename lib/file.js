/**
 * Created by hfcj3 on 2017/7/10.
 */
'use strict';
const multer = require('koa-multer');
/**
 * file
 */
exports.diskStore = path => {
	const storage = multer.diskStorage({
		/**
		 *设置上传后文件路径.
		 * 若传入函数，需手动创建目录
		 * 若传入字符串，则会自动创建
		 */
		//   destination: function (req, file, cb) {
		//       cb(null, './public/uploads')
		//  },  // 报错，需手动创建目录

		destination: path, // './public/uploads'
		filename: (req, file, cb) => {
			cb(null, file.originalname);
		}
	});

	return multer({ storage: storage});  // upload

};
/**
 * 文件读取到内存中，需注意内存溢出
 */
exports.memoryStore = () => {
	const storage = multer.memoryStorage();
	return multer({ storage: storage })
};