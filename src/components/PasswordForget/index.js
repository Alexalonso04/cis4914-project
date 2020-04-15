import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { withFirebase } from '../Firebase';
import * as ROUTES from '../../constants/routes';


import { 
	Grid,
	Header,
	Form,
	Segment,
	Button
} from 'semantic-ui-react';

const PasswordForgetPage = () => (
  <Grid 
    verticalAlign = 'middle'
    textAlign = 'center'
  >
    <Grid.Column  
    verticalAlign = 'middle'
    style={{ maxWidth: 450 }}
    >
      <PasswordForgetForm />
    </Grid.Column>
  </Grid> 
);
const INITIAL_STATE = {
  email: '',
  error: null,
};
class PasswordForgetFormBase extends Component {
  constructor(props) {
    super(props);
    this.state = { ...INITIAL_STATE };
  }
  onSubmit = event => {
    const { email } = this.state;
    this.props.firebase
      .doPasswordReset(email)
      .then(() => {
        this.setState({ ...INITIAL_STATE });
      })
      .catch(error => {
        this.setState({ error });
      });
    event.preventDefault();
  };
  onChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };
  render() {
    const { email, error } = this.state;
    const isInvalid = email === '';

    return (
		<>
    		<Header as ='h2' color ='teal' textAlign = 'center'>Password Reset</Header>
    		<Form size = 'small' onSubmit={this.onSubmit} >
    		    <Segment stacked>
    		      <Form.Input
						    fuid
                name = 'email'
                label = 'Email'
						    icon = 'user'
						    value = {email}
    		        type = 'text'
    		        onChange = {this.onChange}
    		        iconPosition = 'left'
    		        placeholder = 'email@host.com'
    		      />
    		    </Segment>
            <Button 
    		      color = 'teal'
						  fluid
						  disabled = {isInvalid}
    		      type = 'submit'
    		      size = 'large'
    		    >Reset My Password</Button>
    		    {error && <p>{error.message}</p>}
    		</Form>
		</>
    );
  }
}
const PasswordForgetLink = () => (
  <p>
    <Link to={ROUTES.PASSWORD_FORGET}>Forgot Password?</Link>
  </p>
);
export default PasswordForgetPage;
const PasswordForgetForm = withFirebase(PasswordForgetFormBase);
export { PasswordForgetForm, PasswordForgetLink };