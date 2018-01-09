'use strict';

var gulp = require('gulp'),
  watch = require('gulp-watch'),
  sourcemaps = require('gulp-sourcemaps'),
  rigger = require('gulp-rigger'),
	concat = require('gulp-concat'),
	uglify = require('gulp-uglify'),
  minifycss = require('gulp-clean-css'),
  rimraf = require('rimraf'),
	browserSync = require("browser-sync"),
	changed = require('gulp-changed'),
  reload = browserSync.reload,
	notify = require('gulp-notify'),
	through2 = require('through2');

var path = {
			build: {
        html: 'build/',
				php: 'build/',
        js: 'build/js/',
        css: 'build/css/',
        img: 'build/img/',
        fonts: 'build/fonts/'
    },
    src: {
        html: 'src/**/*.html',
				php: 'src/**/*.php',
				js: ['src/js/lib/angular.min.js', 'src/js/lib/*.js', 'src/js/app.js', 'src/js/*.js'],
				css:  'src/**/*.css',
        img: 'src/img/**/*.*',
				fonts: 'src/fonts/**/*.*'
    },
    watch: {
        html: 'src/**/*.html',
        js: 'src/js/**/*.js',
				css: 'src/**/*.css',
        img: 'src/img/**/*.*',
        fonts: 'src/fonts/**/*.*',
				php: 'src/**/*.php'
    },
    clean: './build'
};

gulp.task('connect-sync', function() {
  browserSync.init({
		proxy: "mysite.ru/filemanager2/build"
  });
});

gulp.task('clean', function (cb) {
    rimraf(path.clean, cb);
});

gulp.task('html:build', function () {
    return gulp.src(path.src.html) 
      .pipe(rigger())
			.pipe(gulp.dest(path.build.html))
      .pipe(reload({stream: true}));
});

gulp.task('js:build', function () {
    return gulp.src(path.src.js) 
    .pipe(rigger()) 
		.pipe(sourcemaps.init()) 
		.pipe(concat('script.js'))
		.pipe(uglify())
		.pipe(sourcemaps.write('../maps')) 
    .pipe(gulp.dest(path.build.js))
    .pipe(reload({stream: true}));
});

gulp.task('style:build', function () {
    return gulp.src(path.src.css) 
    .pipe(sourcemaps.init())
    .pipe(concat('styles.css'))
		.pipe(minifycss())
    .pipe(sourcemaps.write('../maps'))
    .pipe(gulp.dest(path.build.css))
    .pipe(reload({stream: true}));
});

gulp.task('image:build', function () {
    return gulp.src(path.src.img) 
		.pipe(changed(path.build.img))
    .pipe(gulp.dest(path.build.img))
    .pipe(reload({stream: true}));
});

gulp.task('fonts:build', function() {
    return gulp.src(path.src.fonts)
    .pipe(gulp.dest(path.build.fonts));
});

gulp.task('php:build', function() {
    return gulp.src(path.src.php)
    .pipe(gulp.dest(path.build.php))
		.pipe(reload({stream: true}));
});

gulp.task('build', [
    'html:build',
    'js:build',
    'style:build',
		'fonts:build',
		'php:build',
    'image:build'
]);


gulp.task('watch', function(){
    watch([path.watch.html], function(event, cb) {
        gulp.start('html:build');
    });
  	watch([path.watch.css], function(event, cb) {
        gulp.start('style:build');
		});
    watch([path.watch.js], function(event, cb) {
        gulp.start('js:build');
    });
    watch([path.watch.img], function(event, cb) {
        gulp.start('image:build');
    });
		watch([path.watch.php], function(event, cb) {
        gulp.start('php:build');
    });
	  watch([path.watch.fonts], function(event, cb) {
        gulp.start('fonts:build');
    });
});


gulp.task('default', ['build', 'connect-sync', 'watch']);