import { useEffect, useState } from "react";
import { defaultExtensionSettings, ExtensionSettings, getExtensionSettings } from "../lib/extension-settings"

export const useExtensionSettings = () => {
    const [extensionSettings, setExtensionSettings] = useState<ExtensionSettings>(defaultExtensionSettings);

    useEffect(() => {
        (async () => {
            const settings = await getExtensionSettings();
            setExtensionSettings(settings);
        })()
    }, []);

    return { extensionSettings }
}