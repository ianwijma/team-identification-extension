import { createContext, PropsWithChildren, useContext, useEffect, useState } from "react";
import { defaultExtensionSettings, ExtensionSettings, getExtensionSettings, setExtensionSettings } from "../lib/extension-settings";

type SetFunction<T> = (newValue: T) => void
type BlankFunction = () => void

type Context = {
    loading: boolean,
    settings: ExtensionSettings,
    updateSettings: SetFunction<ExtensionSettings>
}

const mockSetFn: SetFunction<any> = (newValue) => {};
const mockBlankFn: BlankFunction = () => {};

const defaultContext: Context = {
    loading: false,
    settings: defaultExtensionSettings,
    updateSettings: mockSetFn
}

const SettingsContext = createContext<Context>(defaultContext); 

export const useSettingsContext = () => useContext(SettingsContext);

export const SettingsContextProvider = ({ children }: PropsWithChildren) => {
    const [loading, setLoading] = useState(true);
    // Loading is too quick, we need to show off the forms skeletons a bit.
    const setLoadingDelayed = (newLoading: boolean) => setTimeout(() => setLoading(newLoading), 500);

    const [settings, setSettings] = useState(defaultExtensionSettings);
    const updateSettings = (settings: ExtensionSettings) => {
        setLoading(true);
        setExtensionSettings(settings).then((settings) => {
            setSettings(settings);
            setLoadingDelayed(false)
        });
    }

    const overwriteContext: Partial<Context> = {
        loading,
        settings,
        updateSettings
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
