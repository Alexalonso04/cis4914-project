import React, { useState } from "react";

import {Container, Grid, Header, Divider, Label} from 'semantic-ui-react';

export default function ViewEvent ({event}) {
    console.log(event);
    const {eventDate: date, description, name, passcode, eventID: id} = event;

    return (
        <>
        <Container textAlign='right'>
            <Grid>
                <Grid.Row columns={2}>
                    <Grid.Column width={3} textAlign='left' floated='left'>
                        <Header as='h2' content={name}/>
                    </Grid.Column>
                    <Grid.Column width={12} floated='right' textAlign='right'>
                        <Label icon='hashtag' color='blue' size='large' content={passcode}/>
                        <Label icon='calendar' color='blue' size='large' content={date}/>
                    </Grid.Column>
                </Grid.Row>
            </Grid>
            <Divider/>
            {/* <div>
            <p>  <b>Starts on: </b>  {date}</p>
            <p>Level</p>
            </div> */}
        </Container>
        <Container>
            <b>Description</b>
            <p>{description}</p>
        </Container>
        <Container>
            <Grid>
                <Grid.Row>
                    <Grid.Column floated='right' textAlign='right'>
                        <Label icon='keyboard'  color='blue' size='large' content={id}/>
                    </Grid.Column>
                </Grid.Row>
            </Grid>
        </Container>
        </>
    );
};