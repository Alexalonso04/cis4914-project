import React from 'react';
import { Link } from 'react-router-dom';
import SignOutButton from '../SignOut';
import * as ROUTES from '../../constants/routes';

import { AuthUserContext } from '../Session';

import {
    Menu,
    Dropdown,
    Icon
} from 'semantic-ui-react';

const Navigation = () => (
  <>
    <AuthUserContext.Consumer>
      {authUser =>
        authUser ? <NavigationAuth user={authUser} /> : <NavigationNonAuth />
      }
    </AuthUserContext.Consumer>
  </>
);

const NavigationAuth = ({user}) => (
  <Menu
  inverted
  borderless
  fluid
  >
    <Menu.Menu position='left'>
        <Menu.Item as={Link} to={ROUTES.HOME} icon='home'/>
    </Menu.Menu>
    <Menu.Menu position='right'>
        <Dropdown
          text={user.email}
          item
          floating
          pointing
        >
          <Dropdown.Menu>
            <Dropdown.Item as={Link} to={ROUTES.ACCOUNT}>Profile</Dropdown.Item>
            <Dropdown.Item as={Link} to={ROUTES.HOME}>Event Panel</Dropdown.Item>
            <Dropdown.Item as={Link} to={ROUTES.USERPANEL}>User Panel</Dropdown.Item>
            <Dropdown.Item>
              <SignOutButton/>
            </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
    </Menu.Menu>
</Menu>
);
const NavigationNonAuth = () => (
    <Menu
      inverted
      borderless
      fluid
    >
        <Menu.Menu position='left'>
            <Menu.Item as={Link} to={ROUTES.LANDING}>
            <Icon name='home' size='big'/>
            </Menu.Item>
        </Menu.Menu>
        <Menu.Menu position='right' >
            <Menu.Item as={Link} to={ROUTES.SIGN_IN}>
              <Icon name='user' size='big' />
            </Menu.Item>
        </Menu.Menu>
    </Menu>
);

export default Navigation;