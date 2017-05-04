module.exports = function (grunt) {
  "use strict";

  grunt.initConfig({
    copy: {
      build: {
        files: [{
            expand: true,
            cwd: "./public",
            src: ["**"],
            dest: "./build/public"
          },
          {
            expand: true,
            cwd: "./views",
            src: ["**"],
            dest: "./build/views"
          }
        ]
      } 
    },
    ts: {
      app: {
        files: [{
          src: ["src/\*\*/\*.ts", "!src/.baseDir.ts"],
          dest: "./build"
        }],
        options: {
          "module": "commonjs",
          "target": "es6",
          "noImplicitAny": false,
          "sourceMap": true,
          "experimentalDecorators": true,
          "emitDecoratorMetadata": true
        }
      }
    },
    watch: {
      ts: {
        files: ["src/\*\*/\*.ts"],
        tasks: ["ts"]
      },
      views: {
        files: ["views/**/*.pug"],
        tasks: ["copy"]
      }
    }
  });

  grunt.loadNpmTasks("grunt-contrib-copy");
  grunt.loadNpmTasks("grunt-contrib-watch");
  grunt.loadNpmTasks("grunt-ts");
  grunt.loadNpmTasks("grunt-serve");

  grunt.registerTask("default", [
    "copy",
    "ts"
  ]);
  grunt.registerTask("ts-w", [
    "copy",
    "ts", 
    "watch"
  ]);

};