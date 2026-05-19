<?php
/**
 * Template article — compatible WPBakery.
 */
if (!defined('ABSPATH')) exit;
get_header();
?>

<main class="ge-page">
    <?php while (have_posts()) : the_post(); ?>

        <div class="ge-page__header">
            <div class="ge-page__header-inner">

                <div class="ge-article-meta">
                    <?php
                    echo '<span>' . get_the_date('d M Y') . '</span>';
                    $cats = get_the_category();
                    if ($cats) {
                        echo ' <span class="ge-article-meta__sep">·</span> ';
                        echo '<a href="' . esc_url(get_category_link($cats[0]->term_id)) . '">'
                             . esc_html($cats[0]->name) . '</a>';
                    }
                    ?>
                </div>

                <h1 class="ge-page__title"><?php the_title(); ?></h1>

                <?php if (has_post_thumbnail()) : ?>
                <div class="ge-article-thumb">
                    <?php the_post_thumbnail('large'); ?>
                </div>
                <?php endif; ?>

            </div>
        </div>

        <div class="ge-page__content">
            <?php the_content(); ?>

            <div class="ge-article-nav">
                <?php
                $prev = get_previous_post();
                $next = get_next_post();
                if ($prev) :
                ?>
                <a href="<?php echo esc_url(get_permalink($prev)); ?>" class="ge-article-nav__link ge-article-nav__link--prev">
                    ← <?php echo esc_html($prev->post_title); ?>
                </a>
                <?php endif; if ($next) : ?>
                <a href="<?php echo esc_url(get_permalink($next)); ?>" class="ge-article-nav__link ge-article-nav__link--next">
                    <?php echo esc_html($next->post_title); ?> →
                </a>
                <?php endif; ?>
            </div>
        </div>

    <?php endwhile; ?>
</main>

<?php get_footer(); ?>
