import React, { useState } from "react";
import { withFirebase } from '../components/Firebase';

import { Form, Grid, Button, Icon } from "semantic-ui-react";
import SemanticDatepicker from 'react-semantic-ui-datepickers';
import { onlyNumericValues} from "../util/validators";

export default function EventForm({organization, addEvent, updateEvents, closeModal}) {
    const [code, setCode] = useState('');
    
    const [values, setValues] = useState({
        id: "",
        name: "",
        code: "",
        active: false,
        minimum_level: "",
        allowedUsers: '',
        notAllowedUsers: '',
        description: "",
        date: ""
    });

    const [isValid, setIsValid] = useState(true);

    const options = [
        {
            key: '1',
            text:'1',
            value:'1'
        },
        {
            key: '2',
            text:'2',
            value:'2'
        },
        {
            key: '3',
            text:'3',
            value:'3'
        },
        {
            key: '4',
            text:'4',
            value:'4'
        },
        {
            key: '5',
            text:'5',
            value:'5'
        }
    ]

    var formValues = values;

    var valid = isValid;

    var onChange = (name, value) => {
        formValues[name] = value;
        setValues(formValues);
        valid = values.name === "" || 
                values.code === "" ||
                values.minimum_level === "" || 
                values.description === "" ||
                values.date === "";
        setIsValid(valid);
    };

    var onSubmit = async () => {
        const eventAdded = await addEvent(
            organization,
            values.id,
            values.name,
            values.minimum_level,
            values.allowedUsers,
            values.notAllowedUsers,
            values.description,
            values.date,
            values.code
        );

        if(!eventAdded) {
            alert('Event ID already in use. Verify if the event was already entered.');
        } else {
            closeModal("Create");
            updateEvents();
        }
    };

    return (
        <Grid>
            <Grid.Row>
                <Grid.Column>
                    <Form onSubmit={onSubmit}>
                        <Form.Group widths='equal'>
                            <Form.Input
                                label="Event Name"
                                name="name"
                                type="text"
                                width={4}
                                maxLength="25"
                                onChange={(param, data) => {
                                    onChange(data.name, data.value);
                                }}
                            />
                            <Form.Input
                                label="Event Code"
                                name="code"
                                type="text"
                                width={1}
                                value={code}
                                maxLength="5"
                                onChange={(param, data) => {
                                    //only allow numeric values to be inputted
                                    if (onlyNumericValues(data.value)) {
                                        setCode(data.value);
                                        onChange(data.name, data.value);
                                    }
                                }}
                            />
                            <Form.Input
                                label="Event ID"
                                name="id"
                                type="text"
                                width={4}
                                // value={values.code}
                                maxLength="10"
                                onChange={(param, data) => {
                                    onChange(data.name, data.value);
                                }}
                            />
                        </Form.Group>
                        <Form.Group widths='equal'>
                            <Form.TextArea
                                label="Description"
                                name="description"
                                type="text"
                                width={2}
                                // value={values.description}
                                onChange={(param, data) => {
                                    onChange(data.name, data.value);
                                }}
                            />
                        </Form.Group>
                        <Form.Group widths='equal'>
                            <Form.Dropdown
                                label = "Minimum Level"
                                name = "minimum_level"
                                placeholder = "1 - 5"
                                fluid
                                selection
                                // value={checkInData.company}
                                options = {options}
                                onChange={(param, data) => {
                                  onChange(data.name, data.value);
                                }}
                            />
                            <Form.Field
                                content={
                                    <SemanticDatepicker 
                                        name="date" 
                                        label="Start Date"
                                        onChange={(param, data) => {
                                            /* Convert the date object to a string. Locale means that the format of the string will
                                             * be in accordance to the region using the application.
                                             * For the use it will be MM/DD/YYYY
                                             */
                                            try {
                                                const dateString = data.value.toLocaleDateString();
                                                onChange(data.name, dateString)
                                            }
                                            catch (e) {
                                                onChange(data.name, '');
                                            }
                                        }
                                        }
                                    />
                                }
                            />
                        </Form.Group>
                        <Form.Group widths='equal'>
                            <Form.Input
                                label="Allowed Users"
                                name="allowedUsers"
                                type="text"
                                // value={values.description}
                                onChange={(param, data) => {
                                    onChange(data.name, data.value);
                                }}
                            />
                            <Form.Input
                                label="Not Allowed Users"
                                name="notAllowedUsers"
                                type="text"
                                // value={values.description}
                                onChange={(param, data) => {
                                    onChange(data.name, data.value);
                                }}
                            />
                        </Form.Group>
                        <Button
                            content="Cancel"
                            size='large'
                            type='button'
                            color="red"
                            icon="cancel"
                            labelPosition="left"
                            floated="right"
                            onClick = {()=>{
                                closeModal("Create");
                            }}
                        />
                        <Button
                            type="submit"
                            disabled={isValid}
                            content="Submit"
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
    );
}
