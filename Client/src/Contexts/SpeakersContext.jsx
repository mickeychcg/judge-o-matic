import React, {useState, useEffect, useContext} from 'react';

import UserContext from './UserContext';

const SpeakersContext = React.createContext({});

function Provider(props) {
  const userContext = useContext(UserContext);
  const user = userContext.user;

  const [speakers, setSpeakers] = useState(null);

  const fetchSpeakers = async () => {
    const speakerIds = user.speakers;
    const response = await fetch(`http://localhost:3001/api/user/${user._id}/speakers`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      },
    });
    const json = await response.json();
    setSpeakers(json);
  };

  useEffect(() => {
    if (user) {
      fetchSpeakers();
    }
  }, [user]);

  return (
    <SpeakersContext.Provider value={{list: speakers}}>
      {props.children}
    </SpeakersContext.Provider>
  );
}

export {
  SpeakersContext as default,
  Provider as SpeakersContextProvider
};