import {Clock, Settings, updateClock} from "./scripts.js";

let clock = new Clock();
let settings = new Settings();

updateClock(clock, settings);

window.wallpaperPropertyListener = {
    applyUserProperties: function (properties) {
        if (properties.ui_font_size) {
            settings.font.size = properties.ui_font_size.value;
        }

        if (properties.ui_use_12h_format) {
            settings.format.use_12h_format = properties.ui_use_12h_format.value;
        }
        if (properties.ui_show_leading_zero) {
            settings.format.show_leading_zero = properties.ui_show_leading_zero.value;
        }
        if (properties.ui_use_const) {
            settings.format.use_const_declaration = properties.ui_use_const.value;
        }

        if (properties.ui_customize_position_enable) {
            settings.position.customization.enable = properties.ui_customize_position_enable.value;
        }
        if (properties.ui_position_x) {
            settings.position.x = properties.ui_position_x.value;
        }
        if (properties.ui_position_y) {
            settings.position.y = properties.ui_position_y.value;
        }

        if (properties.ui_customize_visibility_enable) {
            settings.visibility.customization.enable = properties.ui_customize_visibility_enable.value;
        }
        if (properties.ui_show_hour) {
            settings.clock.elements.hour.visibility = properties.ui_show_hour.value;
        }
        if (properties.ui_show_minute) {
            settings.clock.elements.minute.visibility = properties.ui_show_minute.value;
        }
        if (properties.ui_show_second) {
            settings.clock.elements.second.visibility = properties.ui_show_second.value;
        }
        if (properties.ui_show_period) {
            settings.clock.elements.period.visibility = properties.ui_show_period.value;
        }
        if (properties.ui_show_day) {
            settings.clock.elements.day.visibility = properties.ui_show_day.value;
        }
        if (properties.ui_show_weekday) {
            settings.clock.elements.weekday.visibility = properties.ui_show_weekday.value;
        }
        if (properties.ui_show_month) {
            settings.clock.elements.month.visibility = properties.ui_show_month.value;
        }
        if (properties.ui_show_year) {
            settings.clock.elements.year.visibility = properties.ui_show_year.value;
        }
        if (properties.ui_show_timezone) {
            settings.clock.elements.timezone.visibility = properties.ui_show_timezone.value;
        }
        if (properties.ui_show_unix) {
            settings.clock.elements.unix.visibility = properties.ui_show_unix.value;
        }

        if (properties.ui_theme) {
            settings.theme.name = properties.ui_theme.value;
        }

        if (properties.ui_customize_theme_enable) {
            settings.theme.customization.enable = properties.ui_customize_theme_enable.value;
        }
        if (properties.ui_font_family) {
            settings.font.family = properties.ui_font_family.value;
        }

        updateClock(clock, settings);
    }
};

setInterval(function () {
    updateClock(clock, settings);
}, 1000);