$(function() {
  DEBUG = false;
  /* config
  * interval : time in ms between the display of images
  * playtime : timeout for the setInterval function
  * current  : index of the current image
  * current_thumb_block : index of the current thumbnail
  * number_of_thumbnails_per_view : the number of images inside of each wrapper
  */
  var interval = 4000;
  var playtime;
  var current = 0;
  var current_thumb_block = 1;
  var number_of_thumbnails_per_view = 18;

  /* internal state
  * number_of_thumbnails : total number  of thumbsnails
  */
  var number_of_thumbnails = $('#thumbnail_container .thumbnail_block').length * number_of_thumbnails_per_view - 1;
  var last_thumbnail_block = Math.ceil(number_of_thumbnails / number_of_thumbnails_per_view);
  var thumb_open = false;
  var thumb_index = 0;

  /*event keycodes*/
  var KEY_RET = 13;
  var KEY_SPACE = 32;
  var KEY_LEFT = 37;
  var KEY_UP = 38;
  var KEY_RIGHT = 39;
  var KEY_DOWN = 40;
  var KEY_A = 65;
  var KEY_S = 83;

  $('document').ready(function(e) {
    current = 1;
    show_current_image();
  });

  $("body").keyup(function(e) {
    var i;
    if (e.which == KEY_LEFT) {
      if (thumb_open) {
        previous_thumbnail_block();
      } else {
        prev();
      }
    } else if (e.which == KEY_RIGHT) {
      if (thumb_open) {
        next_thumbnail_block();
      } else {
        next();
      }
    } else if (e.which == KEY_UP && thumb_open) {
      close_thumbnail_view();

    } else if (e.which == KEY_SPACE && !thumb_open) {
      pause_or_play();

    } else if (e.which == KEY_DOWN && !thumb_open) {
      open_thumbnail_view();

    } else if (thumb_open && e.which == KEY_S && thumb_index > 0) {
      previous_thumbnail();

    } else if (thumb_open && e.which == KEY_A) {
      next_thumbnail();

    } else if (thumb_open && e.which == KEY_RET && thumb_index >= 0) {
       current = thumb_index;
       close_thumbnail_view();
       next();
    }
    e.preventDefault();
  });

  /**
  * show the controls when
  * mouseover the main container
  */
  slideshowMouseEvent();
  function slideshowMouseEvent() {
    $('#slideshow_container').unbind('mouseenter')
               .bind('mouseenter',showControls)
               .unbind('mouseleave')
               .bind('mouseleave',hideControls);
    }

  /**
  * pause or play icons
  */
  function pause_or_play() {
    var self = $('#play_pause_control');
    if(self.hasClass('msg_play')) {
      play();
    } else {
      pause();
    }
  }
  /**
  * RemoteControl events
  *   click next:  display next image
  *   click prev:  display previous image
  *   click play:  plays slideshow
  *   click pause: pauses slideshow
  */
  $('#next_control').bind('click',function(e){
    pause();
    next();
  });
  $('#previous_control').bind('click',function(e){
    pause();
    prev();
  });
  $('#play_pause_control').bind('click',function(e){
    pause_or_play();
  });


  /**
  * ThumbnailView events:
  *   click next:     show next page of thumbnails
  *   click previous: show previous page of thumbnails
  *   click close:    hide page of thumbnails
  */
  $('#next_thumb_control').bind('click',function(e){
    next_thumbnail_block();
  });
  $('#previous_thumb_control').bind('click',function(e){
    previous_thumbnail_block();
  });
  $('#close_thumb_control').bind('click',function(e){
    close_thumbnail_view();
  });

  /**
  * Thumbnail events:
  *   clicking:   show image
  *   mouseenter: opcaity=1
  *   mouseleave: opcaity=0.5
  */
  $('#thumbnail_container .thumbnail_block > a').bind('click', function(e) {
    displayImageByThumb(this);
    e.preventDefault();
  }).bind('mouseenter', function() {
    $(this).stop().animate({'opacity':1});
  }).bind('mouseleave', function() {
    $(this).stop().animate({'opacity':0.5});
  });

/************* control functions ****************/
  /**
  * show and hide controls functions
  */
  function showControls(){
    $('#controls').stop().animate({'right':'15px'},500);
  }
  function hideControls(){
    $('#controls').stop().animate({'right':'-310px'},500);
  }

  /**
  * start/stop the slideshow
  */
  function play(){
    $('#play_pause_control').addClass('msg_pause').removeClass('msg_play');
    playtime = setInterval(next,interval);
    next();
  }
  function pause(){
    $('#play_pause_control').addClass('msg_play').removeClass('msg_pause');
    clearTimeout(playtime);
  }

  /**
  * show the next/prev image
  */
  function next(){
    ++current;
    show_current_image();
  }
  function prev() {
    --current;
    show_current_image();
  }

  /**
  * Close thumbnail view
  */
  function close_thumbnail_view () {
    $('.thumb_controls_help').hide();
    hide_thumb(thumb_index);
    $('a[tabindex="' + thumb_index + '"]').stop().animate({'opacity': 0.5});
    thumb_index = -1;
    thumb_open = false;
    thumbnailViewToImageView();
  }

  /**
  * clicking the grid icon,
  * shows the thumbs view, pauses the slideshow, and hides the controls
  */
  function open_thumbnail_view() {
    thumb_index = current-1;
    thumb_open = true;
    hideControls();
    $('.thumb_controls_help').show();
    $('#slideshow_container').unbind('mouseenter').unbind('mouseleave');
    pause();
    $('#thumbnail_container').stop().animate({'top':'0px'},500);
    $('#pic_container').stop().animate({'opacity':'0.3'},500);
    show_thumb(thumb_index);
  }
  $('#grid_control').bind('click',function(e){
    open_thumbnail_view();
    e.preventDefault();
  });

  function get_thumb(idx) {
    if (DEBUG) {
      console.log("get_thumb("+idx+")");
    }
    return $($('#thumbnail_container .thumbnail_block a')[idx]);
  }
  function hide_thumb(idx) {
    get_thumb(idx).stop().animate({'opacity': 0.5});
  }
  function show_thumb(idx) {
    get_thumb(idx).stop().animate({'opacity': 1.0});
  }

  function next_thumbnail () {
    if (DEBUG) {
      console.log("START next_thumbnail: thumb_index=" + thumb_index + ", current_thumb_block="+current_thumb_block+ ', current='+current);
    }

    if (thumb_index+1 >= number_of_thumbnails ) {
      if (DEBUG) {
        console.log("MAX reached: thumb_index("+thumb_index+") >= number_of_thumbnails("+number_of_thumbnails+")");
      }
      return;
    }
    hide_thumb(thumb_index);
    ++thumb_index;
    if (thumb_index == current_thumb_block * number_of_thumbnails_per_view) {
        next_thumbnail_block();
    }
    show_thumb(thumb_index);

    if (DEBUG) {
      console.log("END next_thumbnail: thumb_index=" + thumb_index + ", current_thumb_block="+current_thumb_block+ ', current='+current);
    }
  }

  function previous_thumbnail () {
    if (DEBUG) {
      console.log("START previous_thumbnail : thumb_index=" + thumb_index + ", number_of_thumbnails_per_view="+number_of_thumbnails_per_view + ", current_thumb_block="+current_thumb_block+ ', current='+current);
    }

    hide_thumb(thumb_index);
    --thumb_index;
    if (thumb_index == (current_thumb_block-1) * number_of_thumbnails_per_view - 1) {
      previous_thumbnail_block();
    }
    show_thumb(thumb_index);

    if (DEBUG) {
      console.log("END previous_thumbnail : thumb_index=" + thumb_index + ", number_of_thumbnails_per_view="+number_of_thumbnails_per_view + ", current_thumb_block="+current_thumb_block+ ', current='+current);
    }
  }


  /**
  * Show the next thumbnail block
  */
  function next_thumbnail_block () {
    if (DEBUG) {
        console.log("START next_thumbnail_block: thumb_index=" + thumb_index + ", current_thumb_block="+current_thumb_block+ ', current='+current);
    }
    if (current_thumb_block >= last_thumbnail_block) {
        console.log("last BLOCK reached");
        return;
    }

    hide_thumb(thumb_index);

    var next_wrapper = get_thumbnail_container(current_thumb_block+1);
    if(next_wrapper.length) {
      get_thumbnail_container(current_thumb_block).
              fadeOut(function () {
                  ++current_thumb_block;
                  next_wrapper.fadeIn();
      });
    }
    thumb_index = current_thumb_block * number_of_thumbnails_per_view;
    show_thumb(thumb_index);
    if (DEBUG) {
        console.log("END next_thumbnail_block: thumb_index=" + thumb_index + ", current_thumb_block="+current_thumb_block+ ', current='+current);
    }
  }
  /**
  * Show the previous thumbnail block
  */
  function previous_thumbnail_block () {
    if (DEBUG) {
        console.log("START previous_thumbnail_block: thumb_index=" + thumb_index + ", current_thumb_block="+current_thumb_block+ ', current='+current);
    }
    if (current_thumb_block <= 1) {
      if (DEBUG) {
        console.log("first BLOCK reached");
      }
      return;
    }

    hide_thumb(thumb_index);

    var prev_wrapper = get_thumbnail_container(current_thumb_block-1);
    if (prev_wrapper.length) {
      get_thumbnail_container(current_thumb_block).
        fadeOut(function () {
          prev_wrapper.fadeIn();
      });
    }
    --current_thumb_block;
    thumb_index = current_thumb_block * number_of_thumbnails_per_view - 1;
    show_thumb(thumb_index);

    if (DEBUG) {
      console.log("END previous_thumbnail_block: thumb_index=" + thumb_index + ", current_thumb_block="+current_thumb_block+ ', current='+current);
    }
  }

/************* do functions ****************/

  /**
  * shows an image (shows a full image)
  */
  function show_current_image() {
    if (DEBUG) {
      console.log("show_current_image()");
    }
    alternateThumbs();
    var thumb_block = get_thumbnail_container(current_thumb_block);
    var thumb = thumb_block.find('a:nth-child(' + parseInt(current - number_of_thumbnails_per_view * (current_thumb_block - 1)) +')').find('img');
    if (thumb.length) {
      var source = thumb.attr('alt');
      var angle = thumb.css('transform');
      var currentImage = $('#pic_container').find('img');
      if(currentImage.length) {
        currentImage.fadeOut(function() {
          $(this).remove();

          /*does not work in FF*/
          $('<img />').load(function() {
            var image = $(this);
            resize(image, angle);
            image.hide();
            $('#pic_container').empty().append(image.fadeIn());
          }).attr('src', source);

        });
      } else {

        /*does not work in FF*/
        $('<img />').load(function() {
            var image = $(this);
            resize(image, angle);
            image.hide();
            $('#pic_container').empty().append(image.fadeIn());
        }).attr('src',source);

      }
    }
  }

  /**
  * the thumbs wrapper being shown, is always
  * the one containing the current image
  */
  function alternateThumbs () {
    get_thumbnail_container(current_thumb_block).hide();
    current_thumb_block = Math.ceil(current/number_of_thumbnails_per_view);

    if (DEBUG) {
        console.log("alternateThumbs: current_thumb_block="+current_thumb_block+ ', current='+current);
    }

    get_thumbnail_container(current_thumb_block).show();
  }

  function get_thumbnail_container (idx) {
    if (DEBUG) {
      console.log("get_thumbnail_container("+idx+")");
    }
    return $('#thumbnail_container').
            find('.thumbnail_block:nth-child('+idx+')');
  }

  /**
  * show image for a given thumbnail
  */
  function displayImageByThumb (thumb) {
    var idx = $(thumb).index();
    current = (current_thumb_block-1) * number_of_thumbnails_per_view + idx + 1;
    if (DEBUG) {
      console.log("displayImageByThumb: idx="+ idx
                + ", current=" + current
                + ", current_thumb_block="+ current_thumb_block);
    }
    show_current_image();
    thumbnailViewToImageView();
  }

  function thumbnailViewToImageView() {
    if (DEBUG) {
      console.log("thumbnailViewToImageView()");
    }
    showControls();
    slideshowMouseEvent();
    $('#thumbnail_container').stop().animate({'top':'-750px'}, 500);
    $('.thumb_controls_help').hide();
    $('#pic_container').stop().animate({'opacity':'1'},500);
  }

  /**
  * resize the image to fit in the container
  */
  function resize(image, angle) {
    var theImage;
    theImage = new Image();
    theImage.src = image.attr("src");

    /*wait for image to load*/
    theImage.onload = function(){
      if(DEBUG) {
        console.log("theImage.width:" + theImage.width + ", height:"+ theImage.height);
      }
      //width:1280, height:853 oder width:853, height:1280
      if ( theImage.width < theImage.height) {
        image.height(600);
      } else {
        image.width(900);
      }
    };
  }
});
