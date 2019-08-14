import React, {useContext} from 'react';
import {Link, Route} from 'react-router-dom';

import SpeakersContext from '../../Contexts/SpeakersContext';

import Speaker from './Speaker';

import './Speakers';

import './Speakers.css';

function Speakers(props) {
  const speakersContext = useContext(SpeakersContext);
  
  return (
    <div>
      <h1 className="Speakers" >Speakers</h1>
      {!speakersContext.list &&
        <div>Loading...</div>
      }
      {speakersContext.list &&
        <>
          <div>
            {speakersContext.list.map((speaker, index) => {
              return (
                <div className="SpeakerListing" key={index}>
                  <Link to={`${props.match.path}/${speaker._id}`}>{speaker.name}</Link>
                </div>
              );
            })}
          </div>
          <div>
            <Route path="/speakers/:id" component={Speaker} />
          </div>
        </>
      }
    </div>
  );
}

export {Speakers as default};