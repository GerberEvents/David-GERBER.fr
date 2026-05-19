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
            'eyebrow'  => ge_opt('ge_hero_eyebrow')  ?: 'Dossier I · Manifeste · Édition MMXXVI',
            'quote'    => ge_opt('ge_hero_quote')    ?: 'Concevoir, créer, casser les codes.',
            'script'   => ge_opt('ge_hero_script')   ?: 'backstage mindset.',
            'body'     => ge_opt('ge_hero_body')     ?: 'David Gerber dessine, code, construit et met en lumière — souvent dans le même projet.',
            'projects' => ge_opt('ge_hero_projects') ?: '142+',
            'bg'       => ge_opt('ge_hero_bg')       ?: get_template_directory_uri() . '/assets/img/bg-alley-lamps.png',
            'lockup'   => [
                'line1'  => 'GERBER',
                'line2'  => 'EVENTS',
                'script' => 'since 1983',
            ],
        ],

        'manifesto' => [
            'quoteA'   => ge_opt('ge_manifesto_quote_a') ?: 'L\'image sans la technique, c\'est de la décoration.',
            'quoteB'   => ge_opt('ge_manifesto_quote_b') ?: 'La technique sans l\'image, c\'est de l\'artisanat.',
            'script'   => ge_opt('ge_manifesto_script')  ?: 'les deux ensemble — c\'est Gerber.',
            'footnote' => ge_opt('ge_manifesto_footnote') ?: 'Fondé en 1983 · Lyon, France',
        ],

        'marquee' => array_values(array_filter(array_map('trim',
            explode(',', ge_opt('ge_marquee_tokens') ?: 'SON · LUMIÈRE · SCÉNOGRAPHIE · UX DESIGN · WEB · RÉNOVATION · PRODUCTION · IDENTITÉ · RÉGIE · 1983')))),

        'disciplinesHeader' => [
            'eyebrow' => ge_opt('ge_disc_eyebrow') ?: 'Champs d\'intervention',
            'title'   => ge_opt('ge_disc_title')   ?: 'Quatre disciplines,\nune seule exigence.',
        ],

        'disciplines' => ge_get_disciplines(),
        'stills'      => ge_get_stills(),

        'contact' => [
            'email'   => ge_opt('ge_contact_email')   ?: 'contact@david-gerber.fr',
            'phone'   => ge_opt('ge_contact_phone')   ?: '+33 (0)6 00 00 00 00',
            'address' => ge_opt('ge_contact_address') ?: 'Lyon, France',
            'cta'     => ge_opt('ge_contact_cta')     ?: 'Démarrer un brief',
            'script'  => ge_opt('ge_contact_script')  ?: 'parlons-en.',
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
    if ($out) return $out;
    // Fallback : retire _local_img (clé interne, inutile côté JS).
    return array_map(fn($d) => array_diff_key($d, ['_local_img' => '']), ge_default_disciplines());
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
    if ($out) return $out;
    return array_map(fn($s) => array_diff_key($s, ['_local_img' => '']), ge_default_stills());
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
    $uri = get_template_directory_uri() . '/assets/img/';
    return [
        [
            'n'          => 'I',
            'title'      => 'Conception · UX / UI Design',
            'blurb'      => "Aménagement d'espaces, création 3D, design d'interface et expérience utilisateur — du pré-prod à la régie graphique en plateau.",
            'tags'       => ['UX', 'UI', '3D', 'Espaces'],
            'img'        => $uri . 'portrait-sound-engineer.png',
            '_local_img' => 'portrait-sound-engineer.png',
            'caption'    => 'Régie · session 2024',
            'kicker'     => 'UX',
        ],
        [
            'n'          => 'II',
            'title'      => 'Développement Web · Identité Digitale',
            'blurb'      => 'Création de sites web, branding, design visuel et solutions digitales sur mesure — pensé pour résister au plateau.',
            'tags'       => ['Code', 'Brand', 'Visuel', 'Sur-mesure'],
            'img'        => $uri . 'portrait-trumpet.jpeg',
            '_local_img' => 'portrait-trumpet.jpeg',
            'caption'    => 'Direction artistique · 2023',
            'kicker'     => 'BRAND',
        ],
        [
            'n'          => 'III',
            'title'      => 'Rénovation · Second Œuvre',
            'blurb'      => "Électricité, plomberie, finitions, béton ciré et coordination technique de chantier — la matière avant l'image.",
            'tags'       => ['Chantier', 'Finitions', 'Coordination'],
            'img'        => $uri . 'bg-alley-corner.png',
            '_local_img' => 'bg-alley-corner.png',
            'caption'    => 'Chantier · loft Canut',
            'kicker'     => 'BÂTI',
        ],
        [
            'n'          => 'IV',
            'title'      => 'Événementiel · Régie générale',
            'blurb'      => 'Son, lumière, scénographie et accompagnement global — depuis 1983, sur scène et en coulisses.',
            'tags'       => ['Son', 'Lumière', 'Scéno.', 'Production'],
            'img'        => $uri . 'portrait-motorbike.png',
            '_local_img' => 'portrait-motorbike.png',
            'caption'    => 'Tournée · printemps 2025',
            'kicker'     => 'EVT',
        ],
    ];
}

function ge_default_stills() {
    $uri = get_template_directory_uri() . '/assets/img/';
    return [
        ['src' => $uri . 'portrait-revolver-lockup.jpg', '_local_img' => 'portrait-revolver-lockup.jpg', 'label' => 'Casting · Studio 4',    'code' => 'A-014'],
        ['src' => $uri . 'portrait-motorbike.png',       '_local_img' => 'portrait-motorbike.png',       'label' => 'Repérage · Hudson St.',  'code' => 'A-027'],
        ['src' => $uri . 'portrait-trumpet.jpeg',        '_local_img' => 'portrait-trumpet.jpeg',        'label' => 'Session · Trompette',    'code' => 'B-008'],
        ['src' => $uri . 'portrait-sound-engineer.png',  '_local_img' => 'portrait-sound-engineer.png',  'label' => 'Régie son · Live',       'code' => 'B-019'],
        ['src' => $uri . 'portrait-shadow.png',          '_local_img' => 'portrait-shadow.png',          'label' => 'Portrait · D. Gerber',   'code' => 'C-003'],
        ['src' => $uri . 'bg-alley-corner.png',          '_local_img' => 'bg-alley-corner.png',          'label' => 'Décor · brique brute',   'code' => 'D-002'],
    ];
}
