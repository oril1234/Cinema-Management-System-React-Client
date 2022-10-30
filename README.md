# Cinema Management System Client 

This repository is of a cinema management system React client in which data related to movies shown in the cinema, members who can subscribe to them, and the subscriptions themselves is handled by the user.

A user in the system can add,edit delete members and movies, as well as registering members to movies - all depending on permissions granted to the user by the admin, who is the only one who can handle other users.

The client oprates against one main server located [here](https://github.com/oril1234/Cinema-Management-System-Main-Flask-Server) and the data fetched from it is stored and handled in 
Redux, and thus accessible through multiple componenets.
The data in Redux is:
1. The data of the user who is currently logged in to the system if there is one
2. All the users in the system arranged in a Map data structure in which the id of each user is the key, and the user data is the value.
3. All the movies in the system arranged in a Map data structure in which the id of each movie is the key, and the movie data is the value.
4. All the members in the system arranged in a Map data structure in which the id of each memberis the key, and the member data is the value
5. All the movies subscriptions arranged in a Map data structure in which for every subscription the movie id is the key, and an array of all the subscriptions to that movie is the value
6. All the members subscriptions arranged in a Map data structure in which for every subscription the member id is the key, and an array of all the subscriptions to movies made by this member is the value

Below is a high level diagram of the client:
![High Level](https://user-images.githubusercontent.com/49225452/198881191-29575ea2-2bc3-4501-a779-9ae31dce8017.png)

This is a detailed hierarchy of the components:
![diagram drawio (7)](https://user-images.githubusercontent.com/49225452/198881268-1dbfd325-5f66-4166-b356-2a950a16f947.png)


In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)
