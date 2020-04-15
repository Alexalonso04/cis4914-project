import React, { Component } from 'react';
import { withFirebase } from '../Firebase';
import { AuthUserContext, withAuthorization } from '../Session';

class NewEvent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            recognizer: ''
        }
    }

    async addEventClick() {
        const eventID = document.getElementById('eventID').value;
        const eventName = document.getElementById('eventName').value;
        const minimumLevel = document.getElementById('minimumLevel').value;
        const allowedUsers = document.getElementById('allowedUsers').value;
        const notAllowedUsers = document.getElementById('notAllowedUsers').value;
        const description = document.getElementById('description').value;
        const eventDate = document.getElementById('eventDate').value;
        const passCode = document.getElementById('passcode').value;

        var error = 'All fields must be filled. Please enter a value for: ';
        if(eventID === '') { error+=' eventID'; }
        if(eventName === '') { error+=' Event Name'; }
        if(minimumLevel === '') { error+=' Minimum Level'; }
        if(description === '') { error+=' Description'; }
        if(eventDate === '') { error+=' Event Date'; }
        if(passCode === '') {error+=' Pass Code'}

        if(error !== 'All fields must be filled. Please enter a value for: ') {
            alert(error);
            return;
        }
        const organization = this.props.children.organization;
        const eventAdded = await this.props.firebase.addEvent(organization, eventID, eventName, minimumLevel, allowedUsers, notAllowedUsers, description, eventDate, passCode);
        if(!eventAdded) {
            alert('Event ID already in use. Verify if the event was already entered.');
        }

        this.props.eventUpdate();

    }

    render() {
        return (
            <div>
                <h1>NEW EVENT</h1>
                <div>
                    <p>Event ID:</p>
                    <input id={'eventID'}/>
                    <p>Event Name:</p>
                    <input id={'eventName'}/>
                    <p>Minimum Level:</p>
                    <input id={'minimumLevel'}/>
                    <p>Allowed Employees ID:</p>
                    <input id={'allowedUsers'}/>
                    <p>Not Allowed Employees ID:</p>
                    <input id={'notAllowedUsers'}/>
                    <p>Description:</p>
                    <input id={'description'}/>
                    <p>Pass Code:</p>
                    <input id={'passcode'}/>
                    <p>Event Date:</p>
                    <input id={'eventDate'}/>
                    <br/>
                    <button onClick={() => this.addEventClick() }>Insert Event</button>
                </div>
            </div>
        );
    }
}
const condition = authUser => !!authUser;
export default withAuthorization(condition)(withFirebase(NewEvent));