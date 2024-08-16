import { useContext, useEffect, useState } from "react";
import { createContext, PropsWithChildren } from "react";
import { defaultExtensionSettings, ExtensionSettings, getExtensionSettings } from "../../lib/extension-settings";
import { NetworkEvent, useNetworkActivity } from "../lib/use-network-activity";

type SetFunction<T> = (newValue: T) => void
type BlankFunction = () => void

type Context = {
    preserveEvents: boolean,
    setPreserveEvents: SetFunction<boolean>,
    trackEvents: boolean,
    setTrackEvents: SetFunction<boolean>,
    networkEvents: NetworkEvent[],
    clearNetworkEvents: BlankFunction,
    extensionSettings: ExtensionSettings,
}

const mockSetFn: SetFunction<any> = (newValue) => {};
const mockBlankFn: BlankFunction = () => {};

const defaultContext: Context = {
    preserveEvents: false,
    setPreserveEvents: mockSetFn,
    trackEvents: false,
    setTrackEvents: mockSetFn,
    networkEvents: [],
    clearNetworkEvents: mockBlankFn,
    extensionSettings: defaultExtensionSettings,
}

const DevtoolsContext = createContext<Context>(defaultContext);

export const useDevtoolsContext = () => useContext(DevtoolsContext);

export const DevtoolsContextProvider = ({ children }: PropsWithChildren) => {
    const [ preserveEvents, setPreserveEvents ] = useState(false);
    const [ trackEvents, setTrackEvents ] = useState(true);
    const { networkEvents, clearNetworkEvents } = useNetworkActivity({ 
        resetOnNavigate: !preserveEvents,
        trackActivity: trackEvents
     });
     const [extensionSettings, setExtensionSettings] = useState<ExtensionSettings>(defaultExtensionSettings);

     useEffect(() => {
         (async () => {
            const settings = await getExtensionSettings();
            setExtensionSettings(settings);
         })()
     }, []);

    const overwriteContext: Partial<Context> = {
        preserveEvents, 
        setPreserveEvents,
        trackEvents, 
        setTrackEvents,
        networkEvents,
        clearNetworkEvents,
        extensionSettings
    };

    return (
        <DevtoolsContext.Provider value={{ ...defaultContext, ...overwriteContext }}>
            {children}
        </DevtoolsContext.Provider>
    )
}