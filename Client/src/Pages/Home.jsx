import React from 'react';
import {Switch, Route} from 'react-router-dom';

import {SpeakersContextProvider} from '../Contexts/SpeakersContext';

import Landing from './Landing';
import Speakers from './Speakers';

import Navigation from '../Components/Navigation';

function Home(props) {
  return (
    <div>
      <SpeakersContextProvider>
        <Navigation />
        <Switch>
          <Route path="/speakers" component={Speakers} />
          <Route path="/" component={Landing} />
        </Switch>
      </SpeakersContextProvider>
    </div>
  );
}

export {Home as default};