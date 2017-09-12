module.exports = function ( grunt ) {

    // Project configuration.
    grunt.initConfig( {
        pkg   : grunt.file.readJSON( "package.json" ),
        concat: {
            options: {
                banner: "/*! <%= pkg.name %> <%= grunt.template.today(\"yyyy-mm-dd\") %> */\n"
            },
            build  : {
                src : [ "bower_components/jquery/dist/jquery.js", "bower_components/angular/angular.js", "src/environments/*js", "src/app.js", "src/*.js", "src/**/*.js", "!src/environments/environment.js" ],
                dest: "dist/<%= pkg.name %>.min.js"
            }
        }
    } );

    // Load the plugin that provides the "uglify" task.
    grunt.loadNpmTasks( "grunt-contrib-concat" );

};