// Requirements
// ==============================
var del = require('del'),
	gulp = require('gulp'),
	gutil = require('gulp-util'),
	path = require('path'),
	runSequence = require('run-sequence'),
	through2 = require('through2'),
	transform = require('vinyl-transform');

var plumber = require('gulp-plumber'),
	sourcemaps = require('gulp-sourcemaps');

// Config
// ==============================
var config = {
	path: {
		root: path.resolve(__dirname) + '/'
	}
};

// Base
config.path.doc = config.path.root + 'src/';
config.path.assets = config.path.doc + 'assets/';
config.path.build = config.path.root + 'build/';

// Source
config.path.sass = config.path.assets + 'scss/';
config.path.js_src = config.path.assets + 'js_src/';
config.path.images = config.path.assets + 'images_src/';
config.path.fonts = config.path.assets + 'fonts/';

// Compiled
config.path.css = config.path.assets + 'css/';
config.path.js = config.path.assets + 'js/';
config.path.img = config.path.assets + 'images/';

// SASS / SCSS > CSS
// ==============================
var autoprefixer = require('gulp-autoprefixer'),
	sass = require('gulp-sass');

gulp.task('sass', function() {
	return gulp.src(config.path.sass + '**/*.{scss,sass}')
	.pipe(plumber({
		errorHandler: logger.error
	}))
	.pipe(sourcemaps.init())
	.pipe(sass({
		includePaths: [
			config.path.vendor
		],
		precision: 10
	}))
	.pipe(sourcemaps.write({
		includeContent: false
	}))
	.pipe(sourcemaps.init({
		loadMaps: true
	}))
	.pipe(autoprefixer({
		browsers: [
		'> 1%',
		'last 2 versions',
		'Firefox ESR',
		'Opera 12.1',
		'IE 9'
		]
	}))
	.pipe(sourcemaps.write())
	.pipe(gulp.dest(config.path.css));
});

// JS
// ==============================
var browserify = require('browserify'),
	concat = require('gulp-concat');

gulp.task('js', function() {
	return gulp.src(config.path.js_src + '**/*.js')
	.pipe(plumber({
		errorHandler: logger.error
	}))
	.pipe(sourcemaps.init())
	.pipe(through2.obj(function (file, enc, next) {
		browserify(file.path)
		.bundle(function(err, res) {
			file.contents = res;
			next(null, file);
		});
	}))
	.pipe(concat('scripts.js'))
	.pipe(sourcemaps.write())
	.pipe(gulp.dest(config.path.js));
});
