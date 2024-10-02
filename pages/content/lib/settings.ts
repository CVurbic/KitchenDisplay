import { Settings } from './types';
import { getStoredData, setStoredData } from './utils';

export let settings: Settings = { onOffCollors: false, highlightArticle: 0 };

export function updateSettings(newSettings: Partial<Settings>) {
    settings = { ...settings, ...newSettings };
    setStoredData("settings", settings);
}

export function loadSettings() {
    settings = getStoredData("settings", settings);
}
