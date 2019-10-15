'use strict';

var gulp        = require('gulp');
var gutil       = require('gulp-util');
var sass        = require('gulp-sass');
var pug         = require('gulp-pug');
var babel       = require('gulp-babel');
var livereload  = require('gulp-livereload');
var zip         = require('gulp-zip');
var rev         = require('gulp-rev');
var del         = require('del');
var browserSync = require('browser-sync');
var spa         = require('browser-sync-spa');
var include     = require('gulp-include');

browserSync.use(spa());

var paths = {
  src: 'src',
  dist: 'dist'
};

var pugFiles = {
  src: paths.src + '/views/**/!(_)*.pug',
  dist: paths.dist,
  watch: paths.src + '/views/**/*.pug'
}

var htmlFiles = {
  watch: paths.dist + '/**/*.html'
}

var scssFiles = {
  src: paths.src + '/sass/main.sass',
  dist: paths.dist + '/css/',
  watch: paths.src + '/sass/**/*.sass'
}

var jsFiles = {
  src: paths.src + '/js/**/*.js',
  dist: paths.dist + '/js',
  watch: paths.src + '/js/**/*.js'
}

var assetsFiles = {
  src: paths.src + '/assets/**/*.*',
  dist: paths.dist,
  watch: paths.src + '/assets/**/*.*'
}

var zipFiles = {
  src: paths.dist + '/**/*.*',
  dist: './zip/',
  name: 'reviewpilot-landing.zip'
}

// Compiles pug
gulp.task('pug', function() {
  return gulp.src(pugFiles.src)
    .pipe(pug({
      locals: {},
      pretty: true
    }))
    .pipe(gulp.dest(pugFiles.dist))
});

// Compiles SCSS
gulp.task('sass', function() {
  return gulp.src(scssFiles.src)
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest(scssFiles.dist))
    .pipe(browserSync.stream());
});

// Compiles Vanilla JS
gulp.task('js', () => {
  return gulp.src(jsFiles.src)
    .pipe(include({
      includePaths: [
        __dirname + "/node_modules"
      ]
    }))
    .pipe(gulp.dest(jsFiles.dist))
    .pipe(browserSync.reload({
      stream: true
    }));
});

// Compiles ES6 JS
gulp.task('js:babel', () => {
  return gulp.src(jsFiles.src)
    .pipe(include({
      includePaths: [
        __dirname + "/node_modules"
      ]
    }))
    .pipe(babel({ presets: ['es2015'] }))
    .pipe(gulp.dest(jsFiles.dist));
});

// Inits Browser Sync server
function browserSyncServe(done) {
  browserSync.init({
    ghostMode: true,
    notify: false,
    server: {
      baseDir: paths.dist
    },
    open: 'local'
  });
  done();
}

// Simple timeout to deal with Pug compiling lag
function reloadBrowserSyncPug() {
  setTimeout(reloadBrowserSync, 500);
}

// Reload Browser sync
function reloadBrowserSync() {
  browserSync.reload();
}

// Move all assets task
gulp.task('move', () => {
  return gulp.src(assetsFiles.src)
    .pipe(gulp.dest(assetsFiles.dist));
});

// Move assets task
gulp.task('moveassets', gulp.series('move'));

// Watch Task
gulp.task('watch', function() {
  gulp.watch(pugFiles.watch, gulp.series('pug', reloadBrowserSyncPug));
  gulp.watch(scssFiles.watch, gulp.series('sass'));
  gulp.watch(jsFiles.watch, gulp.series('js'));
  gulp.watch(assetsFiles.watch, gulp.series('moveassets', reloadBrowserSyncPug));
});

// Browsersync Task
gulp.task('browsersync', gulp.series(browserSyncServe));

// [npm run build] Default Task
gulp.task('default', gulp.series('pug', 'sass', 'js', 'move'));

// [npm run build] Build Task
gulp.task('build', gulp.series('default'));

// [npm run serve] Serve Task
gulp.task('serve', gulp.series('default', 'watch', 'browsersync'));

// Zip dist task
gulp.task('zip', () => {
  return gulp.src(zipFiles.src)
    .pipe(zip(zipFiles.name))
    .pipe(rev())
    .pipe(gulp.dest(zipFiles.dist));
});
