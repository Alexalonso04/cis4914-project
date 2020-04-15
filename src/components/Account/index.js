import React, { Component } from "react";
import { PasswordForgetForm } from '../PasswordForget';
import PasswordChangeForm from '../PasswordChange';
import { withFirebase } from '../Firebase';
import { AuthUserContext, withAuthorization } from '../Session';
import {Divider, Header, Button, Icon, Form, Card, Image, Grid, Container, Modal} from 'semantic-ui-react'
import EventCard from "../../UIComponents/EventCard";

class AccountPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      organization: '',
      email: '',
      registeredUser: '',
      userName: '',
      organizationPasscode: '',
    }
  }

  async componentDidMount() {
    const organizationInfo = await this.props.firebase.getOrganizationInformation();
    this.setState({
      organization: organizationInfo.companyName,
      email: organizationInfo.email,
      userFirstName: organizationInfo.name,
      userLastName: organizationInfo.lastName,
      userName: organizationInfo.username,
      deleteModal: false,
      passcodeModal: false,
      passwordModal: false,
      passcodeChanged: false,
    });

  }

  showDeleteModal(value) {
    this.setState({
      deleteModal: value
    });
  }

  deleteOrganization() {
    this.showDeleteModal(false);
    this.props.firebase.deleteOrganizationData(this.state.organization);
    alert('Deleted');
    //logout
  }

  changePasscode() {
    const passcode = document.getElementById('passcodeForm').value;
    if(passcode ==null || passcode.length == 0) {
      alert('You need to enter a passcode!')
      return;
    }
    this.props.firebase.changeOrganizationPasscode(this.state.organization, passcode);
    alert('Passcode changed!');
    //this.setState({passcodeChage:true});
    document.getElementById('passcodeForm').value = '';
  }

  changePasscodeModal() {
    this.setState({
      //passcodeChanged: false
    });
  }


  render() {
    const {organization, email, userFirstName, userLastName, userName, deleteModal, passcodeModal, passwordModal, passcodeChanged} = this.state;
    return (
        <AuthUserContext.Consumer>
          {authUser => (
              <>
                <Divider horizontal size='huge'>
                  <h1> {organization} </h1>
                </Divider>

                <div>
                  <Header as='h2' icon textAlign='center'>
                    <Icon name='users' circular/>
                    <Header.Content>{userName}</Header.Content>
                    <Header.Content>{email}</Header.Content>
                    <Header.Content>{userLastName + ', ' + userFirstName}</Header.Content>
                  </Header>
                </div>
                <br/>

                <Container>
                  <Grid stackable>
                    <Grid.Row>
                      <Grid.Column>
                        <Card.Group centered itemsPerRow={3}>
                          <Card.Group>

                            <Card>
                              <Card.Content>
                                <Card.Header>
                                  Delete Data
                                </Card.Header>
                                <br/>
                                <Card.Description>
                                  Deletes all the data stored about the organization
                                </Card.Description>
                              </Card.Content>
                              <Modal size={"small"} open={deleteModal}>
                                <Modal.Header>Delete Organization Data</Modal.Header>
                                <Modal.Content>
                                  <p>Are you sure you want to delete the data of <strong>{organization}</strong>? (There
                                    is no way to recover the data in the future)</p>
                                </Modal.Content>
                                <Modal.Actions>
                                  <Button negative onClick={() => this.showDeleteModal(false)}>No</Button>
                                  <Button
                                      onClick={() => this.deleteOrganization()}
                                      positive
                                      icon='checkmark'
                                      labelPosition='right'
                                      content='Yes'
                                  />
                                </Modal.Actions>
                              </Modal>
                              <Button negative onClick={() => this.showDeleteModal(true)}>
                                <Icon name='trash alternate outline'/>
                                Delete
                              </Button>
                            </Card>

                            <Card>
                              <Card.Content>
                                <Card.Header>
                                  Change Passcode
                                </Card.Header>
                                <br/>
                                <Card.Description>
                                  Replace the current organization passcode. It affects admin users.
                                </Card.Description>
                              </Card.Content>
                              <Modal size={"tiny"}
                                     trigger={<Button color='blue' onClick={()=>this.changePasscodeModal()}>
                                       <Icon name='th'/>
                                       Change Passcode
                                       </Button>}>
                                <Modal.Header>Change {organization} passcode</Modal.Header>
                                <Modal.Content>
                                  <Modal.Description>
                                    <div className="ui one column stackable center aligned page grid">
                                      <div className="column wide">
                                        <div className="ui action input ">
                                          <input type="password" id='passcodeForm'/>
                                          <button className="ui green center button" onClick={()=>this.changePasscode()} >
                                            Change Passcode
                                          </button>
                                        </div>
                                        { passcodeChanged &&
                                          < div className="ui positive message">
                                            <div className="header">

                                            </div>
                                            <p> The passcode was changed!
                                            </p></div>}
                                      </div>
                                    </div>
                                  </Modal.Description>
                                </Modal.Content>
                              </Modal>



                            </Card>

                            <Card>
                              <Card.Content>
                                <Card.Header>
                                  Change User Password
                                </Card.Header>
                                <br/>
                                <Card.Description>
                                  Replace password for user <strong>{userName}</strong>
                                </Card.Description>
                              </Card.Content>
                              <Modal size={"mini"}
                                     trigger={<Button color='teal'>
                                       <Icon name='asterisk'/>
                                       Change Password
                                     </Button>}>
                                <Modal.Header>Change {email} password</Modal.Header>
                                <Modal.Content image>
                                  <Modal.Description style={{'width':'100px'}}>
                                    <PasswordChangeForm/>
                                  </Modal.Description>
                                </Modal.Content>
                              </Modal>
                            </Card>

                          </Card.Group>
                        </Card.Group>
                      </Grid.Column>
                    </Grid.Row>
                  </Grid>
                </Container>
              </>
          )}
        </AuthUserContext.Consumer>
    )
  }
}
const condition = authUser => !!authUser;
export default withAuthorization(condition)(AccountPage);