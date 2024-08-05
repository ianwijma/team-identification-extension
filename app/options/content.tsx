'use client';

import { useState } from "react";

export const OptionsContent = () => {
    const [count, setCount] = useState(0);

    return (
        <div>
            Options
            {' '}
            <button onClick={() => setCount(count+1)}>Count: {count}</button>
        </div>
    )
}
