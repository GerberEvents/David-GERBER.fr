<?php
/**
 * Asset pipeline.
 *
 * The prototype is React + Babel-standalone (no build step). For
 * production it'd be ideal to ship a pre-built bundle, but since the
 * brief is "keep React, no toolchain", we load Babel in the browser too.
 *
 * Footprint (gzipped): React ~40kb + ReactDOM ~135kb + Babel ~450kb.
 * Acceptable for a portfolio homepage; if needed, swap Babel for a
 * pre-compiled bundle later (instructions in README.md).
 */
if (!defined('ABSPATH')) exit;

function ge_enqueue_assets() {
    $uri = get_template_directory_uri();
    $ver = GE_THEME_VERSION;

    // Fonts (Kanilia is self-hosted via assets/fonts; see main.css @font-face).
    wp_enqueue_style(
        'ge-google-fonts',
        'https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=Allura&family=Geist:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&family=Instrument+Serif:ital@0;1&display=swap',
        [], null
    );

    // Theme styles
    wp_enqueue_style('ge-main',  $uri . '/assets/css/main.css', ['ge-google-fonts'], $ver);
    wp_enqueue_style('ge-theme', get_stylesheet_uri(), [], $ver);

    // React + ReactDOM (CDN, no build step needed)
    wp_register_script('ge-react',     'https://unpkg.com/react@18.3.1/umd/react.production.min.js',        [], null, false);
    wp_register_script('ge-react-dom', 'https://unpkg.com/react-dom@18.3.1/umd/react-dom.production.min.js',['ge-react'], null, false);
    wp_register_script('ge-babel',     'https://unpkg.com/@babel/standalone@7.29.0/babel.min.js',           [], null, false);

    wp_enqueue_script('ge-react');
    wp_enqueue_script('ge-react-dom');
    wp_enqueue_script('ge-babel');

    // Inject window.GERBER_DATA before the JSX runs.
    wp_register_script('ge-data', '', [], $ver, false);
    wp_enqueue_script('ge-data');
    wp_add_inline_script('ge-data',
        'window.GERBER_DATA = ' . wp_json_encode(ge_collect_data()) . ';',
        'before'
    );

    // The JSX files. Order matters — helpers first, then components, then app.
    // They're enqueued as plain <script> tags but we'll filter them to
    // type="text/babel" via script_loader_tag so Babel transpiles them.
    foreach ([
        'ge-helpers'    => 'assets/jsx/helpers.jsx',
        'ge-editorial'  => 'assets/jsx/direction-editorial.jsx',
        'ge-app'        => 'assets/jsx/app.jsx',
    ] as $handle => $rel) {
        wp_enqueue_script(
            $handle,
            $uri . '/' . $rel,
            ['ge-babel', 'ge-react-dom', 'ge-data'],
            $ver,
            true
        );
    }
}
add_action('wp_enqueue_scripts', 'ge_enqueue_assets');

/**
 * Babel-standalone needs the JSX scripts marked `type="text/babel"` and
 * NOT executed by the browser before Babel sees them. WordPress doesn't
 * have a setting for this, so we rewrite the <script> tag for our handles.
 */
function ge_babel_script_type($tag, $handle, $src) {
    static $babel_handles = ['ge-helpers','ge-editorial','ge-app'];
    if (!in_array($handle, $babel_handles, true)) return $tag;
    // Replace `src=` with `data-presets="..."` + `type="text/babel"`.
    $tag = str_replace(
        ' src=',
        ' type="text/babel" data-presets="env,react" data-type="module" src=',
        $tag
    );
    return $tag;
}
add_filter('script_loader_tag', 'ge_babel_script_type', 10, 3);
