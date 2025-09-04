const 	gulp			= require('gulp'),
		sass			= require('gulp-sass')(require('sass')),
		browserSync		= require('browser-sync'),
		concat			= require('gulp-concat'),
		uglify			= require('gulp-uglify'),
		cleanCSS		= require('gulp-clean-css'),
		rename			= require('gulp-rename'),
		autoprefixer	= require('gulp-autoprefixer'),
		notify			= require("gulp-notify"),
		fileInclude		= require('gulp-file-include');


// Сервер и автообновление страницы Browsersync
gulp.task('browser-sync', function() {
	browserSync({
		server: {
			baseDir: 'app'
			// baseDir: 'app'
		},
		notify: false,
		// tunnel: true,
		// tunnel: "projectmane", //Demonstration page: http://projectmane.localtunnel.me
	});
});

// Минификация пользовательских скриптов проекта и JS библиотек в один файл
gulp.task('js', function() {
	return gulp.src([
		// 'app/libs/jquery/app/jquery.min.js',
		// 'app/js/common.js', // Всегда в конце
		])
	.pipe(concat('scripts.min.js'))
	// .pipe(uglify()) // Минимизировать весь js (на выбор)
	.pipe(gulp.dest('app/js'))
	.pipe(browserSync.reload({ stream: true}));
});

gulp.task('sass', function() {
	return gulp.src('app/sass/*.sass')
	.pipe(sass({outputStyle: 'expanded'}).on("error", notify.onError()))
	.pipe(concat('main.css'))
	// .pipe(rename({suffix: '.min', prefix : ''}))
	// .pipe(autoprefixer(['last 15 versions']))
	// .pipe(cleanCSS()) // Опционально, закомментировать при отладке
	.pipe(gulp.dest('app/Styles'))
	.pipe(browserSync.reload({ stream: true }));
});

// gulp.task('css', function() {
// 	return gulp.src('app/Styles/*.css')
// 	.pipe(browserSync.reload({ stream: true }))
// });

gulp.task('code', function() {
	// return gulp.src('app/**/*.html')
	return gulp.src('app/html/main.html')
	.pipe(fileInclude({
		prefix: '@@',    // Префикс для вставки
		basepath: '@file' // Путь к файлам
	}))
	.pipe(rename('index.html'))
	.pipe(gulp.dest('app'))
	.pipe(browserSync.reload({ stream: true }))
});

gulp.task('watch', function() {
	gulp.watch('app/sass/*.sass', gulp.parallel('sass'));
	// gulp.watch('app/Styles/**/*.css', gulp.parallel('css'));
	// gulp.watch(['libs/**/*.js', 'app/js/common.js'], gulp.parallel('js'));
	gulp.watch(['app/*.html', 'app/partials/*.html'], gulp.parallel('code'));
});

gulp.task('default', gulp.parallel('sass', 'code', 'browser-sync', 'watch'));

// Общая задача
gulp.task('build', gulp.series('sass', 'code'));
