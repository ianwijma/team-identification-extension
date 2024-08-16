import { Button, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from "@nextui-org/react";
import { useMemo } from "react"
import { getTeam } from "../../hooks/use-team";
import { ExtensionSettings, TeamAlias } from "../../lib/extension-settings";
import { useDevtoolsContext } from "../contexts/devtools";
import { getTeamFromHeaders } from "../lib/network-tools";
import { openTeamPopup } from "../lib/open-team-popup";
import { NetworkEvent } from "../lib/use-network-activity"

type DataItem = {
    requestTeamName: string | null;
    requestTeamAlias: string | null;
    responseTeamName: string | null;
    responseTeamAlias: string | null;
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

const networkEventToDataItem = (event: NetworkEvent, extensionSettings: ExtensionSettings): DataItem => {
    const { time, network } = event;
    const { request, response, _protocol, _resourceType, _request_id, time: duration } = network;
    const { method, url: requestUrl, headers: requestHeaders } = request;
    const { bodySize, status, headers: responseHeaders } = response;
    const { requestHeaderName, responseHeaderName } = extensionSettings;

    const url = new URL(requestUrl);

    const requestTeamAlias = getTeamFromHeaders(requestHeaders, requestHeaderName);
    const requestTeam = requestTeamAlias ? getTeam(requestTeamAlias, extensionSettings) : null;

    const responseTeamAlias = getTeamFromHeaders(requestHeaders, responseHeaderName);
    const responseTeam = responseTeamAlias ? getTeam(responseTeamAlias, extensionSettings) : null;
    
    return {
        requestTeamAlias,
        requestTeamName: requestTeam?.name ?? null,
        responseTeamAlias,
        responseTeamName: responseTeam?.name ?? null,
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

const dataFilter = (teamAliasFilter: string) => (item: DataItem) => 
    item.requestTeamAlias === teamAliasFilter || item.responseTeamAlias === teamAliasFilter

type NetworkTableParams = {
    teamAliasFilter?: string | null
}

export const NetworkTable = ({ teamAliasFilter = null }: NetworkTableParams) => {
    const { networkEvents, extensionSettings } = useDevtoolsContext();
    const data = useMemo(() => networkEvents.map(ev => networkEventToDataItem(ev, extensionSettings)), [networkEvents, extensionSettings]);
    const filteredData = teamAliasFilter ? data.filter(dataFilter(teamAliasFilter)) : data

    const columns: Array<keyof DataItem> = [
        'requestTeamName',
        'responseTeamName',
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
                            // TODO: Make table work better
                            const value = item[column];
                            if (column === 'requestTeamName') {
                                const requestTeamAlias: TeamAlias | null = item['requestTeamAlias'];
                                if (requestTeamAlias) {
                                    return <TableCell><Button onClick={() => openTeamPopup(requestTeamAlias)}>{value}</Button></TableCell>
                                }
                            }

                            if (column === 'responseTeamName') {
                                const responseTeamAlias: TeamAlias | null = item['responseTeamAlias'];
                                if (responseTeamAlias) {
                                    return <TableCell><Button onClick={() => openTeamPopup(responseTeamAlias)}>{value}</Button></TableCell>
                                }
                            }

                            return <TableCell>{value}</TableCell>
                        })}
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    )
}