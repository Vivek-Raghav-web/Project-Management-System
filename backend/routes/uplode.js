import multer from "multer";
import path from "path";

console.log("🔥 REPORT =>", report);
console.log("🔥 PRESENTATION =>", presentation);
console.log("🔥 CODE =>", code);

if (report) {
  console.log("📄 REPORT NAME =>", report.name);
}

if (presentation) {
  console.log("📊 PRESENTATION NAME =>", presentation.name);
}

if (code) {
  console.log("💻 CODE NAME =>", code.name);
}
const storage = multer.diskStorage({
  

  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },

  filename: (req, file, cb) => {

    // ✅ ORIGINAL EXTENSION
    const ext = path.extname(file.originalname);

    // ✅ FILE NAME WITHOUT EXTENSION
    const name = path
      .basename(file.originalname, ext)
      .replace(/\s+/g, "-");

    // ✅ FINAL CLEAN NAME
    const finalName =
      Date.now() + "-" + name + ext;

    cb(null, finalName);
  },
});

const upload = multer({ storage });

export default upload;