var gulp = require('gulp'),
	sass = require('gulp-sass'),
	neat = require('node-neat').includePaths,
	vulcanize = require('gulp-vulcanize'),
	runSequence = require('run-sequence'),
	clean = require('gulp-clean'),
	removeEmptyDirectories = require('remove-empty-directories'),
	fs = require('fs'),
	ncp = require('ncp').ncp;

var paths = {
	mainScss: './src/assets/style.scss',
	elementScss: './src/elements/*.scss',
	elementCss: './src/elements',
	srcPath: './src',
	distPath: './dist',
	bowerComponentsPath: './src/bower_components',
	srcAssets: "./src/assets",
	distAssets: "./dist/assets",
	manifestFile: "manifest.yml"
};

if (!fs.existsSync(paths.distPath)) {
	fs.mkdirSync(paths.distPath);
}

gulp.task('clean', function() {
	return gulp.src(paths.distPath + "/*")
		.pipe(clean({
			force: true
		}))
});

gulp.task('prune-empty-subfolders', function() {
	var removed = removeEmptyDirectories(paths.distPath);
});

gulp.task('copy-assets', function(done) {
	ncp.limit = 16;
	ncp(paths.srcAssets, paths.distAssets, function(err) {
		if (err) console.error(err);
		done();
	});
});

gulp.task('main-sass', function() {
	return gulp.src(paths.mainScss)
		.pipe(sass({
			includePaths: [paths.bowerComponentsPath].concat(neat)
		}))
		.pipe(gulp.dest(paths.srcAssets));
});

gulp.task('element-sass', function() {
	return gulp.src(paths.elementScss)
		.pipe(sass({
			includePaths: [paths.bowerComponentsPath].concat(neat)
		}))
		.pipe(gulp.dest(paths.elementCss));
});

gulp.task('sass', function(done) {
	runSequence('main-sass', 'element-sass', function() {
		done();
	});
});

gulp.task('vulcanize', function() {
	return gulp.src(paths.srcPath + "/index.html")
		.pipe(vulcanize({
			stripComments: true,
			inlineScripts: true,
			inlineCss: true
		}))
		.pipe(gulp.dest(paths.distPath));
});

gulp.task('watch', function() {
	gulp.watch('src/**/*', ["build"]);
});

gulp.task('build', function(done) {
	runSequence('clean', 'sass', 'vulcanize', 'prune-empty-subfolders',
		'copy-assets',
		function() {
			done();
		});
});

gulp.task('default', ['build', 'watch']);
