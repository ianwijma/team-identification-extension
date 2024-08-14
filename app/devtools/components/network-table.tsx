import { Button, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from "@nextui-org/react";
import { useMemo } from "react"
import { useDevtoolsContext } from "../contexts/devtools";
import { getTeamFromHeaders } from "../lib/network-tools";
import { openTeamPopup } from "../lib/open-team-popup";
import { NetworkEvent } from "../lib/use-network-activity"

type NavigateDataType = 'navigate';
type RequestDataType = 'request';

type DataItem = {
    dataType: NavigateDataType | RequestDataType;
    requestTeamId: string | null;
    responseTeamId: string | null;
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

const networkEventToDataItem = (event: NetworkEvent): DataItem => {
    const { time, network } = event;
    const { request, response, _protocol, _resourceType, _request_id, time: duration } = network;
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

const dataFilter = (teamIdFilter: string) => (item: DataItem) => 
    item.requestTeamId === teamIdFilter || item.responseTeamId === teamIdFilter

type NetworkTableParams = {
    teamIdFilter?: string | null
}

export const NetworkTable = ({ teamIdFilter = null }: NetworkTableParams) => {
    const { networkEvents } = useDevtoolsContext();
    const data = useMemo(() => networkEvents.map(networkEventToDataItem), [networkEvents]);
    const filteredData = teamIdFilter ? data.filter(dataFilter(teamIdFilter)) : data

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
        <Table className="w-full" isCompact={true}>
            <TableHeader>
                {columns.map(column => <TableColumn>{column}</TableColumn>)}
            </TableHeader>
            <TableBody>
                {filteredData.map((item, index) => (
                    <TableRow key={index}>
                        {columns.map(column => {
                            const value = item[column];
                            if (column === 'requestTeamId' || column === 'responseTeamId' && value) {
                                return <TableCell><Button onClick={() => openTeamPopup(value as string)}>{value}</Button></TableCell>
                            }

                            return <TableCell>{value}</TableCell>
                        })}
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    )
}