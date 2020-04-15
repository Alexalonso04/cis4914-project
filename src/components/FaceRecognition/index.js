import React, { Component } from 'react';
import Camera from 'react-html5-camera-photo';
import * as faceapi from 'face-api.js';
import * as canvas from 'canvas';
import { withFirebase } from '../Firebase';
import 'react-html5-camera-photo/build/css/index.css';
import {Input, Button, Segment, Loader, Dimmer, Message} from 'semantic-ui-react';

//
class Face_Recognition extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading:false,
            feedbackHide: true,
            feedbackColor: '',
            feedbackHeader: ''
        }
    }

    stopLoading = async () => {
        this.setState({loading:false});
    }

    hideFeedback = () => {
        this.setState({feedbackHide: true})
    }

    showFeedback = async (result) => {
        if(result === 'AUTHENTICATION CORRECT') {
            this.setState({
                feedbackHide: false,
                feedbackColor: 'green',
                feedbackHeader: 'Authentication succeed'
            });
        }
        else if (result === 'AUTHENTICATION FAILED') {
            this.setState({
                feedbackHide: false,
                feedbackColor: 'red',
                feedbackHeader: 'Authentication failed'
            });
        }
        else if (result.includes("ALERT")) {
            this.setState({
                feedbackHide: false,
                feedbackColor: 'yellow',
                feedbackHeader: result
            });
        }
        else if (result.includes("ERROR")) {
            this.setState({
                feedbackHide: false,
                feedbackColor: 'red',
                feedbackHeader: result
            });
        }
        else if (result === 'PLEASE TRY AGAIN'){
            this.setState({
                feedbackHide: false,
                feedbackColor: 'yellow',
                feedbackHeader: 'Please try again'
            });
        }
        else {
            this.setState({
                feedbackHide: false,
                feedbackColor: 'yellow',
                feedbackHeader: result
            });
        }
        var self = this;
        setInterval(function () {
            self.hideFeedback();
        }, 5000)

    }

    render() {
        //INPUTS FROM CHILDREN IN THE CONSTRUCTOR
        const organization = this.props.children.organization;
        const eventID = this.props.children.event;
        const stopLoadingFunction = this.stopLoading;
        const showFeedback = this.showFeedback;

        //INSTANCE OF FIREBASE
        const fb = this.props.firebase;

        /**
         * @param userID
         * @returns {Promise<null|LabeledFaceDescriptors>}
         * LOADS USER DESCRIPTORS FORM DATABASE AND CREATE LABELEDFACEDESCRIPTOR
         * INSTANCE. INSTANCE USED TO COMPARE USER IMAGE
         */
        async function loadUserDescriptor(userID) {
            let descriptionSet = await fb.getDescriptors(organization, userID);
            if (descriptionSet.length == 0) {
                return null;
            }
            return new faceapi.LabeledFaceDescriptors(userID, descriptionSet);
        }

        /**
         * @param dataUri: TAKEN IMAGE DATA
         * @returns {Promise<void>}
         * VERIFIES IF THE IMAGE IS VALID AND GET USER INFORMATION
         */
        async function handleTakePhoto(dataUri) {

            //LOAD WEBCAM CAPTURED IMAGE AND BUILD THE DESCRIPTOR SET
            let blob = await fetch(dataUri).then(r => r.blob());    //Build Image
            const image = await faceapi.bufferToImage(blob);
            const detection = await faceapi.detectAllFaces(image).withFaceLandmarks().withFaceDescriptors();
            if (detection.length === 0) {
                showFeedback("ERROR. No face detected. Please try again.")
                stopLoadingFunction();
                return;
            }

            if (detection.length > 1) {
                showFeedback("ERROR. Multiple faces detected. Please try again.")
                stopLoadingFunction();
                return;
            }

            //CHECK IF ELEMENT ID WAS ENTERED
            const userID = document.getElementById("userId").value;
            if (userID == '') {
                showFeedback("ALERT. No user ID detected. Process will take longer to detect user")
                await handleTakePhotoNoUserID(image, detection);
                stopLoadingFunction();
                return;
            }

            //GET USER INFO, EVENT INFO AND VERIFY IF IT IS ALLOWED
            const userInfo = await fb.getUserInformation(organization, userID);
            if (userInfo == null) {
                showFeedback("ERROR. Invalid user id")
                stopLoadingFunction();
                return;
            }

            const eventInfo = await fb.getEventInformation(organization, eventID);
            if (eventInfo.notAllowedUsers.includes(userID)) {
                showFeedback("ERROR. User not allowed")
                stopLoadingFunction();
                return
            }
            if (eventInfo.minimumLevel > userInfo.level && !eventInfo.allowedUsers.includes(userID)) {
                showFeedback("ERROR. User not allowed")
                stopLoadingFunction();
                return
            }

            //LOAD DESCRIPTOR SET AND VERIFY IF IT IS VALID
            const descriptorSet = await (loadUserDescriptor(userID));
            if (descriptorSet == null || descriptorSet.length == 0) {
                showFeedback("ERROR. Unable to process. Invalid user ID or user has no face descriptors stored")
                stopLoadingFunction();
                return;
            }

            //CREATE THE FACE MATCHER AND MATH THE DESCRIPTORS
            const faceMatcher = await new faceapi.FaceMatcher(descriptorSet, 0.6);
            const displaySize = {width: image.width, height: image.height};
            const resizedDetections = await faceapi.resizeResults(detection, displaySize);
            const results = resizedDetections.map(d => faceMatcher.findBestMatch(d.descriptor));

            // RECOGNIZE AGE AND GENDER
            const detectionsWithAgeAndGender = await faceapi.detectAllFaces(image).withAgeAndGender()

            //#region MANAGE RESULT
            const faceAccuracy = (1 - results[0].distance) * 100;
            const ageAccuracy = Math.abs(userInfo.age - detectionsWithAgeAndGender[0].age);
            const sexDetection = (detectionsWithAgeAndGender[0].gender == userInfo.sex);

            await evaluateResult(faceAccuracy, ageAccuracy, sexDetection, userID, userInfo);
            stopLoadingFunction();
        }

        async function handleTakePhotoNoUserID(image, detection) {

            //GET ALL USERS DESCRIPTORS
            const usersDescriptors = await fb.getAllUsersDescriptions(organization);
            var bestValue = 0;
            var index = -1;

            var bestFaceAccuracy = 0;
            var bestAgeAccuracy = 0;
            var bestSexDetection = 0;

            for (var i = 0; i < usersDescriptors.length; i++) {
                const current = usersDescriptors[i];
                if (current.descriptors === null || current.descriptors.length <= 0) {
                    continue;
                }
                const descriptorSet = new faceapi.LabeledFaceDescriptors(current.userID, current.descriptors);

                //CREATE THE FACE MATCHER AND MATH THE DESCRIPTORS
                const faceMatcher = await new faceapi.FaceMatcher(descriptorSet, 0.6);
                const displaySize = {width: image.width, height: image.height};
                const resizedDetections = await faceapi.resizeResults(detection, displaySize);
                const results = resizedDetections.map(d => faceMatcher.findBestMatch(d.descriptor));
                // RECOGNIZE AGE AND GENDER
                const detectionsWithAgeAndGender = await faceapi.detectAllFaces(image).withAgeAndGender();

                const faceAccuracy = (1 - results[0].distance) * 100;
                const ageAccuracy = Math.abs(current.userInfo.age - detectionsWithAgeAndGender[0].age);
                const sexDetection = (detectionsWithAgeAndGender[0].gender == current.userInfo.sex);

                if (faceAccuracy > bestFaceAccuracy) {
                    bestFaceAccuracy = faceAccuracy;
                    bestAgeAccuracy = ageAccuracy;
                    bestSexDetection = sexDetection;
                    index = i;
                }
            }

            if (index < 0) {
                showFeedback("ERROR. Unable to locate user.")
                stopLoadingFunction();
                return;
            }

            const userID = usersDescriptors[index].userID;

            //GET USER INFO, EVENT INFO AND VERIFY IF IT IS ALLOWED
            const userInfo = usersDescriptors[index].userInfo;

            const eventInfo = await fb.getEventInformation(organization, eventID);
            if (eventInfo.notAllowedUsers.includes(userID)) {
                showFeedback("ERROR. User not allowed")
                stopLoadingFunction();
                return
            }
            if (eventInfo.minimumLevel > userInfo.level && !eventInfo.allowedUsers.includes(userID)) {
                showFeedback("ERROR. User not allowed")
                stopLoadingFunction();
                return
            }

            await evaluateResult(bestFaceAccuracy, bestAgeAccuracy, bestSexDetection, userID, userInfo);
            stopLoadingFunction();
        }

        async function evaluateResult(faceAccuracy, ageAccuracy, sexDetection, userID, userInfo) {

            //console.log('FACE ACCURACY: ' + faceAccuracy + ' %')
            //console.log('AGE DIFFERENCE: ' + ageAccuracy + ' years')
            //console.log('SEX DETECTED: ' + sexDetection)

            var result = '';

            if (ageAccuracy < 7 && sexDetection) {
                if (faceAccuracy > 55) {
                    //console.log('AUTHENTICATION CORRECT')
                    result = 'AUTHENTICATION CORRECT';
                } else if (faceAccuracy > 50) {
                    //console.log('PLEASE TRY AGAIN')
                    result = 'PLEASE TRY AGAIN';
                } else {
                    //console.log('AUTHENTICATION FAILED')
                    result = 'AUTHENTICATION FAILED';
                }
            } else {
                //console.log('AUTHENTICATION FAILED')
                result = 'AUTHENTICATION FAILED';
            }
            //document.getElementById("ResultText").innerHTML = 'RESULT: ' + result;
            //#endregion

            if (result != 'AUTHENTICATION CORRECT') {
                //console.log('NO RECORDING ATTENDANCE');
                showFeedback(result);
                stopLoadingFunction();
                return;
            }

            const respAttendance = await fb.markUserAttendance(organization, eventID, userID);
            //console.log(respAttendance);
            if (respAttendance != null) {
                result = 'User '+userInfo.firstName+' '+userInfo.lastName+' already authenticated at '+new Date(respAttendance).toLocaleString()

            }
            showFeedback(result);
        }

        /**
         * LOADS ALL MODULES FO THE FACEAPI
         */
        Promise.all([
            faceapi.nets.faceRecognitionNet.loadFromUri('/models'),
            faceapi.nets.faceLandmark68Net.loadFromUri('/models'),
            faceapi.nets.ssdMobilenetv1.loadFromUri('/models'),
            faceapi.nets.ageGenderNet.loadFromUri('/models'),

            faceapi.nets.tinyFaceDetector.loadFromUri('/models'),
            faceapi.nets.faceLandmark68TinyNet.loadFromUri('/models'),
        ])

        return (
            <>
                <div className="ui two column centered grid">
                    <div>
                        <Message
                            color={this.state.feedbackColor}
                            hidden={this.state.feedbackHide}
                            header={this.state.feedbackHeader}
                        />
                    </div>
                    <div  class="ui segment">
                        <Dimmer active={this.state.loading}>
                            <Loader content='Processing Image...' size='huge'/>
                        </Dimmer>
                        <Camera
                            onTakePhoto={(dataUri) => {
                                this.setState({loading:true});
                                handleTakePhoto(dataUri);

                            }}
                            isSilentMode = {true}
                        />
                    </div>
                    <div className="four column centered row">
                        <div className="column">
                            <img/>
                        </div>
                        <div className="column">
                            <div className="ui left icon input">
                                <input type="text" placeholder="User ID" id={'userId'}/>
                                    <i className="address card outline icon"></i>
                            </div>
                        </div>
                        <div className="column">
                            <img/>
                        </div>
                    </div>
                </div>


                {/* <div className="ui three stackable cards">
                    <div className="card huge">
                        <div className="image">
                            <Camera
                                onTakePhoto={(dataUri) => {
                                    handleTakePhoto(dataUri);
                                }}
                            />
                        </div>
                    </div>
                    <div>
                        <p>User ID</p>
                        <input accept={'text'} id={'userId'}/>
                    </div>
                </div> */}
            </>
        );
    }
}
export default withFirebase(Face_Recognition);