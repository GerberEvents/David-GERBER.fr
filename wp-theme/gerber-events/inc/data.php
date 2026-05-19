<?php
/**
 * Aggregates ALL editable content into a single PHP array, ready to be
 * JSON-encoded into window.GERBER_DATA for the React frontend.
 *
 * Reading is done with simple defaults (ge_opt + WP_Query) so the frontend
 * never has to know about Customizer / CPT internals.
 */
if (!defined('ABSPATH')) exit;

function ge_collect_data() {
    return [
        'hero' => [
            'eyebrow'  => ge_opt('ge_hero_eyebrow'),
            'quote'    => ge_opt('ge_hero_quote'),
            'script'   => ge_opt('ge_hero_script'),
            'body'     => ge_opt('ge_hero_body'),
            'projects' => ge_opt('ge_hero_projects'),
            'bg'       => ge_opt('ge_hero_bg'),
            'lockup'   => [
                'line1'  => 'GERBER',
                'line2'  => 'EVENTS',
                'script' => 'since 1983',
            ],
        ],

        'manifesto' => [
            'quoteA'   => ge_opt('ge_manifesto_quote_a'),
            'quoteB'   => ge_opt('ge_manifesto_quote_b'),
            'script'   => ge_opt('ge_manifesto_script'),
            'footnote' => ge_opt('ge_manifesto_footnote'),
        ],

        'marquee' => array_values(array_filter(array_map('trim',
            explode(',', ge_opt('ge_marquee_tokens'))))),

        'disciplinesHeader' => [
            'eyebrow' => ge_opt('ge_disc_eyebrow'),
            'title'   => ge_opt('ge_disc_title'),
        ],

        'disciplines' => ge_get_disciplines(),
        'stills'      => ge_get_stills(),

        'contact' => [
            'email'   => ge_opt('ge_contact_email'),
            'phone'   => ge_opt('ge_contact_phone'),
            'address' => ge_opt('ge_contact_address'),
            'cta'     => ge_opt('ge_contact_cta'),
            'script'  => ge_opt('ge_contact_script'),
        ],

        'nav' => ge_get_nav_items('primary'),

        'site' => [
            'home'  => home_url('/'),
            'name'  => get_bloginfo('name'),
            'year'  => date('Y'),
        ],

        'asset' => [
            // CDN/theme path the JSX can use as a base for any future references.
            'baseUrl' => get_template_directory_uri(),
        ],
    ];
}

/**
 * Pull Disciplines CPT in menu_order then chronological order.
 * Falls back to the seeded defaults if the CPT is empty.
 */
function ge_get_disciplines() {
    $q = new WP_Query([
        'post_type'      => 'ge_discipline',
        'posts_per_page' => 20,
        'orderby'        => ['menu_order' => 'ASC', 'date' => 'ASC'],
    ]);
    $out = [];
    if ($q->have_posts()) {
        while ($q->have_posts()) {
            $q->the_post();
            $id  = get_the_ID();
            $img = get_the_post_thumbnail_url($id, 'ge-disc') ?: '';
            $out[] = [
                'n'       => get_post_meta($id, 'roman_number', true) ?: '',
                'title'   => get_the_title(),
                'blurb'   => wp_strip_all_tags(get_the_content()),
                'tags'    => array_values(array_filter(array_map('trim',
                                explode(',', get_post_meta($id, 'tags', true))))),
                'img'     => $img,
                'caption' => get_post_meta($id, 'caption', true) ?: '',
                'kicker'  => get_post_meta($id, 'kicker',  true) ?: '',
            ];
        }
        wp_reset_postdata();
    }
    return $out ?: ge_default_disciplines();
}

function ge_get_stills() {
    $q = new WP_Query([
        'post_type'      => 'ge_still',
        'posts_per_page' => 24,
        'orderby'        => ['menu_order' => 'ASC', 'date' => 'ASC'],
    ]);
    $out = [];
    if ($q->have_posts()) {
        while ($q->have_posts()) {
            $q->the_post();
            $id  = get_the_ID();
            $img = get_the_post_thumbnail_url($id, 'ge-still') ?: '';
            $out[] = [
                'src'   => $img,
                'label' => get_post_meta($id, 'label', true) ?: get_the_title(),
                'code'  => get_post_meta($id, 'code',  true) ?: '',
            ];
        }
        wp_reset_postdata();
    }
    return $out ?: ge_default_stills();
}

