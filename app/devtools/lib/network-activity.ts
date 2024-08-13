import { isClient } from "../../lib/isClient";

export type NetworkRequest = chrome.devtools.network.Request;
type CallbackFn<T> = (data: T) => void
type EventCallback<T> = (callback: CallbackFn<T>) => void

const NAVIGATED_EVENT = 'navigated-event';
const REQUEST_EVENT = 'request-event';

let eventBus: Comment;

if (isClient()) {
    eventBus = new Comment('network-activity');
} else {
    // Comment is not availabe during compilation
    eventBus = {
        addEventListener: (..._: any[]) => console.log('add', _),
        removeEventListener: (..._: any[]) => console.log('remove', _),
        dispatchEvent: (..._: any[]) => console.log('dispatch', _),
    } as Comment;
}

const handleNavigated = (navigatedUrl: string)  => 
    eventBus.dispatchEvent(new CustomEvent(NAVIGATED_EVENT, { detail: navigatedUrl }))


const handleRequest = (event: NetworkRequest)  => 
    eventBus.dispatchEvent(new CustomEvent(REQUEST_EVENT, { detail: event }))

let startedEmitting = false;

const ensureEmitting = () => {
    // Chrome is not availble during compilation.
    if (!startedEmitting && isClient()) {
        startedEmitting = true;

        chrome.devtools.network.onNavigated.addListener(handleNavigated);
        chrome.devtools.network.onRequestFinished.addListener(handleRequest);

        console.log('Started listening to network events...');
    }
}

export const getNetworkActivity = () => {
    const addNavigatedListener: EventCallback<string> = (callback) => 
        eventBus.addEventListener(NAVIGATED_EVENT, ({ detail }: any) => callback(detail))
    const removeNavigatedListener: EventCallback<string> = (callback) => 
        eventBus.removeEventListener(NAVIGATED_EVENT, ({ detail }: any) => callback(detail))

    const addRequestListener: EventCallback<NetworkRequest> = (callback) => 
        eventBus.addEventListener(REQUEST_EVENT, ({ detail }: any) => callback(detail))
    const removeRequestListener: EventCallback<NetworkRequest> = (callback) => 
        eventBus.removeEventListener(REQUEST_EVENT, ({ detail }: any) => callback(detail))
    
    ensureEmitting();

    return {
        addNavigatedListener,
        removeNavigatedListener,

        addRequestListener,
        removeRequestListener,
    }
}