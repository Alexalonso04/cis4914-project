import React, { Component } from 'react';
import { withFirebase } from '../Firebase';
import CustomUploadButton from 'react-firebase-file-uploader/lib/CustomUploadButton';
import { AuthUserContext, withAuthorization } from '../Session';
import NewUser from "../NewUser";
import NewEvent from "../NewEvent";

class AdminPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
        organization: '',
        users: [],
        events: []
    }
  }

  async componentDidMount() {
    const organization = await this.props.firebase.getOrganization();
    const users = await this.props.firebase.getUsersPreview(organization);
    const events = await this.props.firebase.getEventsPreview(organization);
    this.setState({
        organization: organization,
        users: users,
        events: events
    });
  }

  async updateEvent() {
      const events = await this.props.firebase.getEventsPreview(this.state.organization);
      this.setState({ events: events });
  }

    async updateUser() {
        const users = await this.props.firebase.getUsersPreview(this.state.organization);
        this.setState({ users: users });
    }

  render() {
      const {organization, users, events} = this.state;

      return (
          <div>
              <h1>Admin</h1>
              <p>Upload file</p>
              <p>Add User</p>
              <NewUser children={{'organization': organization}} userUpdate={ this.updateUser.bind(this) }/>

              <p>Add Event</p>
              <NewEvent children={{'organization': organization}} eventUpdate={ this.updateEvent.bind(this) }/>
              <br/>
              <h2>USER LIST</h2>
              <UserList users={users}/>
              <br/>
              <h2>EVENT LIST</h2>
              <EventList events={events}/>

          </div>
      );
  }
}

const UserList = ({users}) => (
    <ul>
        {
            users.map(
                user => (
                    <div >
                        <h3> { user.email } </h3>
                        <p> { user.firstName } { user.lastName } </p>
                        <p> Level: { user.level } </p>
                    </div>
                )
            )
        }
    </ul>
);

const EventList = ({events}) => (
    <ul>
        {
            events.map(
                event => (
                    <div>
                        <h3> { event.eventID } </h3>
                        <p> Name: { event.name } </p>
                        <p> Date: { event.eventDate } </p>
                        <p> Min Level: { event.minimumLevel } </p>
                        <p> Status: { event.active } </p>
                    </div>
                )
            )
        }
    </ul>
);

const condition = authUser => !!authUser;
export default withAuthorization(condition)(AdminPage);