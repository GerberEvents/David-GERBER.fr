<?php
/**
 * Header — ouvre le document HTML et fire les hooks WP.
 * Sur les pages non-React (page, single, archive…), affiche la navbar PHP.
 * Sur la page d'accueil, React rend sa propre navbar intégrée dans le hero.
 */
if (!defined('ABSPATH')) exit;
?><!doctype html>
<html <?php language_attributes(); ?> data-theme="dark">
<head>
    <meta charset="<?php bloginfo('charset'); ?>" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <?php wp_head(); ?>
</head>
<body <?php body_class('ge-body'); ?>>
<?php wp_body_open(); ?>

<?php if (!is_front_page()) : ?>
<header class="ge-site-header">
    <a href="<?php echo esc_url(home_url('/')); ?>" class="ge-site-logo">
        <span class="ge-site-logo__mark">GE</span>
        <span class="ge-site-logo__text">
            <span class="ge-site-logo__name">GERBER EVENTS</span>
            <span class="ge-site-logo__script">since 1983</span>
        </span>
    </a>

    <?php
    wp_nav_menu([
        'theme_location' => 'primary',
        'container'      => 'nav',
        'container_class'=> 'ge-site-nav',
        'menu_class'     => 'ge-site-nav__list',
        'depth'          => 1,
        'fallback_cb'    => function () {
            echo '<nav class="ge-site-nav"><ul class="ge-site-nav__list">
                <li><a href="' . esc_url(home_url('/')) . '">Accueil</a></li>
                <li><a href="' . esc_url(home_url('/#contact')) . '">Contact</a></li>
            </ul></nav>';
        },
    ]);
    ?>

    <a href="<?php echo esc_url(home_url('/#contact')); ?>" class="ge-site-cta">
        Brief&nbsp;·&nbsp;FR/EN
    </a>
</header>
<?php endif; ?>
