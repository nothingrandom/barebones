# barebones

**A lightweight starting point for web projects**

[![Build status](https://travis-ci.org/nothingrandom/barebones.svg?branch=master)](https://travis-ci.org/nothingrandom/barebones)
[![devDependency Status](https://david-dm.org/nothingrandom/barebones/dev-status.svg)](https://david-dm.org/nothingrandom/barebones#info=devDependencies)
[![Built with gulp](http://nothingrandom.com/images/built-gulp.png)](http://gulpjs.com/)

----------

## Quick Start
1. Clone the repo
2. Run `npm intall`
3. Write code, compile with `gulp`
4. Build something awesome

## What's included
- Advanced gulpfile
  - Compile scss/sass to css
  - Compile multiple JS files with browsify
  - Image minification
  - Build project for release
  - Deploy project over ftp
  - Notifications on Mac
- SCSS structure
  - Normalize / Reset CSS
  - Advanced mixins
- Lightweight grid (coming soon)

## In depth
### gulpfile
The gulpfile is built with the front end developer in mind, with the aim of not being cluttered or slow.

##### `gulp`
The basis of this task is simple. It will compile all of your sass, js, and images.

##### `gulp watch`
This task takes the default `gulp` task and watches for future changes.

##### `gulp sass`
All you need to do it write your scss/sass in the folder "src/assets/scss" and this task will compile to css. Compiled files can be found in the "src/assets/css" folder.

##### `gulp js`
Just write your javascript in the "src/assets/js_src" folder and this gulp task will compile all the different files into one. Compiled files can be found in the "src/assets/js" folder.

##### `gulp images`
Images are big. That doesn't need to be the case. Place your images in the "src/assets/images_src" folder and this task will compress them and place them within the "src/assets/images" folder.

##### `gulp compress`
When you get to the end of the project and are deploying, you no longer need to have pretty code. Instead you need small files. Run this task to achieve that. The compressed files can be found in "build/".

> **Note**

> - Unused css styles will be trimmed from the compressed stylesheets
> - `console.log` lines will be trimmed from the compressed JS

##### `gulp build`
When you're ready to hand over the project, run this task and all the important stuff will be compressed and copied over to the "build" folder.

##### `gulp deploy`
Run this task to copy your build folder over to your server via FTP. Enter your credentials in the "ftpconfig.json" file. You can also run `gulp deploy:clean` to delete the files within the path you're using.

##### `gulp notify`
This runs in the background. If you're using OS X, when something bad happens you'll get a notification so you can go and fix it.

###### ToDo
- More notifications
- Add browser-sync
- Code linter

### scss
The scss file structure is designed to allow you to start writing your stylesheets with minimal setup.

##### colors
Nested palette to allow for easy access to multiple color variants

`color: palette(grey, dark);`

##### fonts
`@include font-face("Font Name", "/path/to/font", 400, normal);`

##### mobile
Media queries for custom screen sizes. Range from 150px to 1500px+. Change `$screen-**` in the "_variables.scss" file.

##### reset
CSS reset inspired by both [normalize.css](http://necolas.github.io/normalize.css/) and [Reset CSS](http://meyerweb.com/eric/tools/css/reset/)

##### utilities
A wide range of mixins and functions. All self-documenting.

**Some of my favorites**
###### functions
- em (convert px to em)
- rem (convert px to rem)
- palette ([colors](#colors))
- rgba-convert (convert hex to rgba)

###### mixins
- font-face ([fonts](#fonts))
- placeholder (style placeholders with @content)
- clearfix (`:after` style. Useful when working with floats)
- screen-min/max/range ([mobile](#mobile))

##### variables
Find the variables used across the project here.
- `$base-font-size`
- screen break points
- grid settings

### grid
Coming soon

_Made by [nothingrandom](http://nothingrandom.com) :)_
