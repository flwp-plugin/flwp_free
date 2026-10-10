<?php
if (!defined('ABSPATH')) {
	exit;
}
?>

<section id="flwp-view-start" class="flwp-view-section flwp-form-list">
	<header class="flwp-view-header flex-row">
		<h2 style="font-size: 24px; font-weight: 600; margin: 0 0 5px 0; color: var(--flwp-primary-color);"><?php esc_html_e('admin.page.form_list.title', 'flwp'); ?></h2>
		<a href="<?php echo esc_url(admin_url('admin.php?page=flwp-form-builder')); ?>" class="page-title-action"><?php esc_html_e('admin.page.form_list.add_new', 'flwp'); ?></a>
	</header>

	<?php if (!empty($isDuplicate)) : ?>
		<div class="updated notice is-dismissible">
			<p><?php esc_html_e( 'admin.page.form_list.notice.duplicate_success', 'flwp' ); ?></p>
		</div>
	<?php endif; ?>

	<?php if (!empty($isDelete)) : ?>
		<div class="updated notice is-dismissible">
			<p><?php esc_html_e( 'admin.page.form_list.notice.delete_success', 'flwp' ); ?></p>
		</div>
	<?php endif; ?>

	<?php if (!empty($formNotFound)) : ?>
		<div class="error notice is-dismissible">
			<p><?php esc_html_e( 'admin.page.form_list.notice.form_not_found', 'flwp' ); ?></p>
		</div>
	<?php endif; ?>

	<form method="get">
		<input type="hidden" name="page" value="flwp-forms" />
		<?php wp_nonce_field('flwp_admin_nonce', 'nonce'); ?>
		<?php
		$form_table->display();
		?>
	</form>
</section>
