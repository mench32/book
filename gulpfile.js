//Переменные
var path = {};

path.dev = {};
path.dev.root = 'dev';
path.dev.stylus = path.dev.root   + '/stylus';
path.dev.css =    path.dev.root   + '/css';
path.dev.fonts =  path.dev.root   + '/fonts';
path.dev.data =   path.dev.root   + '/data';
path.dev.jade =   path.dev.root   + '/template';
path.dev.html =   path.dev.root   + '/template';
path.dev.js =     path.dev.root   + '/js';
path.dev.images = path.dev.root   + '/img';
path.dev.sprite = path.dev.images + '/icons';
path.dev.svg =    path.dev.root   + '/svg';


path.pub = {};
path.pub.root =   'public';
path.pub.stylus = path.pub.root   + '/css';
path.pub.css =    path.pub.root   + '/css';
path.pub.fonts =  path.pub.stylus + '/fonts';
path.pub.data =   path.pub.root   + '/data';
path.pub.jade =   path.pub.root   + '';
path.pub.html =   path.pub.root   + '';
path.pub.js =     path.pub.root   + '/js';
path.pub.images = path.pub.root   + '/img';
path.pub.sprite = path.pub.images + '/icons';
path.pub.svg =    path.dev.root   + '/svg';

path.build = {};
path.build.root =   'build';
path.build.stylus = path.build.root   + '/css';
path.build.css =    path.build.root   + '/css';
path.build.fonts =  path.build.root   + '/fonts';
path.build.jade =   path.build.root   + '';
path.build.html =   path.build.root   + '';
path.build.js =     path.build.root   + '/js';
path.build.images = path.build.root   + '/img';
path.build.sprite = path.build.images + '/icons';
path.build.svg =    path.dev.root   + '/svg';


// Инициализируем плагины
var gulp =        require('gulp');              // Gulp JS
var concat =      require('gulp-concat');       // Склейка файлов
var csso =        require('gulp-csso');         // Минификация CSS
var ghPages =     require('gulp-gh-pages');     // плагин позволяющий заливать проект в отдельную ветку gh-pages
var imagemin =    require('gulp-imagemin');     // Минификация изображений
var jade =        require('gulp-jade');         // Плагин для Jade
var myth =        require('gulp-myth');         // Плагин для Myth
var sourcemaps =  require('gulp-sourcemaps');
var spritesmith = require('gulp.spritesmith');  // Плагин для создания спрайтов из PNG
var stylus =      require('gulp-stylus');       // Плагин для Stylus
var uglify =      require('gulp-uglify');       // Минификация JS
var bower =       require('gulp-bower');
var server =      require('gulp-express');
var exec =        require('child_process').exec;
var wrap =        require('gulp-wrap-amd');


function runCommand(command) {
    return function (cb) {
        exec(command, function (err, stdout, stderr) {
            console.log(stdout);
            console.log(stderr);
            cb(err);
        });
    }
}

gulp.task('bower', function() {
    return bower()
        .pipe(gulp.dest(path.pub.js + '/vendor/'))
});

gulp.task('deploy', function() {
    return gulp.src('./' + path.pub.root + '/**/*')
        .pipe(ghPages());
});

// Собираем css из stylus
gulp.task('stylus', function () {
    gulp.src('./' + path.dev.stylus + '/screen.styl')
        .on('error', console.log)
        .pipe(sourcemaps.init())
        .on('error', console.log)
        .pipe(stylus())
        .on('error', console.log)
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('./' + path.pub.stylus + '/'))
        .pipe(server.notify());
});

// Копируем шрифты
gulp.task('fonts', function() {
    gulp.src('./' + path.dev.fonts + '/**/*.*')
        .on('error', console.log)
        .pipe(gulp.dest('./' + path.pub.fonts + '/'))
        .on('error', console.log)
        .pipe(server.notify());
});

// Копируем данные
//gulp.task('data', function() {
//    gulp.src('./' + path.dev.data + '/**/*.*')
//        .pipe(gulp.dest('./' + path.pub.data + '/')) // записываем css
//        .pipe(server.notify());
//});


gulp.task("jade-runtime", function() {
    gulp.src(['./' + path.dev.js + '/views/**/*.jade'])
        .pipe(jade({
            pretty: true,
            client: true
        }))
        .on('error', console.log)
        .pipe(wrap({
            deps: ['jade', 'helpers'],
            params: ['jade', 'helpers'],
            exports: 'template'
        }))

        .pipe(gulp.dest('./' + path.pub.js + '/views/'))
        .pipe(server.notify());
});


// Собираем html из jade
gulp.task('jade', function() {
    gulp.src(['./' + path.dev.jade + '/**/*.jade', '!./' + path.dev.jade + '/**/_*.jade'])
        .pipe(jade({pretty: true}))
        .on('error', console.log)
        .pipe(gulp.dest('./' + path.pub.jade + '/'))
        .pipe(server.notify());
});

//копируем HTML
gulp.task('html', function() {
    gulp.src(['./' + path.dev.html + '/**/*.html'])
        .pipe(gulp.dest('./' + path.pub.html + '/'))
        .on('error', console.log)
        .pipe(server.notify());
});

