# CARAS

**CARAS** is a web app created using nodejs, react, firebase and tensorflow. This app manages organization events registration (check in) using company users face as the main factor of authentication.


# USAGE

## How it works?

**CARAS** uses in the backend the **faceapi.js** (https://github.com/justadudewhohacks/face-api.js/) With the user of this API the app is able to recognize an user face, age and gender. With the user of this parameters the app is able to provide access to an event to a certain user. All the information is stored in **Firebase** encrypted.  

## How to start using it?

First an organization must me registered. After the admin portal will allow to the organization admin to manage events and users. Users information, gender, age, email, name, id and level must be provided, then the admin will proceed to capture the user face landmarks. 
To setup an event, admins will provide minimum level, allowed users (in case that an user that does not satisfy the level requirement is allowed into the event) and notAllowed users (opposite of allowed users). Additionally an event passcode must be entered. Once the event goes active, the admin must setup the station providing the organization id and the event passcode. Later on, users will encounter a simple interface where they have to entered their user id, and capture a photo using the webcam of the device to start the face recognition. After this the system will provide feedback to the user about their allowance status. 

# FILES

- /src/FaceRecognition/
	>  Control that allows the facerecognition. Control needs organization id and event id. This control must be used only if the event and organization were verified. 	After the user is authenticated user attendance is recorded.

<<<<<<< HEAD
- /src/Recognizer/
	>  Control that contains FaceRecognition control. This control needs to validate organization, event and event passcode before calling the FaceRecognition control.
	
- /src/Firebase/
	>  Control that handle all the database managment.	
=======
The build is minified and the filenames include the hashes.<br />
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (Webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: https://facebook.github.io/create-react-app/docs/code-splitting

### Analyzing the Bundle Size

This section has moved here: https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size

### Making a Progressive Web App

This section has moved here: https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app

### Advanced Configuration

This section has moved here: https://facebook.github.io/create-react-app/docs/advanced-configuration

### Deployment

This section has moved here: https://facebook.github.io/create-react-app/docs/deployment

### `npm run build` fails to minify

This section has moved here: https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify


## UI-UI Branch
This branch contains all the main UI components. They will be located in `/src/UIComponents`.

### Dependencies
UI components are using the Semantic UI React package. This package is already added to the dependencies in package.json,
, therefore to update, you simply need to run `npm install `. If that doesn't work, then you can install the 
dependency yoursel by running:
```
npm install semantic-ui-react
```

Additionally, you will also ned to install the Semantic UI basic theme. This theme can be customized later down the line.
```
npm install semantic-ui-css
```

To be able to see the css of Semantic UI, you must import the Semantic UI theme into the entry file of the application. In
this case, that would be **index.js**. To import, simply add `import 'semantic-ui-css/semantic.min.css'` inside **index.js**
>>>>>>> origin/ui-ux
