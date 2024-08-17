import { Modal, ModalBody, ModalHeader } from "@nextui-org/react"
import { useTeam } from "../../hooks/use-team"
import { TeamAlias } from "../../lib/extension-settings"

type TeamPopupParams = {
    teamAlias: TeamAlias
}

export const TeamPopup = ({ teamAlias }: TeamPopupParams) => {
    const { team } = useTeam(teamAlias);
    const { name, description, alias } = team ?? {};

    return (
        <Modal className='rounded-none' isOpen={true}>
            <ModalHeader>
                <div>
                    {name ? name : teamAlias}
                    {alias ? (
                        <>
                            <br />
                            <small className="text-gray-500">({alias})</small>
                        </>
                    ) : ''}
                </div>
            </ModalHeader>
            <ModalBody>
                <p>
                    {description ? description : <small>No team description</small>}
                </p>
            </ModalBody>
        </Modal>
    )
}