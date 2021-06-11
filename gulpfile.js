const { src, dest, task, watch, series, parallel } = require("gulp")
const autoprefixer = require("gulp-autoprefixer")
const { sass } = require("@mr-hope/gulp-sass")
const mode = require("gulp-mode")()
const pug = require("gulp-pug")
const del = require("del")

task("build:pug", () => {
  return src("src/*.pug")
    .pipe(pug({ pretty: mode.development() }))
    .pipe(dest("build/"))
})

task("build:sass", () => {
  return src("src/styles/styles.scss")
    .pipe(sass().on("error", sass.logError))
    .pipe(autoprefixer())
    .pipe(dest("build"))
})

task("watch:pug", () => {
  return watch("src/**/*.pug", task("build:pug"))
})

task("watch:sass", () => {
  return watch("src/styles/**/*.scss", task("build:sass"))
})

task("clean", () => {
  return del(["build/**/*"])
})

const build = series("clean", parallel("build:pug", "build:sass"))
const start = series(build, parallel("watch:pug", "watch:sass"))

exports.default = mode.production() ? build : start
exports.build = build
exports.start = start
