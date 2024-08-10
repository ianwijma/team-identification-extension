import { useMemo } from "react"
import { NavigateNetworkEvent, NetworkEvent, RequestNetworkEvent } from "../lib/use-network-activity"

type NavigateDataType = 'navigate';
type RequestDataType = 'request';

type DataItem = {
    dataType: NavigateDataType | RequestDataType;
    requestTeamId: string;
    responseTeamId: string;
    name: string;
    path: string;
    url: string;
    method: string;
    status: string; // list status
    protocol: string; // list protocols
    scheme: string;
    domain: string;
    type: string;
    size: string;
    connectionId: string;
    duration: number;
    time: number;
}

const getNameFromUrl = (url: URL): string => 
    url.pathname === '/' ? url.hostname : url.pathname.split('/').slice(-1)[0];

const getTeamFromHeaders = (headers: any[]): string => {
    const filterHeader = ({ name }: any) => name === 'x-team-identification-extension';

    const [wantedHeader = {}] = headers.filter(filterHeader);

    const { value } = wantedHeader;

    return value;
}

const navigateToDataItem = (event: NavigateNetworkEvent): DataItem => {
    const { time, detail } = event;
    const url = new URL(detail);

    return {
        dataType: 'navigate',
        requestTeamId: '',
        responseTeamId: '',
        name: getNameFromUrl(url),
        path: url.pathname,
        url: url.toString(),
        method: 'GET',
        status: '',
        protocol: '',
        scheme: url.protocol,
        domain: url.hostname,
        type: 'document',
        size: '',
        connectionId: '',
        duration: 0,
        time,
    }
}

const requestToDataItem = (event: RequestNetworkEvent): DataItem => {
    const { time, detail } = event;
    const { request, response, _protocol, _resourceType, _request_id, time: duration } = detail;
    const { method, url: requestUrl, headers: requestHeaders } = request;
    const { bodySize, status, headers: responseHeaders } = response;

    const url = new URL(requestUrl);
    
    return {
        dataType: 'request',
        requestTeamId: getTeamFromHeaders(requestHeaders),
        responseTeamId: getTeamFromHeaders(responseHeaders),
        name: getNameFromUrl(url),
        path: url.pathname,
        url: url.toString(),
        method,
        status: status.toString(),
        protocol: _protocol?.toString() ?? '',
        scheme: url.protocol,
        domain: url.hostname,
        type: _resourceType?.toString() ?? '',
        size: bodySize.toString(),
        connectionId: _request_id?.toString() ?? '',
        duration: parseInt(duration.toString()),
        time,
    }
}

const networkEventToDataItem = (event: NetworkEvent): DataItem => 
    event.type === 'navigated' ? navigateToDataItem(event) : requestToDataItem(event)

type NetworkTableParams = {
    networkEvents: NetworkEvent[]
}

export const NetworkTable = ({ networkEvents }: NetworkTableParams) => {
    const data = useMemo(() => networkEvents.map(networkEventToDataItem), [networkEvents])

    const columns: Array<keyof DataItem> = [
        'dataType',
        'requestTeamId',
        'responseTeamId',
        'name',
        'path',
        'url',
        'method',
        'status',
        'protocol',
        'scheme',
        'domain',
        'type',
        'size',
        'connectionId',
        'duration',
        'time',
    ]

    return (
        <table className="w-full">
            <thead>
                <tr>
                    {columns.map(column => <td>{column}</td>)}
                </tr>
            </thead>
            <tbody id="network-table">
                {data.map(item => (
                    <tr>
                        {columns.map(column => {
                            const value = item[column];
                            if (column === 'requestTeamId' || column === 'responseTeamId' && value) {
                                return <td><button>{value}</button></td>
                            }

                            return <td>{value}</td>
                        })}
                    </tr>
                ))}
            </tbody>
        </table>
    )
}