const gulp = require('gulp');
const concat = require('gulp-concat');
const plumber = require('gulp-plumber');
const postcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');
const del = require('del');
const browserSync = require('browser-sync').create();

// Локальный сервер

function serve() {
  browserSync.init({
    server: {
      baseDir: './dist',
    },
    notify: false,
    open: false,
    cors: true,
  });
}

// Копирование HTML

function html() {
  return gulp
    .src('src/**/*.html')
    .pipe(plumber())
    .pipe(gulp.dest('dist'))
    .pipe(browserSync.stream());
}

// Сборка и объединение CSS

function css() {
  return gulp
    .src('src/**/*.css')
    .pipe(plumber())
    .pipe(concat('bundle.css'))
    .pipe(
      postcss([
        autoprefixer({
          grid: true,
          overrideBrowserslist: ['last 5 versions'],
        }),
      ])
    )
    .pipe(gulp.dest('dist'))
    .pipe(browserSync.stream());
}

// Копирование шрифтов

function fonts() {
  return gulp
    .src('src/fonts/**/*.{woff,woff2,ttf,otf}', { encoding: false })
    .pipe(gulp.dest('dist/fonts'))
    .pipe(browserSync.stream());
}

// Копирование изображений

function images() {
  return gulp
    .src('src/images/**/*.{jpg,jpeg,png,svg,gif,ico,webp,avif}', {
      encoding: false,
    })
    .pipe(gulp.dest('dist/images'))
    .pipe(browserSync.stream());
}

// Очистка dist

function clean() {
  return del('dist');
}

// Вотчеры

function watchFiles() {
  gulp.watch('src/**/*.html', html);
  gulp.watch('src/**/*.css', css);
  gulp.watch('src/fonts/**/*.{woff,woff2,ttf,otf}', fonts);
  gulp.watch('src/images/**/*.{jpg,png,svg,gif,ico,webp,avif}', images);
}

// Сборка и запуск

const build = gulp.series(clean, gulp.parallel(html, css, images, fonts));
const watchapp = gulp.parallel(build, watchFiles, serve);

// Экспорты

exports.html = html;
exports.css = css;
exports.fonts = fonts;
exports.images = images;
exports.clean = clean;

exports.build = build;
exports.watchapp = watchapp;
exports.default = watchapp;
