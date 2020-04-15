import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { compose } from 'recompose';
import { SignUpLink } from '../SignUp';
import { PasswordForgetLink } from '../PasswordForget';
import { withFirebase } from '../Firebase';
import * as ROUTES from '../../constants/routes';

import LoginForm from '../../UIComponents/loginForm';

import { Grid, Message } from 'semantic-ui-react';

const SignInPage = () => (
  <Grid 
    textAlign = 'center'
    verticalAlign = 'middle'
  >
    <Grid.Column style={{ maxWidth: 450 }}>
      <SignInForm />
      <Message>
        <PasswordForgetLink />
        <SignUpLink />
      </Message>
    </Grid.Column>
  </Grid>
);

const INITIAL_STATE = {
  email: '',
  password: '',
  error: null,
};

class SignInFormBase extends Component {
  constructor(props) {
    super(props);
    this.state = { ...INITIAL_STATE };
  }
  onSubmit = event => {
    console.log("On submit called");
    const { email, password } = this.state;
    this.props.firebase
      .doSignInWithEmailAndPassword(email, password)
      .then(() => {
        this.setState({ ...INITIAL_STATE });
        this.props.history.push(ROUTES.HOME);
        console.log(ROUTES.HOME);
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
    const { email, password, error } = this.state;
    const isInvalid = password === '' || email === '';

    return (
      <>
      <LoginForm
        onChange = {this.onChange}
        onSubmit = {this.onSubmit}
        email = {email}
        password = {password}
        errors = {error}
        isInvalid = {isInvalid}
      />
      </>
      // <SignInPage email = {this.state.email} password = {this.state.password} onSubmit = {this.onSubmit} onChange = {this.onChange}/>
      // <form onSubmit={this.onSubmit}>
      //   <input
      //     name="email"
      //     value={email}
      //     onChange={this.onChange}
      //     type="text"
      //     placeholder="Email Address"
      //   />
      //   <input
      //     name="password"
      //     value={password}
      //     onChange={this.onChange}
      //     type="password"
      //     placeholder="Password"
      //   />
      //   <button disabled={isInvalid} type="submit">
      //     Sign In
      //   </button>
      //   {error && <p>{error.message}</p>}
      // </form>
    //   <Container component="main" maxWidth="xs">
    //   <CssBaseline />
    //   <div >
    //     {/* <Avatar className={classes.avatar}>
    //       <LockOutlinedIcon />
    //     </Avatar> */}
    //     <Typography align="center" component="h1" variant="h5">
    //       Sign in
    //     </Typography>
    //     <form  noValidate onSubmit = {this.onSubmit}>
    //       <TextField
    //         variant="outlined"
    //         margin="normal"
    //         required
    //         fullWidth
    //         id="email"
    //         value={this.email}
    //         onChange={this.onChange}
    //         label="Email Address"
    //         name="email"
    //         autoComplete="email"
    //         autoFocus
    //       />
    //       <TextField
    //         variant="outlined"
    //         margin="normal"
    //         required
    //         fullWidth
    //         name="password"
    //         label="Password"
    //         type="password"
    //         id="password"
    //         value={this.password}
    //         onChange={this.onChange}
    //         autoComplete="current-password"
    //       />
    //       <FormControlLabel
    //         control={<Checkbox value="remember" color="primary" />}
    //         label="Remember me"
    //       />
    //       <Button
    //         type="submit"
    //         fullWidth
    //         variant="contained"
    //         color="primary"
    //         // className={classes.submit}
    //       >
    //         Sign In
    //       </Button>
    //       <Grid container>
    //         <Grid item xs>
    //           <Link href="#" variant="body2">
    //             Forgot password?
    //           </Link>
    //         </Grid>
    //         <Grid item>
    //           <Link href="#" variant="body2">
    //             {"Don't have an account? Sign Up"}
    //           </Link>
    //         </Grid>
    //       </Grid>
    //     </form>
    //   </div>
    //   <Box mt={8}>
    //   <Typography variant="body2" color="textSecondary" align="center">
    //   {'Copyright © '}
    //   <Link color="inherit" href="https://material-ui.com/">
    //     Your Website
    //   </Link>{' '}
    //   {new Date().getFullYear()}
    //   {'.'}
    // </Typography>
    //   </Box>
    // </Container>
    );
  }
}
const SignInForm = compose(
  withRouter,
  withFirebase,
)(SignInFormBase);

export default SignInPage;
export { SignInForm };