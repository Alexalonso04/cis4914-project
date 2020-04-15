import React from "react";
import { withFirebase } from '../components/Firebase';
import { AuthUserContext, withAuthorization } from '../components/Session';

import { Container, Grid, Form, Button } from "semantic-ui-react";
import { genderOptions, levelOptions } from "../util/options";
import SemanticDatepicker from 'react-semantic-ui-datepickers';
import { onlyNumericValues} from "../util/validators";


class EditEventForm extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			id: this.props.event.eventID,
			name: this.props.event.name,
			level: this.props.event.minimumLevel,
			allowedUsers: this.props.event.allowedUsers,
			notAllowedUsers: this.props.event.notAllowedUsers,
			description: this.props.event.description,
			date: this.props.event.eventDate,
			code: this.props.event.passcode
		};
		console.log(this.props.event);
	}

	onChange = async (event, { name, value }) => {
		this.setState({
			...this.state.values,
			[name]: value
		});
	};

	onSubmit = async (event) => {
		const {
			id,
			name,
			level,
			allowedUsers,
			notAllowedUsers,
			description,
			date,
			code
		} = this.state;

		const {organization, updateEvents, closeModal, firebase} = this.props;
		const eventAdded = await firebase.updateEvent(
			organization,
			id,
			name,
			level,
			allowedUsers,
			notAllowedUsers,
			description,
			date,
			code
			);
		if (!eventAdded) {
			alert("Event could not be updated");
			return;
		}
		updateEvents();
		closeModal();
		
	}

	render() {
		const {
			name,
			level,
			allowedUsers,
			notAllowedUsers,
			description,
			date,
			code
		} = this.state;

		const {closeModal} = this.props;
		
		return (
			<Grid>
				<Grid.Row>
					<Grid.Column>
							<Form
								onSubmit={this.onSubmit}
								size='large'
							>
								<Form.Group widths='equal'>
									<Form.Input
										fluid
										label="Event Name"
										name="name"
										type="text"
										width={12}
										maxLength="25"
										value={name}
										onChange={this.onChange}
									/>
									<Form.Field
										content={
											<SemanticDatepicker 
												name="date" 
												label="Start Date"
												placeholder={date}
												onChange={(param, data) => {
													/* Convert the date object to a string. Locale means that the format of the string will
													 * be in accordance to the region using the application.
													 * For the use it will be MM/DD/YYYY
													 */
													try {
														const tempData = {
															name: data.name,
															value: data.value.toLocaleDateString()
														}
														this.onChange(param, tempData);
													}
													catch (e) {
														const tempData = {
															name: data.name,
															value: ''
														}
														this.onChange(param, tempData);
													}
													}
												}
											/>
										}
									/>
								</Form.Group>
								<Form.Group>
									<Form.Select
										fluid
										label="Level"
										name="level"
										width={3}
										value={level}
										options={levelOptions}
										onChange={this.onChange}
									/>
									<Form.Input
										fluid
										label="Allowed Users"
										name="allowedUsers"
										type="text"
										width={8}
										value={allowedUsers}
										onChange={this.onChange}
									/>
									<Form.Input
										fluid
										label="Not Allowed Users"
										name="notAllowedUsers"
										type="text"
										width={8}
										value={notAllowedUsers}
										onChange={this.onChange}
									/>
								</Form.Group>
								<Form.Group widths='equal'>
									<Form.TextArea
										label="Description"
										name="description"
										type="text"
										width={8}
										value={description}
										onChange={this.onChange}
									/>
								</Form.Group>
								<Form.Group>
									<Form.Input
                            		    label="Event Code"
                            		    name="code"
                            		    type="text"
										value={code}
										width={5}
                            		    maxLength="5"
                            		    onChange={(param, data) => {
                            		        //only allow numeric values to be inputted
                            		        if (onlyNumericValues(data.value)) {
                            		            this.onChange(param, data);
                            		        }
                            		    }}
                            		/>
								</Form.Group>
								<Button
									content="Cancel"
									size='large'
									color="red"
									type='button'
									icon="cancel"
									labelPosition="left"
									floated="right"
									onClick={closeModal}
								/>
								<Button
									type="submit"
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
}

const condition = authUser => !!authUser;
export default withAuthorization(condition)(withFirebase(EditEventForm));
