import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUpload, faDownload } from '@fortawesome/free-solid-svg-icons'
import { Button, Card, CardBody, CardFooter, CardHeader, Chip, Divider, Modal, ModalBody, ModalContent, ModalHeader, Tooltip, useDisclosure } from "@nextui-org/react";
import { useDevtoolsContext } from "../contexts/devtools";
import { getTeamFromHeaders } from "../lib/network-tools";
import { NetworkTable } from "./network-table";
import { openTeamPopup } from "../lib/open-team-popup";

type TeamObject = {
    requestCount: number;
    responseCount: number;
}
type TeamMap = {
    [key: string]: TeamObject
}

type TeamModalProps = {
    teamId: string;
    isOpen: boolean;
    onClose: () => void;
}
const TeamModal = ({ teamId, isOpen, onClose }: TeamModalProps) => {
    return (
        <Modal size='full' isOpen={isOpen} onClose={onClose}>
            <ModalContent>
                {() => (
                    <>
                        {/* TODO: Proper team name */}
                        <ModalHeader className="flex flex-col gap-1">
                            {teamId} Network Activity
                        </ModalHeader>
                        <ModalBody>
                            <NetworkTable teamIdFilter={teamId} />
                        </ModalBody>
                    </>
                )}
            </ModalContent>
        </Modal>
    )
}

type TeamCardProps = {
    teamId: string;
    requestCount: number;
    responseCount: number
}
const TeamCard = ({ teamId, requestCount, responseCount }: TeamCardProps) => {
    const {isOpen, onOpen, onClose} = useDisclosure();


    return (
        <Card className="min-w-64 grow">
            <CardHeader>
                {/* TODO: Convert to a proper name */}
                {teamId}
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
                <TeamModal {...{teamId, isOpen, onClose}} />
                <Button onClick={onOpen}>Network Activity</Button>
                <Button onClick={() => openTeamPopup(teamId)}>Show Team</Button>
            </CardFooter>
        </Card>
    )
}

export const TeamOverview = () => {
    const { networkEvents } = useDevtoolsContext();
    const teamMap = networkEvents.reduce((teamMap, networkEvent) => {
        const { type, detail } = networkEvent;

        const addTeamMap = (teamId: string, target: keyof TeamObject) => {
            if(!(teamId in teamMap)) {
                teamMap[teamId] = {
                    requestCount: 0,
                    responseCount: 0,
                };
            }

            if (!(target in teamMap[teamId])) {
                teamMap[teamId][target] = 0
            }

            teamMap[teamId][target]++
        }

        if (type === 'request') {
            const { request, response } = detail;
            const { headers: requestHeaders } = request;
            const { headers: responseHeaders } = response;

            const requestTeamId = getTeamFromHeaders(requestHeaders);
            if (requestTeamId) addTeamMap(requestTeamId, 'requestCount')

            const responseTeamId = getTeamFromHeaders(responseHeaders);
            if (responseTeamId) addTeamMap(responseTeamId, 'responseCount')
        }

        return teamMap;
    }, {} as TeamMap)

    return (
        <div className="flex flex-wrap gap-3 mx-3">
            {Object.keys(teamMap).map(teamId => <TeamCard key={teamId} teamId={teamId} { ...teamMap[teamId] } />)}
        </div>
    )
}

