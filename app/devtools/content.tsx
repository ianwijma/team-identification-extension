'use client';

import { Divider, Tab, Tabs } from "@nextui-org/react";
import { NetworkTable } from "./components/network-table";
import { TeamOverview } from "./components/team-overview";
import { Toolbelt } from "./components/toolbelt";
import { DevtoolsContextProvider } from "./contexts/devtools";

export const DevtoolsContent = () => {
    return (
        <DevtoolsContextProvider>
            <Toolbelt />
            <Divider />
            <Tabs size="sm" className="mx-3 pt-3">
                <Tab key='table' title='Network Table'>
                    <div className="p-3">
                        <NetworkTable />
                    </div>
                </Tab>
                <Tab key='team' title='Per Team overview'>
                    <TeamOverview />
                </Tab>
            </Tabs>
        </DevtoolsContextProvider>
    )
}
