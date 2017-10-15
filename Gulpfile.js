var gulp = require('gulp');
var $ = require('gulp-load-plugins')();

var paths = {
    lintables: [
        "./app/**/*.js",
    ]
};

// Run Hapi server and reload on changes
gulp.task('serve', function() {
    $.nodemon({
        script: 'index.js',
        ignore: ['Gulpfile.js', 'node_modules', 'rethinkdb_data']
    });
});

gulp.task('lint', function() {
  return gulp.src(paths.lintables)
    .pipe($.jshint())
    .pipe($.jshint.reporter('default'));
});

gulp.task('watch', function () {
    gulp.watch(paths.lintables, ['lint']);
});

gulp.task('default', ['serve', 'watch']);
