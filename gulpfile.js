"use strict";

const gulp = require('gulp');
const sass = require('gulp-sass');
const browsersync = require('browser-sync').create();
const concat = require('gulp-concat');
const uglify = require('gulp-uglify');
const del = require('del');
const autoprefixer = require('autoprefixer');
const notify = require('gulp-notify');
const babel = require('gulp-babel');
const postcss = require('gulp-postcss');
const scss = require('postcss-scss');
const mqpacker = require('css-mqpacker');
const nested = require('postcss-nested');
const cssnano = require('cssnano');
const svgo = require('gulp-svgo');

// BrowserSync
function browserSync(done) {
  browsersync.init({
    server: {
      baseDir: './app/'
    },
    port: 3000
  });
  done();
}

// BrowserSync Reload
function browserSyncReload(done) {
  browsersync.reload();
  done();
}

// styles
function css() {
  let plugins = [
    nested,
    mqpacker,
    autoprefixer,
    cssnano
  ];

  let src = [
    'app/scss/style.scss',
    'app/scss/404.scss'
  ];

  return gulp.src(src)
    .pipe(sass({outputStyle: 'expand'}).on('error', notify.onError()))
    .pipe(postcss(plugins, {syntax: scss}))
    .pipe(gulp.dest('app/css'))
    .pipe(browsersync.stream());
}

// scripts
function libsJS() {
  let src = [
    './app/libs/classlist-polyfill/index.js',
    './app/libs/nodelist-foreach-polyfill/index.js',
    './app/libs/element-closest/element-closest.js',
    './app/libs/svgxuse/svgxuse.min.js',
    './app/libs/count-up/countUp.min.js',
    './app/libs/tinyslider/tiny-slider.js',
    './app/libs/promise/polyfill.min.js',
    './app/libs/regenerator-runtime/runtime.js',
    './app/libs/fetch/fetch.js',
    './app/libs/intersection-observer/intersection-observer.js',
    './app/libs/lazyload/lazyload.min.js'
  ];

  return gulp.src(src)
    .pipe(uglify())
    .pipe(concat('scripts.min.js'))
    .pipe(gulp.dest('./app/js'));
}

// compile js
function compileJS() {
  return gulp.src([
    './app/js/es6/*.js'])
    .pipe(babel({presets: ['@babel/preset-env']}))
    .pipe(gulp.dest('./app/js'))
    .pipe(browsersync.stream());
}

// watch function
function watchFiles() {
  gulp.watch('./app/scss/**/*.scss', css);
  gulp.watch('./app/js/es6/*.js', compileJS);
  gulp.watch('./app/*.html', browserSyncReload);
}

// Clean assets
function clean() {
  return del(['./dist/']);
}

function buildHtml() {
  return gulp.src([
    'app/*.html',
    // 'app/.htaccess',
  ]).pipe(gulp.dest('dist'));
}

function buildCss() {
  return gulp.src([
    'app/css/style.css',
    'app/css/404.css',
  ]).pipe(gulp.dest('dist/css'));
}

function buildFonts() {
  return gulp.src([
    'app/fonts/**/*',
  ]).pipe(gulp.dest('dist/fonts'));
}

function buildJs() {
  return gulp.src([
    'app/js/jquery.min.js',
    'app/js/scripts.min.js',
    'app/js/common.js'
  ]).pipe(gulp.dest('dist/js'));
}

function images() {
  return gulp.src('app/img/**/*')
    .pipe(gulp.dest('dist/img'));
}

function icons() {
  return gulp.src('app/icons/**/*')
    .pipe(svgo({
      plugins: [
        {cleanupIDs: false},
      ]
    }))
    .pipe(gulp.dest('dist/icons'));
}

// define complex tasks
const js = gulp.series(libsJS, compileJS);
const build = gulp.series(clean, gulp.parallel(buildHtml, buildCss, buildFonts, libsJS, buildJs, images, icons));
const watch = gulp.series(js, gulp.parallel(watchFiles, browserSync));

// export tasks
exports.images = images;
exports.icons = icons;
exports.css = css;
exports.js = js;
exports.build = build;
exports.watch = watch;
exports.default = watch;
