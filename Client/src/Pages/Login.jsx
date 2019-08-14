import React, {Component, useState, useContext} from 'react';

import UserContext from '../Contexts/UserContext';
function Login(props) {
  const userContext = useContext(UserContext);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (email && password) {
      await userContext.login(email, password);
      props.history.push('/');
    }
  };

  return (
    <div className="Auth">
      <h3>Log into your account:</h3>
      <form className="auth-form-left" onSubmit={handleSubmit}>
        <div className="form-control">
          <input
            type="email"
            name="email"
            placeholder="Enter your email..."
            value={email}
            onChange={(event) => setEmail(event.target.value)} />
        </div>
        <div className="form-control">
          <input
            type="password"
            name="password"
            placeholder="Enter your password..."
            value={password}
            onChange={(event) => setPassword(event.target.value)} />
        </div>
        <div className="form-actions">
          <input type="submit" className="submit-btn" value="Log In!" />
        </div>
      </form>
      {message &&
        <div>{message}</div>
      }
    </div>
  );
}
export default Login;