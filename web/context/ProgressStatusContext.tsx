import React from 'react';

interface IProgressStatusContext {
    progressStatus: string;
    setProgressStatus: (status: string) => void;
}
export const ProgressStatusContext = React.createContext<IProgressStatusContext>({
    progressStatus: '',
    setProgressStatus: () => {},
});

export const ProgressStatusProvider = ({ children }) => {
    const [progressStatus, setProgressStatus] = React.useState('');

    return <ProgressStatusContext.Provider value={{ setProgressStatus, progressStatus }}>{children}</ProgressStatusContext.Provider>;
};

export default ProgressStatusContext;
