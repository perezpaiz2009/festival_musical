const {
    src,
    dest,
    watch,
    parallel
} = require("gulp");

//css
const sass = require("gulp-sass")(require('sass'));
const plumber = require('gulp-plumber');
const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');
const postcss = require('gulp-postcss');
const sourcemaps = require('gulp-sourcemaps');


//imagenes
const avif = require('gulp-avif');
const cache = require('gulp-cache');
const imageMin = require('gulp-imagemin');
const webp = require('gulp-webp');

//javascript
const terser = require('gulp-terser-js');

function css(done) {
    src("src/scss/**/*.scss") //Identificar archivo Sass
        .pipe(sourcemaps.init())
        .pipe(plumber())
        .pipe(sass()) //compilarlo
        .pipe(postcss([autoprefixer(), cssnano()]))
        .pipe(sourcemaps.write('.'))
        .pipe(dest("build/css")) //almacenarlo a Disco Duro


    done(); //callback avisa a Gulp cuando llegamos al final
}


function imagenes(done) {
    const opciones = {
        optimizationLevel: 3
    }
    src('src/img/**/*.{jpg,png}')
        .pipe(cache(imageMin(opciones)))
        .pipe(dest('build/img'))

    done();
}

function versionWebp(done) {
    const opciones = {
        quality: 50
    };

    src('src/img/**/*.{jpg,png}')
        .pipe(webp(opciones))
        .pipe(dest('build/img'))

    done();
}

function versionAvif(done) {
    const opciones = {
        quality: 50
    };

    src('src/img/**/*.{jpg,png}')
        .pipe(avif(opciones))
        .pipe(dest('build/img'))

    done();
}

function javascript(done) {
    src('src/js/**/*.js')
        .pipe(sourcemaps.init())
        .pipe(terser())
        .pipe(sourcemaps.write('.'))
        .pipe(dest('build/js'));



    done();
}

function dev(done) {
    watch("src/scss/**/*.scss", css) //cuando cambie esta hoja de estilos manda a llamar esta funcion
    watch("src/js/**/*.js", javascript) //cuando cambie esta js manda a llamar esta funcion, para actualizar 
    //los cambios
    done();
}

exports.css = css; //mandando a llamar la funcion de CSS
exports.js = javascript;
exports.imagenes = imagenes;
exports.versionAvif = versionAvif;
exports.versionWebp = versionWebp;
exports.dev = parallel(imagenes, versionWebp, versionAvif, javascript, dev);