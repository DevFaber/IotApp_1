import firebase from 'firebase';

export const firebaseConfig = {
  apiKey: 'AIzaSyBusDe6x7pAreideGifwo4VwpzGCCD1aRs',
  authDomain: 'faberhomebackend.firebaseapp.com',
  databaseURL: 'https://faberhomebackend.firebaseio.com',
  projectId: 'faberhomebackend',
  storageBucket: 'faberhomebackend.appspot.com',
};

firebase.initializeApp(firebaseConfig);
