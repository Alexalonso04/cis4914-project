import React, { Component } from 'react';
import { withFirebase } from '../Firebase';
import CameraFaceDescriptor from "./CameraFaceDescriptor";
import FileFaceDescriptor from "./FileFaceDescriptor";
import CustomUploadButton from 'react-firebase-file-uploader/lib/CustomUploadButton';
import { AuthUserContext, withAuthorization } from '../Session';

import {Form, Button, Grid, Modal, Message} from 'semantic-ui-react';
import { genderOptions, levelOptions } from "../../util/options";
import {onlyAlphaNumValues, onlyNumericValues, validEmail} from "../../util/validators";

var user = {
    userID: '',
    firstName: '',
    lastName: '',
    email: '',
    level: '',
    gender: '',
    age: ''
}

var answer;
var imageModal;
var confirmationImageModal;

class NewUser extends Component {
    constructor(props) {
        super(props);
        this.state = {
            viewImageModal: false,
            viewConfirmationImageModal: false,
            answer: false,
            recognizer: '',
            organization: this.props.children.organization,
            user: {
                userID: '',
                firstName: '',
                lastName: '',
                email: '',
                level: '',
                gender: '',
                age: ''
            },
            errors: []
        }
    }

    onSubmit = async (event) => {
        const {
            userID,
            firstName,
            lastName,
            email,
            level,
            gender,
            age
        } = this.state.user;

        const {organization} = this.state;

        var errors = [];

        if (!validEmail(email)) {
            errors.push('Email must be a valid email.');
        }

        this.setState({errors: errors});


        // console.log(this.state);
        // const userID = document.getElementById('userID').value;
        // const firstName = document.getElementById('firstName').value;
        // const lastName = document.getElementById('lastName').value;
        // const email = document.getElementById('email').value;
        // const level = document.getElementById('level').value;
        // const gender = document.getElementById('gender').value;
        // const age = document.getElementById('age').value;

        // var error = 'All fields must be filled. Please enter a value for: ';
        // if(userID === '') { error+=' UserID'; }
        // if(firstName === '') { error+=' FirstName'; }
        // if(lastName === '') { error+=' LastName'; }
        // if(email === '') { error+=' Email'; }
        // if(level === '') { error+=' Level'; }
        // if(gender === '') { error+=' Gender'; }
        // if(age === '') { error+=' Age'; }

        // if(error != 'All fields must be filled. Please enter a value for: ') {
        //     alert(error);
        //     return;
        // }
        if (errors.length === 0) {
            const userAdded = await this.props.firebase.addUser(organization,userID,firstName,lastName,email,level,gender,age);
            if(!userAdded) {
                errors.push('User ID already exists');
                this.setState({errors: errors});
            } else {
                this.setState({viewConfirmationImageModal: true});    
            }
        }
        
        // document.getElementById('userID').disabled = true;
        // document.getElementById('firstName').disabled = true;
        // document.getElementById('lastName').disabled = true;
        // document.getElementById('email').disabled = true;
        // document.getElementById('level').disabled = true;
        // document.getElementById('gender').disabled = true;
        // document.getElementById('age').disabled = true;
        // document.getElementById('addUser').disabled = true;

        // this.props.userUpdate();

        // const answer =  window.confirm("Do you want to use you camera to take user face descriptions? \n If you want to upload the images files press Cancel");
        // if(answer) {
        //     this.setState({
        //         recognizer: <CameraFaceDescriptor children={{'organization':organization,'userID':userID}} />,
        //     });
        // }
        // else {
        //     this.setState({
        //         recognizer: <FileFaceDescriptor children={{'organization':organization,'userID':userID}} />,
        //     });
        // }

        // imageModal = (
        //     <Modal
        //         open={this.state.viewImageModal}
        //         size='large'
        //         closeOnDimmerClick={false}
        //     >
        //         <Modal.Header as='h1' content={answer ? 'Take Pictures' : 'Choose Your Pictures'}/>
        //         <Modal.Content content={
        //             answer
        //                 ? (<CameraFaceDescriptor children={{'organization':organization,'userID':userID}} />)
        //                 : (<FileFaceDescriptor children={{'organization':organization,'userID':userID}} />)
        //             }
        //         />
        //     </Modal>
        // )
    }

    onChange = (event, {name, value}) => {
        user[name] = value
        this.setState({user});
    }

    closeModal = async() => {
        await this.setState({viewImageModal: false});
        await this.props.closeModal("Create");
    }

