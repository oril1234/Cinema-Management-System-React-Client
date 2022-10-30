# Cinema Management System Client 

This repository is of a cinema management system React client in which data related to movies shown in the cinema, members who can subscribe to them, and the subscriptions themselves is handled by the users.

Users in the system can add, edit delete members and movies, as well as registering members to movies - all depending on permissions granted to them by the admin, who is the only one who can manage other users.

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
![diagram drawio (8)](https://user-images.githubusercontent.com/49225452/198881665-f1fc94cf-a129-402a-97ca-d80df266d711.png)


This is a detailed hierarchy of the components:
![diagram drawio (7)](https://user-images.githubusercontent.com/49225452/198881268-1dbfd325-5f66-4166-b356-2a950a16f947.png)


## Setup And Installation
Clone down this repository. You will need node and npm installed globally on your machine.

Installation:

`npm install`

`npm install react-router-dom`

`npm install @material-ui/core`


To Start Application:

`npm start`

then run the URL http://localhost:3000/


