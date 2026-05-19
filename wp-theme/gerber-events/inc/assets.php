<?php
/**
 * Asset pipeline — GERBER EVENTS.
 */
if (!defined('ABSPATH')) exit;

function ge_enqueue_assets() {
    $uri = get_template_directory_uri();
    $ver = GE_THEME_VERSION;

    // Google Fonts (preconnect pour réduire la latence)
    wp_enqueue_style('ge-google-fonts',
        'https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=Allura&family=Geist:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&family=Instrument+Serif:ital@0;1&display=swap',
        [], null
    );

    // Styles du thème — ge-theme dépend de ge-main pour garantir l'ordre
    wp_enqueue_style('ge-main',  $uri . '/assets/css/main.css', ['ge-google-fonts'], $ver);
    wp_enqueue_style('ge-theme', get_stylesheet_uri(), ['ge-main'], $ver);

    // React + JSX uniquement sur la page d'accueil (front-page.php).
    // Les autres pages (WPBakery, articles) n'en ont pas besoin.
    if (is_front_page()) {
        wp_register_script('ge-react',
            'https://unpkg.com/react@18.3.1/umd/react.production.min.js',
            [], null, true
        );
        wp_register_script('ge-react-dom',
            'https://unpkg.com/react-dom@18.3.1/umd/react-dom.production.min.js',
            ['ge-react'], null, true
        );
        wp_register_script('ge-babel',
            'https://unpkg.com/@babel/standalone@7.29.0/babel.min.js',
            [], null, true
        );

        wp_enqueue_script('ge-react');
        wp_enqueue_script('ge-react-dom');
        wp_enqueue_script('ge-babel');

        // Injection de window.GERBER_DATA avant les JSX (footer, après babel)
        wp_register_script('ge-data', false, ['ge-babel', 'ge-react-dom'], $ver, true);
        wp_enqueue_script('ge-data');
        wp_add_inline_script('ge-data',
            'window.GERBER_DATA = ' . wp_json_encode(
                ge_collect_data(),
                JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES
            ) . ';'
        );

        // Fichiers JSX — dans le footer, après GERBER_DATA
        foreach ([
            'ge-helpers'   => 'assets/jsx/helpers.js',
            'ge-editorial' => 'assets/jsx/direction-editorial.js',
            'ge-app'       => 'assets/jsx/app.js',
        ] as $handle => $rel) {
            wp_enqueue_script(
                $handle,
                $uri . '/' . $rel,
                ['ge-data'],
                $ver,
                true
            );
        }
    }
}
add_action('wp_enqueue_scripts', 'ge_enqueue_assets');

/**
 * Ajoute type="text/babel" sur les scripts JSX pour que Babel les transpile.
 * Utilise une regex pour être robuste aux changements de format de WP.
 */
function ge_babel_script_type($tag, $handle, $src) {
    static $jsx_handles = ['ge-helpers', 'ge-editorial', 'ge-app'];
    if (!in_array($handle, $jsx_handles, true)) return $tag;
    // Remove any existing type attribute before injecting type="text/babel"
    $tag = preg_replace('/\s+type=["\'][^"\']*["\']/i', '', $tag, 1);
    return preg_replace(
        '/(<script\b[^>]*)\bsrc=/i',
        '$1 type="text/babel" data-presets="react" src=',
        $tag,
        1
    );
}
add_filter('script_loader_tag', 'ge_babel_script_type', 10, 3);
