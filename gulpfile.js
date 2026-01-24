import postcssGlobalData from "@csstools/postcss-global-data";
import autoprefixer from "autoprefixer";
import fs from "fs";
import gulp from "gulp";
import cleanCSS from "gulp-clean-css";
import concat from "gulp-concat";
import htmlmin from "gulp-htmlmin";
import inject from "gulp-inject-string";
import postcss from "gulp-postcss";
import sourcemaps from "gulp-sourcemaps";
import ts from "gulp-typescript";
import composer from "gulp-uglify/composer.js";
import ordered from "ordered-read-streams";
import postcssCalc from "postcss-calc";
import postcssCustomProperties from "postcss-custom-properties";
import uglify from "uglify-js";
import yargs from "yargs";
import { hideBin } from "yargs/helpers";

const minify = composer(uglify, console);

function getConfig() {
  const location = yargs(hideBin(process.argv)).string("config").argv.config;

  if (location === undefined) {
    throw new Error("No config specified");
  }
  const pkg = JSON.parse(fs.readFileSync("./package.json", "utf8"));
  return {
    ...JSON.parse(fs.readFileSync(location, "utf8")),
    cache: `handbook-${pkg.version}`,
  };
}

function getThemeFiles() {
  const themeFiles = ["src/css/default-theme.css"];
  const argTheme = yargs(hideBin(process.argv)).string("theme").argv.theme;
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
      .pipe(concat(`${name}.min.css`))
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
  return ordered([
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
  ]);
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
    .src(
      [
        "src/font/fontello.eot",
        "src/font/fontello.svg",
        "src/font/fontello.ttf",
        "src/font/fontello.woff",
        "src/font/fontello.woff2",
      ],
      { encoding: false },
    )
    .pipe(gulp.dest("dist/font/")),
);

gulp.task("build:html", () =>
  gulp
    .src([
      "src/html/403.php",
      "src/html/404.php",
      "src/html/500.php",
      "src/html/enableJS.php",
      "src/html/index.php",
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
  gulp
    .src(
      [
        "src/icon/android-chrome-192x192.png",
        "src/icon/android-chrome-512x512.png",
        "src/icon/apple-touch-icon.png",
        "src/icon/favicon-16x16.png",
        "src/icon/favicon-32x32.png",
        "src/icon/favicon.ico",
        "src/icon/mstile-150x150.png",
        "src/icon/safari-pinned-tab.svg",
      ],
      { encoding: false },
    )
    .pipe(gulp.dest("dist/")),
);

gulp.task("build:js", () => {
  function bundle(name, addConfig = false) {
    const tsProject = ts.createProject(`tsconfig/${name}.json`);
    const pkg = JSON.parse(fs.readFileSync("./package.json", "utf8"));
    let ret = tsProject
      .src()
      .pipe(inject.replace("INJECTED\\-VERSION", pkg.version))
      .pipe(sourcemaps.init())
      .pipe(tsProject())
      .pipe(concat(`${name}.min.js`));
    if (addConfig) {
      ret = ret.pipe(
        inject.prepend(
          `"use strict";\nvar CONFIG = JSON.parse('${JSON.stringify(
            getConfig(),
          )}');\n`,
        ),
      );
    }
    return ret
      .pipe(minify())
      .pipe(sourcemaps.write("./"))
      .pipe(gulp.dest("dist/"));
  }
  return ordered([bundle("frontend", true), bundle("serviceworker")]);
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
  gulp
    .src(["src/png/avatar.png"], { encoding: false })
    .pipe(gulp.dest("dist/")),
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
