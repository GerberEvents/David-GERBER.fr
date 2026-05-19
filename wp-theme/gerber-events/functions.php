<?php
/**
 * GERBER EVENTS — theme bootstrap.
 *
 * Wires up:
 *  - WordPress theme support (title-tag, custom logo, menus, etc.)
 *  - Custom Post Types for repeatable content (Disciplines, Stills)
 *  - Customizer fields for the singular hero / manifesto / contact text
 *  - React 18 + Babel-standalone enqueueing of the JSX prototype
 *  - wp_localize_script: pushes ALL editable content into window.GERBER_DATA
 *    so the React app reads from the WP admin instead of hardcoded constants.
 *  - First-run seed of 4 disciplines + 6 stills so the homepage is populated
 *    on activation without manual data entry.
 */

if (!defined('ABSPATH')) exit;

define('GE_THEME_VERSION', '1.0.0');

// Subsystems split into /inc for readability.
require_once get_template_directory() . '/inc/setup.php';
require_once get_template_directory() . '/inc/cpt.php';
require_once get_template_directory() . '/inc/customizer.php';
require_once get_template_directory() . '/inc/data.php';
require_once get_template_directory() . '/inc/assets.php';
require_once get_template_directory() . '/inc/seed.php';
