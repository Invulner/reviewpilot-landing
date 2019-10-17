'use strict';

var gulp        = require('gulp');
var gutil       = require('gulp-util');
var sass        = require('gulp-sass');
var pug         = require('gulp-pug');
var babel       = require('gulp-babel');
var livereload  = require('gulp-livereload');
var zip         = require('gulp-zip');
var rev         = require('gulp-rev');
var revReplace  = require('gulp-rev-replace');
var del         = require('del');
var gulpIf      = require('gulp-if')
var browserSync = require('browser-sync').create();
var include     = require('gulp-include');

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

var manifestFile = 'manifest.json'
var args = require('yargs').argv
var isDevelopment = args._[0] != 'build'

// Compiles pug
gulp.task('pug', function() {
  return gulp.src(pugFiles.src)
    .pipe(pug({
      locals: {},
      pretty: true
    }))
    .pipe(gulpIf(!isDevelopment, revReplace({
      manifest: gulp.src(manifestFile, {allowEmpty: true})
    })))
    .pipe(gulp.dest(pugFiles.dist));
});

// Compiles SCSS
gulp.task('sass', function() {
  return gulp.src(scssFiles.src)
    .pipe(sass().on('error', sass.logError))
    .pipe(gulpIf(!isDevelopment, rev()))
    .pipe(gulp.dest(scssFiles.dist))
    .pipe(gulpIf(!isDevelopment, rev.manifest(manifestFile, {
      base: 'manifest',
      merge: true
    })))
    .pipe(browserSync.stream())
    .pipe(gulpIf(!isDevelopment, gulp.dest('manifest')));
});

// Compiles Vanilla JS
gulp.task('js', () => {
  return gulp.src(jsFiles.src)
    .pipe(include({
      includePaths: [
        __dirname + "/node_modules"
      ]
    }))
    .pipe(gulpIf(!isDevelopment, rev()))
    .pipe(gulp.dest(jsFiles.dist))
    .pipe(gulpIf(!isDevelopment, rev.manifest(manifestFile, {
      base: 'manifest',
      merge: true
    })))
    .pipe(browserSync.reload({
      stream: true
    }))
    .pipe(gulpIf(!isDevelopment, gulp.dest('manifest')));
});

// Compiles ES6 JS
gulp.task('js:babel', () => {
  return gulp.src(jsFiles.src)
    .pipe(include({
      includePaths: [
        __dirname + "/node_modules"
      ]
    }))
    .pipe(gulpIf(!isDevelopment, rev()))
    .pipe(babel({ presets: ['es2015'] }))
    .pipe(gulp.dest(jsFiles.dist))
    .pipe(gulpIf(!isDevelopment, rev.manifest(manifestFile, {
      base: 'manifest',
      merge: true
    })))
    .pipe(gulpIf(!isDevelopment, gulp.dest('manifest')));
});

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
    .pipe(gulpIf(!isDevelopment, rev()))
    .pipe(gulp.dest(assetsFiles.dist))
    .pipe(gulpIf(!isDevelopment, rev.manifest(manifestFile, {
      base: 'manifest',
      merge: true
    })))
    .pipe(gulpIf(!isDevelopment, gulp.dest('manifest')))
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
gulp.task('browsersync', function() {
  browserSync.init({
    server: paths.dist,
    port: 8001
  })
});

// [npm run build] Default Task
gulp.task('default', gulp.series('sass', 'js', 'move', 'pug'));

// [npm run build] Build Task
gulp.task('build', gulp.series('default'));

// [npm run serve] Serve Task
gulp.task('serve', gulp.series('default', gulp.parallel('watch', 'browsersync')));

// Zip dist task
gulp.task('zip', () => {
  return gulp.src(zipFiles.src)
    .pipe(zip(zipFiles.name))
    .pipe(rev())
    .pipe(gulp.dest(zipFiles.dist));
});
