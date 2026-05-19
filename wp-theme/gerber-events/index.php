<?php
/**
 * Catch-all fallback — render the same React mount for any page so the
 * theme works even before a static front page is set in Settings → Reading.
 */
if (!defined('ABSPATH')) exit;
get_template_part('front-page');
