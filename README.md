=== FLWP Plugin ===
Contributors: Kai Steudten
Tags: feedback, user feedback, wordpress user feedback, customer feedback, feedback loop, user experience, ux, ui, customer satisfaction, customer engagement
Donate link: https://flwp.de/
Requires at least: 6.7
Tested up to: 7.1.2
Requires PHP: 7.4
Stable tag: 1.0.1
License: GPLv2 or later
License URI: http://www.gnu.org/licenses/gpl-2.0.html

# FLWP - Feedback Loop WordPress Plugin

Eine detaillierte und umfassende Übersicht über alle Funktionen, Architekturmerkmale und Einstellungsmöglichkeiten des **FLWP (Feedback Loop WordPress Plugin)**.

---

## 🚀 Übersicht

**FLWP** ist ein modernes, leistungsstarkes und hochgradig anpassbares WordPress-Plugin zur Erfassung und Analyse von Nutzerfeedback. Es vereint einen visuellen Formular-Builder mit flexiblen
Anzeige-Optionen (In-Content(Automatische Platzierung und Shortcodes), Overlays, schwebende Feedback-Buttons) und umfangreichen Export- sowie Zielgruppen-Regeln (Targeting).

Das Plugin ist ohne schwere JavaScript-Frameworks in **nativem JavaScript (ES Modules)**, **purem CSS** und **semantischem HTML** entwickelt, um maximale Performance und minimale Ladezeiten zu
gewährleisten.

---

## 🏗️ Architektur & Technik

Das Plugin folgt einer modernen, modularen Architektur, die auf Performance und Wartbarkeit ausgelegt ist:

- **Modulares PHP-Backend:** Klare Trennung von Zuständigkeiten durch Namespaces, PSR-ähnliche Struktur und dedizierte Helper-Klassen.
- **Leichtgewichtiges Frontend:** Verzicht auf schwere Frameworks (wie React oder Vue) im Frontend. Stattdessen werden **native ES-Module** und ein performantes DOM-Rendering eingesetzt.
- **Optimierte Targeting-Engine (`IndexBuilder`):** Ein effizientes System zur Auswahl relevanter Formulare basierend auf komplexen Regeln (URL-Pfad, Post-Type, Endgerät), um unnötige
  Datenbankabfragen zu minimieren.
- **Stabiles Cookie-Handling:** Verwendung von konsistentem serverseitigem Hashing (`crc32b`) zur Generierung eindeutiger Cookie-Namen für das Ausblenden von Formularen nach Interaktion,
  synchronisiert zwischen PHP und JavaScript.
- **REST-API & AJAX-Integration:** Saubere Kommunikation zwischen Frontend und Backend über WordPress-AJAX-Endpoints mit Nonce-Validierung.
- **Datenbank-Architektur:** Eigene Tabellen für Formulare (`flwp_form_data`) und Feedback-Einträge (`_flwp_form_feedback`) sorgen für eine saubere Trennung von
  WordPress-Kern-Daten.

---

## 🏗️ Formular-Builder Features

Der integrierte Builder bietet eine intuitive Echtzeit-Oberfläche zur Erstellung und Konfiguration von Formularen:

- **Echtzeit Live-Vorschau:** Sofortige Visualisierung aller Änderungen im Split-View oder Vollbild-Modus.
- **Formular-Metadaten & Status-Header:**
    - Live anpassbarer Formulartitel.
    - Formular-ID Anzeige (z. B. `60`).
    - Automatisch formatierte Zeitstempel für **Letzte Speicherung** und **Letzte Veröffentlichung** (z. B. `12.06.2026 12:45 Uhr`).
    - Status-Umschaltung: *Aktiv / Live*, *Entwurf / Pausiert* und *Admin-Only*.
- **Multi-Step Unterstützung & Dynamische Schrittnummerierung:**
    - Erstellung mehrstufiger Formulare (Schritt 1, Schritt 2).
- **History-Management:** Vollständige Unterstützung für **Undo (Rückgängig)** und **Redo (Wiederholen)** von Bearbeitungsschritten.
- **Vorlagen-System:** Schnellstart-Templates für häufige Anwendungsfälle (z. B. NPS-Umfrage, Website-Feedback, Kundenzufriedenheit).
- **Import / Export:** Formular-Konfigurationen können als JSON-Dateien exportiert und in andere Installationen importiert werden.

---

## 📋 Unterstützte Feldtypen & Elemente

