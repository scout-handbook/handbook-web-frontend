/* eslint-env node */

const yargs = require("yargs");
const fs = require("fs");

const gulp = require("gulp");
const uglify = require("uglify-js");
const composer = require("gulp-uglify/composer");
const merge = require("merge-stream");
const sourcemaps = require("gulp-sourcemaps");
const concat = require("gulp-concat");
const cleanCSS = require("gulp-clean-css");
const postcss = require("gulp-postcss");
const postcssCalc = require("postcss-calc");
const postcssCustomProperties = require("postcss-custom-properties");
const postcssGlobalData = require("@csstools/postcss-global-data");
const autoprefixer = require("autoprefixer");
const inject = require("gulp-inject-string");
const htmlmin = require("gulp-htmlmin");
const ts = require("gulp-typescript");

const pkg = require("./package.json");

const minify = composer(uglify, console);

function getConfig() {
  const location = yargs.string("config").argv.config;
  if (location === undefined) {
    throw new Error("No config specified");
  }
  return {
    ...JSON.parse(fs.readFileSync(location, "utf8")),
    cache: "handbook-" + pkg.version,
  };
}

function getThemeFiles() {
  const themeFiles = ["src/css/default-theme.css"];
  const argTheme = yargs.string("theme").argv.theme;
  if (argTheme !== undefined) {
    themeFiles.push(argTheme);
  }
  return themeFiles;
}

gulp.task("build:css", () => {
  function bundle(name, sources) {
    return gulp
      .src(sources)
      .pipe(sourcemaps.init())
      .pipe(concat(name + ".min.css"))
      .pipe(
        postcss([
          postcssGlobalData({ files: getThemeFiles() }),
          postcssCustomProperties({
            preserve: false,
          }),
          postcssCalc({ warnWhenCannotResolve: true }),
          autoprefixer(),
        ]),
      )
      .pipe(
        cleanCSS({
          compatibility: {
            properties: { colors: false },
          },
        }),
      )
      .pipe(sourcemaps.write("./"))
      .pipe(gulp.dest("dist/"));
  }
  return merge(
    bundle("frontend-computer", ["src/css/computer.css"]),
    bundle("frontend-handheld", ["src/css/handheld.css"]),
    bundle("frontend", [
      "src/css/competenceBubble.css",
      "src/css/fontello.css",
      "src/css/lesson.css",
      "src/css/main.css",
      "src/css/mainPage.css",
      "src/css/nav.css",
      "src/css/offlineSwitch.css",
      "src/css/topUI.css",
    ]),
    bundle("error", ["src/css/error.css"]),
  );
});

gulp.task("build:deps", () =>
  gulp
    .src([
      "node_modules/showdown/dist/showdown.min.js",
      "node_modules/showdown/dist/showdown.min.js.map",
      "node_modules/xss/dist/xss.min.js",
    ])
    .pipe(gulp.dest("dist/")),
);

gulp.task("build:font", () =>
  gulp
    .src([
      "src/font/fontello.eot",
      "src/font/fontello.svg",
      "src/font/fontello.ttf",
      "src/font/fontello.woff",
      "src/font/fontello.woff2",
    ])
    .pipe(gulp.dest("dist/font/")),
);

gulp.task("build:html", () =>
  gulp
    .src([
      "src/html/403.html",
      "src/html/404.html",
      "src/html/500.html",
      "src/html/enableJS.html",
      "src/html/index.html",
    ])
    .pipe(inject.replace("<!--FRONTEND-URI-->", getConfig()["frontend-uri"]))
    .pipe(
      inject.replace(
        "<!--FRONTEND-RESOURCES-PATH-->",
        getConfig()["frontend-resources-path"],
      ),
    )
    .pipe(sourcemaps.init())
    .pipe(inject.replace("<!--SITE-NAME-->", getConfig()["site-name"]))
    .pipe(htmlmin({ collapseWhitespace: true }))
    .pipe(sourcemaps.write("./"))
    .pipe(gulp.dest("dist/")),
);

gulp.task("build:icon", () =>
  merge(
    gulp.src([
      "src/icon/android-chrome-192x192.png",
      "src/icon/android-chrome-512x512.png",
      "src/icon/apple-touch-icon.png",
      "src/icon/favicon-16x16.png",
      "src/icon/favicon-32x32.png",
      "src/icon/favicon.ico",
      "src/icon/mstile-150x150.png",
      "src/icon/safari-pinned-tab.svg",
    ]),
    gulp
      .src(["src/icon/browserconfig.xml"])
      .pipe(
        inject.replace(
          "<!--FRONTEND-RESOURCES-PATH-->",
          getConfig()["frontend-resources-path"],
        ),
      ),
  ).pipe(gulp.dest("dist/")),
);

gulp.task("build:js", () => {
  function bundle(name, addConfig = false) {
    const tsProject = ts.createProject("tsconfig/" + name + ".json");
    let ret = tsProject
      .src()
      .pipe(
        inject.replace(
          '\\"\\"\\/\\*INJECTED\\-VERSION\\*\\/',
          '"' + pkg.version + '"',
        ),
      )
      .pipe(sourcemaps.init())
      .pipe(tsProject())
      .pipe(concat(name + ".min.js"));
    if (addConfig) {
      ret = ret.pipe(
        inject.prepend(
          '"use strict";\nvar CONFIG = JSON.parse(\'' +
            JSON.stringify(getConfig()) +
            "');\n",
        ),
      );
    }
    return ret
      .pipe(minify())
      .pipe(sourcemaps.write("./"))
      .pipe(gulp.dest("dist/"));
  }
  return merge(bundle("frontend", true), bundle("serviceworker"));
});

gulp.task("build:json", () =>
  gulp
    .src(["src/json/manifest.json"])
    .pipe(inject.replace("SITE-NAME", getConfig()["site-name"]))
    .pipe(
      inject.replace(
        "FRONTEND-RESOURCES-PATH",
        getConfig()["frontend-resources-path"],
      ),
    )
    .pipe(gulp.dest("dist/")),
);

gulp.task("build:php", () =>
  gulp.src(["src/php/sitemap.php"]).pipe(gulp.dest("dist/")),
);

gulp.task("build:png", () =>
  gulp.src(["src/png/avatar.png"]).pipe(gulp.dest("dist/")),
);

gulp.task("build:txt", () =>
  gulp.src(["src/txt/htaccess.txt"]).pipe(gulp.dest("dist/")),
);

gulp.task(
  "build",
  gulp.parallel(
    "build:css",
    "build:deps",
    "build:font",
    "build:html",
    "build:icon",
    "build:js",
    "build:json",
    "build:php",
    "build:png",
    "build:txt",
  ),
);
