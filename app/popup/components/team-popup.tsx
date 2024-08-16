import { Card, CardBody, CardHeader } from "@nextui-org/react"
import { useTeam } from "../../hooks/use-team"
import { TeamAlias } from "../../lib/extension-settings"

type TeamPopupParams = {
    teamAlias: TeamAlias
}

export const TeamPopup = ({ teamAlias }: TeamPopupParams) => {
    const { team } = useTeam(teamAlias);
    const { name, description, alias } = team ?? {};

    return (
        <Card className='rounded-none'>
            <CardHeader>
                <h1>
                    {name}
                    {' '}
                    <small className="text-gray-500">({alias})</small>
                </h1>
            </CardHeader>
            <CardBody>
                <p>
                    {description}
                </p>
            </CardBody>
        </Card>
    )
}