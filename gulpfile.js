'use strict';

const { series, parallel } = require('gulp');
const gulp = require('gulp');
const sass = require('gulp-dart-sass');
const babel = require('gulp-babel');
const concat = require('gulp-concat');
const uglify = require('gulp-uglify');
const cleanCSS = require('gulp-clean-css');
const sourcemaps = require('gulp-sourcemaps');

const paths = {
  styles: {
    src: 'src/scss/**/*.scss',
    dest: 'dist/css'
  },
  scripts: {
    src: 'src/js/**/*.js',
    dest: 'dist/js'
  }
};

// Compile Sass
function styles() {
  return gulp.src(paths.styles.src)
    .pipe(sourcemaps.init())
    .pipe(sass({outputStyle: 'expanded', sourcemaps: true, quietDeps: true}).on('error', sass.logError))
    .pipe(cleanCSS())
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(paths.styles.dest));
}
// Compile Javascript
function scripts() {
  return gulp.src(paths.scripts.src, { sourcemaps: true })
    .pipe(babel())
    .pipe(uglify())
    .pipe(concat('main.js'))
    .pipe(gulp.dest(paths.scripts.dest));
}

// Watch for changes
function watch(cb) {
  gulp.watch(paths.scripts.src, scripts);
  gulp.watch(paths.styles.src, styles);
  cb();
}

const build = series(styles, scripts, watch);

// Declare tasks
exports.sass = styles;
exports.scripts = scripts;
exports.watch = watch;
exports.build = build;

// Define default task that is called by just running gulp from cli
exports.default = build;