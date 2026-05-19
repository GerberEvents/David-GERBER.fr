<?php
/**
 * Customizer fields — singular text blocks (hero / manifeste / contact).
 * Repeatable content lives in the Disciplines + Stills CPTs.
 */
if (!defined('ABSPATH')) exit;

function ge_customize_register($wp) {
    // Hero ──────────────────────────────────────────────────────────────
    $wp->add_section('ge_hero', [
        'title'    => __('Hero', 'gerber-events'),
        'priority' => 30,
    ]);
    ge_setting($wp, 'ge_hero', 'ge_hero_eyebrow',  'Dossier I · Manifeste · Édition MMXXVI', 'Eyebrow');
    ge_setting($wp, 'ge_hero', 'ge_hero_quote',    'Concevoir, créer, casser les codes.',  'Citation italique');
    ge_setting($wp, 'ge_hero', 'ge_hero_script',   'backstage mindset.',                     'Texte manuscrit (Allura)');
    ge_setting($wp, 'ge_hero', 'ge_hero_body',
        "David Gerber dessine, code, construit et met en lumière — souvent dans le même projet. Un atelier qui pense la régie comme on pense la maquette : continue.",
        'Paragraphe d\'intro', 'textarea');
    ge_setting($wp, 'ge_hero', 'ge_hero_projects', '142+',                                  'Compteur projets');
    ge_image_setting($wp, 'ge_hero', 'ge_hero_bg',
        get_template_directory_uri() . '/assets/img/bg-alley-lamps.png',
        'Image de fond (ruelle)');

    // Manifeste ─────────────────────────────────────────────────────────
    $wp->add_section('ge_manifesto', [
        'title'    => __('Manifeste', 'gerber-events'),
        'priority' => 32,
    ]);
    ge_setting($wp, 'ge_manifesto', 'ge_manifesto_quote_a',  'Concevoir, créer,',           'Citation — ligne 1');
    ge_setting($wp, 'ge_manifesto', 'ge_manifesto_quote_b',  'casser les codes.',           'Citation — ligne 2');
    ge_setting($wp, 'ge_manifesto', 'ge_manifesto_script',   'backstage mindset.',          'Manuscrit (Allura)');
    ge_setting($wp, 'ge_manifesto', 'ge_manifesto_footnote', 'Atelier Gerber — depuis MCMLXXXIII', 'Mention');

    // Marquee ───────────────────────────────────────────────────────────
    $wp->add_section('ge_marquee', [
        'title'    => __('Bandeau défilant', 'gerber-events'),
        'priority' => 34,
    ]);
    ge_setting($wp, 'ge_marquee', 'ge_marquee_tokens',
        'CONCEPTION, DÉVELOPPEMENT, RÉNOVATION, ÉVÉNEMENTIEL, SCÉNOGRAPHIE, SON & LUMIÈRE, BÉTON CIRÉ, IDENTITÉ VISUELLE',
        'Mots-clés (séparés par des virgules)', 'textarea');

    // Disciplines header ────────────────────────────────────────────────
    $wp->add_section('ge_disciplines', [
        'title'    => __('Disciplines · entête', 'gerber-events'),
        'priority' => 36,
    ]);
    ge_setting($wp, 'ge_disciplines', 'ge_disc_eyebrow', 'III — Disciplines', 'Eyebrow');
    ge_setting($wp, 'ge_disciplines', 'ge_disc_title',
        'Quatre métiers, un seul atelier — pensés ensemble pour que la fabrique reste continue.',
        'Titre principal', 'textarea');

    // Contact ───────────────────────────────────────────────────────────
    $wp->add_section('ge_contact', [
        'title'    => __('Contact / Footer', 'gerber-events'),
        'priority' => 38,
    ]);
    ge_setting($wp, 'ge_contact', 'ge_contact_email',   'david@gerber-events.fr',          'Email');
    ge_setting($wp, 'ge_contact', 'ge_contact_phone',   '+33 6 00 00 00 00',               'Téléphone');
    ge_setting($wp, 'ge_contact', 'ge_contact_address', '14 rue des Capucins, Lyon',       'Adresse');
    ge_setting($wp, 'ge_contact', 'ge_contact_cta',     '→ Envoyer un brief',              'Texte du bouton');
    ge_setting($wp, 'ge_contact', 'ge_contact_script',  'backstage welcome.',              'Manuscrit (Allura)');
}
add_action('customize_register', 'ge_customize_register');

// Helpers ───────────────────────────────────────────────────────────────
function ge_setting($wp, $section, $id, $default, $label, $type = 'text') {
    $wp->add_setting($id, [
        'default'           => $default,
        'sanitize_callback' => $type === 'textarea' ? 'sanitize_textarea_field' : 'sanitize_text_field',
        'transport'         => 'refresh',
    ]);
    $wp->add_control($id, [
        'label'   => $label,
        'section' => $section,
        'type'    => $type,
    ]);
}

function ge_image_setting($wp, $section, $id, $default, $label) {
    $wp->add_setting($id, [
        'default'           => $default,
        'sanitize_callback' => 'esc_url_raw',
        'transport'         => 'refresh',
    ]);
    $wp->add_control(new WP_Customize_Image_Control($wp, $id, [
        'label'   => $label,
        'section' => $section,
    ]));
}

/**
 * Tiny convenience getter — used by data.php and templates.
 */
function ge_opt($id, $fallback = '') {
    return get_theme_mod($id, $fallback);
}
