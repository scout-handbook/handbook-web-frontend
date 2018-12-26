"use strict";
/* eslint-env node */

var yargs = require('yargs');
var fs = require("fs")
var nestedObjectAssign = require('nested-object-assign');

var gulp = require('gulp');
var eslint = require('gulp-eslint');
var uglify = require('uglify-js');
var composer = require('gulp-uglify/composer');
var stylelint = require('gulp-stylelint');
var merge = require('merge-stream');
var sourcemaps = require('gulp-sourcemaps');
var concat = require('gulp-concat');
var cleanCSS = require('gulp-clean-css');
var postcss = require('gulp-postcss');
var postcssCustomProperties = require('postcss-custom-properties');
var autoprefixer = require('autoprefixer');
var inject = require('gulp-inject-string');
var htmlmin = require('gulp-htmlmin');

var pkg = require('./package.json');

var minify = composer(uglify, console);

function getConfig() {
	var config = nestedObjectAssign(JSON.parse(fs.readFileSync("src/json/config.json", "utf8")), {cache: 'handbook-' + pkg.version});
	var overrideLocation = yargs.string('config').argv.config
	if(overrideLocation) {
		config = nestedObjectAssign(config, JSON.parse(fs.readFileSync(overrideLocation, "utf8")));
	}
	return config;
}

gulp.task('eslint', function() {
	return gulp.src(['**/*.js', '!node_modules/**', '!dist/**'])
		.pipe(eslint())
		.pipe(eslint.format())
		.pipe(eslint.failAfterError());
});

gulp.task('stylelint', function() {
	return gulp.src(['**/*.css', '!node_modules/**', '!dist/**', '!src/css/fontello.css'])
		.pipe(stylelint({
			failAfterError: true,
			reporters: [
				{formatter: 'string', console: true}
			]
		}));
});

gulp.task('build:css', function() {
	function bundle(name, sources) {
		return gulp.src(sources)
			.pipe(sourcemaps.init())
			.pipe(concat(name + '.min.css'))
			.pipe(postcss([postcssCustomProperties({importFrom: getConfig(), preserve: false}), autoprefixer()]))
			//.pipe(gulp.dest('dist/'));
			.pipe(cleanCSS({compatibility: 'ie8'}))
			.pipe(sourcemaps.write('./'))
			.pipe(gulp.dest('dist/'));
	}
	return merge(
		bundle('frontend-pushed', [
			'src/css/fontello.css',
			'src/css/lesson.css',
			'src/css/main.css',
			'src/css/mainPage.css',
			'src/css/nav.css',
			'src/css/topUI.css'
		]),
		bundle('frontend-computer', [
			'src/css/computer.css'
		]),
		bundle('frontend-handheld', [
			'src/css/handheld.css'
		]),
		bundle('frontend', [
			'src/css/competenceBubble.css',
			'src/css/offlineSwitch.css'
		]),
		bundle('error', [
			'src/css/error.css'
		])
	);
});

gulp.task('build:deps', function() {
	return gulp.src([
		'node_modules/showdown/dist/showdown.min.js',
		'node_modules/xss/dist/xss.min.js'
	])
		.pipe(gulp.dest('dist/'));
});

gulp.task('build:font', function() {
	return gulp.src([
		'src/font/fontello.eot',
		'src/font/fontello.svg',
		'src/font/fontello.ttf',
		'src/font/fontello.woff',
		'src/font/fontello.woff2'
	])
		.pipe(gulp.dest('dist/font/'));
});

gulp.task('build:html', function() {
	return merge(
		gulp.src([
			'src/html/403.html',
			'src/html/404.html',
			'src/html/500.html',
			'src/html/enableJS.html'
		]),
		gulp.src([
			'src/html/index.html'
		])
			.pipe(inject.replace('<!--FRONTEND-URI-->', getConfig()['frontend-uri']))
	)
		.pipe(sourcemaps.init())
		.pipe(inject.replace('<!--SITE-NAME-->', getConfig()['site-name']))
		//.pipe(gulp.dest('dist/'));
		.pipe(htmlmin({collapseWhitespace: true}))
		.pipe(sourcemaps.write('./'))
		.pipe(gulp.dest('dist/'));
});

gulp.task('build:icon', function() {
	return merge(
		gulp.src([
			'src/icon/android-chrome-192x192.png',
			'src/icon/android-chrome-512x512.png',
			'src/icon/apple-touch-icon.png',
			'src/icon/favicon-16x16.png',
			'src/icon/favicon-32x32.png',
			'src/icon/favicon.ico',
			'src/icon/mstile-150x150.png',
			'src/icon/safari-pinned-tab.svg',
		]),
		gulp.src([
			'src/icon/browserconfig.xml'
		])
			.pipe(inject.replace('<!--ACCENT-COLOR-->', getConfig()['custom-properties']['--accent-color']))
	)
		.pipe(gulp.dest('dist/'));
});

gulp.task('build:js', function() {
	function bundle(name, sources, addConfig) {
		var ret = sources
			.pipe(sourcemaps.init())
			.pipe(concat(name + '.min.js'));
		if(addConfig) {
			ret = ret.pipe(inject.prepend('"use strict";\nvar CONFIG = JSON.parse(\'' + JSON.stringify(getConfig()) + '\');\n'))
		}
		return ret.pipe(inject.replace('\\"\\"\\/\\*INJECTED\\-VERSION\\*\\/', '"' + pkg.version + '"'))
			//.pipe(gulp.dest('dist/'));
			.pipe(minify({ie8: true}))
			.pipe(sourcemaps.write('./'))
			.pipe(gulp.dest('dist/'));
	}
	return merge(
		bundle('serviceworker', gulp.src([
			'src/js/serviceworker.js'
		])),
		bundle('frontend-pushed', gulp.src([
			'src/js/tools/cacheThenNetworkRequest.js',
			'src/js/tools/request.js',
			'src/js/UI/header.js',
			'src/js/UI/navigation.js',
			'src/js/UI/TOC.js',
			'src/js/views/lesson.js',
			'src/js/AfterLoadEvent.js',
			'src/js/authentication.js',
			'src/js/history.js',
			'src/js/main.js',
			'src/js/metadata.js'
		]), true),
		bundle('frontend', gulp.src([
			'src/js/tools/urlEscape.js',
			'src/js/UI/lessonView.js',
			'src/js/views/competence.js',
			'src/js/views/competenceList.js',
			'src/js/views/field.js',
			'src/js/views/lessonList.js',
			'src/js/getLessonById.js',
			'src/js/HandbookMarkdown.js',
			'src/js/xssOptions.js'
		]))
	);
});

gulp.task('build:json', function() {
	return gulp.src([
		'src/json/manifest.json'
	])
		.pipe(inject.replace('SITE-NAME', getConfig()['site-name']))
		.pipe(gulp.dest('dist/'));
});

gulp.task('build:php', function() {
	return gulp.src([
		'src/php/sitemap.php'
	])
		.pipe(gulp.dest('dist/'));
});

gulp.task('build:png', function() {
	return gulp.src([
		'src/png/avatar.png'
	])
		.pipe(gulp.dest('dist/'));
});

gulp.task('build:txt', function() {
	return gulp.src([
		'src/txt/htaccess.txt'
	])
		.pipe(gulp.dest('dist/'));
});

gulp.task('lint', gulp.series('eslint', 'stylelint'));

gulp.task('build', gulp.parallel('build:css', 'build:deps', 'build:font', 'build:html', 'build:icon', 'build:js', 'build:json', 'build:php', 'build:png', 'build:txt'));
