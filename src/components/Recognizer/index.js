import React, { Component } from 'react';
import { withFirebase } from '../Firebase';
import Face_Recognition from "../FaceRecognition";
import {Input, Divider, Card, Container, Grid, Modal, Button, Icon} from 'semantic-ui-react';
import CustomUploadButton from 'react-firebase-file-uploader/lib/CustomUploadButton';
import PasswordChangeForm from "../PasswordChange";
import * as ROUTES from "../../constants/routes";

class Recognizer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            organization: '',
            event: '',
            facerecogition: '',
            showModal: false
        }

    }

    async hideModal() {
        this.setState({
            organization: '',
            event: '',
            facerecogition: '',
            showModal: false
        });
        document.getElementById('organization').value = '';
        document.getElementById('event').value = '';
        document.getElementById('passcode').value = '';

    }

    async getAccess() {
        const organization = document.getElementById('organization').value;
        if (organization.includes('.')) {
            alert('Invalid character in organization \'.\' ')
            return;
        }
        const event = document.getElementById('event').value;
        const eventPasscode = document.getElementById('passcode').value;

        if (organization.length == 0 || event.length == 0 || eventPasscode.length == 0) {
            alert('Please fill out all the fields.')
            return;
        }
        if (await this.props.firebase.checkIfEventExist(organization, event)) {
            if (await this.props.firebase.loginIntoEvent(organization, event, eventPasscode)) {
                this.setState({
                    showModal: true,
                    organization: organization,
                    event: event
                    //facerecogition: <Face_Recognition children={{'organization': organization, 'event': event}}/>
                });
            } else {
                alert('Incorrect event id or passcode')
                return;
            }
        } else {
            alert('Unable to locate event');
            return;
        }

    }

    render() {
        return (
            <>
                <br/>
                <Divider horizontal size='huge'>
                    <h1 className="ui image header">
                        <div className="content">
                            Event Registration
                        </div>
                    </h1>
                </Divider>
                <div className="ui vertically divided grid">
                    <div className="three column row">
                        <div className="column">
                            <p></p>
                        </div>
                        <div className="column">
                            <div className="ui middle aligned center aligned grid">
                                <div className="column">
                                    <form className="ui large form">
                                        <div className="ui stacked segment">
                                            <div className="field">
                                                <div className="ui left icon input">
                                                    <i className="building icon"></i>
                                                    <input type="text" name="email" placeholder="Organization ID" id={'organization'}/>
                                                </div>
                                            </div>
                                            <div className="field">
                                                <div className="ui left icon input">
                                                    <i className="users icon"></i>
                                                    <input type="text" name="email" placeholder="Event ID" id={'event'}/>
                                                </div>
                                            </div>
                                            <div className="field">
                                                <div className="ui left icon input">
                                                    <i className="lock icon"></i>
                                                    <input type="password" name="password" placeholder="Event Passcode" id={'passcode'}/>
                                                </div>
                                            </div>
                                            <div className="ui fluid large blue submit button"
                                                 onClick={() => this.getAccess()}>Access Event
                                            </div>
                                        </div>
                                    </form>
                                    <div className="ui message">
                                        New to CARAS? <a onClick={() => this.props.history.push(ROUTES.SIGN_UP)}>Sign
                                        Up</a>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="column">
                            <p></p>
                        </div>
                    </div>
                </div>
                <Modal size={"small"} open={this.state.showModal }>

                    <div className="ui segment">
                        <div className="ui two column very relaxed grid">
                            <div className="column">
                                <div className="ui">
                                    <h3 className="ui left floated header">{this.state.event}</h3>
                                </div>
                            </div>
                            <div className="column">
                                <div className="ui">
                                    <h3 className="ui right floated header">{this.state.organization}</h3>
                                </div>

                            </div>
                        </div>
                        <div className="ui vertical divider">
                            check in
                        </div>
                    </div>
                    <Modal.Content className=''>
                        <Face_Recognition children={{'organization': this.state.organization, 'event': this.state.event}}/>
                    </Modal.Content>
                    <Modal.Content>
                        <button  class="fluid ui button red" onClick={() => this.hideModal()}>
                            <Icon name='stop circle outline'/>
                            Stop
                        </button>
                    </Modal.Content>
                </Modal>
            </>
        );
    }
}
export default withFirebase(Recognizer);