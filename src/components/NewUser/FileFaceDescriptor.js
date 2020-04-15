import React, { Component } from 'react';
import Camera from 'react-html5-camera-photo';
import * as faceapi from 'face-api.js';
import * as canvas from 'canvas';
import { withFirebase } from '../Firebase';
import 'react-html5-camera-photo/build/css/index.css';
import { Divider, Grid, Header, Form, Button, Icon, Message, Dimmer, Loader } from 'semantic-ui-react';


var constructorImages = new Array();
var currentErrors = [];

class FileFaceDescriptor extends Component {

    constructor(props) {
        super(props);
        this.state = {
            images: [],
            loading: false,
            errors:[]
        }
    }

    onSubmit = async() => {
        this.setState({loading: true});
        var count = 0;
        const {images} = this.state;

        const {closeModal, updateUsers} = this.props.children;
        // const images = [
        //     document.getElementById('file0').files,
        //     document.getElementById('file1').files,
        //     document.getElementById('file2').files,
        //     document.getElementById('file3').files,
        //     document.getElementById('file4').files,
        // ];

        for (var i = 0; i< images.length; i++) {
            const response = await this.handlePhoto(images[i], i)
            if (response) {
                count++;
            }
            currentErrors.push(response);
        }

        if(count === 0) {
            currentErrors.push('You need to upload at least one valid picture');
            // this.setState({errors: currentErrors});
        }
        else {
            alert('Images processed correctly');
            closeModal();
            if (updateUsers !== undefined) {
                updateUsers();
            }
        }
        this.setState({loading: false});
        this.setState({errors: currentErrors});
    }

    handlePhoto = async (imgRaw, index) => {
        const image =  await faceapi.bufferToImage(imgRaw);
        const detection =  await faceapi.detectAllFaces(image).withFaceLandmarks().withFaceDescriptors();
        const {organization, userID} = this.props.children;
        const fb = this.props.firebase;

        if(detection.length === 0) {
            currentErrors.push("No face detected on the image " + imgRaw.name + " - " + index);
            return false;
        }
        if(detection.length > 1) {
            currentErrors.push("More than one face detected on the image " + imgRaw.name + " - " + index);
            return false;
        }
        await fb.insertDescriptor(organization,userID,detection[0].descriptor);
        return true;
    }

    

    render() {
        const isValid = (this.state.images.length === 5);
        const sucessful = (this.state.errors.length === 0);

        console.log(isValid + " " + sucessful);
        console.log(isValid && sucessful);
        Promise.all([
            faceapi.nets.faceRecognitionNet.loadFromUri('/models'),
            faceapi.nets.faceLandmark68Net.loadFromUri('/models'),
            faceapi.nets.ssdMobilenetv1.loadFromUri('/models'),
        ])

        const {loading} = this.state;
        //TAKEN FROM CHILDREN IN THE CONSTRUCTOR
        // const {organization, userID} = this.props.children;
        // // const organization = this.props.children.organization;
        // // const userID = this.props.children.userID;
        // const fb = this.props.firebase;

        return (
            // <div>
            //     <p>Select your files</p>
            //     <br/>
            //     <input type="file" id="file0" accept={"image/jpeg, image/png"}/>
            //     <input type="file" id="file1" accept={"image/jpeg, image/png"}/>
            //     <input type="file" id="file2" accept={"image/jpeg, image/png"}/>
            //     <input type="file" id="file3" accept={"image/jpeg, image/png"}/>
            //     <input type="file" id="file4" accept={"image/jpeg, image/png"}/>
            //     <br/>
            //     <p>You can upload up to 5 pictures.</p>
            //     <button onClick={()=> processPhotos()}>Process</button>
            // </div>

            <Grid
                centered
                container
            >
                <Grid.Row centered textAlign='center'>
                    <Grid.Column verticalAlign='middle' textAlign='left'>
                        <Header as='h1'>
                            <span><Icon name='file' size='large'/> </span>Upload Pictures
                        </Header>
                        <Divider/>

                        <Message
                            size='large'
                            positive
                            hidden={!(sucessful && isValid)}
                            content='Images processed sucessfully!'
                        />
                    </Grid.Column>
                </Grid.Row>
                <Grid.Row centered>
                    <Dimmer active={loading} inverted>
                        <Loader content='Analyzing Images. This might take a while...' size='huge'/>
                    </Dimmer>

                    <Form
                        onSubmit={this.onSubmit}
                    >
                        <Form.Input
                            type='file'
                            name='0'
                            multiple
                            accept={'image/jpeg, image/png'}
                            onChange={(param, data)=>{
                                // console.log(param.target.files);
                                constructorImages[data.name] = param.target.files[0];
                                this.setState({images: constructorImages});
                            }}
                        />
                        <Form.Input
                            type='file'
                            name='1'
                            accept={'image/jpeg, image/png'}
                            onChange={(param, data)=>{
                                constructorImages[1] = param.target.files[0];
                                this.setState({images: constructorImages});
                            }}
                        />
                        <Form.Input
                            type='file'
                            name='2'
                            accept={'image/jpeg, image/png'}
                            onChange={(param, data)=>{
                                constructorImages[2] = param.target.files[0];
                                this.setState({images: constructorImages});
                            }}
                        />
                        <Form.Input
                            type='file'
                            name='3'
                            accept={'image/jpeg, image/png'}
                            onChange={(param, data)=>{
                                constructorImages[3] = param.target.files[0];
                                this.setState({images: constructorImages});
                            }}
                        />
                        <Form.Input
                            type='file'
                            name='4'
                            accept={'image/jpeg, image/png'}
                            onChange={(param, data)=>{
                                constructorImages[4] = param.target.files[0];
                                this.setState({images: constructorImages});
                            }}
                        />
                        <Message
                            color='red'
                            hidden={(currentErrors.length === 0)}
                            header='Errors Encountered:'
                            list={currentErrors}
                        />                        
                        <Button
                            type='submit'
                            icon='upload'
                            labelPosition='right'
                            content='Upload'
                            primary
                            disabled={!isValid}
                        />                        
                    </Form>
                </Grid.Row>
            </Grid>
        );
    }
}
export default withFirebase(FileFaceDescriptor);