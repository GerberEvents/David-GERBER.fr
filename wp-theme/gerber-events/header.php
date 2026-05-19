<?php
/**
 * Header — opens HTML, wires WP head/body hooks.
 * The visual top bar is rendered by React inside #ge-root.
 */
if (!defined('ABSPATH')) exit;
?><!doctype html>
<html <?php language_attributes(); ?> data-theme="dark">
<head>
    <meta charset="<?php bloginfo('charset'); ?>" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <?php wp_head(); ?>
</head>
<body <?php body_class('ge-body'); ?>>
<?php wp_body_open(); ?>
