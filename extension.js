import Clutter from 'gi://Clutter';
import Meta from 'gi://Meta';

import { Extension } from 'resource:///org/gnome/shell/extensions/extension.js';

export default class SemiTransparentInactiveWindows extends Extension {
    enable() {
        this._settings = this.getSettings();
        this._onFocusChanged = this._onFocusChanged.bind(this);
        this._onSettingsChanged = this._onSettingsChanged.bind(this);
        
        this._focusChangedId = global.display.connect('notify::focus-window', this._onFocusChanged);
        this._settingsChangedId = this._settings.connect('changed', this._onSettingsChanged);
        
        this._onFocusChanged();
    }

    disable() {
        if (this._focusChangedId) {
            global.display.disconnect(this._focusChangedId);
            this._focusChangedId = null;
        }

        if (this._settingsChangedId) {
            this._settings.disconnect(this._settingsChangedId);
            this._settingsChangedId = null;
        }

        // Restore all windows to full opacity with fade
        this._getAllWindows().forEach(window => {
            this._setWindowOpacity(window, 255);
        });

        this._settings = null;
    }

    _getAllWindows() {
        const windows = [];
        const workspaceManager = global.workspace_manager;
        
        if (!workspaceManager) {
            console.log('Workspace manager not available');
            return windows;
        }
        
        const numWorkspaces = workspaceManager.get_n_workspaces();
        
        for (let i = 0; i < numWorkspaces; i++) {
            const workspace = workspaceManager.get_workspace_by_index(i);
            if (workspace) {
                const workspaceWindows = global.display.get_tab_list(Meta.TabList.NORMAL_ALL, workspace);
                if (workspaceWindows) {
                    windows.push(...workspaceWindows);
                }
            }
        }
        
        return windows;
    }

    _onSettingsChanged() {
        // Reapply transparency when settings change
        this._onFocusChanged();
    }

    _onFocusChanged() {
        const focusedWindow = global.display.get_focus_window();
        const windows = this._getAllWindows();
        const opacityPercentage = this._settings.get_int('window-opacity');
        const applyToAll = this._settings.get_boolean('apply-to-all-windows');
        
        // Validate opacity percentage
        const clampedOpacity = Math.max(5, Math.min(100, opacityPercentage));
        
        // Convert percentage to 0-255 range
        const opacity = Math.round((clampedOpacity / 100) * 255);
        
        for (const window of windows) {
            if (!window) continue;
            
            if (applyToAll) {
                // Apply transparency to all windows
                this._setWindowOpacity(window, opacity);
            } else {
                // Apply transparency only to inactive windows (original behavior)
                if (window === focusedWindow) {
                    this._setWindowOpacity(window, 255);
                } else {
                    this._setWindowOpacity(window, opacity);
                }
            }
        }
    }

    _setWindowOpacity(window, targetOpacity) {
        if (!window) {
            return;
        }
        
        const actor = window.get_compositor_private();
        if (!actor) {
            return;
        }

        // Remove any existing transitions to avoid conflicts
        actor.remove_all_transitions();

        // Get animation speed from settings and validate
        const animationSpeed = Math.max(50, Math.min(1000, this._settings.get_int('animation-speed')));

        // Animate to the new opacity with a smooth fade
        actor.ease({
            opacity: targetOpacity,
            duration: animationSpeed,
            mode: Clutter.AnimationMode.EASE_OUT_QUAD,
        });
    }
} 