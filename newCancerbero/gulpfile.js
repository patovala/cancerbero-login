const gulp         = require('gulp'),
      autoprefixer = require('autoprefixer'),
      postcss      = require('gulp-postcss'),
      less         = require('gulp-less'),
      rucksack     = require('rucksack-css'),
      lost         = require('lost'),
      browserSync  = require('browser-sync').create(),
      minmax       = require('postcss-media-minmax'),
      customMedia  = require('postcss-custom-media'),
      plumber      = require('gulp-plumber'),
      cssnano      = require('cssnano'),
      rename       = require('gulp-rename');

var route = {
  less: {
    entry: './lib/assets/stylesheets/components.less',
    dest: './dist/assets/css/',
    lib: './lib/assets/stylesheets/**/*.less',
  },
};

gulp.task('compile:css', function(){
  var processors =  [
    autoprefixer(),
    lost(),
    rucksack(),
    minmax(),
    customMedia(),
    cssnano()
  ]

  return gulp.src(route.less.entry)
            .pipe(less())
            .pipe(postcss(processors))
            .pipe(rename('styles.css'))
            .pipe(gulp.dest(route.less.dest))
            .pipe(browserSync.stream())
});

gulp.task('watch', function(){
  gulp.watch(route.less.lib, ['compile:css']);
  gulp.watch('./dist/*.html').on('change', browserSync.reload);
});

gulp.task('serve', function() {
    browserSync.init({
        server: {
          baseDir: './dist'
        }
    });
});

gulp.task('default', ['watch', 'serve']);
