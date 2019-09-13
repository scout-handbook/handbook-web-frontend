/* eslint-env node */
/* eslint-disable @typescript-eslint/no-var-requires */

interface CustomProperties {
	"--accent-color": string;
}

interface Config {
	"frontend-uri": string;
	"site-name": string;
	"custom-properties": CustomProperties;
}

const yargs = require('yargs');
const fs = require("fs")
const nestedObjectAssign = require('nested-object-assign');

const gulp = require('gulp');
const eslint = require('gulp-eslint');
const uglify = require('uglify-js');
const composer = require('gulp-uglify/composer');
const stylelint = require('gulp-stylelint');
const merge = require('merge-stream');
const sourcemaps = require('gulp-sourcemaps');
const concat = require('gulp-concat');
const cleanCSS = require('gulp-clean-css');
const postcss = require('gulp-postcss');
const postcssCustomProperties = require('postcss-custom-properties');
const autoprefixer = require('autoprefixer');
const inject = require('gulp-inject-string');
const htmlmin = require('gulp-htmlmin');
const ts = require("gulp-typescript");

const pkg = require('./package.json');

const minify = composer(uglify, console);

function getConfig(): Config {
	let config = nestedObjectAssign(JSON.parse(fs.readFileSync("src/json/config.json", "utf8")), {cache: 'handbook-' + pkg.version});
	const overrideLocation = yargs.string('config').argv.config
	if(overrideLocation) {
		config = nestedObjectAssign(config, JSON.parse(fs.readFileSync(overrideLocation, "utf8")));
	}
	return config;
}

gulp.task('eslint', function() {
	return gulp.src(['**/*.js', '**/*.ts', '!node_modules/**', '!dist/**'])
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
	function bundle(name: string, sources: Array<string>): NodeJS.ReadWriteStream {
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
		'node_modules/showdown/dist/showdown.min.js.map',
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
	function bundle(name: string, addConfig = false): NodeJS.ReadWriteStream {
		const tsProject = ts.createProject("tsconfig/" + name + ".json");
		let ret = tsProject.src()
			.pipe(inject.replace('\\"\\"\\/\\*INJECTED\\-VERSION\\*\\/', '"' + pkg.version + '"'))
			.pipe(sourcemaps.init())
			.pipe(tsProject())
			.pipe(concat(name + '.min.js'));
		if(addConfig) {
			ret = ret.pipe(inject.prepend('"use strict";\nvar CONFIG = JSON.parse(\'' + JSON.stringify(getConfig()) + '\');\n'))
		}
		return ret
			//.pipe(gulp.dest('dist/'));
			.pipe(minify({ie8: true}))
			.pipe(sourcemaps.write('./'))
			.pipe(gulp.dest('dist/'));
	}
	return merge(
		bundle('serviceworker'),
		bundle('frontend-pushed', true),
		bundle('frontend')
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
