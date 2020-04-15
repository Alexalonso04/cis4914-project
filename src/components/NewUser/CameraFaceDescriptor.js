import React, { Component } from 'react';
import * as faceapi from 'face-api.js';
import { withFirebase } from '../Firebase';
import 'react-html5-camera-photo/build/css/index.css';
import Camera from 'react-html5-camera-photo';
import { Grid, Message, Icon, Label, Header, Loader, Dimmer, Divider, Button, Container } from 'semantic-ui-react';
//import Webcam from "react-webcam";
//

/*TODO
    - Finish formatting the sucess message
    - Rewrite the formatting of the modal in general to reduce wasted space
*/


class CameraFaceDescriptor extends Component {

    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            remainingPhotos: 5,
            errors:[]
        }
    }

    handleTakePhoto = async (dataUri) => {
        const {organization, userID} = this.props.children;
        var errors = [];
        this.setState({loading: true});
        if(this.state.remainingPhotos === 0) {
            return;
        }


        //LOAD WEBCAM CAPTURED IMAGE AND BUILD THE DESCRIPTOR SET
        let blob =  await fetch(dataUri).then(r => r.blob());    //Build Image
        const image =  await faceapi.bufferToImage(blob);
        const detection =  await faceapi.detectAllFaces(image).withFaceLandmarks().withFaceDescriptors();

        if(detection.length === 0) {
            errors.push("No face detected. Please try again.");
        }else if(detection.length > 1) {
            errors.push("Multiple faces detected. Please try again.");
        }

        //TAKEN FROM CHILDREN IN THE CONSTRUCTOR
        // const organization = this.props.children.organization;
        // const userID = this.props.children.userID;
        if (errors.length === 0){
            await this.props.firebase.insertDescriptor(organization,userID,detection[0].descriptor);
            this.setState({remainingPhotos:this.state.remainingPhotos-1});
        }
        this.setState({errors: errors});
        this.setState({loading: false});
    }

    onClick = async (event) => {
        const {closeModal, updateUsers} = this.props.children;
        closeModal();

        if (updateUsers !== undefined) {
            updateUsers();
        }
    }

    render() {
        const {remainingPhotos, loading, errors} = this.state;
        Promise.all([
            faceapi.nets.faceRecognitionNet.loadFromUri('/models'),
            faceapi.nets.faceLandmark68Net.loadFromUri('/models'),
            faceapi.nets.ssdMobilenetv1.loadFromUri('/models'),
        ])

        // if(remainingPhotos == 0) {
        //     completed=true;
        //     closeModal();
        //     if (updateUsers !== undefined) {
        //         updateUsers();
        //     }
        // }

        return (
            <Grid
                centered
                container
            >
                <Grid.Row centered textAlign='center'>
                    <Grid.Column verticalAlign='middle' textAlign='left'>
                        <Header as='h1'>
                            <span><Icon name='camera' size='large'/> </span>Take Pictures
                        </Header>
                        <Divider/>
                        <Message
                            color='red'
                            hidden={errors.length === 0}
                            header='Processing Error'
                            list={errors}
                        />
                        {remainingPhotos === 0 
                        ?('')
                        :(
                            <Container textAlign='center'>
                                <Label color='blue' size='huge' icon ='picture' detail='Pictures Remaining' content={remainingPhotos}/>
                            </Container>
                        )}
                    </Grid.Column>
                </Grid.Row>
                <Grid.Row centered>
                    <Grid.Column stretched>
                        <Dimmer active={loading}>
                            <Loader content='Processing Image...' size='huge'/>
                        </Dimmer>
                            <Camera
                                onTakePhoto = { (dataUri) => { this.handleTakePhoto(dataUri); } }
                                isSilentMode = {true}
                            />
                            <Message
                                size='mini'
                                positive
                                hidden={remainingPhotos !== 0}
                            >
                                <Container>
                                    <Grid>
                                        <Grid.Row>
                                            <Grid.Column verticalAlign='middle'>
                                                <Header as='h2'>Completed!</Header>
                                                <Button
                                                    positive
                                                    floated='right'
                                                    size='large'
                                                    content='Done'
                                                    onClick={this.onClick}
                                                />
                                           </Grid.Column>
                                        </Grid.Row>
                                    </Grid>
                                </Container>
                            </Message>
                    </Grid.Column>
                </Grid.Row>
            </Grid>
            // <div>
            //     <WebcamCapture/>
            //     <p>Remaining Photos: {this.state.remainingPhotos}</p>
            // </div>
        );
    }
}
export default withFirebase(CameraFaceDescriptor);