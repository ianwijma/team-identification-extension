'use client';

import { useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { useCurrentTab } from "../hooks/use-current-tab";
import { TeamAlias } from "../lib/extension-settings";
import { TabPopup } from "./components/tab-popup";
import { TeamPopup } from "./components/team-popup";


export const PopupContent = () => {
    const searchParams = useSearchParams();
    const teamAlias: TeamAlias | null = searchParams.get('teamAlias');
    const { currentTab } = useCurrentTab()

    useEffect(() => {
        // Connect the popup, so we can listen to it closing
        chrome.runtime.connect({ name: "popup" });
    }, [])

    if (teamAlias) {
        return <TeamPopup teamAlias={teamAlias} />
    }

    if (currentTab) {
        return <TabPopup currentTab={currentTab} />
    }

    return (
        <div>
            Nothing to do here
        </div>
    )
}
