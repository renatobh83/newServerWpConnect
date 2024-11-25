import path from "node:path";
import { format } from "date-fns";
import multer from "multer";

const publicFolder = path.resolve(__dirname, "..", "..", "public");
export default {
	directory: publicFolder,

	storage: multer.diskStorage({
		destination: publicFolder,
		filename(
			req: any,
			file: { mimetype?: any; originalname: any },
			cb: (arg0: null, arg1: any) => any,
		) {
			// biome-ignore lint/suspicious/noImplicitAnyLet: <explanation>
			let fileName;
			if (file.mimetype?.toLocaleLowerCase().endsWith("xml")) {
				fileName = file.originalname;
			} else {
				const { originalname } = file;
				const ext = path.extname(originalname);
				const name = originalname.replace(ext, "");
				const date = format(new Date(), "ddMMyyyyHHmmssSSS");
				fileName = `${name}_${date}${ext}`;
			}

			return cb(null, fileName);
		},
	}),
};
