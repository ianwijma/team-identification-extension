import { useEffect, useState } from "react"
import { getNetworkActivity, NetworkRequest } from "./network-activity"

export type NetworkEvent = {
    time: number,
    network: chrome.devtools.network.Request
}

const networkActivity = getNetworkActivity();

let clearCacheOnNavigate = true;
let updateNetworkEventCache = true;
let networkEventCache: NetworkEvent[] = [];

const addNavigated = () =>  {
    if (clearCacheOnNavigate) {
        networkEventCache = []
    }
};

const addRequest = (network: NetworkRequest) =>  {
    if (!updateNetworkEventCache) return;

    const time = Date.now();

    networkEventCache = [ ...networkEventCache, { time, network } ];
}

networkActivity.addRequestListener(addRequest);
networkActivity.addNavigatedListener(addNavigated);


type UseNetworkActivityParams = {
    resetOnNavigate?: boolean;
    trackActivity?: boolean;
}

export const useNetworkActivity = ({ resetOnNavigate = true, trackActivity = true }: UseNetworkActivityParams) => {
    const [ networkEvents, setNetworkEvents ] = useState<NetworkEvent[]>(networkEventCache);

    const syncNetworkEvents = () => setNetworkEvents(networkEventCache); 

    const clearNetworkEvents = () => {
        networkEventCache = [];
        syncNetworkEvents();
    }

    useEffect(() => { clearCacheOnNavigate = resetOnNavigate }, [resetOnNavigate])
    useEffect(() => { updateNetworkEventCache = trackActivity }, [trackActivity])

    useEffect(() => {
        networkActivity.addNavigatedListener(syncNetworkEvents);
        networkActivity.addRequestListener(syncNetworkEvents);     

        return () => {
            networkActivity.removeNavigatedListener(syncNetworkEvents);
            networkActivity.removeRequestListener(syncNetworkEvents);     
        }
    }, [])

    return { networkEvents, clearNetworkEvents };
}