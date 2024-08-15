import { createContext, PropsWithChildren, useContext, useEffect, useState } from "react";
import { ValidationError } from "yup";
import { defaultExtensionSettings, ExtensionSettings, getExtensionSettings, resetExtensionSettings, setExtensionSettings, TeamMap } from "../lib/extension-settings";
import { localSettingsSchema } from "../lib/local-settings";

type SetFunction<T> = (newValue: T) => void
type BlankFunction = () => void

type Context = {
    loading: boolean,
    settings: ExtensionSettings,
    remoteSettingsErrror: null |string,
    updateSettings: SetFunction<ExtensionSettings>,
    resetSettings: BlankFunction,
}

const mockSetFn: SetFunction<any> = (newValue) => {};
const mockBlankFn: BlankFunction = () => {};

const defaultContext: Context = {
    loading: false,
    settings: defaultExtensionSettings,
    remoteSettingsErrror: null,
    updateSettings: mockSetFn,
    resetSettings: mockBlankFn,
}

const SettingsContext = createContext<Context>(defaultContext); 

export const useSettingsContext = () => useContext(SettingsContext);

export const SettingsContextProvider = ({ children }: PropsWithChildren) => {
    const [loading, setLoading] = useState(true);
    // Loading is too quick, we need to show off the forms skeletons a bit.
    const setLoadingDelayed = (newLoading: boolean) => setTimeout(() => setLoading(newLoading), 500);
    const [settings, setSettings] = useState(defaultExtensionSettings);

    const [remoteSettingsErrror, setRemoteSettingsErrror] = useState<null | string>(null);
    const updateRemoteSettingsError = (message?: string) => {
        if (message) {
            setRemoteSettingsErrror(`Settings not saved, error with remote config: ${message}`)
        } else {
            setRemoteSettingsErrror(null);
        }
    }

    const parseSettings = async (newSettings: ExtensionSettings) => {
        updateRemoteSettingsError();

        const { useRemote, remoteUrl } = newSettings;
        if (useRemote && remoteUrl) {
            try {
                const response = await fetch(remoteUrl);
                const remoteSettings = await response.json();
                const { teams = [], ...validatedRemoteSettings } = await localSettingsSchema.validate(remoteSettings, { strict: true });
                const teamMap = teams.reduce((map, team) => {
                    map[team.alias] = team;

                    return map;
                }, {} as TeamMap);
                
                return { ...newSettings, ...validatedRemoteSettings, teamMap };
            } catch (error) {
                if (error instanceof Error) {
                    updateRemoteSettingsError(error.message)
                }

                updateRemoteSettingsError(String(error));

                return settings;
            }
        }

        return newSettings;
    }

    const updateSettings = async (newSettings: ExtensionSettings) => {
        setLoading(true);

        const parsedSettings = await parseSettings(newSettings);
    
        setExtensionSettings(parsedSettings).then((updatedSettings) => {
            setSettings(updatedSettings);
            setLoadingDelayed(false)
        });
    }
    
    const resetSettings = () => {
        setLoading(true);
        resetExtensionSettings().then((settings) => {
            setSettings(settings);
            setLoadingDelayed(false)
        });
    }

    const overwriteContext: Partial<Context> = {
        loading,
        settings,
        remoteSettingsErrror,
        updateSettings,
        resetSettings,
    }

    useEffect(() => {
        // initially load settings
        getExtensionSettings().then(settings => {
            setSettings(settings);
            setLoadingDelayed(false);
        })
    }, []);

    return (
        <SettingsContext.Provider value={{ ...defaultContext, ...overwriteContext }}>
            {children}
        </SettingsContext.Provider>
    )
}
