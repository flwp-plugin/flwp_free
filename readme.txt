=== FLWP – User Feedback & Surveys ===
Contributors: flwppro
Tags: feedback, user feedback, customer feedback, surveys, user experience
Requires at least: 6.7
Tested up to: 7.1
Requires PHP: 7.4
Stable tag: 1.0.5
License: GPLv2 or later
License URI: https://www.gnu.org/licenses/gpl-2.0.html

Collect and analyze user feedback directly in WordPress with a visual form builder, flexible display options, smart triggers, and targeting rules.

== Description ==

FLWP (Feedback Loop for WordPress) is a lightweight and flexible feedback plugin for collecting user feedback directly on your WordPress website.

Create feedback forms with a visual form builder and display them exactly where and when they are relevant. Embed forms directly in your content, open them as overlays or slide-ins, or use a floating feedback button.

FLWP provides flexible display rules, smart triggers, frequency controls, email notifications, and configurable confirmation behavior.

The free version allows you to create and use up to three feedback forms. Submitted feedback is delivered via email notifications, while FLWP Pro adds feedback management and analysis directly in the WordPress admin area.

Submitted feedback data is stored locally in your WordPress database.

The frontend is built with native JavaScript (ES Modules), CSS, and semantic HTML without requiring a frontend framework such as React or Vue.

== Highlights & Features ==

* **Visual Form Builder:** Create and edit feedback forms with a live preview, multi-step support, undo/redo, and reusable templates.
* **Unlimited Feedback Forms:** Create and use unlimited feedback forms with the free version of FLWP.
* **Flexible Form Fields:** Build forms using headlines, descriptions, text areas, buttons, and rating fields.
* **Flexible Display Options:** Display feedback forms before or after content, via shortcode, as overlays, slide-ins, or floating feedback buttons.
* **Smart Triggers:** Open feedback forms based on clicks, time delays, scroll depth, or exit intent.
* **Display Conditions:** Control where and to whom feedback forms are shown using page and device rules.
* **AND/OR Rules:** Combine multiple display conditions to create more specific targeting rules.
* **Frequency Control:** Control how often feedback forms are displayed and prevent unwanted repeated prompts.
* **Email Notifications:** Receive automatic email notifications when new feedback is submitted.
* **Confirmation Actions:** Show a thank-you message, redirect users, or hide a form after submission.
* **Custom Styling:** Customize the appearance of feedback forms and add your own CSS.
* **Lightweight Frontend:** Frontend functionality is built with native JavaScript (ES Modules), CSS, and semantic HTML.
* **Accessibility:** Forms use semantic markup and support keyboard interaction and relevant ARIA attributes.
* **Local Feedback Storage:** Submitted feedback data is stored in your WordPress database.

== Display Options ==

FLWP supports several ways to integrate feedback forms into your website:

* Before or after post content
* Shortcode: `[flwp_form id="123"]`
* Overlay / modal
* Slide-in
* Floating feedback button

Triggers can be used to control when supported display types appear, including:

* Click on a CSS selector
* Time delay
* Scroll depth
* Exit intent

Frequency controls help prevent forms from being shown too often to the same visitor.

== Form Fields ==

The free version of FLWP includes the following form fields:

* Headline
* Description
* Text area
* Button
* Rating

FLWP Pro adds additional feedback and rating fields:

* Thumbs up / down
* Smiley / emoji rating
* Net Promoter Score (NPS 0–10)

== Targeting ==

FLWP provides display conditions that allow you to control where and to whom your feedback forms are shown.

The free version includes basic targeting based on:

* Page type
* Device type

Multiple conditions can be combined using AND/OR logic.

FLWP Pro adds advanced targeting based on:

* URL rules
* Cookie values

These rules can be combined with FLWP's triggers and frequency controls to create targeted feedback experiences.

== Email Notifications ==

FLWP can automatically send an email notification when new feedback is submitted.

Notification emails can include dynamic information such as:

* Submitted feedback values
* Date
* Time
* Page URL

Available placeholders include:

`{feedback_values}`
`{date}`
`{time}`
`{page_url}`

Free users can use email notifications to receive submitted feedback without requiring feedback management in the WordPress admin area.

== Confirmation Actions ==

Configure what happens after a visitor submits a feedback form.

FLWP can:

* Display a custom thank-you message
* Redirect the visitor
* Hide the form after submission
* Prevent unwanted repeated displays

== Feedback Data & Context ==

FLWP can store contextual information together with submitted feedback.

The free version includes:

* Page URL
* Page title
* Referrer URL
* User agent

FLWP Pro adds additional context and tracking metadata, including:

* Browser language
* Screen resolution
* Viewport size
* Timezone
* Connection information
* Device type
* Anonymized session ID
* Time on page
* Color scheme

The anonymized session ID is randomly generated in the visitor's browser session and does not contain a WordPress user ID.

== FLWP Pro ==

FLWP Pro extends the free plugin with additional tools for collecting, managing, and analyzing feedback.

Pro features include:

