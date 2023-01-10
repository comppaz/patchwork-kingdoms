import React, { memo } from 'react';

const Tooltip = memo(props => {
    return (
        <p>
            {props.enabled ? (
                <span className="group relative">
                    <span
                        data-html="true"
                        className="pointer-events-none absolute -top-10 left-1/2 -translate-x-1/2 whitespace-nowrap rounded bg-black px-2 py-1 text-white text-xs opacity-0 transition before:absolute before:left-1/2 before:top-full before:-translate-x-1/2 before:border-4 before:border-transparent before:border-t-black before:content-[''] group-hover:opacity-100">
                        {props.text}
                    </span>

                    {props.children}
                </span>
            ) : (
                <span className="group relative">
                    <span className="pointer-events-none absolute -top-10 left-1/2 -translate-x-1/2 whitespace-nowrap rounded bg-black px-2 py-1 text-white text-xs opacity-0 transition before:absolute before:left-1/2 before:top-full before:-translate-x-1/2 before:border-4 before:border-transparent before:border-t-black before:content-[''] group-hover:opacity-100 hidden">
                        {props.text}
                    </span>

                    {props.children}
                </span>
            )}
        </p>
    );
});

Tooltip.displayName = 'Tooltip';

export default Tooltip;