/**
 * Mirror of the WordPress menu items for React rendering.
 */
function ge_get_nav_items($location) {
    $locations = get_nav_menu_locations();
    if (empty($locations[$location])) {
        // Fallback static menu
        return [
            ['label' => 'Atelier',     'href' => '#'],
            ['label' => 'Productions', 'href' => '#'],
            ['label' => 'Méthode',     'href' => '#'],
            ['label' => 'Presse',      'href' => '#'],
            ['label' => 'Contact',     'href' => '#contact'],
        ];
    }
    $items = wp_get_nav_menu_items($locations[$location]);
    if (!$items) return [];
    return array_values(array_map(fn($i) => [
        'label' => $i->title,
        'href'  => $i->url,
    ], $items));
}

// ── Defaults — used by the seeder and as a runtime fallback ─────────────

function ge_default_disciplines() {
    $img = get_template_directory_uri() . '/assets/img/';
    return [
        [
            'n'       => 'I',
            'title'   => 'Conception · UX / UI Design',
            'blurb'   => "Aménagement d'espaces, création 3D, design d'interface et expérience utilisateur — du pré-prod à la régie graphique en plateau.",
            'tags'    => ['UX', 'UI', '3D', 'Espaces'],
            'img'     => $img . 'portrait-sound-engineer.png',
            'caption' => 'Régie · session 2024',
            'kicker'  => 'UX',
        ],
        [
            'n'       => 'II',
            'title'   => 'Développement Web · Identité Digitale',
            'blurb'   => 'Création de sites web, branding, design visuel et solutions digitales sur mesure — pensé pour résister au plateau.',
            'tags'    => ['Code', 'Brand', 'Visuel', 'Sur-mesure'],
            'img'     => $img . 'portrait-trumpet.jpeg',
            'caption' => 'Direction artistique · 2023',
            'kicker'  => 'BRAND',
        ],
        [
            'n'       => 'III',
            'title'   => 'Rénovation · Second Œuvre',
            'blurb'   => "Électricité, plomberie, finitions, béton ciré et coordination technique de chantier — la matière avant l'image.",
            'tags'    => ['Chantier', 'Finitions', 'Coordination'],
            'img'     => $img . 'bg-alley-corner.png',
            'caption' => 'Chantier · loft Canut',
            'kicker'  => 'BÂTI',
        ],
        [
            'n'       => 'IV',
            'title'   => 'Événementiel · Régie générale',
            'blurb'   => 'Son, lumière, scénographie et accompagnement global — depuis 1983, sur scène et en coulisses.',
            'tags'    => ['Son', 'Lumière', 'Scéno.', 'Production'],
            'img'     => $img . 'portrait-motorbike.png',
            'caption' => 'Tournée · printemps 2025',
            'kicker'  => 'EVT',
        ],
    ];
}

function ge_default_stills() {
    $img = get_template_directory_uri() . '/assets/img/';
    return [
        ['src' => $img . 'portrait-revolver-lockup.jpg', 'label' => 'Casting · Studio 4',     'code' => 'A-014'],
        ['src' => $img . 'portrait-motorbike.png',       'label' => 'Repérage · Hudson St.',   'code' => 'A-027'],
        ['src' => $img . 'portrait-trumpet.jpeg',        'label' => 'Session · Trompette',     'code' => 'B-008'],
        ['src' => $img . 'portrait-sound-engineer.png',  'label' => 'Régie son · Live',        'code' => 'B-019'],
        ['src' => $img . 'portrait-shadow.png',          'label' => 'Portrait · D. Gerber',    'code' => 'C-003'],
        ['src' => $img . 'bg-alley-corner.png',          'label' => 'Décor · brique brute',    'code' => 'D-002'],
    ];
}
