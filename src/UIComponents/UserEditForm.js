import React from "react";
import { withFirebase } from '../components/Firebase';
import { AuthUserContext, withAuthorization } from '../components/Session';
import CameraFaceDescriptor from "../components/NewUser/CameraFaceDescriptor";
import FileFaceDescriptor from "../components/NewUser/FileFaceDescriptor";

import { Grid, Form, Button, Message, Container } from "semantic-ui-react";

import { genderOptions, levelOptions } from "../util/options";
import {onlyAlphaNumValues, onlyNumericValues, validEmail} from "../util/validators";
import { fromRenderProps } from "recompose";


class UserEditForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
        userID: props.user.userID,
        firstName: props.user.firstName,
        lastName: props.user.lastName,
        email: props.user.email,
        gender: props.user.sex,
        age: props.user.age,
        level: props.user.level,
        errors:[]
    };

    console.log(props.user);
  }

  onChange = async (event, { name, value }) => {
    this.setState({
      ...this.state.values,
      [name]: value
    });
  };

  onSubmit = async (event) => {
    const {
        userID,
        firstName,
        lastName,
        email,
        level,
        gender,
        age
    } = this.state;


    const {organization, updateUsers, closeModal, firebase} = this.props;

    var errors = [];

    if (!validEmail(email)) {
        errors.push('Email must be a valid email.');
    }

    this.setState({errors: errors});

    if (errors.length === 0) {
        const userAdded = await this.props.firebase.addUser(
            organization,
            userID,
            firstName,
            lastName,
            email,
            level,
            gender,
            age
        );
        
        if(!userAdded) {
            errors.push('User ID already exists')
            return;
        }
    } else {
        return;
    }
    updateUsers();
    closeModal("Edit");
  }

  render() {
    const { firstName, lastName, email, gender, age, level, errors } = this.state;
    return (
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
                                value={level}
                                options={levelOptions}
                                onChange={this.onChange}
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
                            <Form.Select
                                fluid
                                label="Gender"
                                name="gender"
                                width={3}
                                value={gender}
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
                    </Form>
                    <Button.Group compact fluid size='small'>
                        <Button
                            color='blue'
                            content='Add New Pictures'
                            icon='camera'
                            labelPosition='left'
                        />
                        <Button.Or/>
                        <Button
                            color='blue'
                            content='Upload New Pictures'
                            icon='file'
                            labelPosition='right'
                        />
                    </Button.Group>
                        <Message
                            color='red'
                            size='large'
                            hidden={(errors.length === 0)}
                            header='Invalid Form Fields:'
                            list={errors}
                        />    
                </Grid.Column>
            </Grid.Row>
            <Grid.Row>
                <Grid.Column>
                    <Button
                        type='button'
                        content="Cancel"
                        size='large'
                        color="red"
                        icon="cancel"
                        labelPosition="left"
                        floated="right"
                        onClick={()=>{
                            this.setState({});
                            this.props.closeModal("Edit");
                        }}
                    />
                    <Button
                        onClick={this.onSubmit}
                        content="Submit"
                        size='large'
                        color="green"
                        icon="check"
                        labelPosition="left"
                        floated="left"
                    />
                </Grid.Column>
            </Grid.Row>
        </Grid>
    );
  }
}

const condition = authUser => !!authUser;
export default withAuthorization(condition)(withFirebase(UserEditForm));
