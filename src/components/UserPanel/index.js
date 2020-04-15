import React, {Component} from 'react';
import { withAuthorization } from '../Session';
import { withFirebase } from '../Firebase';
import { Link } from 'react-router-dom';
import * as ROUTES from '../../constants/routes';

import NewUser from '../NewUser/index';
import UserEditForm from '../../UIComponents/UserEditForm';

import { 
    Table, 
    Grid, 
    Container,
    Header, 
    Dimmer, 
    Divider, 
    Icon, 
    Loader, 
    Segment, 
    Modal,
    Button} from 'semantic-ui-react';

class UserPanel extends Component {
    constructor(props) {
        super(props);
        this.state = {
            organization: '',
            users: [],
            // addUser: null,
            deleteUser: null,
            updateUsers: null,
            viewCreateUserModal: false,
            viewUserModal: false,
            viewEditUserModal: false,
            selectedUser: {},
        }
    }

    async componentDidMount() {
        const organization = await this.props.firebase.getOrganization();
        const users = await this.props.firebase.getUsersPreview(organization);
        const addUser = this.props.firebase.addUser;
        const deleteUser = this.props.firebase.deleteUser;
        const updateUsers  = async () => {
            this.setState({loading: true});
            const users =  await this.props.firebase.getUsersPreview(this.state.organization);
            this.setState({ users: users });
            this.setState({loading: false});
        }
        this.setState({
            organization: organization,
            users: users,
            // addUser : addUser,
            deleteUser: deleteUser,
            updateUsers: updateUsers,
            createUserModal: false
        });
    }

    closeModal = (name) => {
        switch(name){
            case "View":
                this.setState({viewUserModal: false});
                break;
            case "Create":
                this.setState({viewCreateUserModal: false});
                break;
            case "Edit":
                this.setState({viewEditUserModal: false});
                break;
        }
    }

    openModal = (name) => {
        switch(name){
            case "View":
                this.setState({viewUserModal: true});
                break;
            case "Create":
                this.setState({viewCreateUserModal: true});
                break;
            case "Edit":
                this.setState({viewEditUserModal: true});
                break;
        }
    }

