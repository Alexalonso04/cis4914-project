import app from 'firebase/app'
import 'firebase/auth';
import 'firebase/database';
import 'firebase/storage';
import image from "react-firebase-file-uploader/lib/utils/image";

const config = {
    apiKey: "AIzaSyCz5H3RlwJowAPSAXi9Lvcc2oyPmLBeuIg",
    authDomain: "cis4914-40936.firebaseapp.com",
    databaseURL: "https://cis4914-40936.firebaseio.com",
    projectId: "cis4914-40936",
    storageBucket: "cis4914-40936.appspot.com",
    messagingSenderId: "178831665685",
    appId: "1:178831665685:web:3ba1a1b03cdd45c57afc1c",
    measurementId: "G-FYCFPK2QDN"
  };

  class Firebase {
      //Comment
      constructor() {
          app.initializeApp(config);
          this.auth = app.auth();
          this.db = app.database();
      }

      //#region AUTH

      doCreateUserWithEmailAndPassword = (email, password) =>
          this.auth.createUserWithEmailAndPassword(email, password);

      doSignInWithEmailAndPassword = (email, password) =>
          this.auth.signInWithEmailAndPassword(email, password);

      doSignOut = () => this.auth.signOut();

      doPasswordReset = email => this.auth.sendPasswordResetEmail(email);

      doPasswordUpdate = password =>
          this.auth.currentUser.updatePassword(password);

      doDeleteUser = () => {
          var user = this.auth.currentUser;
          console.log(user);
          this.auth.signOut();

          user.delete().then(function () {
              console.log("User deleted.");
          }).catch(function (error) {
              console.log("Error deleting user.")
          });
      };

      //endregion

      //#region DATA

      /**
       * @param path
       * @param filter: If filter is passed only fields in the filter will be returned
       * @returns {Promise<[]>}: array with data
       */
      getElementsInPath = async (path, filter = null) => {
          var data = [];
          var ref = this.db.ref(path);
          var snapshot = await ref.once('value');

          if(filter != null) {
              snapshot.forEach(s => {
                  if(filter.includes(s.key)) {
                      data.push({
                          uid: s.key,
                          value: s.val()
                      })
                  }
              });
          }
          else {
              snapshot.forEach(function (childSnapshot) {
                  data.push({
                      uid: childSnapshot.key,
                      value: childSnapshot.val()
                  });
              });
          }
          return data;
      }

      //#region IMAGES

      getImages(organization, userID) {

          var data = [];
          var listRef = app.storage().ref().child('images/' + organization + '/' + userID + '/');

          // Find all the prefixes and items.
          listRef.listAll().then(function (res) {
              res.items.forEach(function (itemRef) {
                  // All the items under listRef.
                  data.push(itemRef.getDownloadURL());

              });
          }).catch(function (error) {
              console.log("Unable to load image set");
          });
          return data;
      }

      uploadImage(organization, userID, imageBlob) {
          var storageRef = app.storage().ref();
          // File or Blob named mountains.jpg
          var file = imageBlob;
          var metadata = {
              contentType: 'image/jpeg'
          };
          // Upload file and metadata to the object 'images/mountains.jpg'
          let fileName = Date.now() + '.jpeg';
          var uploadTask = storageRef.child('images/' + organization + '/' + userID + '/' + fileName).put(file, metadata);

          // Listen for state changes, errors, and completion of the upload.
          uploadTask.on(app.storage.TaskEvent.STATE_CHANGED, // or 'state_changed'
              function (snapshot) {
                  // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
                  var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                  console.log('Upload is ' + progress + '% done');
                  switch (snapshot.state) {
                      case app.storage.TaskState.PAUSED: // or 'paused'
                          console.log('Upload is paused');
                          break;
                      case app.storage.TaskState.RUNNING: // or 'running'
                          console.log('Upload is running');
                          break;
                  }
              }, function (error) {
                  // https://firebase.google.com/docs/storage/web/handle-errors
                  switch (error.code) {
                      case 'storage/unauthorized':
                          console.log("Error uploading: unauthorized ");
                          break;
                      case 'storage/canceled':
                          console.log("Error uploading: canceled ");
                          break;
                      case 'storage/unknown':
                          console.log("Error uploading: unknown");
                          break;
                  }
              }, function () {
                  uploadTask.snapshot.ref.getDownloadURL().then(function (downloadURL) {
                      console.log('File available at', downloadURL);
                  });
              });
      }

      //#endregion

      //#region USERS

      getAllUsersDescriptions = async (organization) => {
          const path = 'organizations/' + organization + '/users/';
          const tempElement = await this.getElementsInPath(path);
          var userDesciptors = [];
          for(var i=0; i < tempElement.length; i++) {
              const user = tempElement[i];
              const element = {
                  userID: user.uid,
                  userInfo: await this.getUserInformation(organization, user.uid),
                  descriptors: await this.getDescriptors(organization, user.uid)
              }
              userDesciptors.push(element);
          }
          return userDesciptors;
      }

      addUser = async (organization, userID, firstName, lastName, email, level, gender, age) => {
          const path = 'organizations/' + organization + '/users/' + userID +'/';
          if( await this.checkIfUserExist(organization,userID)) {
              return false;
          }
          else {
              await this.setUserDatabaseInformation(path, firstName, lastName, email, level, gender, age);
              return true;
          }
      }

      updateUser = async (organization, userID, firstName, lastName, email, level, gender, age) => {
          const path = 'organizations/' + organization + '/users/' + userID +'/';
          await this.setUserDatabaseInformation(path, firstName, lastName, email, level, gender, age);
          return true;

      }
      setUserDatabaseInformation = async (path, firstName, lastName, email, level, gender, age) => {
          await this.db.ref(path+'age').set(age);
          await this.db.ref(path+'email').set(email);
          await this.db.ref(path+'firstName').set(firstName);
          await this.db.ref(path+'lastName').set(lastName);
          await this.db.ref(path+'level').set(level);
          await this.db.ref(path+'sex').set(gender);
      }

      getUserInformation = async (organization, userID) => {
          const path = 'organizations/' + organization + '/users/' + userID + '/';
          var userInformation = {
              'email':'',
              'firstName':'',
              'lastName':'',
              'age':0,
              'level':0,
              'sex':''
          };
          const filter = ['email','firstName','lastName','age','level','sex'];
          const tempElement = await this.getElementsInPath(path, filter);
          if(tempElement == null || tempElement.length == 0) { return null; }
          userInformation.age = tempElement[0].value;
          userInformation.email = tempElement[1].value;
          userInformation.firstName = tempElement[2].value;
          userInformation.lastName = tempElement[3].value;
          userInformation.level = tempElement[4].value;
          userInformation.sex = tempElement[5].value;

          return userInformation;
      }

      markUserAttendance = async (organization, eventID, userID) => {
          const path = 'organizations/' + organization + '/events/' + eventID + '/usersAttended/';
          const tempElement = await this.getElementsInPath(path);
          var timeStampIfRegistered = null;
          for(var i = 0; i < tempElement.length; i++) {
              let u = tempElement[i];
              if(u.uid === userID) {
                  timeStampIfRegistered = u.value;
                  break;
              }
          }
          if(timeStampIfRegistered != null) {
              return timeStampIfRegistered;
          }
          else {
              this.db.ref(path+userID).set(Date.now());
          }
      }

      deleteUser = async (organization, userID) => {
          const path = 'organizations/' + organization + '/users/' + userID + '/';
          this.db.ref(path).remove();
      }

      getUsersPreview = async (organization) => {
          var userResults = [];
          const path = 'organizations/' + organization + '/users/';
          const tempElement = await this.getElementsInPath(path);

          for(var i=0; i < tempElement.length; i++) {
              var userInformation = {
                  'firstName':'',
                  'lastName':'',
                  'level':'',
                  'email':'',
                  'userID':'',
                  'age':'',
                  'sex':''
              };
              userInformation.firstName = tempElement[i].value.firstName;
              userInformation.lastName = tempElement[i].value.lastName;
              userInformation.level = tempElement[i].value.level;
              userInformation.email = tempElement[i].value.email;
              userInformation.userID = tempElement[i].uid;
              userInformation.age = tempElement[i].value.age;
              userInformation.sex = tempElement[i].value.sex;
              userResults.push(userInformation);
          }
          return userResults;
      }

      deleteUsersDescriptors = async (organization, userID) => {
          const path = 'organizations/' + organization + '/users/' + userID + '/descriptors/';
          this.db.ref(path).remove();
      }

      getDescriptorsAVG = async (descriptors) => {
          var avg = [];
          for(var i = 0; i < descriptors[0].length; i++) {
              var iAVG = 0;
              for(var j = 0; j < descriptors.length; j++) {
                  iAVG += descriptors[j][i];
              }
              iAVG /= descriptors.length;
              avg.push(iAVG);
          }
          return avg;
      }

      getDescriptors = async (organization, userID) => {
          const path = 'organizations/' + organization + '/users/' + userID + '/descriptors/';
          const tempDescriptors = await this.getElementsInPath(path);
          var descriptors = [];
          for (var i = 0; i < tempDescriptors.length; i++) {
              let d = tempDescriptors[i];
              descriptors.push(d.value.value);
          }

          if(descriptors.length === 0) {
              return descriptors;
          }

          descriptors = [Float32Array.from(await this.getDescriptorsAVG(descriptors))];
          return descriptors;
      };

      insertDescriptor = (organization, userID, descriptor) => {
          this.db.ref('organizations/' + organization + '/users/' + userID + '/descriptors/').push({
              date: Date.now(),
              value: descriptor,
          });
      };

      checkIfUserExist = async (organization, userID) => {
          const path = 'organizations/'+organization+'/users/';
          const tempElement = await this.getElementsInPath(path);
          var found = false;
          for(var i = 0; i < tempElement.length; i++) {
              if(tempElement[i].uid === userID) {
                  found = true;
                  break;
              }
          }
          return found;
      }

      getUserAttendaceReport = async (organization, eventID) => {
          const path = 'organizations/' + organization + '/events/' + eventID + '/usersAttended/';
          const tempElement = await this.getElementsInPath(path);
          return tempElement;
      }

      //#endregion

      //#region EVENTS

      addEvent = async (organization, eventID, eventName, minimumLevel, allowedusers, notAllowedUsers, description, eventDate, passcode) => {
          const path = 'organizations/' + organization + '/events/' + eventID +'/';
          if( await this.checkIfEventExist(organization,eventID)) {
              return false;
          }
          else {
              await this.setEventDatabaseInformation(path, eventName, minimumLevel, allowedusers, notAllowedUsers, description, eventDate, passcode);

              return true;
          }
      }

      updateEvent = async (organization, eventID, eventName, minimumLevel, allowedusers, notAllowedUsers, description, eventDate, passcode) => {
          const path = 'organizations/' + organization + '/events/' + eventID +'/';
          await this.setEventDatabaseInformation(path, eventName, minimumLevel, allowedusers, notAllowedUsers, description, eventDate, passcode);
          return true;

      }
      setEventDatabaseInformation = async (path, eventName, minimumLevel, allowedusers, notAllowedUsers, description, eventDate, passcode) => {
          await this.db.ref(path+'name').set(eventName);
          await this.db.ref(path+'minimumLevel').set(minimumLevel);
          await this.db.ref(path+'allowedUsers').set(allowedusers);
          await this.db.ref(path+'notAllowedUsers').set(notAllowedUsers);
          await this.db.ref(path+'description').set(description);
          await this.db.ref(path+'eventDate').set(eventDate);
          await this.db.ref(path+'passcode').set(passcode);
          await this.db.ref(path+'active').set(false);
      }

      loginIntoEvent = async (organization, eventID, passcode) => {
          const path = 'organizations/'+organization+'/events/';
          const tempElement = await this.getElementsInPath(path);
          var login = false;
          for(var i = 0; i < tempElement.length; i++) {
              if(tempElement[i].uid === eventID) {
                  if(tempElement[i].value.passcode === passcode && tempElement[i].value.active === true) {
                      login = true;
                  }
                  else {
                      login = false;
                  }
                  break;
              }
          }
          return login;
      }

      getEventInformation = async (organization, eventID) => {
          const path = 'organizations/' + organization + '/events/' + eventID + '/';
          var eventInformation = {
              'allowedUsers':'',
              'minimumLevel':'',
              'notAllowedUsers':'',
          };
          const filter = ['allowedUsers','minimumLevel','notAllowedUsers'];
          const tempElement = await this.getElementsInPath(path, filter);
          eventInformation.allowedUsers = tempElement[0].value;
          eventInformation.minimumLevel = tempElement[1].value;
          eventInformation.notAllowedUsers = tempElement[2].value;

          return eventInformation;
      }

      deleteEvent = async (organization, eventID) => {
          const path = 'organizations/' + organization + '/events/' + eventID + '/';
          this.db.ref(path).remove();
      }

      activateEvent = async (organization, eventID) => {
          const path = 'organizations/' + organization + '/events/' + eventID + '/active/';
          this.db.ref(path).set(true);
      }

      stopEvent = async (organization, eventID) => {
          const path = 'organizations/' + organization + '/events/' + eventID + '/active/';
          this.db.ref(path).set(false);
      }

      getEventsPreview = async (organization) => {
          var eventResult = [];
          const path = 'organizations/' + organization + '/events/';
          const tempElement = await this.getElementsInPath(path);

          for(var i=0; i < tempElement.length; i++) {
              var eventInformation = {
                  'active':'',
                  'eventDate':'',
                  'minimumLevel':'',
                  'name':'',
                  'eventID':'',
                  'description':''
              };
              eventInformation.active = tempElement[i].value.active;
              eventInformation.eventDate = tempElement[i].value.eventDate;
              eventInformation.minimumLevel = tempElement[i].value.minimumLevel;
              eventInformation.name = tempElement[i].value.name;
              eventInformation.eventID = tempElement[i].uid;
              eventInformation.description = tempElement[i].value.description;
              eventInformation.allowedUsers = tempElement[i].value.allowedUsers;
              eventInformation.notAllowedUsers = tempElement[i].value.notAllowedUsers;
              eventInformation.passcode = tempElement[i].value.passcode;
              eventResult.push(eventInformation);
          }
          return eventResult;
      }

      checkIfEventExist = async (organization, eventID) => {
          const path = 'organizations/'+organization+'/events/';
          const tempElement = await this.getElementsInPath(path);
          var found = false;
          for(var i = 0; i < tempElement.length; i++) {
              if(tempElement[i].uid === eventID) {
                  found = true;
                  break;
              }
          }
          return found;
      }

      //#endregion

      //#region ORGANIZATIONS

      getOrganization = async () => {
          var userID = this.auth.currentUser.uid;
          var admin = await this.getElementsInPath('users/', userID);
          if(admin != null){
              return admin[0].value.companyName;
          }
          else{
              return null;
          }
      }

      getOrganizationInformation = async () => {
          var userID = this.auth.currentUser.uid;
          var admin = await this.getElementsInPath('users/', userID);
          if(admin != null){
              return admin[0].value;
          }
          else{
              return null;
          }
      }

      deleteOrganizationData = async (organization) => {
          const path = 'organizations/' + organization + '/';
          this.db.ref(path).remove();
      }

      changeOrganizationPasscode = async (organization, passcode) => {
          await this.db.ref('organizations/'+organization+'/passcode').set(passcode);
      }

      /*
       *    1 -> passcode match
       *    0 -> organization is new
       *    -1-> passcode does not match
       */
      verifyOrganizationPasscode = async (organization, passcode) => {
          const path = 'organizations/' + organization + '/';
          const tempElement = await this.getElementsInPath(path);
          if(tempElement == null || tempElement.length === 0) { return 0; }
          if(tempElement[0].value == passcode) {
              return 1;
          }
          else {
              return -1;
          }
      }

      //#endregion

      //endregion

      // *** User API ***
      user = uid => this.db.ref(`users/${uid}`);
      users = () => this.db.ref('users');
  }
  export default Firebase;