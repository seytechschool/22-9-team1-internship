// const prodConfig = {
//   apiKey: 'AIzaSyAo9XhYAvVgtVynXridFdsg4Qtb0DvgTo0',
//   authDomain: 'emplosoft-2db9f.firebaseapp.com',
//   projectId: 'emplosoft-2db9f',
//   databaseURL: 'https://emplosoft-2db9f-default-rtdb.firebaseio.com',
//   storageBucket: 'emplosoft-2db9f.appspot.com',
//   messagingSenderId: '460039525265',
//   appId: '1:460039525265:web:aec32080d87de88acf0030'
// };
// const devConfig = {
//   apiKey: 'AIzaSyAo9XhYAvVgtVynXridFdsg4Qtb0DvgTo0',
//   authDomain: 'emplosoft-2db9f.firebaseapp.com',
//   projectId: 'emplosoft-2db9f',
//   databaseURL: 'https://emplosoft-2db9f-default-rtdb.firebaseio.com',
//   storageBucket: 'emplosoft-2db9f.appspot.com',
//   messagingSenderId: '460039525265',
//   appId: '1:460039525265:web:aec32080d87de88acf0030'
// };
const prodConfig = {
  apiKey: 'AIzaSyDfkGffAPkv23ApqQPfyi77pQmnUiRf-wU',
  authDomain: 'auth-production-a134c.firebaseapp.com',
  databaseURL: 'https://auth-production-a134c-default-rtdb.firebaseio.com',
  projectId: 'auth-production-a134c',
  storageBucket: 'auth-production-a134c.appspot.com',
  messagingSenderId: '972116277261',
  appId: '1:972116277261:web:ebde38544c73f0ddccbd44'
};
const devConfig = {
  apiKey: 'AIzaSyApuulUku8s1AQuu-d4_aLi5eMX1Pl_aYs',
  authDomain: 'auth-development-4e9d8.firebaseapp.com',
  databaseURL: 'https://auth-development-4e9d8-default-rtdb.firebaseio.com',
  projectId: 'auth-development-4e9d8',
  storageBucket: 'auth-development-4e9d8.appspot.com',
  messagingSenderId: '670885983634',
  appId: '1:670885983634:web:3d2ecedca64e157be9bd4b'
};

const config = process.env.NODE_ENV === 'production' ? prodConfig : devConfig;
// const config =  prodConfig;

export default config;
