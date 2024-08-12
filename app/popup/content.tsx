'use client';

import { useSearchParams } from "next/navigation";


export const PopupContent = () => {
    const searchParams = useSearchParams();
    const teamId = searchParams.get('teamId');

    return (
        <div>
            {teamId}
        </div>
    )
}
