'use client';

import { useState } from "react";
import { NetworkTable } from "./components/network-table";
import { type NetworkEvent, useNetworkActivity } from "./lib/use-network-activity";

export const DevtoolsContent = () => {
    const [resetOnNavigate, setResetOnNavigate] = useState(false);
    const { networkEvents, clearNetworkEvents } = useNetworkActivity({ resetOnNavigate });

    return (
        <div>
            <button onClick={() => clearNetworkEvents()}>Clear logs</button>
            {' '}
            <label>
                Preserve Logs
                <input type='checkbox' onChange={({ currentTarget }) => setResetOnNavigate(!currentTarget.checked)} />
            </label>

            <NetworkTable networkEvents={networkEvents}  />
        </div>
    )
}
