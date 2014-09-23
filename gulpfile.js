var gulp = require('gulp'),
    jshint = require('gulp-jshint');

var jsapp = [
	'app/js/*.js'
	];

gulp.task('default', function() {

});

gulp.task('jshint', function() {
	return gulp.src(jsapp)
		.pipe(jshint())
		.pipe(jshint.reporter('default'));
});
