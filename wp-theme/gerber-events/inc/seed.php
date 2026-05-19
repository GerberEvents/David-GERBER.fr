<?php
/**
 * Seed de premier lancement — exécuté une seule fois à l'activation du thème.
 *
 * Crée :
 *  1. La page « Accueil » et la définit comme page d'accueil statique
 *  2. Le menu de navigation primaire avec 5 liens
 *  3. 4 posts ge_discipline avec images intégrées
 *  4. 6 posts ge_still avec images intégrées
 *
 * Les images sont copiées depuis assets/img/ (pas de requête HTTP).
 * Protégé par l'option ge_content_seeded : ne s'exécute qu'une fois.
 */
if (!defined('ABSPATH')) exit;

function ge_seed_content() {
    if (get_option('ge_content_seeded')) return;

    require_once ABSPATH . 'wp-admin/includes/file.php';
    require_once ABSPATH . 'wp-admin/includes/media.php';
    require_once ABSPATH . 'wp-admin/includes/image.php';

    // 1. Page d'accueil ------------------------------------------------
    $front_id = wp_insert_post([
        'post_title'   => 'Accueil',
        'post_name'    => 'accueil',
        'post_status'  => 'publish',
        'post_type'    => 'page',
        'post_content' => '',
        'post_author'  => 1,
    ]);

    if (!is_wp_error($front_id) && $front_id) {
        update_option('show_on_front', 'page');
        update_option('page_on_front', $front_id);
    }

    // 2. Menu de navigation primaire -----------------------------------
    $menu_name = 'Menu principal';
    $menu_id   = wp_create_nav_menu($menu_name);

    if (!is_wp_error($menu_id)) {
        $menu_items = [
            ['Atelier',     '#'],
            ['Productions', '#'],
            ['Méthode',     '#'],
            ['Presse',      '#'],
            ['Contact',     '#contact'],
        ];
        foreach ($menu_items as $item) {
            wp_update_nav_menu_item($menu_id, 0, [
                'menu-item-title'   => $item[0],
                'menu-item-url'     => $item[1],
                'menu-item-status'  => 'publish',
                'menu-item-type'    => 'custom',
            ]);
        }
        $locations = get_theme_mod('nav_menu_locations', []);
        $locations['primary'] = $menu_id;
        set_theme_mod('nav_menu_locations', $locations);
    }

    // 3. Disciplines ---------------------------------------------------
    foreach (ge_default_disciplines() as $i => $d) {
        $post_id = wp_insert_post([
            'post_title'   => $d['title'],
            'post_content' => $d['blurb'],
            'post_status'  => 'publish',
            'post_type'    => 'ge_discipline',
            'menu_order'   => $i + 1,
        ]);
        if (!is_wp_error($post_id)) {
            update_post_meta($post_id, 'roman_number', $d['n']);
            update_post_meta($post_id, 'tags',         implode(', ', $d['tags']));
            update_post_meta($post_id, 'caption',      $d['caption']);
            update_post_meta($post_id, 'kicker',       $d['kicker']);
            ge_attach_local_image($post_id, $d['_local_img']);
        }
    }

    // 4. Stills --------------------------------------------------------
    foreach (ge_default_stills() as $i => $s) {
        $post_id = wp_insert_post([
            'post_title'   => $s['label'],
            'post_status'  => 'publish',
            'post_type'    => 'ge_still',
            'menu_order'   => $i + 1,
        ]);
        if (!is_wp_error($post_id)) {
            update_post_meta($post_id, 'label', $s['label']);
            update_post_meta($post_id, 'code',  $s['code']);
            ge_attach_local_image($post_id, $s['_local_img']);
        }
    }

    update_option('ge_content_seeded', 1);
}
add_action('after_switch_theme', 'ge_seed_content');

/**
 * Copie un fichier local du thème dans la médiathèque WP et le définit
 * comme image à la une du post. Plus fiable que download_url() car ne
 * dépend pas de la capacité du serveur à se contacter lui-même.
 */
function ge_attach_local_image($post_id, $filename) {
    if (empty($filename)) return;

    $src = get_template_directory() . '/assets/img/' . $filename;
    if (!file_exists($src)) return;

    $upload = wp_upload_dir();
    $dest   = $upload['path'] . '/' . $filename;

    if (!copy($src, $dest)) return;

    $filetype  = wp_check_filetype($filename, null);
    $attach_id = wp_insert_attachment([
        'post_mime_type' => $filetype['type'],
        'post_title'     => sanitize_file_name(pathinfo($filename, PATHINFO_FILENAME)),
        'post_content'   => '',
        'post_status'    => 'inherit',
    ], $dest, $post_id);

    if (is_wp_error($attach_id)) {
        @unlink($dest);
        return;
    }

    wp_update_attachment_metadata(
        $attach_id,
        wp_generate_attachment_metadata($attach_id, $dest)
    );
    set_post_thumbnail($post_id, $attach_id);
}