    render() {
        const {
            userID,
            firstName,
            lastName,
            email,
            age,
            gender,
            level
        } = this.state.user;
        
        const {
            organization,
            viewConfirmationImageModal,
            viewImageModal,
            recognizer,
            errors
        } = this.state
        
        const {closeModal} = this.props;
                
        const isInvalid =   userID === '' ||
                            firstName === '' ||
                            lastName === '' ||
                            email === '' ||
                            gender === '' ||
                            level === '' ||
                            age === '';

        return (
            <>
                {/* <h1>NEW USERS</h1>
                <div id={'InputControls'}>
                    <p>User ID:</p>
                    <input id={'userID'}/>
                    <p>First Name:</p>
                    <input id={'firstName'}/>
                    <p>Last Name:</p>
                    <input id={'lastName'}/>
                    <p>Email:</p>
                    <input id={'email'}/>
                    <p>Level:</p>
                    <input id={'level'}/>
                    <p>Gender:</p>
                    <input id={'gender'}/>
                    <p>Age:</p>
                    <input id={'age'}/>
                    <br/>
                    <button id={'addUser'} onClick={() => this.addUserClick() }>Insert User</button>
                </div> */}
                <Grid>
                    <Grid.Row>
                        <Grid.Column>
                            <Form
                                noValidate
                                onSubmit={this.onSubmit}
                                size='large'
                            >
                                <Form.Group width='equal'>
                                    <Form.Input
                                        fluid
                                        label="First Name"
                                        name="firstName"
                                        type="text"
                                        width={8}
                                        maxLength="25"
                                        value={firstName}
                                        onChange={this.onChange}
                                    />
                                    <Form.Input
                                        fluid
                                        label="Last Name"
                                        name="lastName"
                                        type="text"
                                        width={8}
                                        maxLength="25"
                                        value={lastName}
                                        onChange={this.onChange}
                                    />
                                    <Form.Select
                                        fluid
                                        label="Level"
                                        name="level"
                                        width={3}
                                        options={levelOptions}
                                        onChange={this.onChange}
                                    />
                                </Form.Group>
                                <Form.Group widths='equal'>
                                    <Form.Input
                                        fluid
                                        label="User ID"
                                        name="userID"
                                        type="text"
                                        width={4}
                                        maxLength="15"
                                        value={userID}
                                        onChange={({param: event}, data) => {
                                            //only allow alphanumeric values to be inputted
                                            if (onlyAlphaNumValues(data.value) || data.value === '') {
                                                this.onChange(event, data)
                                            }
                                        }}
                                    />
                                    <Form.Select
                                        fluid
                                        label="Gender"
                                        name="gender"
                                        width={2}
                                        options={genderOptions}
                                        onChange={this.onChange}
                                    />
                                    <Form.Input
                                        fluid
                                        label="Age"
                                        name="age"
                                        type="text"
                                        value={age}
                                        maxLength="2"
                                        width={2}
                                        onChange={({param: event}, data) => {
                                            //only allow numeric values to be inputted
                                            if (onlyNumericValues(data.value)) {
                                                this.onChange(event, data)
                                            }
                                        }}
                                    />
                                </Form.Group>
                                <Form.Group widths='equal'>
                                    <Form.Input
                                        fluid
                                        label="Email"
                                        name="email"
                                        type="text"
                                        width={8}
                                        maxLength='40'
                                        value={email}
                                        onChange={this.onChange}
                                    />
                                </Form.Group>
                                <Message
                                    color='red'
                                    hidden={(errors.length === 0)}
                                    header='Invalid Form Fields:'
                                    list={errors}
                                />
                                <Button
                                    content="Cancel"
                                    size='large'
                                    color="red"
                                    type='button'
                                    icon="cancel"
                                    labelPosition="left"
                                    floated="right"
                                    onClick={()=>{
                                        user = {
                                            userID: '',
                                            firstName: '',
                                            lastName: '',
                                            email: '',
                                            level: '',
                                            gender: '',
                                            age: ''
                                        }
                                        this.setState(user);
                                        this.props.closeModal("Create");
                                    }}
                                />
                                <Button
                                    type="submit"
                                    content="Submit"
                                    disabled={isInvalid}
                                    size='large'
                                    color="green"
                                    icon="check"
                                    labelPosition="left"
                                    floated="left"
                                />            
                            </Form>
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            
                <Modal 
                    size='tiny'
                    closeOnDimmerClick={false}
                    open={viewConfirmationImageModal}
                >
                    <Modal.Header>Required Images</Modal.Header>
                    <Modal.Content>
                        <Modal.Description>
                            <p> To complete this user's profile, we need a set of pictures for our AI to
                                identify this user upon check in. These pictures are securely stored in our database
                                and will not be shared.
                            </p>
                            <p> How would you like to provide these pictures?</p>
                        </Modal.Description>
                    </Modal.Content>
                    <Modal.Actions>
                        <Grid
                            stackable={false}
                        >
                            <Grid.Row columns={1}>
                                <Grid.Column>
                                    <Button
                                        primary
                                        icon='camera'
                                        labelPosition='left'
                                        floated='left'
                                        content='Take Pictures'
                                        onClick={()=>{
                                            this.setState({answer: true});
                                            this.setState({recognizer:<CameraFaceDescriptor children={{'updateUsers': this.props.userUpdate,'organization':organization,'userID':userID, 'closeModal': this.closeModal}} />})
                                            this.setState({viewConfirmationImageModal: false});
                                            this.setState({viewImageModal: true});

                                        }}
                                    />
                                    <Button
                                        primary
                                        icon='image file'
                                        labelPosition='left'
                                        floated='right'
                                        content='Upload Files'
                                        onClick={()=>{
                                            this.setState({answer: false});
                                        this.setState({recognizer:<FileFaceDescriptor children={{'updateUsers': this.props.userUpdate,'organization':organization,'userID':userID, 'closeModal': this.closeModal}}/>})
                                            this.setState({viewConfirmationImageModal: false});
                                            this.setState({viewImageModal: true});
                                        }}
                                    />
                                </Grid.Column>
                            </Grid.Row>
                        </Grid>
                    </Modal.Actions>
                </Modal>
        
                <Modal
                    size={answer ? 'large' : 'small'}
                    open={viewImageModal}
                    onClose={()=>closeModal("Create")}
                    closeOnDimmerClick={false}
                >
                    <Modal.Content content={recognizer}></Modal.Content>
                </Modal>

                {/* <br/>
                <div id={'FaceDescriptorArea'}>
                    {this.state.recognizer}
                </div> */}
            </>
        );
    }
}
const condition = authUser => !!authUser;
export default withAuthorization(condition)(withFirebase(NewUser));