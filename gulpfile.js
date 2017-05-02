var gulp = require("gulp");
var del = require('del');
var rename = require('gulp-rename');
var install = require('gulp-install');
var zip = require('gulp-zip');
var uglify = require('gulp-uglify');
var AWS = require('aws-sdk');
var fs = require('fs');
var runSequence = require('run-sequence');
var webpack = require('webpack-stream');

// First we need to clean out the dist folder and remove the compiled zip file.
gulp.task('clean', function(cb) {
  del('./dist');
  cb();
});

gulp.task("webpack", function () {
  return gulp.src('src/Index.js')
  .pipe(webpack( require('./webpack-dev.config.js') ))
  .pipe(gulp.dest('dist/'));
});

// The js task could be replaced with gulp-coffee as desired.
gulp.task("js", function () {
  return gulp
    .src("dist/index.js")
    .pipe(gulp.dest("dist/"));
});

// Here we want to install npm packages to dist, ignoring devDependencies.
gulp.task('npm', function() {
  return gulp
    .src('./package.json')
    .pipe(gulp.dest('./dist/'))
    .pipe(install({production: true}));
});

// Next copy over environment variables managed outside of source control.
gulp.task('env', function() {
  return gulp
    .src('./config.env.production')
    .pipe(rename('config.env'))
    .pipe(gulp.dest('./dist'));
});

// Now the dist directory is ready to go. Zip it.
gulp.task('zip', function() {
  return gulp
    .src(['dist/**/*', '!dist/package.json', 'dist/.*'])
    .pipe(zip('dist.zip'))
    .pipe(gulp.dest('./'));
});

// The key to deploying as a single command is to manage the sequence of events.
gulp.task('dist', function(cb) {
  return runSequence(
    ['clean'],
    ['webpack'],
    ['js', 'npm', 'env'],
    ['zip'],
//    ['upload'],
    function (err) {
      //if any error happened in the previous tasks, exit with a code > 0
      if (err) {
        cb(err);
        var exitCode = 2;
        console.log('[ERROR] gulp build task failed', err);
        console.log('[FAIL] gulp build task failed - exiting with code ' + exitCode);
        return process.exit(exitCode);
      }
      else {
        return cb();
      }
    }
  );
});
