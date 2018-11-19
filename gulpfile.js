const proxy = require('http-proxy-middleware');
const gulp = require('gulp');
const uglify = require('gulp-uglify');
const cleanCss = require('gulp-clean-css');
const autoprefixer = require('gulp-autoprefixer');
const babel = require('gulp-babel');
const connect = require('gulp-connect');
const livereload = require('gulp-livereload');
const scss = require('gulp-sass');

const jsPath = './src/js/*';
const cssPath = './src/css/*';
const htmlPath = './src/index.html';
const imgsPath = './src/images/**/*';

gulp.task('csstask', () => {
    gulp.src(cssPath)
    .pipe(scss())
    .pipe(autoprefixer({
        browsers: ['last 2 versions']
    }))
    .pipe(cleanCss())
    .pipe(gulp.dest('dist/css'))
    .pipe(livereload())
})
gulp.task('jstask', () => {
    gulp.src(jsPath)
    .pipe(babel({
        presets: ['@babel/env']
    }))
    .pipe(uglify())
    .pipe(gulp.dest('dist/js'))
    .pipe(livereload())
})
gulp.task('imgtask', () => {
    gulp.src(imgsPath)
    .pipe(gulp.dest('dist/images'))
})
gulp.task('htmltask', () => {
    gulp.src(htmlPath)
    .pipe(gulp.dest('dist'))
    .pipe(livereload())
})
gulp.task('connect', () => {
    connect.server({
        host: 'localhost',
        port: '8888',
        livereload: true,
        middleware(connect, opt) {
            return [
                proxy('/jkact/lot', {
                    target: 'http://172.16.100.93:8080',
                    changeOrigin: true
                })
            ]
        }
    })
})
gulp.task('watch', () => {
    livereload.listen();
    gulp.watch(cssPath, ['csstask'])
    gulp.watch(jsPath, ['jstask'])
    gulp.watch(htmlPath, ['htmltask'])
})
gulp.task('default', ['connect', 'jstask', 'imgtask', 'csstask', 'htmltask', 'watch']);