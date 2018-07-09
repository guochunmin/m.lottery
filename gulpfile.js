var gulp = require('gulp');

/*
 * 基本Plugins
 * gulp-rename 重命名
 * gulp-concat 合并打包
 */

var path = require('path');
var del = require('del');
var runSequence = require('run-sequence');
var base64 = require('gulp-base64');
var nodemon = require('gulp-nodemon');

/*
 * Plugins required for packaging ejs
 * gulp-htmlmin 压缩html（ejs,jade）等文件
 */

var miniHtml = require('gulp-htmlmin');

/*
 * Plugins required for packaging less
 * gulp-less 将less编译为css
 * gulp-base64 将文件编译为base64字符串
 * gulp-clean-css 压缩css
 * gulp-autoprefixer 打包编译时自动添加浏览器前缀
 */

var less = require('gulp-less');
var miniCss = require('gulp-clean-css');
var autoprefixer = require('gulp-autoprefixer');

/*
 * Plugins required for packaging js
 * gulp-uglify 压缩js
 * gulp-babel 将es6转化为es5
 * babel-core
 * babel-preset-es2015
 */

var miniJs = require('gulp-uglify');
var babel = require("gulp-babel");

/*
 * Plugins required for packaging images
 * gulp-imagemin 压缩images
 */

var miniImg = require('gulp-imagemin');

/*
 * 删除文件
 */

gulp.task('clean', function() {
    del(['dist/**/*']);
});

/*
 * 打包压缩ejs
 */

gulp.task('ejs',function() {
	return gulp
		.src('client/views/**/*.ejs')
		.pipe(miniHtml({
			collapseWhitespace: true
		}))
		.pipe(gulp.dest('dist/views/'))
});

/*
 * 打包压缩less
 */

gulp.task("less",function() {
	return gulp
		.src(['client/less/**/*.less'])
		.pipe(less({
			paths: [path.join(__dirname, 'less', 'includes')]
		}))
		.pipe(autoprefixer('last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'))
		.pipe(base64())
		.pipe(miniCss())
		.pipe(gulp.dest('dist/css/'))
})

/*
 * 打包压缩js
 */

gulp.task("js",function() {
	return gulp
		.src(['client/js/**/*.js'])
        .pipe(
        	babel({
            	presets: ['es2015']  
        	})
        )
		.pipe(
			miniJs({
				compress: true
			})
		)
		.pipe(gulp.dest('dist/js/'))
});

/*
 * 压缩、打包图片
 */

gulp.task('img',function() {
	return gulp
		.src('client/images/**/*')
		.pipe(
			miniImg({
				optimizationLevel: 3,
				progressive: true,
				interlaced: true
			})
		)
		.pipe(gulp.dest('dist/images/'))
});

/*
 * 打包字体文件
 */

gulp.task('fonts', function() {
	return gulp
		.src(['client/fonts/**/*'])
		.pipe(gulp.dest('dist/css/fonts/'))
});

/*
 * 打包全部
 */

gulp.task('build',['ejs','less','js','img','fonts'],function(){
	// 监听ejs
	gulp.watch('client/**/*.ejs', ['ejs']);
	// 监听所有css文档
	gulp.watch('client/**/*.less', ['less']);
	// 监听所有js文档
	gulp.watch('client/js/**/*', ['js']);
	// 监听所有image
	gulp.watch('client/images/**/*', ['img']);
	// 监听fonts文件
	gulp.watch('client/fonts/**/*', ['fonts']);
});

/*
 * 开启Express服务
 */

gulp.task('nodemon',function(cb){
//gulp.task('nodemon',['build'],function(cb){
	var started = false;
	return nodemon({
			script: './app'
		})
		.on("start",function(){
			if(!started){
				cb();
				started=true;
			}
		})
})

/*
 * 定义默认任务  
 */

gulp.task('default',function(){
	runSequence('clean','build','nodemon');
});