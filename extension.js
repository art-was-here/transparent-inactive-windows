import Clutter from 'gi://Clutter';
import Meta from 'gi://Meta';

import { Extension } from 'resource:///org/gnome/shell/extensions/extension.js';

export default class SemiTransparentInactiveWindows extends Extension {
    enable() {
        this._settings = this.getSettings();
        this._onFocusChanged = this._onFocusChanged.bind(this);
        this._focusChangedId = global.display.connect('notify::focus-window', this._onFocusChanged);
        this._onFocusChanged();
    }

    disable() {
        if (this._focusChangedId) {
            global.display.disconnect(this._focusChangedId);
            this._focusChangedId = null;
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
        const numWorkspaces = workspaceManager.get_n_workspaces();
        
        for (let i = 0; i < numWorkspaces; i++) {
            const workspace = workspaceManager.get_workspace_by_index(i);
            const workspaceWindows = global.display.get_tab_list(Meta.TabList.NORMAL_ALL, workspace);
            windows.push(...workspaceWindows);
        }
        
        return windows;
    }

    _onFocusChanged() {
        const focusedWindow = global.display.get_focus_window();
        const windows = this._getAllWindows();
        const opacity = this._settings.get_int('window-opacity');
        
        for (const window of windows) {
            if (window === focusedWindow) {
                this._setWindowOpacity(window, 255);
            } else {
                this._setWindowOpacity(window, opacity);
            }
        }
    }

    _setWindowOpacity(window, targetOpacity) {
        const actor = window.get_compositor_private();
        if (!actor) {
            return;
        }

        // Remove any existing transitions to avoid conflicts
        actor.remove_all_transitions();

        // Animate to the new opacity with a smooth fade
        actor.ease({
            opacity: targetOpacity,
            duration: 300, // 300ms transition duration
            mode: Clutter.AnimationMode.EASE_OUT_QUAD,
        });
    }
} 