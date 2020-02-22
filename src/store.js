// File with the configuration for redux, firebase & firestore
import { createStore, combineReducers, compose } from 'redux';
import { reactReduxFirebase, firebaseReducer } from 'react-redux-firebase';
import { reduxFirestore, firestoreReducer } from 'redux-firestore';
import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';

// Custom reducers
import buscarUsuarioReducer from './reducers/buscarUsuarioReducer';

// Configure Firestore
const firebaseConfig = {
  apiKey: "AIzaSyDll7XSVFSfp2P_xNfPOToiZ0LG3VS8MxE",
  authDomain: "bibliostore-58b7d.firebaseapp.com",
  databaseURL: "https://bibliostore-58b7d.firebaseio.com",
  projectId: "bibliostore-58b7d",
  storageBucket: "bibliostore-58b7d.appspot.com",
  messagingSenderId: "731485125029",
  appId: "1:731485125029:web:00476fd96bd2061ea3104c",
  measurementId: "G-E950XG53DE"
};

// run firebase
firebase.initializeApp(firebaseConfig);

// configurate react-redux
const rrfConfig = {
  userProfile: 'users',
  useFirestoreForProfile: true
}

// Compose is an enhancer that takes different functions
// function that takes another functions
const createStoreWithFirebase = compose(
 reactReduxFirebase(firebase, rrfConfig),
 reduxFirestore(firebase)
)(createStore);

// Reducers
const rootReducer = combineReducers({
  firebase: firebaseReducer,
  firestore: firestoreReducer,
  usuario: buscarUsuarioReducer
});

// Initial state
const initialState = {};

// Create the store
const store = createStoreWithFirebase(rootReducer, initialState, compose(
  reactReduxFirebase(firebase),
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
));

export default store;
