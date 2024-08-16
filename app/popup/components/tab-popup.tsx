import { Button, Card, CardBody, CardFooter, CardHeader } from "@nextui-org/react";
import { useEffect, useState } from "react";
import { useExtensionSettings } from "../../hooks/use-extension-settings";
import { Tab } from "../../hooks/use-tab-query";

type TabPopupParam = {
    currentTab: Tab
};

export const TabPopup = ({ currentTab }: TabPopupParam) => {
    const [elementPicker, setElementPicker] = useState(false);
    const { extensionSettings } = useExtensionSettings();
    const { elementAttributeName } = extensionSettings

    const { id: tabId } = currentTab;

    const toggleElementPicker = () => {
        const newElementPicker = !elementPicker;
        if (tabId) {
            chrome.tabs.sendMessage(tabId, { type: 'set-picker', elementPicker: newElementPicker, attributeName: elementAttributeName }, function(){
                setElementPicker(newElementPicker)
            });
        }
    }

    useEffect(() => {
        if (tabId) {
            chrome.tabs.sendMessage(tabId, { type: 'get-picker' }, function({ elementPickerState = false }){
                setElementPicker(elementPickerState)
            });
        }
    }, [])

    return (
        <Card className='rounded-none'>
            <CardHeader>
                <h1>Team Identification Extension</h1>
            </CardHeader>
            <CardBody>

            </CardBody>
            <CardFooter>
                <Button color={elementPicker ? 'danger' : 'success'} onClick={toggleElementPicker}>
                    {`${elementPicker ? 'Disable' : 'Enable'} element picker`}
                </Button>
            </CardFooter>
        </Card>
    )
}