#!/bin/bash

POT_FILE="languages/flwp.pot"
PO_FILE="languages/flwp-de_DE.po"
LANG_DIR="languages/"
PLUGIN_DIR="./"

make_pot() {
    echo "Generating POT file..."
    ./vendor/bin/wp i18n make-pot --ignore-domain --exclude="assets/js/source,assets/js/components,assets/css/source,assets/css/components" "$PLUGIN_DIR" "$POT_FILE"
}

update_po() {
    echo "Updating PO file..."
    ./vendor/bin/wp i18n update-po "$POT_FILE"
}

make_json() {
    echo "Generating JSON files..."
    ./vendor/bin/wp i18n make-json "$LANG_DIR"
}

make_mo() {
    echo "Generating MO files..."
    ./vendor/bin/wp i18n make-mo "$LANG_DIR"
}

if [ $# -eq 0 ]; then
    make_pot
    update_po
    make_json
    make_mo
else
    for arg in "$@"; do
        case "$arg" in
            pot) make_pot ;;
            po) update_po ;;
            json) make_json ;;
            mo) make_mo ;;
            *) echo "Unknown command: $arg"; exit 1 ;;
        esac
    done
fi
