import React, { Component } from 'react';
//import Camera from 'react-html5-camera-photo';
import * as faceapi from 'face-api.js';
import * as canvas from 'canvas';
import { withFirebase } from '../Firebase';
//import 'react-html5-camera-photo/build/css/index.css';

import Webcam from "react-webcam";
//
class Face_Recognition extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        //INPUTS FROM CHILDREN IN THE CONSTRUCTOR
        const organization = this.props.children.organization;
        const eventID = this.props.children.event;

        //INSTANCE OF FIREBASE
        const fb = this.props.firebase;

        /**
         * @param userID
         * @returns {Promise<null|LabeledFaceDescriptors>}
         * LOADS USER DESCRIPTORS FORM DATABASE AND CREATE LABELEDFACEDESCRIPTOR
         * INSTANCE. INSTANCE USED TO COMPARE USER IMAGE
         */
        async function loadUserDescriptor(userID) {
            let descriptionSet = await fb.getDescriptors(organization,userID);
            if(descriptionSet.length == 0) { return null; }
            return new faceapi.LabeledFaceDescriptors(userID, descriptionSet);
        }

        /**
         * @param dataUri: TAKEN IMAGE DATA
         * @returns {Promise<void>}
         * VERIFIES IF THE IMAGE IS VALID AND GET USER INFORMATION
         */
        async function handleTakePhoto (dataUri) {

            //LOAD WEBCAM CAPTURED IMAGE AND BUILD THE DESCRIPTOR SET
            let blob =  await fetch(dataUri).then(r => r.blob());    //Build Image
            const image =  await faceapi.bufferToImage(blob);
            const detection =  await faceapi.detectAllFaces(image).withFaceLandmarks().withFaceDescriptors();
            if(detection.length === 0) {
                alert("No face detected. Please try again.");
                return;
            }

            if(detection.length > 1) {
                alert("Multiple faces detected. Please try again.");
                return;
            }

            //CHECK IF ELEMENT ID WAS ENTERED
            const userID = document.getElementById("userId").value;
            if(userID == '') {
                alert("No user ID detected. Process will take longer to detect user");
                await handleTakePhotoNoUserID(image, detection);
                return;
            }

            //GET USER INFO, EVENT INFO AND VERIFY IF IT IS ALLOWED
            const userInfo = await fb.getUserInformation(organization,userID);
            if(userInfo == null) {
                alert("Invalid user id");
                return;
            }

            const eventInfo = await fb.getEventInformation(organization,eventID);
            if(eventInfo.notAllowedUsers.includes(userID)) {
                alert('USER NOT ALLOWED');
                return
            }
            if(eventInfo.minimumLevel > userInfo.level && !eventInfo.allowedUsers.includes(userID)) {
                alert('USER NOT ALLOWED');
                return
            }

            //LOAD DESCRIPTOR SET AND VERIFY IF IT IS VALID
            const descriptorSet =  await (loadUserDescriptor(userID));
            if(descriptorSet == null || descriptorSet.length == 0) {
                alert("Unable to process. Invalid user ID or user has no face descriptors stored");
                return;
            }

            //CREATE THE FACE MATCHER AND MATH THE DESCRIPTORS
            const faceMatcher = await new faceapi.FaceMatcher(descriptorSet, 0.6);
            const displaySize = { width: image.width, height: image.height };
            const resizedDetections = await faceapi.resizeResults(detection, displaySize);
            const results = resizedDetections.map(d => faceMatcher.findBestMatch(d.descriptor));

            // RECOGNIZE AGE AND GENDER
            const detectionsWithAgeAndGender =  await faceapi.detectAllFaces(image).withAgeAndGender()

            //#region MANAGE RESULT
            const faceAccuracy = (1 - results[0].distance)*100;
            const ageAccuracy = Math.abs(userInfo.age-detectionsWithAgeAndGender[0].age);
            const sexDetection = (detectionsWithAgeAndGender[0].gender == userInfo.sex);

            await evaluateResult(faceAccuracy,ageAccuracy,sexDetection,userID,userInfo);

        }

        async function handleTakePhotoNoUserID(image, detection) {

            //GET ALL USERS DESCRIPTORS
            const usersDescriptors = await fb.getAllUsersDescriptions(organization);
            var bestValue = 0;
            var index = -1;

            var bestFaceAccuracy =0;
            var bestAgeAccuracy =0;
            var bestSexDetection =0;

            for (var i =0; i < usersDescriptors.length; i++) {
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

            if(index < 0) {
                alert('Unable to locate user.');
                return;
            }

            const userID = usersDescriptors[index].userID;

            //GET USER INFO, EVENT INFO AND VERIFY IF IT IS ALLOWED
            const userInfo = usersDescriptors[index].userInfo;

            const eventInfo = await fb.getEventInformation(organization,eventID);
            if(eventInfo.notAllowedUsers.includes(userID)) {
                alert('USER NOT ALLOWED');
                return
            }
            if(eventInfo.minimumLevel > userInfo.level && !eventInfo.allowedUsers.includes(userID)) {
                alert('USER NOT ALLOWED');
                return
            }

            await evaluateResult(bestFaceAccuracy,bestAgeAccuracy,bestSexDetection,userID,userInfo);

        }

        async function evaluateResult (faceAccuracy, ageAccuracy, sexDetection, userID, userInfo) {

            console.log('FACE ACCURACY: '+faceAccuracy+' %')
            console.log('AGE DIFFERENCE: '+ageAccuracy+' years')
            console.log('SEX DETECTED: '+sexDetection)

            var result = '';

            if(ageAccuracy < 7 && sexDetection) {
                if(faceAccuracy > 55) {
                    console.log('AUTHENTICATION CORRECT')
                    result = 'AUTHENTICATION CORRECT';
                }
                else if (faceAccuracy > 50) {
                    console.log('PLEASE TRY AGAIN')
                    result = 'PLEASE TRY AGAIN';
                }
                else {
                    console.log('AUTHENTICATION FAILED')
                    result = 'AUTHENTICATION FAILED';
                }
            }
            else {
                console.log('AUTHENTICATION FAILED')
                result = 'AUTHENTICATION FAILED';
            }
            document.getElementById("ResultText").innerHTML = 'RESULT: '+result;
            //#endregion

            if(result != 'AUTHENTICATION CORRECT') {
                console.log('NO RECORDING ATTENDANCE');
                return;
            }

            const respAttendance = await fb.markUserAttendance(organization,eventID,userID);
            console.log(respAttendance);
            if(respAttendance != null) {
                alert('User '+userInfo.firstName+' '+userInfo.lastName+' '+
                    'was registered already at '+ new Date(respAttendance).toLocaleString());
            }
        }

        const videoConstraints = {
            width: 640,
            height: 480,
            facingMode: "user"
        };

        const WebcamCapture = () => {
            const webcamRef = React.useRef(null);

            const capture = React.useCallback(
                () => {
                    const imageSrc = webcamRef.current.getScreenshot();
                    handleTakePhoto(imageSrc);
                },
                [webcamRef]
            );

            return (
                <>
                    <Webcam
                        audio={false}
                        height={720}
                        ref={webcamRef}
                        screenshotFormat="image/jpeg"
                        width={1280}
                        videoConstraints={videoConstraints}
                    />
                    <button onClick={capture}>Capture photo</button>
                </>
            );
        };



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
            <div id={'MainControl'}>
                <WebcamCapture/>
                <div style={{marginLeft:"50%"}}>
                    <div>
                        <p>User ID</p>
                        <input accept={'text'} id={'userId'} />
                    </div>
                    <p id={'ResultText'}>RESULT:</p>
                </div>
            </div>
        );
    }
}
export default withFirebase(Face_Recognition);