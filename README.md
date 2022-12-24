# Project Nova (React)
## Demo link:
Current version of the Boss Timer tool is live on the [Revolution Alliance website](https://www.revolution-alliance.com) 
Access Project Nova and the new React version at [nova-tools-app.web.app](https://nova-tools-app.web.app)

## Table of Content:

- [About The App](#about-the-app)
- [Technologies](#technologies)
- [Setup](#setup)
- [Deployment](#deployment)
- [Credits](#credits)

## About The App
Project Nova is a web app to reinforce the efforts of the Revolution Alliance. Right now, it's mostly focused on perfecting the Boss Timer tool.

## Technologies
- `React`
- `Express`
- `Firebase Functions`
- `Firebase Firestore`
- `Firebase Authentication`

## Setup
- Download or clone the repository
- Run `npm install` to install all npm dependencies
- Run `npm start` to spin up a local session
- React code is in the `src` folder
- The `functions` folder holds the serverless functions hosted by Firebase. For now, it's the endpoint that handles the Authentication workflow.

## Deployment
- First run `npm run build`
- Then run `firebase deploy`
- If it's your first time deploying, you may have to init firebase by first running `firebase init`
- To only deploy the Firebase functions, you can run `firebase deploy --only functions`

## Credits
List of contriubutors:
- [Jason Merrell](#)
- [Joao Nuno Brito](#)
- [Whatever Side's Name Is](#)