* Unlimited feedback forms
* Thumbs up / down fields
* Smiley / emoji rating fields
* Net Promoter Score (NPS) fields
* Feedback management directly in the WordPress admin area
* Feedback status management for unread, read, and archived entries
* Filtering and detailed feedback information
* Additional targeting rules based on URLs and cookie values
* Additional feedback context and tracking metadata
* Import and export of feedback data as CSV or JSON
* Import and export of form configurations
* Feedback statistics and dashboard insights

The free version remains fully usable for creating and displaying up to three feedback forms and receiving submitted feedback via email.

== Feedback Management ==

FLWP Pro provides feedback management directly in the WordPress admin area.

Submitted feedback can be viewed together with its form values and available context information.

Feedback entries can be organized using the following statuses:

* Unread
* Read
* Archived

Feedback can also be filtered by criteria such as form, display type, status, and date range.

== Import & Export ==

Import and export functionality is available with FLWP Pro.

Feedback data can be exported as:

* CSV
* JSON

Form configurations can also be exported and imported as JSON. This can be useful when moving forms between WordPress installations or from a staging environment to a live website.

FLWP Pro also supports importing previously exported feedback data.

== Privacy & Feedback Data ==

Submitted feedback data is stored locally in your WordPress database.

FLWP does not require an external feedback service to store or analyze submitted feedback. Feedback content is not sent to an external feedback cloud for storage or analysis.

Depending on your configuration and license, separate services used for licensing, updates, or plugin-related functionality may process their own technical data independently of submitted feedback content.

== Installation ==

1. Install FLWP from the WordPress plugin directory or upload the plugin ZIP file.
2. Activate FLWP from the Plugins screen in WordPress.
3. Open **FLWP** in the WordPress admin area.
4. Create your first feedback form using the visual form builder.
5. Configure where and when the form should be displayed.
6. Publish the form.

You can also embed a form manually using the shortcode `[flwp_form id="123"]`, replacing `123` with the ID of your form.

== Frequently Asked Questions ==

= How many feedback forms can I create? =

The free version of FLWP allows you to create and use up to three feedback forms.

FLWP Pro removes this limit and allows you to create unlimited feedback forms.

= Where is submitted feedback stored? =

Submitted feedback data is stored locally in your WordPress database.

Free users receive submitted feedback through email notifications. FLWP Pro additionally provides feedback management and analysis directly in the WordPress admin area.

= How do I manually embed a form into a page? =

Use the shortcode `[flwp_form id="123"]`, replacing `123` with the ID of the form you want to display.

= Which form fields are included in the free version? =

The free version includes headline, description, text area, button, and rating fields.

FLWP Pro additionally provides thumbs up/down, smiley/emoji ratings, and NPS (Net Promoter Score 0–10).

= Which display types are available in the free version? =

The free version supports in-content forms, shortcodes, overlays, slide-ins, and floating feedback buttons.

These display types are not restricted to FLWP Pro.

= Can I control when a feedback form appears? =

Yes. FLWP supports triggers such as clicks, time delays, scroll depth, and exit intent.

Frequency controls can also be used to limit repeated displays.

FLWP Pro additionally provides URL- and cookie-based targeting rules.

= Can I combine multiple display conditions? =

Yes. Display conditions can be combined using AND/OR logic to create more specific targeting rules.

= Can I manage submitted feedback in WordPress? =

Feedback management in the WordPress admin area is available with FLWP Pro.

FLWP Pro includes feedback details, status management, filtering, additional context information, and feedback statistics.

Free users receive submitted feedback through email notifications.

= Can feedback data be exported? =

Yes, with FLWP Pro.

Feedback can be exported as CSV or JSON. FLWP Pro also supports importing feedback data and importing or exporting form configurations.

= Does FLWP collect additional context about feedback submissions? =

FLWP can store context information together with feedback submissions.

The free version includes the page URL, page title, referrer URL, and user agent.

FLWP Pro adds additional metadata such as browser language, screen resolution, viewport size, timezone, connection information, device type, anonymized session ID, time on page, and color scheme.

= What is the anonymized session ID? =

FLWP can generate a random session identifier in the visitor's browser session.

The identifier can be used to technically associate feedback submissions from the same browser session. It does not contain a WordPress user ID.

= Does FLWP require an external feedback service? =

No. Submitted feedback data is stored locally in your WordPress database and does not require an external feedback service for storage or analysis.

= Does FLWP require a JavaScript framework in the frontend? =

No. FLWP's frontend functionality is built with native JavaScript (ES Modules) and CSS without requiring a frontend framework such as React or Vue.

== Screenshots ==

1. FLWP dashboard with feedback statistics and recent activity.
2. Visual form builder with live preview and field selection.
3. Display and targeting rules for controlling where feedback forms appear.
4. Feedback management and detailed feedback view in FLWP Pro.
5. Feedback import and export tools in FLWP Pro.

== Links ==

* Plugin website: https://flwp.de/
* Features: https://flwp.de/funktionen/
* Documentation: https://flwp.de/docs/
* Support forum: https://flwp.de/support-forum/

== Translations ==

FLWP includes translations for:

* English
* German

== Changelog ==

= 1.0.5 =

* Initial public release of FLWP.