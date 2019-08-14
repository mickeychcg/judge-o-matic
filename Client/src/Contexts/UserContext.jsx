import React, {useState, useEffect, useReducer} from 'react';

const UserContext = React.createContext({});

const USER_TOKEN = 'userToken';

const initialState = {
  user: null,
  isLoading: true
};

function reducer(state, action) {
  switch (action.type) {
    case 'IS_LOADING': {
      if (state.isLoading) {
        return state;
      }
      return {
        ...state,
        isLoading: true
      };
    }
    case 'SET_USER': {
      return {
        ...state,
        user: action.payload,
        isLoading: false
      };
    }
    case 'CLEAR_USER': {
      return {
        ...state,
        user: null,
        isLoading: false
      };
    }
    case 'STOP_LOADING': {
      return {
        ...state,
        isLoading: false
      };
    }
    default: return state;
  }
}

function Provider(props) {
  const [state, dispatch] = useReducer(reducer, initialState);

  const login = async (email, password) => {
    dispatch({type: 'IS_LOADING'});
    const response = await fetch('http://localhost:3001/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email,
        password
      })
    });
    if (response.status === 200) {
      const json = await response.json();
      window.localStorage.setItem(USER_TOKEN, json.token);
      dispatch({type: 'SET_USER', payload: json.user});
    } else {
      dispatch({type: 'STOP_LOADING'});
    }
  };

  const loginFromToken = async () => {
    dispatch({type: 'IS_LOADING'});
    const userToken = window.localStorage.getItem(USER_TOKEN);
    if (userToken) {
      const response = await fetch('http://localhost:3001/auth/me/from/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          token: userToken
        })
      });
      if (response.status === 200) {
        const json = await response.json();
        dispatch({type: 'SET_USER', payload: json.user});
      } else {
        dispatch({type: 'STOP_LOADING'});
      }
    } else {
      dispatch({type: 'STOP_LOADING'});
    }
  };

  const logout = () => {
    dispatch({type: 'CLEAR_USER'});
    window.localStorage.removeItem(USER_TOKEN);
  };

  useEffect(() => {
    loginFromToken();
  }, []);

  return (
    <UserContext.Provider value={{
      ...state,
      login,
      logout
    }}>
      {props.children}
    </UserContext.Provider>
  );
}

export {
  UserContext as default,
  Provider as UserContextProvider
};