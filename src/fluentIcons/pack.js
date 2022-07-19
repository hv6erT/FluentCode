import svgtofont from 'svgtofont';
import path from "path";
 
await svgtofont({
  src: path.resolve(process.cwd(), 'icons'),
  dist: path.resolve(process.cwd(), 'fonts'),
  fontName: 'fluentIconsFont',
  emptyDist: true,
  classNamePrefix: "fluent-icons",
  css: {
    fontSize: "18px"
  },
  svgicons2svgfont: {
    fontHeight: 1000,
    normalize: true
  },
});