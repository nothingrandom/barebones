# barebones
> barebones is the starting point for stylesheets.

## Installation
Using this project is fairly straight forward.

Just drop the contents of the `scss` folder into your `stylesheet` folder and run either `yarn add browser-reset` or `npm install -save browser-reset` to also add my [browser-reset](https://github.com/nothingrandom/browser-reset) project

### What this is
This project is a great starting point for writing clean, functional stylesheets using scss.

#### Grid
This project includes [flexboxgrid](flexboxgrid.com) as a grid system. [Browser support](https://caniuse.com/#search=flexbox)

#### Color Palettes
I'm really good at creating a messy array of color variables. This palette system exists to "fix" that. Instead of using `$grey`, `$grey-light`, `$grey-lighter`, `$grey-lightest` you can break it down into categories. Your colors file will look a little like this

```
$palettes: (
  grey: (
    base: #808080,
    light: #959595,
    lighter: #b5b5b5,
    lightest: #d5d5d5
  ),
);
```

And when you need to color something, you can just do this `color: palette(grey, light)`

#### REM and EM
There's REM and EM pixel conversions. `font-size: em(16px)` becomes `1em`

#### Font Family
Googling how to include a font package gets a bit irritating. Instead you can use the following syntax `@include font-face('Font Name', '/path/to/font', 400, normal);` and it will generate the font-face from `eot`, `eot?#iefix`, `woff` and `ttf. I use [FontPrep](https://github.com/briangonzalez/fontprep) to convert font files for this.

#### Breakpoints
Modern web means supporting screen sizes of all sorts. I like to build mobile first, so that's the way my breakpoints work.

```
.class {
  width: 100px;

  @include breakpoint(md) {
    width: 500px;
  }

  @include breakpoint(lg) {
    width: 1000px;
  }
}
```

You can find the variables for these in the `scss/_variables` file

#### The rest
I've done a fairly job of writing a lot of comments in the `scss/_utilities` file, so a quick read through will give a good overview of everything included


### Wishlist (and issues)
Any features you'd like to see? Any features don't work for you? Let me know with the issue tracker.

### Recommendations

I recommend that you use this [scss-lint](https://github.com/nothingrandom/scss-lint-default.yml) config to keep you code clean and tidy.

----------

##### _Made by [Benjamin Hollway](http://nothingrandom.com) :)_
