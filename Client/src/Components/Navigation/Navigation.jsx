import React, {useContext} from 'react';
import {withRouter, Link} from 'react-router-dom';

import UserContext from '../../Contexts/UserContext';

import './Navigation.css';

const pages = [
  {url: '/', title: 'Home'},
  {url: '/speakers', title: 'Speakers'},
];

function Navigation(props) {
  const userContext = useContext(UserContext);
  return (
    <nav className='nav'>
      <ul>
        {pages.map(page => {
          const className = [];
          if (page.url === '/') {
            if (props.location.pathname === '/') {
              className.push('isActive');
            }
          } else if (props.location.pathname.startsWith(page.url)) {
            className.push('isActive');
          }
          return (
            <li key={page.url}>
              <Link to={page.url} className={className.join(' ')}>
                {page.title}
              </Link>
            </li>
          );
        })}
        <li>
          <a
            href="/logout"
            onClick={event => {
              event.preventDefault();
              userContext.logout();
            }}>
            Logout
          </a>
        </li>
      </ul>
    </nav>
  );
}

const NavigationWithRouter = withRouter(Navigation);

export {NavigationWithRouter as default};