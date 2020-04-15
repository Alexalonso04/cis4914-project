import React, { useState } from "react";
import { Button, Icon, Card, Modal, Grid} from "semantic-ui-react";
import EditEventForm from "../UIComponents/EditEventForm";
import ViewEvent from '../UIComponents/ViewEvent';


export default function EventCard({ event, organization, activateEvent, updateEvents, stopEvent, deleteEvent, openModal}) {
    console.log("Card Rendered");
    const attendance = (
        <p>
            <Icon name="user" />
            {/*{event.attendance}/{event.totalCount} Attendees*/}
        </p>
    );

    // const editEventModal = (
    //     <Modal
    //         onClose={() =>{ closeModal("Create")}}
    //         open={viewEditEventForm}
    //         size='tiny'
    //         closeOnEscape={true}
    //         closeOnDimmerClick={false}
    //     >
    //         <Modal.Header as="h1">Edit Event</Modal.Header>
    //         <Modal.Content>
    //             <EditEventForm
    //                 event={event}
    //                 organization={organization}
    //                 updateEvents={updateEvents}
    //                 closeModal={closeModal}
    //             />
    //         </Modal.Content>
    //     </Modal>
    // );

    // const eventModal = (
    //     <Modal
    //         open={viewEventModal}
    //         onClose={()=> this.closeModal("view")}
    //         size='tiny'
    //         closeOnEscape={true}
    //         closeOnDimmerClick={true}
    //     >
    //         <Modal.Header as='h1' content='Event Detail View'/>
    //         <Modal.Content>
    //             <ViewEvent event={event} />
    //         </Modal.Content>
    //         <Modal.Actions>
    //             <Grid>
    //                 <Grid.Row>
    //                     <Grid.Column>
    //                         <Button 
    //                             content='Close'
    //                             color='grey'
    //                             size='large'
    //                             floated='left'
    //                             onClick={()=>this.closeModal("View")}
    //                         />
    //                         <Button 
    //                             icon='edit'
    //                             labelPosition='left'
    //                             content='Edit'
    //                             size='large'
    //                             floated='right'
    //                             positive
    //                             onClick={()=>{
    //                                 this.openModal("Edit");
    //                                 this.closeModal("View");
    //                             }}
    //                         />
    //                     </Grid.Column>
    //                 </Grid.Row>
    //             </Grid>                
    //         </Modal.Actions>
    //     </Modal>
    // );

    return (
        <>
            <Card fluid raised>
                <Card.Content>
                <Button
                    stackable='true'
                    color={(event.active ? "red" : "blue")}
                    icon={(event.active ? "stop" : "play")}
                    onClick={() => {
                        event.active
                            ? (stopEvent(organization,event.eventID))
                            : (activateEvent(organization, event.eventID));
                        updateEvents();
                    }}
                    size="medium"
                    floated="right"
                    />
                    <Card.Header>{event.name}</Card.Header>
                    <Card.Meta>Created on {event.eventDate} </Card.Meta>
                    <Card.Description> {event.description} </Card.Description>
                    {/* <i className="trash icon" style={{'margin-left':'90%', 'cursor':'pointer'}}
                        onClick={()=>{
                            deleteEvent(organization,event.eventID);
                            updateEvents();
                        }}
                    /> */}
                </Card.Content>
                <Card.Content 
                    extra 
                    textAlign='center'
                >
                    <div className='ui two buttons'>
                      <Button  
                        color='blue'
                        content='View'
                        icon='eye'
                        labelPosition='left'
                        onClick={openModal}
                    />
                      <Button 
                        color='red'
                        content='Delete'
                        icon='trash'
                        labelPosition='left'
                        onClick={()=>{
                            deleteEvent(organization,event.eventID);
                            updateEvents();
                        }}
                        />
                    </div>
                </Card.Content>
                {/*<Card.Content extra>{attendance}</Card.Content>*/}
            </Card>
            {/* {editEventModal}
            {eventModal} */}
        </>
    );
}
