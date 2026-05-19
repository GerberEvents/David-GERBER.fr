<?php
/**
 * Template de page — compatible WPBakery.
 * the_content() exécute les shortcodes WPBakery automatiquement.
 */
if (!defined('ABSPATH')) exit;
get_header();
?>

<main class="ge-page">
    <?php while (have_posts()) : the_post(); ?>

        <?php if (get_the_title()) : ?>
        <div class="ge-page__header">
            <div class="ge-page__header-inner">
                <h1 class="ge-page__title"><?php the_title(); ?></h1>
            </div>
        </div>
        <?php endif; ?>

        <div class="ge-page__content">
            <?php the_content(); ?>
        </div>

    <?php endwhile; ?>
</main>

<?php get_footer(); ?>
