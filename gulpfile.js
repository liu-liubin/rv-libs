const gulp = require('gulp');
const babel = require('gulp-babel');
const ts = require("gulp-typescript");
const typescript = require('gulp-tsc');

// function streamTask() {
//   return src('src/app.js')
    // .pipe(babel({
    //   presets: ['@babel/env'],
    //   plugins: [
    //     '@babel/transform-runtime'
    //   ]
    // }))
//     .pipe(dest('dist'));
// }

// function appTask() {
//   var tsResult = src(["src/app.ts"])
//     .pipe(typescript({
//       noImplicitAny: true,
//       out: "rival.js",
//       module: "amd",
//       target: "ES5"
//     }))
//     .pipe(dest('dist/'));
//   return tsResult;
// }
// exports.default = streamTask;

gulp.task('app', function () {
  return gulp.src('src/app.ts')
    .pipe(ts({ outFile:"rival.js",module:"none"}))
    .pipe(babel({
      presets: ["@babel/preset-env"],
      plugins: [
        "@babel/plugin-transform-runtime"
      ]
    }))
    .pipe(gulp.dest("dist"));
});