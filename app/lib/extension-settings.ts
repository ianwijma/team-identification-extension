import 'react';
import { localSettingsSchema } from '../options/lib/local-settings';

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
    console.log('[settings] getting');
    chrome.storage.sync.get(
        defaultExtensionSettings,
        (settings) => resolve(settings as ExtensionSettings)
    )
});

export const setExtensionSettings = (settings: ExtensionSettings): Promise<ExtensionSettings> => new Promise((resolve) => {
    console.log('[settings] setting', { settings });
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

export const refetchFromRemoteExtensionSettings = async () => {
    const settings = await getExtensionSettings();
    const updatedSettings = await updateFromRemoteExtensionSettings(settings);
    await setExtensionSettings(updatedSettings);
}

export const updateFromRemoteExtensionSettings = async (newSettings: ExtensionSettings) => {
    console.log('[settings] fetching remote');

    const throwError = (message: string) => {
        throw new Error(`Settings not saved, error with remote config: ${message}`)
    }

    try {
        const { remoteUrl } = newSettings;
        const response = await fetch(remoteUrl);
        const remoteSettings = await response.json();
        const { teams = [], ...validatedRemoteSettings } = await localSettingsSchema.validate(remoteSettings, { strict: true });
        const teamMap = teams.reduce((map, team) => {
            map[team.alias] = team;

            return map;
        }, {} as TeamMap);

        await setExtensionSettings({ ...newSettings, ...validatedRemoteSettings, teamMap })
    } catch (error) {
        if (error instanceof Error) {
            throwError(error.message)
        }

        throwError(String(error));
    }

    return getExtensionSettings();
}