    render() {
        const {loading, organization, users, deleteUser, updateUsers,viewEditUserModal, viewCreateUserModal: createUserModal, viewUserModal, selectedUser: user} = this.state;

        const userFormModal = (
            <Modal
                closeIcon
                onClose={()=>updateUsers()}
                open={createUserModal}
                size='small'
                closeOnEscape={true}
                closeOnDimmerClick={false}
            >
                <Modal.Header as='h1' content='New User'/>
                <Modal.Content content={<NewUser children={{'organization': organization}} closeModal={this.closeModal} userUpdate={updateUsers} />}/>
            </Modal>
        );

        const userEditModal = (
            <Modal
                onClose={() => this.closeModal("Edit")}
                open={viewEditUserModal}
                size='tiny'
                closeOnEscape={true}
                closeOnDimmerClick={false}                
            >
                <Modal.Header as='h1'>Edit User</Modal.Header>
                <Modal.Content>
                    <UserEditForm
                        user={user} 
                        organization={organization} 
                        closeModal={() => this.closeModal("Edit")}
                        updateUsers={updateUsers} />
                </Modal.Content>
            </Modal>
        );

        const userModal = (
            <Modal
                open={viewUserModal}
                onClose={() => this.closeModal("View")}
                size='tiny'
                closeOnEscape={true}
                closeOnDimmerClick={true}
            >
                <Modal.Header as='h1' content='User Profile' />
                <Modal.Content>
                    <Container>
                        <Grid>
                            <Grid.Row>
                                <Grid.Column>
                                    <Header textAlign='center' as='h1' icon>
                                        <Icon name='user circle'/>
                                        {user.firstName} {user.lastName}
                                    </Header>
                                    <Table
                                        unstackable
                                        celled
                                        singleLine
                                        striped
                                        definition
                                    >
                                        <Table.Body>
                                            <Table.Row>
                                                <Table.Cell width={4}>User ID:</Table.Cell>
                                                <Table.Cell>{user.userID}</Table.Cell>
                                            </Table.Row>
                                            <Table.Row>
                                                <Table.Cell>Level:</Table.Cell>
                                                <Table.Cell>{user.level}</Table.Cell>
                                            </Table.Row>
                                            <Table.Row>
                                                <Table.Cell>Gender:</Table.Cell>
                                                <Table.Cell>{user.sex}</Table.Cell>
                                            </Table.Row>
                                            <Table.Row>
                                                <Table.Cell>Age:</Table.Cell>
                                                <Table.Cell>{user.age}</Table.Cell>
                                            </Table.Row>
                                            <Table.Row>
                                                <Table.Cell>Email:</Table.Cell>
                                                <Table.Cell>{user.email}</Table.Cell>
                                            </Table.Row>
                                        </Table.Body>
                                    </Table>
                                </Grid.Column>
                            </Grid.Row>
                        </Grid>
                    </Container>
                </Modal.Content>
                <Modal.Actions>
                    <Grid>
                        <Grid.Row>
                            <Grid.Column>
                            <Button 
                                content='Close'
                                color='grey'
                                size='large'
                                floated='left'
                                onClick={()=>this.closeModal("View")}
                            />
                            <Button 
                                icon='edit'
                                labelPosition='left'
                                content='Edit'
                                size='large'
                                floated='right'
                                positive
                                onClick={()=>{
                                    this.openModal("Edit");
                                    this.closeModal("View");
                                }}
                            />
                            </Grid.Column>
                        </Grid.Row>
                    </Grid>
                </Modal.Actions>
            </Modal>
        )   
        
        return (
            <>
                <Container>
                    <Grid columns={1} >
                        <Grid.Row>
                            <Header as='h1'>User Panel</Header>
                        </Grid.Row>
                        <Grid.Row>
                            <Grid.Column>
                                <Button
                                    content="Add User"
                                    icon="add"
                                    color="green"
                                    labelPosition="left"
                                    floated="right"
                                    onClick={()=>{
                                        this.openModal("Create");
                                    }}
                                />
                            </Grid.Column>
                        </Grid.Row>
                    </Grid>
                </Container>

                <Divider horizontal>
                <Header as="h2">{organization} Users </Header>
                </Divider>
                    <Dimmer active={users ? false : true} inverted>
                    <Loader/>
                </Dimmer>
                {users === undefined || users.length === 0 
                ?(
                    <Segment placeholder>
                        <Header icon>
                          <Icon name='users' size='large'/>
                          <p>There are currently no users registered</p>
                        </Header>
                    </Segment>
                    )
                :(
                    <Container>
                    <Grid>
                        <Grid.Row>
                            <Grid.Column>
                            <Table 
                                celled 
                                unstackable
                            >
                                <Table.Header>
                                    <Table.Row >
                                        <Table.HeaderCell>First Name </Table.HeaderCell>
                                        <Table.HeaderCell>Last Name  </Table.HeaderCell>
                                        <Table.HeaderCell>Level      </Table.HeaderCell>
                                        <Table.HeaderCell>View      </Table.HeaderCell>
                                        <Table.HeaderCell>Delete      </Table.HeaderCell>
                                    </Table.Row>
                                </Table.Header>
                                <Table.Body>
                                    {users.map((user, index) => (
                                         <Table.Row key={index}>
                                            <Table.Cell>{user.firstName}</Table.Cell>
                                            <Table.Cell>{user.lastName}</Table.Cell>
                                            <Table.Cell>{user.level}</Table.Cell>
                                            <Table.Cell collapsing textAlign='center'>
                                                <Button
                                                    color='blue'
                                                    icon = "info"
                                                    onClick = { () => {
                                                        this.setState({selectedUser: user});
                                                        this.setState({viewUserModal: true});
                                                    }}
                                                />
                                            </Table.Cell>
                                            <Table.Cell collapsing textAlign='center' >
                                                <Button
                                                    color='red'
                                                    negative
                                                    icon = "delete"
                                                    onClick={async () =>{
                                                        deleteUser(organization, user.userID).then(()=>{
                                                            updateUsers();
                                                        })
                                                    }}
                                                />
                                            </Table.Cell>
                                        </Table.Row>
                                    ))}
                                </Table.Body>
                             </Table>
                             </Grid.Column>
                        </Grid.Row>
                    </Grid>
                </Container>
                    )
                }
                {userFormModal}
                {userModal}
                {userEditModal}
            </>
        )
    }

}

const condition = authUser => !!authUser;
export default withAuthorization(condition)(UserPanel);

