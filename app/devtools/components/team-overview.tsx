import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUpload, faDownload } from '@fortawesome/free-solid-svg-icons'
import { Button, Card, CardBody, CardFooter, CardHeader, Chip, Divider, Modal, ModalBody, ModalContent, ModalHeader, Tooltip, useDisclosure } from "@nextui-org/react";
import { useDevtoolsContext } from "../contexts/devtools";
import { getTeamFromHeaders } from "../lib/network-tools";
import { NetworkTable } from "./network-table";
import { openTeamPopup } from "../lib/open-team-popup";
import { useTeam } from "../../hooks/use-team";

type TeamObject = {
    requestCount: number;
    responseCount: number;
}
type TeamMap = {
    [key: string]: TeamObject
}

type TeamModalProps = {
    teamAlias: string;
    isOpen: boolean;
    onClose: () => void;
}
const TeamModal = ({ teamAlias, isOpen, onClose }: TeamModalProps) => {
    const { team } = useTeam(teamAlias);
    const { name = teamAlias } = team ?? {};

    return (
        <Modal size='full' className="bg-background" isOpen={isOpen} onClose={onClose}>
            <ModalContent>
                {() => (
                    <>
                        {/* TODO: Proper team name */}
                        <ModalHeader className="flex flex-col gap-1">
                            {name} Network Activity
                        </ModalHeader>
                        <ModalBody className="max-h-[95vh] overflow-y-scroll overflow-x-hidden">
                            <NetworkTable teamAliasFilter={teamAlias} />
                        </ModalBody>
                    </>
                )}
            </ModalContent>
        </Modal>
    )
}

type TeamCardProps = {
    teamAlias: string;
    requestCount: number;
    responseCount: number
}
const TeamCard = ({ teamAlias, requestCount, responseCount }: TeamCardProps) => {
    const {isOpen, onOpen, onClose} = useDisclosure();
    const { team } = useTeam(teamAlias);
    const { name = teamAlias } = team ?? {};


    return (
        <Card className="min-w-64 grow">
            <CardHeader>
                {name}
            </CardHeader>
            <Divider />
            <CardBody>
                <div className="flex h-5 justify-evenly">
                    <Tooltip content="Requests">
                        <Chip startContent={<FontAwesomeIcon icon={faUpload} />} >
                                {requestCount}
                        </Chip>
                    </Tooltip>
                    <Tooltip content='Responses'>
                        <Chip startContent={<FontAwesomeIcon icon={faDownload} />} >
                                {responseCount}
                        </Chip>
                    </Tooltip>
                </div>
            </CardBody>
            <CardFooter className='flex justify-evenly'>
                <TeamModal {...{teamAlias, isOpen, onClose}} />
                <Button onClick={onOpen}>Network Activity</Button>
                <Button onClick={() => openTeamPopup(teamAlias)}>Show Team</Button>
            </CardFooter>
        </Card>
    )
}

export const TeamOverview = () => {
    const { networkEvents, extensionSettings } = useDevtoolsContext();
    const teamMap = networkEvents.reduce((teamMap, networkEvent) => {
        const addTeamMap = (teamAlias: string, target: keyof TeamObject) => {
            if(!(teamAlias in teamMap)) {
                teamMap[teamAlias] = {
                    requestCount: 0,
                    responseCount: 0,
                };
            }

            if (!(target in teamMap[teamAlias])) {
                teamMap[teamAlias][target] = 0
            }

            teamMap[teamAlias][target]++
        }

        const { network } = networkEvent;
        const { request, response } = network;
        const { headers: requestHeaders } = request;
        const { headers: responseHeaders } = response;

        const { requestHeaderName, responseHeaderName } = extensionSettings;

        const requestTeamAlias = getTeamFromHeaders(requestHeaders, requestHeaderName);
        if (requestTeamAlias) addTeamMap(requestTeamAlias, 'requestCount')

        const responseTeamAlias = getTeamFromHeaders(responseHeaders, responseHeaderName);
        if (responseTeamAlias) addTeamMap(responseTeamAlias, 'responseCount')

        return teamMap;
    }, {} as TeamMap)

    return (
        <div className="flex flex-wrap gap-3 mx-3">
            {Object.keys(teamMap).map(teamAlias => <TeamCard key={teamAlias} teamAlias={teamAlias} { ...teamMap[teamAlias] } />)}
        </div>
    )
}

