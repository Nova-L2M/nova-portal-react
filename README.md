# Project L2M DB (React)
## Demo link:
Access Project L2M DB and the new React version at [l2m-db.web.app](https://l2m-db.web.app)

## Table of Content:
- [About The App](#about-the-app)
- [Technologies](#technologies)
- [Setup](#setup)
- [Deployment](#deployment)
- [Credits](#credits)

## About The App
Project L2M DB is a web app to help manage players in L2M. Right now, it's mostly focused on gathering gear/soul information. This was based on an already existing app [nova-portal-react](https://github.com/Nova-L2M/nova-portal-react)

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
- [Joao Nuno Brito](#)