Das Plugin bietet ein breites Spektrum an Standard- und Spezialfeldern:

### Standard-Eingabefelder

- **Textabsatz (Textarea):** Für mehrzeiliges, freies Nutzerfeedback.

### Spezial- & Rating-Felder (Feedback Metrics)

- **Sternebewertung (Star Rating):** Konfigurierbare Anzahl von Sternen (z. B. 3 oder 5 Sterne).
- **Smiley- / Emoji-Bewertung:** Visuelle Zufriedenheitsmessung mit emotionalen Emojis und anpassbaren Beschriftungen.
- **Daumen-Feedback (Thumbs Up/Down):** Schnelles binäres Positiv-/Negativ-Feedback.
- **NPS (Net Promoter Score):** Standardisierte Skala von 0–10 zur Messung der Weiterempfehlungswahrscheinlichkeit.

### Content- & Layout-Elemente

- **Überschrift (Heading):** Zur Strukturierung von Abschnitten.
- **Textabsatz / Beschreibung:** Für erklärende Hinweise und Anleitungen.
- **Aktions-Buttons (Submit / Action):** Individuell anpassbare Absende-Buttons.

---

## 🔀 Bedingte Logik (Condition Builder)

- **Visueller Regel-Editor:** Steuerung der Sichtbarkeit von einzelnen Formularen basierend auf Seitentyp, Gerätetyp, Url oder Cookie.
- **Bedingungsoperatoren:** Unterstützt Vergleiche wie *ist gleich*, *ist nicht gleich*, *enthält*, *größer als*, *kleiner als*.
- **Mehrfachbedingungen:** Verknüpfung von Bedingungen mit **UND (AND)** oder **ODER (OR)** Logik.

---

## 📍 Anzeige, Platzierung & Triggers

FLWP bietet umfassende Steuerungsmöglichkeiten zur Positionierung und Auslösung von Formularen:

### 1. In-Content Formulare

- **Shortcode:** Manuelle Einbettung via `[flwp_form id="..."]` an beliebiger Stelle in Beiträgen oder Seiten.
- **Pre-Content / Post-Content:** Automatische Anzeige vor oder nach dem Hauptinhalt einer Seite.

### 2. Overlay Formulare

- **Popup / Modal:** Zentriertes Overlay-Fenster mit Abdunkelung des Hintergrunds (Backdrop).
- **Slide-In Banner:** Elegant einfliegende Leisten (z. B. unten rechts oder unten mittig).
- **Schwebender Feedback-Button:** Fixierter Button an den Bildschirmrändern (Mitte Links, Mitte Rechts, Unten Rechts, Unten Links), der beim Klick das Feedback-Modal öffnet.

### 3. Auslöser (Triggers)

- **Klick-Auslöser:** Öffnen beim Klick auf ein beliebiges CSS-Element (`clickSelector`).
- **Zeitverzögerung (Delay):** Automatische Anzeige nach X Sekunden.
- **Scroll-Tiefe:** Auslösung beim Erreichen eines prozentualen Scroll-Werts der Seite (z. B. 50% Scrolltiefe).
- **Exit-Intent:** Erkennung von Mausbewegungen zum Verlassen des Fensters.

### 4. Overlay & Backdrop-Steuerung

- **Scrollen bei geöffnetem Overlay erlauben**
- **Kopfbereich oder Footer ausblenden**
- **Backdrop Overlay:** Optionale Hintergrund-Abdunkelung.
- **Schließen per Klick auf Backdrop (`closeOnBackdrop`):** Schließt das Overlay beim Klick außerhalb des Modals.
- **Schließen per ESC-Taste (`closeOnEsc`):** Schließt das Modal bequem über die Tastatur.
- **Permanentes Ausblenden:** Option zum dauerhaften Verstecken des Auslösers nach dem Schließen (`hideOnClose`) oder nach erfolgreichem Absenden (`hideOnSubmit`).
- **Feedback-Button Customizer:** Eigene Steuerung für Texte, Farben (Hintergrund, Text, Rahmen, Hover-Zustände) und Schriftgrößen des schwebenden Buttons.

---

## 🎨 Design, Typografie & Box-Modell

Jedes Formular lässt sich nahtlos an das Corporate Design anpassen:

