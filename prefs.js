import Adw from 'gi://Adw';
import Gio from 'gi://Gio';
import Gtk from 'gi://Gtk';

import { ExtensionPreferences, gettext as _ } from 'resource:///org/gnome/Shell/Extensions/js/extensions/prefs.js';

export default class SemiTransparentInactiveWindowsPreferences extends ExtensionPreferences {
    fillPreferencesWindow(window) {
        const page = new Adw.PreferencesPage();
        const group = new Adw.PreferencesGroup({
            title: _('Transparent Inactive Windows'),
            description: _('Configure window transparency settings'),
        });
        group.add(this.buildPrefsWidget());
        page.add(group);
        window.add(page);
    }

    buildPrefsWidget() {
        let settings = this.getSettings();
        let box = new Gtk.Box({
            halign: Gtk.Align.CENTER,
            orientation: Gtk.Orientation.VERTICAL,
            'margin-top': 20,
            'margin-bottom': 20,
            'margin-start': 20,
            'margin-end': 20,
            spacing: 16
        });

        // Add toggle for applying to all windows
        box.append(this.buildToggle(settings, 'apply-to-all-windows', _('Apply transparency to all windows')));
        
        // Add opacity slider (5% to 100%)
        box.append(this.buildSlider(settings, 'window-opacity', [5, 100, 1, 5], _('Window opacity percentage:')));

        // Add animation speed slider (50ms to 1000ms)
        box.append(this.buildMsSlider(settings, 'animation-speed', [50, 1000, 10, 50], _('Animation speed:')));

        return box;
    }

    buildToggle(settings, key, labeltext) {
        let hbox = new Gtk.Box({ 
            orientation: Gtk.Orientation.HORIZONTAL, 
            spacing: 10 
        });

        let label = new Gtk.Label({ 
            label: labeltext, 
            halign: Gtk.Align.START,
            hexpand: true,
            wrap: true,
            xalign: 0
        });

        let toggle = new Gtk.Switch({
            halign: Gtk.Align.END,
            valign: Gtk.Align.CENTER
        });

        // Add tooltip for accessibility
        toggle.set_tooltip_text(_('Toggle whether to apply transparency to all windows or just inactive ones'));

        settings.bind(key, toggle, 'active', Gio.SettingsBindFlags.DEFAULT);

        hbox.append(label);
        hbox.append(toggle);

        return hbox;
    }

    buildSlider(settings, key, values, labeltext) {
        let [lower, upper, step, page] = values;
        let vbox = new Gtk.Box({ 
            orientation: Gtk.Orientation.VERTICAL, 
            spacing: 10 
        });

        let hbox = new Gtk.Box({ 
            orientation: Gtk.Orientation.HORIZONTAL, 
            spacing: 10 
        });

        let label = new Gtk.Label({ 
            label: labeltext, 
            halign: Gtk.Align.START,
            hexpand: true,
            wrap: true,
            xalign: 0
        });

        // Get initial value
        let initialValue = settings.get_int(key);

        let valueLabel = new Gtk.Label({
            label: `${initialValue}%`,
            halign: Gtk.Align.END,
            width_chars: 5
        });

        hbox.append(label);
        hbox.append(valueLabel);

        let adjustment = new Gtk.Adjustment({
            lower: lower,
            upper: upper,
            step_increment: step,
            page_increment: page,
            value: initialValue
        });

        let scale = new Gtk.Scale({
            orientation: Gtk.Orientation.HORIZONTAL,
            adjustment: adjustment,
            digits: 0,
            hexpand: true,
            draw_value: false
        });

        // Add tooltip for accessibility
        scale.set_tooltip_text(_('Adjust the transparency level of windows from 5% (very transparent) to 100% (fully opaque)'));

        // Update settings when scale changes
        scale.connect('value-changed', () => {
            let value = Math.round(scale.get_value());
            settings.set_int(key, value);
            valueLabel.set_text(`${value}%`);
        });

        // Update scale when settings change externally
        settings.connect(`changed::${key}`, () => {
            let value = settings.get_int(key);
            scale.set_value(value);
            valueLabel.set_text(`${value}%`);
        });

        vbox.append(hbox);
        vbox.append(scale);

        return vbox;
    }

    buildMsSlider(settings, key, values, labeltext) {
        let [lower, upper, step, page] = values;
        let vbox = new Gtk.Box({ 
            orientation: Gtk.Orientation.VERTICAL, 
            spacing: 10 
        });

        let hbox = new Gtk.Box({ 
            orientation: Gtk.Orientation.HORIZONTAL, 
            spacing: 10 
        });

        let label = new Gtk.Label({ 
            label: labeltext, 
            halign: Gtk.Align.START,
            hexpand: true,
            wrap: true,
            xalign: 0
        });

        // Get initial value
        let initialValue = settings.get_int(key);

        let valueLabel = new Gtk.Label({
            label: `${initialValue}ms`,
            halign: Gtk.Align.END,
            width_chars: 5
        });

        hbox.append(label);
        hbox.append(valueLabel);

        let adjustment = new Gtk.Adjustment({
            lower: lower,
            upper: upper,
            step_increment: step,
            page_increment: page,
            value: initialValue
        });

        let scale = new Gtk.Scale({
            orientation: Gtk.Orientation.HORIZONTAL,
            adjustment: adjustment,
            digits: 0,
            hexpand: true,
            draw_value: false
        });

        // Add tooltip for accessibility
        scale.set_tooltip_text(_('Adjust the animation speed from 50ms (very fast) to 1000ms (slow)'));

        // Update settings when scale changes
        scale.connect('value-changed', () => {
            let value = Math.round(scale.get_value());
            settings.set_int(key, value);
            valueLabel.set_text(`${value}ms`);
        });

        // Update scale when settings change externally
        settings.connect(`changed::${key}`, () => {
            let value = settings.get_int(key);
            scale.set_value(value);
            valueLabel.set_text(`${value}ms`);
        });

        vbox.append(hbox);
        vbox.append(scale);

        return vbox;
    }
} 