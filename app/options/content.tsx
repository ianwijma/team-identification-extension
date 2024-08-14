'use client';

import { Tab, Tabs } from "@nextui-org/react";
import { ConfigurationForm } from "./components/configuration-form";
import { RemoteForm } from "./components/remote-form";
import { SettingsContextProvider } from "./context/settings";

export const OptionsContent = () => {
    return (
        <SettingsContextProvider>
            <Tabs className="mx-3 pt-3">
                <Tab key='remote' title="Remote Configuration">
                    <RemoteForm />
                </Tab>
                <Tab key='local' title="Local Settings">
                    <ConfigurationForm />
                </Tab>
            </Tabs>
        </SettingsContextProvider>
    )
}
