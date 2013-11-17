Picture Gallery
================

This gallery-software is an easy to use UNIX-style HTML generator. It
use erb-templates (Ruby) to generate an HTML-image-gallery of your
files.  The generator should work on all Linux, MacOS X or other UNIX
flavors. Your clients should have a webkit based browser that supports
HTML5 and CSS3.

Preconditions
-------------

You should have

* a bunch of image-files
* `convert`, a tool of the [ImageMagick](http://www.imagemagick.org) package
* `erb`, a ruby based html-template engine

Usage
-----

In order to use this online-photo-gallery you have to

1. put your image files into `pics/<name>` directory (p.e. `pics/asia2012/`)
1. create thumbnails of your images and
1. render the html-gallery into a html file.

### Create Thumbnails ###

Before you can render the html page the directories should look like
this:

    .
    |-- create.sh
    +-- css/
    |-- photogallery.js
    |-- gallery_target_dir.erb
    +-- icons/
    +--. pics/
       +--. asia2012/
          |-- IMG_3688.jpg
          |-- IMG_3689.jpg
          ...
          |-- IMG_5969.jpg
          +-- thumb/


Now you generate thumbnails:
    cd pics/asia2012
    for each in *.jpg; do convert -size 120x120 $each -resize 120x120 thumb/tmb_$each; done
    cd ..

After generating the thumbnails your directory should looks like this:

    .
    |-- create.sh
    +-- css/
    |-- photogallery.js
    |-- gallery_target_dir.erb
    +-- icons/
    +--. pics/
       +--. asia2012/
          |-- IMG_3688.jpg
          |-- IMG_3689.jpg
          ...
          |-- IMG_5969.jpg
          +--. thumb/
             |-- tmb_IMG_3688.jpg
             ..
             |-- tmb_IMG_5696.jpg

### Render html page ###

After creating your thumbnails you can render your target html page:

    % ./create.hs pics/asia2012 > gallery_asia2012.html
