import { createContext, PropsWithChildren, useContext, useEffect, useState } from "react";
import { defaultExtensionSettings, ExtensionSettings, getExtensionSettings, resetExtensionSettings, setExtensionSettings, TeamMap, updateFromRemoteExtensionSettings } from "../../lib/extension-settings";

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
    const [remoteSettingsErrror, setRemoteSettingsErrror] = useState<null | string>(null);
    // Loading is too quick, we need to show off the forms skeletons a bit.
    const setLoadingDelayed = (newLoading: boolean) => setTimeout(() => setLoading(newLoading), 500);
    const [settings, setSettings] = useState(defaultExtensionSettings);

    const updateSettings = async (newSettings: ExtensionSettings) => {
        setLoading(true);

        setRemoteSettingsErrror(null);

        const { useRemote, remoteUrl } = newSettings;

        if (useRemote && remoteUrl) {
            try {
                newSettings = await updateFromRemoteExtensionSettings(newSettings);
            } catch (error) {
                console.error(error);
                if (error instanceof Error) {
                    setRemoteSettingsErrror(error.message);
                } else {
                    setRemoteSettingsErrror('Something went wrong');
                }
            }
        }

        setExtensionSettings(newSettings).then((updatedSettings) => {
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
