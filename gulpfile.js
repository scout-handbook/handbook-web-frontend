"use strict";
/* eslint-env node */

var gulp = require('gulp');
var shell = require('gulp-shell');
var eslint = require('gulp-eslint');
var uglify = require('uglify-js');
var composer = require('gulp-uglify/composer');
var stylelint = require('gulp-stylelint');
var merge = require('merge-stream');
var sourcemaps = require('gulp-sourcemaps');
var concat = require('gulp-concat');
var cleanCSS = require('gulp-clean-css');
var postcss = require('gulp-postcss');
var autoprefixer = require('autoprefixer');
var inject = require('gulp-inject-string');
var htmlmin = require('gulp-htmlmin');

var pkg = require('./package.json');

var minify = composer(uglify, console);

gulp.task('eslint', function() {
	return gulp.src(['**/*.js', '!node_modules/**', '!API/**', '!dist/**'])
		.pipe(eslint())
		.pipe(eslint.format())
		.pipe(eslint.failAfterError());
});

gulp.task('stylelint', function() {
	return gulp.src(['**/*.css', '!node_modules/**', '!API/**', '!dist/**', '!src/shared/fontello?(-ie7).css'])
		.pipe(stylelint({
			failAfterError: true,
			reporters: [
				{formatter: 'string', console: true}
			]
		}));
});

gulp.task('npm-check-updates', shell.task(['npm outdated'], {ignoreErrors: true}));

gulp.task('build:html', function() {
	function bundle(name, sources) {
		return gulp.src(sources)
			.pipe(sourcemaps.init())
			.pipe(concat(name + '.min.html'))
			//.pipe(gulp.dest('dist/'));
			.pipe(htmlmin({collapseWhitespace: true}))
			.pipe(sourcemaps.write('./'))
			.pipe(gulp.dest('dist/'));
	}
	return merge(
		bundle('frontend', [
			'src/html/index.html'
		])
	);
});

gulp.task('build:js', function() {
	function bundle(name, sources) {
		return gulp.src(sources)
			.pipe(sourcemaps.init())
			.pipe(concat(name + '.min.js'))
			.pipe(inject.replace('\\"\\"\\/\\*INJECTED\\-VERSION\\*\\/', '"' + pkg.version + '"'))
			//.pipe(gulp.dest('dist/'));
			.pipe(minify({ie8: true}))
			.pipe(sourcemaps.write('./'))
			.pipe(gulp.dest('dist/'));
	}
	return merge(
		bundle('serviceworker', [
			'src/js/serviceworker.js'
		]),
		bundle('frontend-pushed', [
			'src/js/tools/cacheThenNetworkRequest.js',
			'src/js/tools/request.js',
			'src/js/UI/header.js',
			'src/js/UI/navigation.js',
			'src/js/UI/TOC.js',
			'src/js/views/lesson.js',
			'src/js/AfterLoadEvent.js',
			'src/js/authentication.js',
			'src/js/config.js',
			'src/js/history.js',
			'src/js/main.js',
			'src/js/metadata.js'
		]),
		bundle('frontend', [
			'src/js/tools/urlEscape.js',
			'src/js/UI/lessonView.js',
			'src/js/views/competence.js',
			'src/js/views/competenceList.js',
			'src/js/views/field.js',
			'src/js/views/lessonList.js',
			'src/js/getLessonById.js',
			'src/js/OdyMarkdown.js',
			'src/js/xssOptions.js'
		])
	);
});

gulp.task('build:css', function() {
	function bundle(name, sources) {
		return gulp.src(sources)
			.pipe(sourcemaps.init())
			.pipe(concat(name + '.min.css'))
			.pipe(postcss([autoprefixer()]))
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
		])
	);
});

gulp.task('build:php', function() {
	return gulp.src('src/php/*')
		.pipe(gulp.dest('dist/'));
});

gulp.task('build:txt', function() {
	return gulp.src('src/txt/*')
		.pipe(gulp.dest('dist/'));
});

gulp.task('build', gulp.parallel('build:html', 'build:css', 'build:js', 'build:php', 'build:txt'));
