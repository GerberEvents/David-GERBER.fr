<?php
/**
 * Theme setup — supports + menus.
 */
if (!defined('ABSPATH')) exit;

function ge_setup() {
    add_theme_support('title-tag');
    add_theme_support('automatic-feed-links');
    add_theme_support('post-thumbnails');
    add_theme_support('custom-logo', [
        'height'      => 64,
        'width'       => 64,
        'flex-height' => true,
        'flex-width'  => true,
    ]);
    add_theme_support('html5', [
        'search-form','comment-form','comment-list','gallery','caption','style','script',
    ]);

    register_nav_menus([
        'primary' => __('Menu principal', 'gerber-events'),
        'footer'  => __('Menu footer',     'gerber-events'),
    ]);

    add_image_size('ge-still',  600, 800, true);   // contact-sheet frames
    add_image_size('ge-disc',   400, 480, true);   // discipline thumbs
    add_image_size('ge-hero', 2400, 1400, true);   // hero alley bg
}
add_action('after_setup_theme', 'ge_setup');
