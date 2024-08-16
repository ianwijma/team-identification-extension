import 'react';

export type TeamAlias = string;
export type Team = {
    alias: TeamAlias,
    name: string,
    description: string,
}

export type TeamMap = Record<TeamAlias, Team>;

export type ExtensionSettings = {
    useRemote: boolean,
    remoteUrl: string,
    elementAttributeName: string,
    requestHeaderName: string,
    responseHeaderName: string,
    teamMap: TeamMap
}

export const defaultExtensionSettings: ExtensionSettings = {
    useRemote: false,
    remoteUrl: '',
    elementAttributeName: 'team-identification-extension',
    requestHeaderName: 'x-team-identification-extension',
    responseHeaderName: 'x-team-identification-extension',
    teamMap: {}
}

export const getExtensionSettings = (): Promise<ExtensionSettings> => new Promise((resolve) => {
    console.log('[settings] fetching');
    chrome.storage.sync.get(
        defaultExtensionSettings,
        (settings) => resolve(settings as ExtensionSettings)
    )
});

export const setExtensionSettings = (settings: ExtensionSettings): Promise<ExtensionSettings> => new Promise((resolve) => {
    console.log('[settings] saving', { settings });
    chrome.storage.sync.set(
        settings,
        () => resolve(settings)
    )
});

export const resetExtensionSettings = (): Promise<ExtensionSettings> => new Promise((resolve) => {
    console.log('[settings] resetting');
    chrome.storage.sync.set(
        defaultExtensionSettings,
        () => resolve(defaultExtensionSettings)
    )
});



