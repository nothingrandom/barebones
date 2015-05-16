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