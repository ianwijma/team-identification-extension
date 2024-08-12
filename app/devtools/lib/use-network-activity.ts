import { useCallback, useEffect, useState } from "react"
import { getNetworkActivity, NetworkRequest } from "./network-activity"

export type RequestNetworkEvent = {
    type: 'request',
    time: number,
    detail: chrome.devtools.network.Request
}

export type NavigateNetworkEvent = {
    type: 'navigated',
    time: number,
    detail: string
}

export type NetworkEvent = RequestNetworkEvent | NavigateNetworkEvent;

const networkActivity = getNetworkActivity();

type UseNetworkActivityParams = {
    resetOnNavigate?: boolean;
    trackActivity?: boolean;
}
export const useNetworkActivity = ({ resetOnNavigate = true, trackActivity = true }: UseNetworkActivityParams = {}) => {
    const [ networkEvents, setNetworkEvents ] = useState<NetworkEvent[]>([]);

    // TODO: Check why trackActivity does not stop adding / updating network events...  
    const addNetworkEvent = (networkEvent: NetworkEvent) => trackActivity && setNetworkEvents([...networkEvents, networkEvent]);
    
    const clearNetworkEvents = () => setNetworkEvents([]);

    const addNavigated = (navigatedUrl: string) =>  addNetworkEvent({
        type: 'navigated',
        time: Date.now(),
        detail: navigatedUrl
    });

    const addRequest = (request: NetworkRequest) =>  addNetworkEvent({
        type: 'request',
        time: Date.now(),
        detail: request
    });

    useEffect(() => {
        networkActivity.removeNavigatedListener(clearNetworkEvents);
        networkActivity.removeNavigatedListener(addNavigated);
        networkActivity.removeRequestListener(addRequest);     

        if (resetOnNavigate) {
            networkActivity.addNavigatedListener(clearNetworkEvents);
        } else {
            networkActivity.addNavigatedListener(addNavigated);
        }
        
        networkActivity.addRequestListener(addRequest);

        // TODO: this makes us stop listening to requests, causing it to miss some calls...
        return () => {
            networkActivity.removeNavigatedListener(clearNetworkEvents);
            networkActivity.removeNavigatedListener(addNavigated);
            networkActivity.removeRequestListener(addRequest);            
        };
    }, [networkEvents, resetOnNavigate]);

    return { networkEvents, clearNetworkEvents };
}