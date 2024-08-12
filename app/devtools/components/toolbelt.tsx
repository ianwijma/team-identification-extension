import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { Button, Checkbox, Divider } from "@nextui-org/react"
import { useDevtoolsContext } from "../contexts/devtools"
import { faBan } from '@fortawesome/free-solid-svg-icons'


export const Toolbelt = () => {
    const { preserveEvents, setPreserveEvents, trackEvents, setTrackEvents, clearNetworkEvents } = useDevtoolsContext()

    return (
        <div className="px-3 py-1">
            <div className="flex space-x-3 h-8">
                <Button onClick={clearNetworkEvents} size='sm' isIconOnly>
                    <FontAwesomeIcon icon={faBan} />
                </Button>
                <Divider orientation="vertical" />
                <Checkbox defaultSelected={trackEvents} size='sm' onValueChange={setTrackEvents}>Record Network</Checkbox>
                <Divider orientation="vertical" />
                <Checkbox defaultSelected={preserveEvents} size='sm' onValueChange={setPreserveEvents}>Preserve Network</Checkbox>
            </div>
        </div>
    )
}