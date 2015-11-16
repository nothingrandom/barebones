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

var ftpconfig = require('./ftpconfig.json');

// Task Aliases
// ==============================
gulp.task('default', ['sass', 'js', 'images']);

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
config.path.buildassets = config.path.root + 'build/assets/';

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
	.pipe(gulp.dest(config.path.css))
	.pipe(browserSync.stream());
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

// Images
// ==============================
var changed = require('gulp-changed'),
	imagemin = require('gulp-imagemin'),
	pngquant = require('imagemin-pngquant'),
	svg2png = require('gulp-svg2png');

gulp.task('images:svg', function() {
	return gulp.src(config.path.images + '**/*.svg')
	.pipe(changed(config.path.img))
	.pipe(svg2png())
	.pipe(gulp.dest(config.path.images));
});

gulp.task('images', ['images:svg'], function(done) {
	return gulp.src(config.path.images + '**/*.{png,gif,jpg,jpeg,svg}')
	.pipe(changed(config.path.img))
	.pipe(imagemin({
		optimizationLevel: 3,
		progressive: true,
		use: [pngquant()]
	}))
	.pipe(gulp.dest(config.path.img));
});

// Compression
// ==============================
var nano = require('gulp-cssnano'),
	stripify = require('stripify'),
	uglify = require('gulp-uglify');

gulp.task('compress', ['compress:css', 'compress:js-scripts', 'compress:js-vendor']);

gulp.task('compress:css', ['sass'], function(done) {
	return gulp.src(config.path.css + '**/*.css')
	.pipe(size({
		title: 'CSS before',
		showFiles: true
	}))
	.pipe(nano())
	.pipe(size({
		title: 'CSS after',
		showFiles: true
	}))
	.pipe(gulp.dest(config.path.buildassets + 'css/'));
});

gulp.task('compress:js-scripts', ['js'], function(done) {
	return gulp.src(config.path.js_src + '**/*.js')
	.pipe(plumber({
		errorHandler: logger.error
	}))
	.pipe(sourcemaps.init())
	.pipe(through2.obj(function (file, enc, next) {
		browserify(file.path)
		.transform('stripify')
		.bundle(function(err, res) {
			file.contents = res;
			next(null, file);
		});
	}))
	.pipe(concat('scripts.js'))
	.pipe(sourcemaps.write())
	.pipe(size({
		title: 'JS before',
		showFiles: true
	}))
	.pipe(uglify())
	.pipe(size({
		title: 'JS after',
		showFiles: true
	}))
	.pipe(gulp.dest(config.path.buildassets + 'js/'));
});

gulp.task('compress:js-vendor', ['js'], function(done) {
	return gulp.src(config.path.js + 'vendor/**/*.js')
	.pipe(plumber({
		errorHandler: logger.error
	}))
	.pipe(size({
		title: 'JS before',
		showFiles: true
	}))
	.pipe(uglify())
	.pipe(size({
		title: 'JS after',
		showFiles: true
	}))
	.pipe(gulp.dest(config.path.buildassets + 'js/vendor/'));
});

// Build
// ==============================
gulp.task('build:clean', function() {
	del([
		'build/**/*'
	]);
})

gulp.task('build:html', function() {
	return gulp.src(config.path.doc + '**/*.{html,htm,php}')
	.pipe(gulp.dest(config.path.build));
})

gulp.task('build:fonts', function() {
	return gulp.src(config.path.fonts + '**/*.*')
	.pipe(gulp.dest(config.path.buildassets + 'fonts'));
})

gulp.task('build:images', ['images'], function(done) {
	return gulp.src(config.path.img + '**/*.*')
	.pipe(gulp.dest(config.path.buildassets + 'images'));
})

gulp.task('build', function(cb) {
	runSequence('build:clean', 'compress', 'build:html', 'build:images', 'build:fonts', 'build:size', cb);
})

gulp.task('build:size', function() {
	return gulp.src(config.path.build + '**/*.*')
	.pipe(size());
})

// FTP
// ==============================
var ftp = require('vinyl-ftp');

var conn = ftp.create({
	host: ftpconfig.host,
	user: ftpconfig.user,
	pass: ftpconfig.pass,
	port: ftpconfig.port,
	parallel: 3,
	log: gutil.log
});

gulp.task('deploy:fast', function(done) {
	var globs = [
		'build/**'
	];

	return gulp.src(globs, {
		base: 'build',
		buffer: false
	})
	.pipe(conn.newer(ftpconfig.path))
	.pipe(conn.dest(ftpconfig.path));
})

gulp.task('deploy:clean', function(cb) {
	conn.rmdir(ftpconfig.path, cb)
})

gulp.task('deploy', function() {
	runSequence('build', 'deploy:fast');
})

// Notifications
// ==============================
var notify = require('gulp-notify');

var logger = {
	log: function() {
		var parts;
		parts = 1 <= arguments.length ? [].slice.call(arguments, 0) : [];
		return gutil.log.call(null, logger.format.apply(null, parts));
	},
	format: function() {
		var parts;
		parts = 1 <= arguments.length ? [].slice.call(arguments, 0) : [];
		return parts.join(' ').replace(config.path.root, '', 'g');
	},
	error: function(error) {
		notify.onError({
			title: 'Error (' + error.plugin + ')',
			message: logger.format(error.message)
		}).apply(this, arguments);

		return this.emit('end');
	}
};

// File size
// ==============================
var size = require('gulp-size');

gulp.task('size', function() {
	return gulp.src(config.path.doc + '**/*.*')
	.pipe(size({
		showFiles: true
	}));
});

// Browser Sync
// ==============================
var browserSync = require('browser-sync').create();

gulp.task('browser-sync', ['sass'], function() {
	browserSync.init({
		proxy: 'localhost'
	});

	gulp.watch(config.path.sass + '**/*.{sass,scss}', function(event) {
		logger.log(gutil.colors.magenta(event.path, gutil.colors.white(event.type)));
		return gulp.start('sass');
	});
	gulp.watch(config.path.doc + '**/*.{html,htm,php}').on('change', browserSync.reload);
});

// Watch
// ==============================
gulp.task('watch', ['default', 'browser-sync'], function(done) {
	gulp.watch([config.path.js_src + '**/*.js'], function(event) {
		logger.log(gutil.colors.magenta(event.path, gutil.colors.white(event.type)));
		return gulp.start('js');
	});

	gulp.watch([config.path.images + '**/*.{png,gif,jpg,jpeg,svg}'], function(event) {
		logger.log(gutil.colors.green(event.path, gutil.colors.white(event.type)));
		return gulp.start('images');
	});
});
