# FLWP – User Feedback & Surveys

FLWP (Feedback Loop for WordPress) is a WordPress plugin for collecting, managing, and analyzing user feedback directly on your website.

Build feedback forms with a visual form builder, display them using flexible triggers and targeting rules, and manage submissions in the WordPress admin area.

Feedback data is stored locally in your WordPress database.

## Features

- Visual form builder with live preview
- Unlimited feedback forms
- Multi-step feedback forms
- Rating fields, text areas, buttons, headlines, and descriptions
- Multiple display types: shortcodes, overlays, slide-ins, and floating feedback buttons
- Smart triggers: click, scroll depth, time delay, and exit intent
- Page- and device-based targeting
- Feedback management with status handling and filtering
- Email notifications and configurable confirmation actions
- Optional feedback context and tracking
- Lightweight frontend using native JavaScript (ES Modules)

### FLWP Pro

FLWP Pro extends the free version with additional features:

- Thumbs up/down, smiley ratings, and Net Promoter Score (NPS)
- Advanced URL- and cookie-based targeting
- Extended technical tracking information
- Advanced feedback statistics and insights
- CSV and JSON import/export functionality

Both Free and Pro support unlimited feedback forms.

## Requirements

- WordPress 6.7 or newer
- PHP 7.4 or newer
- Composer
- Node.js and npm

## Development Setup

Clone the repository into your local WordPress plugins directory:

```bash
cd wp-content/plugins
git clone https://github.com/flwp-plugin/flwp_free.git flwp
cd flwp
```

Install PHP dependencies:

```bash
composer install
```

Install JavaScript dependencies:

```bash
npm install
```

Generate or update translation files:

```bash
npm run translate
```

Build the frontend and admin assets in watch mode:

```bash
npm run build
```

After completing the setup, activate **FLWP – User Feedback & Surveys** in the WordPress admin area.

### Build Commands

| Command | Description |
|---|---|
| `composer install` | Install PHP dependencies |
| `npm install` | Install JavaScript dependencies |
| `npm run build` | Build JavaScript and CSS assets |
| `npm run translate` | Generate or update translation files |

## Installation for WordPress Users

This GitHub repository contains the development source code.

For a regular WordPress installation, use the packaged plugin release or install FLWP through the WordPress Plugin Directory once available.

A source checkout may require Composer dependencies and compiled assets before the plugin can be used.

## Translations

FLWP supports internationalization using WordPress translation functions.

Available languages include:

- English
- German

Translation files are located in the `languages/` directory.

To update translations during development, run:

```bash
npm run translate
```

## Privacy

Submitted feedback is stored locally in the WordPress database.

FLWP supports optional tracking of contextual information associated with feedback submissions. Site administrators can configure which supported data points are collected.

No external feedback storage service is required.

## Documentation & Support

- Website: https://flwp.de/
- Features: https://flwp.de/funktionen/
- Documentation: https://flwp.de/docs/
- Support: https://flwp.de/support-forum/

## License

FLWP is licensed under the GNU General Public License v2 or later.

See [GPL-2.0-or-later](https://www.gnu.org/licenses/gpl-2.0.html) for license information.