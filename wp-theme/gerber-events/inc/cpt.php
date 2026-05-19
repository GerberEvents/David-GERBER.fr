<?php
/**
 * Custom Post Types — Disciplines & Stills.
 *
 * Both expose:
 *  - Title, content (used for the long-form blurb on Disciplines)
 *  - Featured image (the thumbnail / portrait)
 *  - A small meta box of additional structured fields
 *
 * Kept native: no ACF dependency.
 */
if (!defined('ABSPATH')) exit;

function ge_register_cpts() {
    register_post_type('ge_discipline', [
        'labels' => [
            'name'               => __('Disciplines', 'gerber-events'),
            'singular_name'      => __('Discipline', 'gerber-events'),
            'add_new_item'       => __('Ajouter une discipline', 'gerber-events'),
            'edit_item'          => __('Modifier la discipline', 'gerber-events'),
            'all_items'          => __('Toutes les disciplines', 'gerber-events'),
            'menu_name'          => __('Disciplines', 'gerber-events'),
        ],
        'public'        => false,
        'show_ui'       => true,
        'show_in_menu'  => true,
        'show_in_rest'  => false,
        'menu_icon'     => 'dashicons-portfolio',
        'menu_position' => 22,
        'hierarchical'  => false,
        'supports'      => ['title','editor','thumbnail','page-attributes'],
    ]);

    register_post_type('ge_still', [
        'labels' => [
            'name'               => __('Planche-contact', 'gerber-events'),
            'singular_name'      => __('Cliché', 'gerber-events'),
            'add_new_item'       => __('Ajouter un cliché', 'gerber-events'),
            'edit_item'          => __('Modifier le cliché', 'gerber-events'),
            'all_items'          => __('Tous les clichés', 'gerber-events'),
            'menu_name'          => __('Planche-contact', 'gerber-events'),
        ],
        'public'        => false,
        'show_ui'       => true,
        'show_in_menu'  => true,
        'show_in_rest'  => false,
        'menu_icon'     => 'dashicons-format-gallery',
        'menu_position' => 23,
        'hierarchical'  => false,
        'supports'      => ['title','thumbnail','page-attributes'],
    ]);
}
add_action('init', 'ge_register_cpts');

/**
 * Meta box — Discipline: roman_number, tags, caption, kicker.
 * The long blurb uses the post editor (`the_content`).
 */
function ge_discipline_meta_box() {
    add_meta_box('ge_discipline_fields', __('Métadonnées', 'gerber-events'),
        'ge_render_discipline_meta', 'ge_discipline', 'side', 'high');
}
add_action('add_meta_boxes_ge_discipline', 'ge_discipline_meta_box');

function ge_render_discipline_meta($post) {
    wp_nonce_field('ge_discipline_meta', 'ge_discipline_meta_nonce');
    $vals = [
        'roman_number' => get_post_meta($post->ID, 'roman_number', true),
        'tags'         => get_post_meta($post->ID, 'tags',         true),
        'caption'      => get_post_meta($post->ID, 'caption',      true),
        'kicker'       => get_post_meta($post->ID, 'kicker',       true),
    ];
    ?>
    <p>
        <label for="ge_roman">Numéro romain</label><br />
        <input type="text" id="ge_roman" name="roman_number" value="<?php echo esc_attr($vals['roman_number']); ?>" class="widefat" placeholder="I, II, III, IV" />
    </p>
    <p>
        <label for="ge_tags">Tags (séparés par des virgules)</label><br />
        <input type="text" id="ge_tags" name="tags" value="<?php echo esc_attr($vals['tags']); ?>" class="widefat" placeholder="UX, UI, 3D, Espaces" />
    </p>
    <p>
        <label for="ge_caption">Légende manuscrite</label><br />
        <input type="text" id="ge_caption" name="caption" value="<?php echo esc_attr($vals['caption']); ?>" class="widefat" placeholder="Régie · session 2024" />
    </p>
    <p>
        <label for="ge_kicker">Étiquette (3-5 lettres)</label><br />
        <input type="text" id="ge_kicker" name="kicker" value="<?php echo esc_attr($vals['kicker']); ?>" class="widefat" placeholder="UX, BRAND, BÂTI, EVT" />
    </p>
    <p class="description">L'image en vedette (à droite) sert de vignette dans la liste des disciplines.</p>
    <?php
}

/**
 * Meta box — Still: label, code (e.g. "A-014").
 */
function ge_still_meta_box() {
    add_meta_box('ge_still_fields', __('Métadonnées', 'gerber-events'),
        'ge_render_still_meta', 'ge_still', 'side', 'high');
}
add_action('add_meta_boxes_ge_still', 'ge_still_meta_box');

function ge_render_still_meta($post) {
    wp_nonce_field('ge_still_meta', 'ge_still_meta_nonce');
    $label = get_post_meta($post->ID, 'label', true);
    $code  = get_post_meta($post->ID, 'code',  true);
    ?>
    <p>
        <label for="ge_label">Légende</label><br />
        <input type="text" id="ge_label" name="label" value="<?php echo esc_attr($label); ?>" class="widefat" placeholder="Casting · Studio 4" />
    </p>
    <p>
        <label for="ge_code">Code de référence</label><br />
        <input type="text" id="ge_code" name="code" value="<?php echo esc_attr($code); ?>" class="widefat" placeholder="A-014" />
    </p>
    <p class="description">L'image en vedette est utilisée dans la planche-contact.</p>
    <?php
}

/**
 * Save handlers for both CPTs.
 */
function ge_save_meta($post_id) {
    if (defined('DOING_AUTOSAVE') && DOING_AUTOSAVE) return;
    if (!current_user_can('edit_post', $post_id)) return;

    // Discipline
    if (isset($_POST['ge_discipline_meta_nonce']) && wp_verify_nonce($_POST['ge_discipline_meta_nonce'], 'ge_discipline_meta')) {
        foreach (['roman_number','tags','caption','kicker'] as $k) {
            if (isset($_POST[$k])) update_post_meta($post_id, $k, sanitize_text_field(wp_unslash($_POST[$k])));
        }
    }

    // Still
    if (isset($_POST['ge_still_meta_nonce']) && wp_verify_nonce($_POST['ge_still_meta_nonce'], 'ge_still_meta')) {
        foreach (['label','code'] as $k) {
            if (isset($_POST[$k])) update_post_meta($post_id, $k, sanitize_text_field(wp_unslash($_POST[$k])));
        }
    }
}
add_action('save_post_ge_discipline', 'ge_save_meta');
add_action('save_post_ge_still',      'ge_save_meta');
