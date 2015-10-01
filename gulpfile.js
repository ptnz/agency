'use strict';

/* Gulp plugins */
var gulp = require('gulp'), // Task runner
		watch = require('gulp-watch'), // Watch, that actually is an endless stream
		rename = require("gulp-rename"), // Rename files
		del = require('del'), // Delete something
		rigger = require('gulp-rigger'), // Include content of one file to another
		path = require('path'),
	processhtml = require('gulp-processhtml'), // Plugin uses Denis Ciccale's node-htmlprocessor to process/transform html files
		concat = require('gulp-concat'), // Concatenates files
		streamqueue = require('streamqueue'), // Pipe queued streams progressively, keeping datas order.
		sourcemaps = require('gulp-sourcemaps'), // Write source maps
		less = require('gulp-less'), // Compile Less to CSS
		lessReporter = require('gulp-less-reporter'), // Error reporter for gulp-less
		autoprefixer = require('gulp-autoprefixer'), // Prefix CSS
		size = require('gulp-size'), // Display the size of something
		csscomb = require('gulp-csscomb'), // Coding style formatter for CSS
		minifycss = require('gulp-minify-css'), // Minify CSS
		uglify = require('gulp-uglify'), // Minify JS
		jshint = require('gulp-jshint'), // JS code linter
		stylish = require('jshint-stylish'), // Reporter for JSHint
		imagemin = require('gulp-imagemin'), // Optimize images
		pngquant = require('imagemin-pngquant'), // PNG plugin for ImageMin
		ghPages = require('gulp-gh-pages'), // Publish contents to Github pages
		runSequence = require('run-sequence').use(gulp), // Run a series of dependent gulp tasks in order
		browserSync = require("browser-sync"), // Synchronised browser testing
		cssbeautify = require('gulp-cssbeautify'),
		reload = browserSync.reload;


/* Path settings */
var projectPath = {
	build: { // Set build paths
		html: 'build/',
		js: 'build/js/',
		jsMainFile: 'main.js',
		css: 'build/css/',
		img: 'build/img/images/',
		pngSprite: 'build/img/sprites/png/',
		fonts: 'build/fonts/'
	},

	src: { // Set source paths
		html: 'src/*.html',
		jsCustom: 'src/js/custom.js',
		jsVendor: 'src/js/vendor.js',
		style: 'src/styles/style.less',
		img: 'src/img/images/**/*.*',
		pngSprite: 'src/img/sprites/png/**/*.png',
		fonts: 'src/fonts/**/*.*'
	},
	watch: { // Set watch paths
		html: 'src/**/*.html',
		js: 'src/js/**/*.js',
		style: 'src/styles/**/*.less',
		img: 'src/img/images/**/*.*',
		pngSprite: 'src/img/sprites/png/**/*.png',
		fonts: 'src/fonts/**/*.*'
	},
	clean: ['build/**/*', '!build/.gitignore'], // Set paths and exludes for cleaning build dir
	ghPages: './build/**/*' // Set dir that will be uploaded to GitHub Pages
};


/* BrowserSync local web server settings */
var config = {
	server: {
		baseDir: "./build"
	},
	tunnel: false,
	host: 'localhost',
	port: 9000,
	injectChanges: true,
	logPrefix: "App Front-End"
};


/*********/
/* Tasks */
/*********/


/* BrowserSync local web server*/
gulp.task('webserver', function () {
	browserSync(config);
});


/* HTML */
gulp.task('html', function () {
	return gulp.src(projectPath.src.html)
			.pipe(processhtml({
				recursive: true
			}))
			.pipe(size({
				title: 'HTML'
			}))
			.pipe(gulp.dest(projectPath.build.html))
			.pipe(reload({stream: true}));
});


