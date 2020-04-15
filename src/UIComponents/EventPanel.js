import React, { useState } from "react";
import {
    Grid,
    Container,
    Button,
    Divider,
    Header,
    Card,
    Modal,
    Dimmer,
    Loader,
    Segment,
    Icon
} from "semantic-ui-react";

import EventCard from "../UIComponents/EventCard";
import CreateEventForm from "../UIComponents/CreateEventForm";
import ViewEvent from '../UIComponents/ViewEvent';
import EditEventForm from "../UIComponents/EditEventForm";

export default function EventPanel({organization, events, addEvent, updateEvents, activateEvent, stopEvent, deleteEvent}) {
    const [viewEditEventForm, setViewEditEventForm] = useState(false);
    const [viewEventModal, setViewEventModal] = useState(false);
    const [viewCreateEventForm, setViewCreateEventForm] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState({});

    const activeEvents = [];
    const inactiveEvents = [];

    if(events) {
        events.forEach(event => {
            if (event.active){
                activeEvents.push(event);
            }else {
                inactiveEvents.push(event);}
        });
    }

    const closeModal = (name) => {
        switch(name) {
            case "View":
                setViewEventModal(false);
                break;
            case "Edit":
                setViewEditEventForm(false);
                break;   
            case "Create":
                setViewCreateEventForm(false);
                break;                
        }
    }

    const openModal = (name, data) => {
        switch(name) {
            case "View":
                setSelectedEvent(data);
                setViewEventModal(true);
                break;
            case "Edit":
                setSelectedEvent(data);
                setViewEditEventForm(true);
                break;   
            case "Create":
                setViewCreateEventForm(true);
                break;                
        }
    }


    const createEventModal = (
        <Modal
            onClose={() =>{ closeModal("Create")}}
            open={viewCreateEventForm}
            size='tiny'
            closeOnEscape={true}
            closeOnDimmerClick={false}
        >
            <Modal.Header as="h1">New Event</Modal.Header>
            <Modal.Content>
                <CreateEventForm
                    organization={organization}
                    addEvent={addEvent}
                    updateEvents={updateEvents}
                    closeModal = {() => {
                        closeModal("Create")}}
                />
            </Modal.Content>
        </Modal>
    );


    const editEventModal = (
        <Modal
            onClose={() =>{ closeModal("Edit")}}
            open={viewEditEventForm}
            size='tiny'
            closeOnEscape={true}
            closeOnDimmerClick={false}
        >
            <Modal.Header as="h1">Edit Event</Modal.Header>
            <Modal.Content>
                <EditEventForm
                    event={selectedEvent}
                    organization={organization}
                    updateEvents={updateEvents}
                    closeModal = {() => {
                        closeModal("Edit")}}
                />
            </Modal.Content>
        </Modal>
    );

    const eventModal = (
        <Modal
            open={viewEventModal}
            onClose={()=> closeModal("view")}
            size='tiny'
            closeOnEscape={true}
            closeOnDimmerClick={true}
        >
            <Modal.Header as='h1' content='Event Detail View'/>
            <Modal.Content>
                <ViewEvent event={selectedEvent} />
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
                                onClick={()=>closeModal("View")}
                            />
                            <Button 
                                icon='edit'
                                labelPosition='left'
                                content='Edit'
                                size='large'
                                floated='right'
                                positive
                                onClick={()=>{
                                    openModal("Edit", selectedEvent);
                                    closeModal("View");
                                }}
                            />
                        </Grid.Column>
                    </Grid.Row>
                </Grid>                
            </Modal.Actions>
        </Modal>
    );

    return (
        <>
        <Container>
            <Grid>
                <Grid.Row>
                     <Header as='h1'>Event Panel</Header>
                </Grid.Row>
                <Grid.Row>
                    <Grid.Column>
                        <Button
                            content="Add Event"
                            color='green'
                            icon="add"
                            labelPosition="left"
                            floated="right"
                            onClick={() => {
                                setViewCreateEventForm(true);
                            }}
                        />
                    </Grid.Column>
                </Grid.Row>
            </Grid>
        </Container>

            <Divider horizontal>
                <Header as="h2">Active Events</Header>
            </Divider>
            <Container>
                <Grid stackable>
                    <Grid.Row >
                        <Grid.Column>
                        <Dimmer inverted active={events.length === 0} >
                            <Loader content='Loading...' size='huge'/>
                        </Dimmer>
                       {activeEvents.length === 0 ?(
                        <Segment placeholder>
                            <Header icon>
                              <Icon name='calendar' size='large'/>
                              <p>There are currently no active events</p>
                            </Header>
                        </Segment>
                        )
                        :(
                        <Card.Group centered itemsPerRow={3}>
                            {activeEvents &&
                                activeEvents.map((event, index) => (
                                    <EventCard 
                                        event={event} 
                                        key={index}
                                        organization={organization} 
                                        updateEvents={updateEvents} 
                                        activateEvent = {activateEvent}
                                        stopEvent = {stopEvent}
                                        deleteEvent = {deleteEvent}
                                        openModal={()=>openModal("View", event)}
                                    />
                                ))}
                        </Card.Group>
                        )}
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            </Container>

            <Divider horizontal>
                <Header as="h2">Inactive Events</Header>
            </Divider>
            
            <Container>
                <Grid stackable>
                    <Grid.Row>
                        <Grid.Column>
                        <Dimmer active={events.length === 0} inverted>
                            <Loader content='Loading...' size='huge' />
                        </Dimmer>
                        {inactiveEvents.length === 0 ?(
                        <Segment placeholder>
                            <Header icon>
                              <Icon name='calendar' size='large'/>
                              <p>There are currently no active events</p>
                            </Header>
                        </Segment>
                        )
                        :(<Card.Group centered itemsPerRow={3}>
                            {inactiveEvents &&
                                inactiveEvents.map((event, index) => (
                                    <EventCard 
                                        event={event} 
                                        key={index} 
                                        organization={organization} 
                                        updateEvents={updateEvents} 
                                        activateEvent = {activateEvent}
                                        deleteEvent = {deleteEvent}
                                        openModal={()=>openModal("View", event)}
                                    />
                                ))
                            }
                        </Card.Group>
                        )}
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            </Container>
            
            
            {createEventModal}
            {editEventModal}
            {eventModal}
        </>
    );
}
