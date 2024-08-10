import { useEffect, useState } from "react"
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
    resetOnNavigate?: boolean
}
export const useNetworkActivity = ({ resetOnNavigate = false }: UseNetworkActivityParams = {}) => {
    const [ networkEvents, setNetworkEvents ] = useState<NetworkEvent[]>([]);
    const addNetworkEvent = (networkEvent: NetworkEvent) => setNetworkEvents([...networkEvents, networkEvent]);
    const clearNetworkEvents = () => setNetworkEvents([]);

    const addNavigated = (navigatedUrl: string) => addNetworkEvent({
        type: 'navigated',
        time: Date.now(),
        detail: navigatedUrl
    });

    const addRequest = (request: NetworkRequest) => addNetworkEvent({
        type: 'request',
        time: Date.now(),
        detail: request
    });

    useEffect(() => {
        if (resetOnNavigate) {
            networkActivity.addNavigatedListener(clearNetworkEvents);
        } else {
            networkActivity.addNavigatedListener(addNavigated);
        }
        
        networkActivity.addRequestListener(addRequest);

        return () => {
            networkActivity.removeNavigatedListener(clearNetworkEvents);
            networkActivity.removeNavigatedListener(addNavigated);
            networkActivity.removeRequestListener(addRequest);
        }
    }, [networkEvents, resetOnNavigate]);

    return { networkEvents, clearNetworkEvents };
}