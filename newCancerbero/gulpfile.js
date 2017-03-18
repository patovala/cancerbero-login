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

const del = require('del');

const gulpLoadPlugins = require('gulp-load-plugins');
const $ = gulpLoadPlugins();

var route = {
  less: {
    entry: './assets/stylesheets/components.less',
    dest: './dist/',
    lib: './assets/stylesheets/**/*.less',
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
            .pipe(rename('captiveportal-style.css'))
            .pipe(gulp.dest(route.less.dest))
            .pipe(browserSync.stream())
});

gulp.task('html', ['compile:css'], () => {
  return gulp.src(['*.html', '*.php'])
    .pipe($.useref({searchPath: ['.tmp', 'html', '.']}))
    .pipe($.if('*.js', $.uglify()))
    .pipe($.if('*.css', $.cssnano({safe: true, autoprefixer: false})))
    //.pipe($.if('*.css', $.rev()))
    //.pipe($.revReplace())
    //.pipe($.if('*.html', $.htmlmin({collapseWhitespace: true})))
    .pipe(gulp.dest('dist/'));
});

gulp.task('assets', () => {
  return gulp.src(['assets/images/**/*', 'assets/js/*', 'assets/css/*'])
    .pipe(gulp.dest('dist/'));
});

gulp.task('watch', function(){
  gulp.watch(route.less.lib, ['compile:css']);
  gulp.watch('./*.html').on('change', browserSync.reload);
});

gulp.task('serve', function() {
    browserSync.init({
        server: {
          baseDir: ['.tmp', './dist'],
        }
    });
});

gulp.task('clean', del.bind(null, ['.tmp', 'dist']));

gulp.task('build', ['clean', 'html', 'compile:css', 'assets'], () => {
  return gulp.src('dist/**/*').pipe($.size({title: 'build', gzip: true}));
});

gulp.task('default', ['watch', 'html', 'assets', 'serve']);

