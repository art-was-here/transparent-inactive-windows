## Transparent Inactive Windows
by: art-was-here

### Intro

This is a simple Gnome extension to make inactive windows semi-transparent. This is a built in feature of Hyprland, my normal desktop environment, and all the other extensions available for Gnome for transparency options do not work on Gnome 48. So...I made this. I even added a fancy fade animation so its not so jarring when windows switch between different opacities.

### Planned Features

[x] Transparent inactive windows
[x] Transparent fade animation
[x] Apply transparency to ALL windows
[x] Increase/Decrease animation speed
[x] Switch transparency to percentage slider


### Link to Gnome Extensions
TODO

### Manual Install

`git clone https://github.com/art-was-here/transparent-inactive-windows`

`mv transparent-inactive-windows transparent-inactive-windows@art-was-here`

`mv transparent-inactive-windows@art-was-here ~/.local/share/gnome-shell/extensions/`

`glib-compile-schemas ~/.local/share/gnome-shell/extensions/transparent-inactive-windows@art-was-here/schemas/`

`gnome-extensions enable transparent-inactive-windows@art-was-here`

You may have to log in and out.
