import { useState } from 'react';
import { Tab } from '@headlessui/react';

function classNames(...classes) {
    return classes.filter(Boolean).join(' ');
}

export default function Tabs() {
    let [categories] = useState(['About', 'Statistics']);

    return (
        <div className="relative">
            <Tab.Group
                onChange={index => {
                    console.log('Changed selected tab to:', index);
                }}>
                <Tab.List className="flex space-x-1 rounded-xl bg-blue-900/20 p-1">
                    {categories.map(category => (
                        <Tab
                            key={category}
                            className={({ category }) =>
                                classNames(
                                    'w-full rounded-lg py-2.5 text-sm font-medium leading-5 text-blue-700',
                                    'ring-white ring-opacity-60 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2',
                                    { category } ? 'bg-white shadow' : 'text-blue-100 hover:bg-white/[0.12] hover:text-white',
                                )
                            }>
                            {category}
                        </Tab>
                    ))}
                </Tab.List>
            </Tab.Group>
        </div>
    );
}
