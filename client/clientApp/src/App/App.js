import kind from '@enact/core/kind';
import ThemeDecorator from '@enact/sandstone/ThemeDecorator';
import Panels from '@enact/sandstone/Panels';
import MainPanel from '../views/MainPanel';
import LoginPanel from '../views/LoginPanel';
import RegisterPanel from '../views/RegisterPanel';
import ChartPanel from '../views/ChartPanel';
import TimelapsePanel from '../views/TimelapsePanel';

import { auth } from '../views/firebase';
import { useState, useCallback, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';

import './attachErrorHandler';
import css from './App.module.less';
import SubscribePanel from '../views/SubscribePanel';
import { PlantProvider } from '../views/PlantContext';


const App = (props) => {
    const [index, setIndex] = useState(0);
    const [user, setUser] = useState(null);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
        });
        return () => unsubscribe();
    }, []);

    // const nextPanel = useCallback(() => {
    //     setIndex((prevIndex) => prevIndex + 1);
    // }, []);

    const previousPanel = useCallback(() => {
        setIndex((prevIndex) => Math.max(0, prevIndex - 1));
    }, []);

    const loginPanel = useCallback(() => {
        setIndex(0);
    }, []);

    const mainPanel = useCallback(() => {
        setIndex(1);
    }, []);

    const registerPanel = useCallback(() => {
        setIndex(2);
    }, []);

    const chartPanel = useCallback(() => {
        setIndex(3);
    }, []);

    const subscribePanel = useCallback(() => {
        setIndex(4);
    }, []);

    const timelapsePanel = useCallback(() => {
        setIndex(5);
    }, []);

    return (
        <PlantProvider>
            <Panels css={css} {...props} index={index} onBack={previousPanel}>
                    <LoginPanel     user={user} setUser={setUser} back={previousPanel} main={mainPanel} register={registerPanel}/>
                    <MainPanel      login={loginPanel} user={user} main={mainPanel} chart={chartPanel} subscribe={subscribePanel} timelapse={timelapsePanel}/>
                    <RegisterPanel  login={loginPanel}/>
                    <ChartPanel     login={loginPanel} user={user} main={mainPanel} chart={chartPanel} subscribe={subscribePanel} timelapse={timelapsePanel}/>
                    <SubscribePanel login={loginPanel} user={user} main={mainPanel} chart={chartPanel} subscribe={subscribePanel} timelapse={timelapsePanel}/>
                    <TimelapsePanel login={loginPanel} user={user} main={mainPanel} chart={chartPanel} subscribe={subscribePanel} timelapse={timelapsePanel}/>
            </Panels>
        </PlantProvider>
    );
};

const AppDecorator = kind({
    styles: {
        css,
        className: 'app'
    },
    render: (props) => <App {...props} />
});

export default ThemeDecorator(AppDecorator);
