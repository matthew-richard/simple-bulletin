module.exports = function (grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('./package.json'),

    assemble: {
      options: {
        layout: 'page.hbs',
        layoutdir: 'layouts',
        partials: ['partials/*']
      },
      posts: {
        files: [{
          cwd: 'content',
          dest: '.',
          expand: true,
          src: ['*']
        }]
      }
    },

    watch: {
      content: {
        files: ['content/*.md', 'layouts/*.hbs',
                'partials/*.hbs', 'js/**/*.js', 'css/**/*.css'],
        tasks: ['assemble'],
      },
      source: {
        files: ['server.js'],
        tasks: ['exec:run']
      }
    },

    exec: {
      run: {
        command: 'tmux send-keys -t server:edit.2 C-c C-m "node server.js" C-m'
      }
    }

  });

  console.log(grunt.config.get("assemble.posts.files[0]"));

  grunt.loadNpmTasks('assemble');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-exec');

  grunt.registerTask('default', ['assemble']);
}