// Собираем JS
gulp.task('js', function() {
    gulp.src(['./' + path.dev.js + '/**/*.js', '!./' + path.dev.js + '/vendor/**/*.js'])
        //.pipe(concat('index.js')) // Собираем все JS, кроме тех которые находятся в ./assets/js/vendor/**
        //.on('error', console.log)
        .pipe(gulp.dest('./' + path.pub.js + '/'))
        .pipe(server.notify());

    gulp.src(['./' + path.dev.js + '/vendor/**/*.js'])
        .pipe(gulp.dest('./' + path.pub.js + '/vendor/'))
        .on('error', console.log)
        .pipe(server.notify());

});

// Копируем и минимизируем изображенияe
gulp.task('images', function() {
    gulp.src(['./' + path.dev.images + '/**/*', '!./' + path.dev.images + '/icons/**/'])
        .pipe(imagemin())
        .on('error', console.log)
        .pipe(gulp.dest('./' + path.pub.images + '/'))
        .pipe(server.notify());
});

// Создаем спрайты иконок
gulp.task('sprite', function () {
    gulp.src('./' + path.dev.sprite + '/*.png')
        .on('error', console.log)
        .pipe(spritesmith({
            imgName: 'sprite.png',
            cssName: 'sprite.styl',
            cssFormat: 'stylus',
            algorithm: 'binary-tree',
            imgPath: '../img/sprite.png',
            //cssTemplate: 'stylus.template.mustache',
            cssVarMap: function(sprite) {
                sprite.name = 's-' + sprite.name
            }
        }))
        .pipe(gulp.dest('./' + path.pub.images + '/'))
        .pipe(gulp.dest('./' + path.dev.stylus + '/libs'))
        .pipe(server.notify());
});

gulp.task('server', function(){
    server.run(['server.js']);
});

//Слушаем изменения в папках
gulp.task('watch', function() {
    gulp.start(['images', 'sprite', 'jade', 'jade-runtime', 'html', 'stylus', 'js', 'fonts', 'bower']);

    gulp.watch([path.dev.stylus + '/**/*.styl'], ['stylus']);
    gulp.watch([path.dev.fonts + '/**/*.*'],     ['fonts']);
    //gulp.watch([path.dev.data + '/**/*.*'],      ['data']);
    gulp.watch([path.dev.jade + '/**/*.jade'],   ['jade']);
    gulp.watch([path.dev.js + '/views/**/*.jade'], ['jade-runtime']);
    gulp.watch([path.dev.html + '/**/*.html'],   ['html']);
    gulp.watch([path.dev.js + '/**/*.js'],       ['js']);
    gulp.watch([path.dev.images + '/**/*.*'],    ['images']);
    gulp.watch([path.dev.sprite + '/*.*'],       ['sprite']);
});

// Запуск сервера разработки gulp watch
gulp.task('default', ['server', 'watch']);

gulp.task('build', function() {
    // css
    gulp.src('./' + path.dev.stylus + '/screen.styl')
        .pipe(stylus()) // собираем stylus
        .on('error', console.log)
        .pipe(myth()) // добавляем префиксы
        .on('error', console.log)
        .pipe(csso()) // минимизируем css
        .on('error', console.log)
        .pipe(gulp.dest('./' + path.build.stylus)); // записываем css

    //копируем шрифты
    gulp.src('./' + path.dev.fonts + '/*.*')
        .pipe(gulp.dest('./' + path.build.fonts)); // записываем css

    // jade
    gulp.src(['./' + path.dev.jade + '/**/*.jade', '!./' + path.dev.jade + '/**/_*.jade'])
        .pipe(jade({
            pretty: true
        }))
        .on('error', console.log)
        .pipe(gulp.dest('./' + path.build.jade));

    // html
    gulp.src(['./' + path.dev.html + '/**/*.html'])
        .pipe(gulp.dest('./' + path.build.html));

    // js
    gulp.src(['./' + path.dev.js + '/**/*.js', '!./' + path.dev.js + '/vendor/**/*.js'])
        .pipe(concat('index.js'))
        .on('error', console.log)
        .pipe(uglify())
        .on('error', console.log)
        .pipe(gulp.dest('./' + path.build.js));

    gulp.src(['./' + path.dev.js + '/vendor/**/*.js'])
        .pipe(uglify())
        .on('error', console.log)
        .pipe(gulp.dest('./' + path.build.js + '/vendor'));

    // sprite
    gulp.src('./' + path.dev.images + '/**/*')
        .pipe(imagemin())
        .on('error', console.log)
        .pipe(gulp.dest('./' + path.build.images));

    gulp.task('sprite', function () {
        gulp.src('./' + path.dev.sprite + '/*.png')
            .pipe(spritesmith({
                imgName: 'sprite.png',
                cssName: 'sprite.styl',
                cssFormat: 'stylus',
                algorithm: 'binary-tree',
                imgPath: '../img/sprite.png',
                //cssTemplate: 'stylus.template.mustache',
                cssVarMap: function(sprite) {
                    sprite.name = 's-' + sprite.name
                }
            }))
            .on('error', console.log)
            .pipe(gulp.dest('./' + path.build.images))
            .pipe(gulp.dest('./' + path.dev.stylus + '/libs'))
    });


});

gulp.task('mongo-start', runCommand('mongod --dbpath ./dev/data/db/' ));
gulp.task('mongo-stop', runCommand('mongo --eval "use admin; db.shutdownServer();"'));