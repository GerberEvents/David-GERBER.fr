<?php
/**
 * Front page — minimal React mount point.
 * All visible content is rendered by the JSX bundle in assets/jsx/.
 */
if (!defined('ABSPATH')) exit;
get_header();
?>

<noscript>
    <p style="padding:2rem;background:#0a0a0a;color:#f4f1ec;font-family:system-ui,sans-serif">
        Cette page nécessite JavaScript. Sans JS, contactez GERBER EVENTS au
        <?php echo esc_html(ge_opt('ge_contact_phone', '+33 6 00 00 00 00')); ?> ·
        <?php echo esc_html(ge_opt('ge_contact_email', 'david@gerber-events.fr')); ?>
    </p>
</noscript>

<main id="ge-root" class="ge-mount"></main>

<?php get_footer(); ?>