- **Farbsystem & CSS-Variablen:** Zentrale Steuerung von Primärfarbe (`#104689`).
- **Typografie & Icons:** Ansteuerung von Schriftgrößen, Zeilenhöhen und Integration von Font-Awesome 6 Icon-Klassen (`<i>`).
- **Box-Modell Steuerung (`setupBoxModelControl`) für In-content Formulare:**
    - Präzise Anpassung von **Padding** und **Margin** für alle vier Seiten (Top, Right, Bottom, Left).
    - **Linked-Werte Toggle:** Synchronisiert Werte bei der Eingabe.
    - **Robuste Validierung:** Verhindert das Speichern leerer Strings durch automatische Konvertierung / Fallbacks auf `"0"` bzw. `"auto"`.
- **Modales Layout & Spacing:** Saubere Trennung des Modal-Aufbaus: `.flwp-general-overlay-modal` besitzt ein rahmenloses Grundlayout, während die Abstände präzise durch die Child-Elemente
  `.flwp-overlay-header`, `.flwp-overlay-body` und `.flwp-overlay-footer` definiert werden.

---

## 🎯 Targeting (Zielgruppen- & Regel-Engine)

Präzise Regeln bestimmen, wann und wem ein Formular angezeigt wird:

- **Seiten-Regeln:** Ausspielung auf allen Seiten, spezifischen URL-Pfaden / Mustern, Beitrags-Typen (Post Types).
- **Geräte-Regeln:** Gezieltes Targeten von Desktop, Tablet oder Mobile-Geräten.
- **Frequenz & Session-Limits:** Begrenzung der Anzeigehäufigkeit pro Nutzer (z. B. max. 1x pro Session oder Ausblenden für X Tage via Cookie).

---

## 🔔 Benachrichtigungen & Integrationen

- **E-Mail-Benachrichtigung:** Automatische E-Mails bei neuem Feedback-Eingang mit konfigurierbarem Betreff, Empfängern und dynamischen Platzhaltern (`{feedback_values}`, `{date}`, `{time}`,
  `{page_url}`).

---

## 📈 Tracking & Erfolgsbestätigung

- **Bestätigungs-Optionen (Confirmation):**
    - Dankeschön-Nachricht mit anpassbarem Text & Icon.
    - Automatische Weiterleitung (Redirect) auf eine spezifische URL.
    - Formular nach Absenden ausblenden oder Cookie-Sperre aktivieren.

---

## 📊 Administration, Analyse & Daten-Management

Das Admin-Dashboard bietet umfassende Werkzeuge zur Verwaltung:

- **Dashboard:** Visuelle KPIs (Gesamt-Feedbacks,Verteilungsanzahl nach Typ, Letzte Feedbacks, Feedback-Trend via Chart).
- **Formular-Verwaltung ("All Forms"):** Übersicht aller Formulare mit Status, Kurz-Codes und Schnellaktionen (Bearbeiten, Duplizieren, Status ändern, Löschen).
- **Feedback-Liste ("Feedback List"):** Tabellarische Übersicht aller eingegangenen Rückmeldungen mit Status-Tracking (Gelesen / Ungelesen), Filterfunktion und Detail-Modal.
- **Daten-Management (Import & Export):**
    - **Feedback-Export:** CSV- und JSON-Export gesammelter Antworten mit flexiblen Filtern (Formular-Auswahl, Zeitraum-Filter: *Gesamter Zeitraum*, *Heute*, *Letzte 7 Tage*, *Letzte 30 Tage*,
      *Benutzerdefiniert*).
    - **Formular-Export & Import:** Sichern und Übertragen von Formular-Strukturen als JSON-Dateien.
- **Detaillierte Feedback-Einsicht:** Analyse von Nutzer-Metadaten wie URL-Pfad, User-Agent, Betriebssystem, Gerätetyp, Bildschirmauflösung und Verweildauer auf der Seite.
- **Status-Workflow:** Markierung von Feedbacks als *Ungelesen*, *Gelesen* oder *Archiviert* zur effizienten Team-Kollaboration.
- **Plugin-Einstellungen ("Settings"):** Globale Optionen wie Custom css.

---

## 🔐 Sicherheit, Performance & Accessibility

- **integrierten Honeypot-Spamschutz**
- **Performance:** Leichtgewichtiger Frontend-Code ohne schwerfällige Frameworks.
- **Barrierefreiheit (A11y):** Semantisches HTML5, vollständige Tastaturbedienbarkeit, ARIA-Attribute (`aria-label`, `aria-expanded`, `role`) und kontrasteigenes Design.
- **Input-Sanitizing & Security:** Escape-Funktionen und XSS-Schutz für alle Benutzereingaben.
