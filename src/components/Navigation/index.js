import React from 'react';
import { Link } from 'react-router-dom';
import SignOutButton from '../SignOut';
import * as ROUTES from '../../constants/routes';

import { AuthUserContext } from '../Session';

import {
    Menu,
    Dropdown
} from 'semantic-ui-react';

const Navigation = () => (
  <>
    <AuthUserContext.Consumer>
      {authUser =>
        authUser ? <NavigationAuth /> : <NavigationNonAuth />
      }
    </AuthUserContext.Consumer>
  </>
);

const NavigationAuth = () => (
  <ul>
    <li>
      <Link to={ROUTES.LANDING}>Landing</Link>
    </li>
    <li>
      <Link to={ROUTES.HOME}>Home</Link>
    </li>
    <li>
      <Link to={ROUTES.ACCOUNT}>Account</Link>
    </li>
    <li>
      <Link to={ROUTES.ADMIN}>Admin</Link>
    </li>
    <li>
      <SignOutButton />
    </li>
  </ul>
);
const NavigationNonAuth = () => (
    <Menu>
        <Menu.Menu position='left'>
            <Menu.Item as={Link} to={ROUTES.SIGN_IN} text='Sign-In' />
        </Menu.Menu>
        <Menu.Menu position='left'>
            <Menu.Item as={Link} to={ROUTES.SIGN_IN} icon='user'/>
        </Menu.Menu>
    </Menu>
);

export default Navigation;