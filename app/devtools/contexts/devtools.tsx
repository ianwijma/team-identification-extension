import { useContext, useState } from "react";
import { createContext, PropsWithChildren } from "react";
import { NetworkEvent, useNetworkActivity } from "../lib/use-network-activity";

type SetFunction<T> = (newValue: T) => void
type BlankFunction = () => void

type Context = {
    preserveEvents: boolean,
    setPreserveEvents: SetFunction<boolean>,
    trackEvents: boolean,
    setTrackEvents: SetFunction<boolean>,
    networkEvents: NetworkEvent[],
    clearNetworkEvents: BlankFunction
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

    const overwriteContext: Partial<Context> = {
        preserveEvents, 
        setPreserveEvents,
        trackEvents, 
        setTrackEvents,
        networkEvents,
        clearNetworkEvents
    };

    return (
        <DevtoolsContext.Provider value={{ ...defaultContext, ...overwriteContext }}>
            {children}
        </DevtoolsContext.Provider>
    )
}