/* JavaScript */
gulp.task('js', function () {
	return streamqueue(
			{objectMode: true},
			gulp.src(projectPath.src.jsVendor).pipe(rigger()).pipe(size({title: 'Vendor JavaScript'})),
			gulp.src(projectPath.src.jsCustom).pipe(rigger()).pipe(jshint()).pipe(jshint.reporter(stylish)).pipe(size({title: 'Custom JavaScript'}))
	)
			.pipe(concat(projectPath.build.jsMainFile))
			.pipe(sourcemaps.init())
			.pipe(gulp.dest(projectPath.build.js))
			.pipe(rename({suffix: '.min'}))
			.pipe(uglify())
			.pipe(sourcemaps.write('./'))
			.pipe(size({
				title: 'Total JavaScript'
			}))
			.pipe(gulp.dest(projectPath.build.js))
			.pipe(reload({stream: true}));
});


/* Less */
gulp.task('less', function () {
	return gulp.src(projectPath.src.style)
			.pipe(sourcemaps.init())
			.pipe(less({
				paths: [ path.join(__dirname, 'less', 'includes') ]
			}))
			.on('error', lessReporter)
			//.pipe(autoprefixer('> 2%'))
			.pipe(autoprefixer([
				'Android 2.3',
				'Android >= 4',
				'Chrome >= 20',
				'Firefox >= 24', // Firefox 24 is the latest ESR
				'Explorer >= 8',
				'iOS >= 6',
				'Opera >= 12',
				'Safari >= 6']))
			//.pipe(csscomb())
			.pipe(cssbeautify({
				indent: '  ',
				openbrace: 'end-of-line',
				autosemicolon: true
			}))
			.pipe(gulp.dest(projectPath.build.css))


			.pipe(rename({suffix: '.min'}))
			.pipe(minifycss())
			.pipe(sourcemaps.write('./'))
			.pipe(size({
				title: 'CSS'
			}))
			.pipe(gulp.dest(projectPath.build.css))
			.pipe(reload({stream: true}));
});


/* Images */
gulp.task('images', function () {
	return gulp.src(projectPath.src.img)
			.pipe(imagemin({
				progressive: true,
				optimizationLevel: 5,
				use: [pngquant()],
				interlaced: true
			}))
			.pipe(size({
				title: 'Images'
			}))
			.pipe(gulp.dest(projectPath.build.img))
			.pipe(reload({stream: true}));
});


/* PNG Sprite simple-version*/
gulp.task('png-sprite', function () {
	return gulp.src(projectPath.src.pngSprite)
			.pipe(gulp.dest(projectPath.build.pngSprite))
			.pipe(reload({stream: true}));
});


/* Fonts */
gulp.task('fonts', function () {
	return gulp.src(projectPath.src.fonts)
			.pipe(size({
				title: 'Fonts'
			}))
			.pipe(gulp.dest(projectPath.build.fonts))
			.pipe(reload({stream: true}));
});


/* Clean build directory */
gulp.task('clean', function (cb) {
	del(projectPath.clean, cb);
});


/* Github Pages */
gulp.task('demo', function () {
	return gulp.src(projectPath.ghPages)
			.pipe(ghPages());
});


/* Build */
gulp.task('build', function (callback) {
	runSequence(
			'clean',
			'html',
			'js',
			'less',
			'images',
			'png-sprite',
			'fonts',
			//'demo',
			callback)
});


/* Watching */
gulp.task('watch', ['webserver'], function () {
	watch([projectPath.watch.html], function (event, cb) {
		gulp.start('html');
	});
	watch([projectPath.watch.js], function (event, cb) {
		gulp.start('js');
	});
	watch([projectPath.watch.style], function (event, cb) {
		gulp.start('less');
	});
	watch([projectPath.watch.img], function (event, cb) {
		gulp.start('images');
	});
	watch([projectPath.watch.pngSprite], function (event, cb) {
		gulp.start('png-sprite');
	});
	watch([projectPath.watch.fonts], function (event, cb) {
		gulp.start('fonts');
	});
});



/* Default */
gulp.task('default', ['watch'], function (callback) {

});
