import React from 'react';
import { 
    Button, 
    Form, 
    Header, 
    Segment, 
    Message
} from 'semantic-ui-react';

export default function LoginForm({onChange, onSubmit, email, password, errors, isInvalid}) {
    return (
        <>
        <Header as ='h2' color ='teal' textAlign = 'center'>Sign in</Header>
        <Form size = 'small' onSubmit={onSubmit} >
            <Segment stacked>
                <Form.Input
                    fuid
                    icon = 'user'
                    name = 'email'
                    type = 'text'
                    value = {email}
                    onChange = {onChange}
                    iconPosition = 'left'
                    placeholder = 'email@host.com'
                />
                <Form.Input
                    fluid = 'true'
                    icon = 'lock'
                    name = 'password'
                    value = {password}
                    iconPosition = 'left'
                    onChange = {onChange}
                    placeholder  = 'password'
                    type = 'password'
                />
            </Segment>
            <Button 
                color = 'teal'
                fluid
                disabled = {isInvalid}
                type = 'submit'
                size = 'large'
            >Login</Button>
            {/* {errors && <Message
                            error
                        >{errors.message}</Message>} */}
            {errors && <p>{errors.message}</p>}
        </Form>
        </>
    );
};