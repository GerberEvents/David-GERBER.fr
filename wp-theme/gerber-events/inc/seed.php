<?php
/**
 * On theme activation, seed:
 *  - 4 ge_discipline posts
 *  - 6 ge_still posts
 *  - Side-loads bundled placeholder images from assets/img/ into the Media
 *    library and sets them as featured images.
 *
 * Guarded by a one-shot option so it doesn't re-seed on every activation.
 */
if (!defined('ABSPATH')) exit;

function ge_seed_content() {
    if (get_option('ge_content_seeded')) return;

    require_once ABSPATH . 'wp-admin/includes/file.php';
    require_once ABSPATH . 'wp-admin/includes/media.php';
    require_once ABSPATH . 'wp-admin/includes/image.php';

    $base = get_template_directory() . '/assets/img/';

    // Disciplines — use defaults exactly.
    foreach (ge_default_disciplines() as $i => $d) {
        $post_id = wp_insert_post([
            'post_title'    => $d['title'],
            'post_content'  => $d['blurb'],
            'post_status'   => 'publish',
            'post_type'     => 'ge_discipline',
            'menu_order'    => $i + 1,
        ]);
        if (!is_wp_error($post_id)) {
            update_post_meta($post_id, 'roman_number', $d['n']);
            update_post_meta($post_id, 'tags',         implode(', ', $d['tags']));
            update_post_meta($post_id, 'caption',      $d['caption']);
            update_post_meta($post_id, 'kicker',       $d['kicker']);
            ge_sideload_thumb($post_id, $d['img']);
        }
    }

    // Stills
    foreach (ge_default_stills() as $i => $s) {
        $post_id = wp_insert_post([
            'post_title'    => $s['label'],
            'post_status'   => 'publish',
            'post_type'     => 'ge_still',
            'menu_order'    => $i + 1,
        ]);
        if (!is_wp_error($post_id)) {
            update_post_meta($post_id, 'label', $s['label']);
            update_post_meta($post_id, 'code',  $s['code']);
            ge_sideload_thumb($post_id, $s['src']);
        }
    }

    update_option('ge_content_seeded', 1);
}
add_action('after_switch_theme', 'ge_seed_content');

/**
 * Side-load an image at a URL into the Media library, attach to a post,
 * and set it as the featured image.
 */
function ge_sideload_thumb($post_id, $url) {
    if (empty($url)) return;
    $tmp = download_url($url);
    if (is_wp_error($tmp)) return;

    $file = [
        'name'     => basename(parse_url($url, PHP_URL_PATH)),
        'tmp_name' => $tmp,
    ];
    $attach_id = media_handle_sideload($file, $post_id);
    if (is_wp_error($attach_id)) {
        @unlink($tmp);
        return;
    }
    set_post_thumbnail($post_id, $attach_id);
}
