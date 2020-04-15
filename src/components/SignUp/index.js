import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { compose } from 'recompose';

import { withFirebase } from '../Firebase';
import * as ROUTES from '../../constants/routes';

import {Grid, Header, Form, Segment, Button, Container} from 'semantic-ui-react';
const SignUpPage = () => (
    <Grid 
    textAlign='left'
        centered
  	>
		<Grid.Column verticalAlign='middle' width='6'>
			<SignUpForm />
		</Grid.Column>
  	</Grid>
);

const INITIAL_STATE = {
    name: '',
    lastName: '',
    companyName: '',
    email: '',
    username: '',
    passwordOne: '',
    passwordTwo: '',
    passcode: '',
    error: null,
};

class SignUpFormBase extends Component {
    constructor(props) {
        super(props);

        this.state = { ...INITIAL_STATE };
    }
    onSubmit = (event) => {
        const { name, lastName, companyName, email, username, passwordOne, passcode } = this.state;

        this.props.firebase
            .verifyOrganizationPasscode(companyName,passcode)
            .then(respose => {
                if(respose == -1) {
                    alert('Unable to process the organization. Try a different organization name or passcode');
                }
                else {
                    this.props.firebase.changeOrganizationPasscode(companyName,passcode)
                        .then(()=>{
                            this.props.firebase
                                .doCreateUserWithEmailAndPassword(email, passwordOne)
                                .then(authUser => {
                                    // Create a user in your Firebase realtime database
                                    return this.props.firebase
                                        .user(authUser.user.uid)
                                        .set({
                                            name,
                                            lastName,
                                            companyName,
                                            email,
                                            username,
                                        });
                                })

                                .then(() => {
                                    this.setState({ ...INITIAL_STATE });
                                    this.props.history.push(ROUTES.HOME);
                                })
                                .catch(error => {
                                    this.setState({ error });
                                });
                        })
                }
            });

        /*
        this.props.firebase
            .doCreateUserWithEmailAndPassword(email, passwordOne)
            .then(authUser => {
                // Create a user in your Firebase realtime database
                return this.props.firebase
                    .user(authUser.user.uid)
                    .set({
                        name,
                        lastName,
                        companyName,
                        email,
                        username,
                    });
            })

            .then(() => {
                this.setState({ ...INITIAL_STATE });
                this.props.history.push(ROUTES.HOME);
            })
            .catch(error => {
                this.setState({ error });
            });
        */

        event.preventDefault();
    }
    onChange = event => {
        this.setState({ [event.target.name]: event.target.value });
    };

    render() {
        const {
            name,
            lastName,
            companyName,
            email,
            username,
            passcode,
            passwordOne,
            passwordTwo,
            error,
        } = this.state;

        const isInvalid =
            passwordOne !== passwordTwo ||
            passwordOne === '' ||
            email === '' ||
            username === '' ||
            passcode === '' ||
            name === '' ||
            lastName === '' ||
            companyName === '';

        return (
            <>
                <Header as ='h2' color ='teal' textAlign = 'center'>Sign Up</Header>
                <Form size = "large" onSubmit={this.onSubmit} >
                    <Segment fluid stacked>
                        <Form.Group>
                            <Form.Input
                                name = 'name'
                                label = 'First Name'
                                value = {name}
                                type = 'text'
                                onChange = {this.onChange}
                            />
                            <Form.Input
                                name = 'lastName'
                                label = 'Last Name'
                                value = {lastName}
                                type = 'text'
                                onChange = {this.onChange}
                            />
                        </Form.Group>  
                        <Form.Input
                            name = 'companyName'
                            label = 'Company'
                            icon = 'building'
                            value = {companyName}
                            type = 'text'
                            onChange = {this.onChange}
                            iconPosition = 'left'
                        />
                        <Form.Input
                            name = 'username'
                            label = 'Username'
                            icon = 'user'
                            value = {username}
                            type = 'text'
                            onChange = {this.onChange}
                            iconPosition = 'left'
                            placeholder = 'username'
                        />
                        <Form.Input
                            label = 'Email'
                            name = 'email'
                            icon = 'mail'
                            value = {email}
                            type = 'text'
                            onChange = {this.onChange}
                            iconPosition = 'left'
                            placeholder = 'email@host.com'
                        />
                        <Form.Input
                            icon = 'lock'
                            name = 'passcode'
                            label = 'Passcode'
                            value = {passcode}
                            iconPosition = 'left'
                            onChange = {this.onChange}
                            placeholder  = 'Passcode'
                            type = 'password'
                        />
                        <Form.Input
                            icon = 'lock'
                            name = 'passwordOne'
                            label = 'Password'
                            value = {passwordOne}
                            iconPosition = 'left'
                            onChange = {this.onChange}
                            placeholder  = 'Password'
                            type = 'password'
                        />
                        <Form.Input
                            icon = 'lock'
                            name = 'passwordTwo'
                            value = {passwordTwo}
                            label = 'Confirm Password'
                            iconPosition = 'left'
                            onChange = {this.onChange}
                            placeholder  = 'Confirm Password'
                            type = 'password'
                        />
                    </Segment>
                    <Button 
                        color = 'teal'
                        fluid
                        disabled = {isInvalid}
                        type = 'submit'
                        size = 'large'
                    >Sign Up</Button>
                    {error && <p>{error.message}</p>}
                </Form>
                </>
        );
    }
}
const SignUpLink = () => (
    <p>
        Don't have an account? <Link to={ROUTES.SIGN_UP}>Sign Up</Link>
    </p>
);

const SignUpForm = compose(
    withRouter,
    withFirebase,
)(SignUpFormBase);

export default SignUpPage;
export { SignUpForm, SignUpLink };