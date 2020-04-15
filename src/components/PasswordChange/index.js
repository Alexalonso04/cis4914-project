import React, { Component } from 'react';
import { withFirebase } from '../Firebase';
import { Input, Button, Segment } from 'semantic-ui-react';
const INITIAL_STATE = {
  passwordOne: '',
  passwordTwo: '',
  error: null,
};

class PasswordChangeForm extends Component {
  constructor(props) {
    super(props);
    this.state = { ...INITIAL_STATE };
  }
  onSubmit = event => {
    const { passwordOne } = this.state;
    this.props.firebase
      .doPasswordUpdate(passwordOne)
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
    const { passwordOne, passwordTwo, error } = this.state;
    const isInvalid =
      passwordOne !== passwordTwo || passwordOne === '';
    return (
      <form onSubmit={this.onSubmit}>
        <Input placeholder='Search...'
               name="passwordOne"
               value={passwordOne}
               onChange={this.onChange}
               type="password"
               placeholder="New Password"
               style={{'width':'100%'}}
        />
        <br/>
        <br/>
        <Input
          name="passwordTwo"
          value={passwordTwo}
          onChange={this.onChange}
          type="password"
          placeholder="Confirm New Password"
          style={{'width':'100%'}}
        />
          <br/>
          <br/>
        <Button positive disabled={isInvalid} type="submit"
                style={{'width':'100%'}}>
          Reset My Password
        </Button>
        {error &&
        < div className="ui negative message">
            <div className="header">
                Error
            </div>
            <p>{error.message}
            </p></div>}
      </form>
    );
  }
}
export default withFirebase(PasswordChangeForm);