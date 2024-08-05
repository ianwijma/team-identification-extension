'use client';

import { useState } from "react";

export const PopupContent = () => {
    const [count, setCount] = useState(0);

    return (
        <div>
            Popup
            {' '}
            <button onClick={() => setCount(count+1)}>Count: {count}</button>
        </div>
    )
}
