<?php
/**
 * Intégration WPBakery Page Builder.
 *
 * - Déclare le support thème (désactive l'alerte "thème non compatible")
 * - Active WPBakery sur les pages, posts et CPTs du thème
 * - Supprime les éléments inutiles du backend WPBakery (go_premium, etc.)
 */
if (!defined('ABSPATH')) exit;

// Déclarer le support WPBakery (doit tourner avant vc_before_init)
add_action('vc_before_init', function () {
    if (function_exists('vc_set_as_theme')) {
        vc_set_as_theme();
    }
});

// Activer l'éditeur WPBakery sur tous les types de contenu utiles
add_filter('vc_editor_post_types', function ($post_types) {
    return array_unique(array_merge($post_types, [
        'page',
        'post',
        'ge_discipline',
        'ge_still',
    ]));
});

// Masquer les onglets de vente WPBakery dans le backend (optionnel)
add_action('admin_head', function () {
    if (!function_exists('vc_is_page_editable')) return;
    echo '<style>
        .vc_upgrade-to-pro-tab,
        .vc_license-tab,
        #vc_go-premium { display: none !important; }
    </style>';
});
