# redux-api-saga

Redux Saga API abstraction

<div> 
<a href="https://www.npmjs.com/package/redux-api-saga">
    <img
      src="https://img.shields.io/npm/v/redux-api-saga.svg" height="20">
  </a>
     <a href="https://www.npmjs.com/package/redux-api-saga">
    <!--<img
      src="https://img.shields.io/npm/dt/redux-api-saga.svg" height="20">-->
  </a>
  <br/>
</div>

Takes in a config and gives you a reducer saga and a common action. 

### Setup

```js 
// store.js
import init from 'redux-api-saga';
import { applyMiddleware, createStore } from 'redux';
import createSagaMiddleware from 'redux-saga';

const defaultOnSuccess = (result) => {
  console.log(typeof result === 'string' ? result : 'Successful.' );
};
const defaultOnError = (error) => {
  alert(typeof error === 'string' ? error : error.message);
};
const config = [
  {
    path: 'http://localhost:3001/auth',
    method: 'POST',
    name: 'authToken', // API will be referred in action using this name
    mode: 'takeLatest',
    initialResult: null, // this is the initial value,
    onSuccess: defaultOnSuccess,
    onError: defaultOnError,
  },
  {
    path: 'http://localhost:3001/puppyJpg/:imageId',
    method: 'GET',
    name: 'puppyJpg',
    mode: 'takeLatest',
    initialResult: 'https://upload.wikimedia.org/wikipedia/commons/9/9c/Indian_pariah_dog_puppy_%288334906336%29.jpg',
  },
];
// default set of headers. you can choose to override this in every action dispatch. 
const getReqHeaders = (state: any) => ({
  Authorization: `bearer ${state.authToken}`,
});
const options = {
  getReqHeadersDefault: getReqHeaders,
};
const apiSaga = init(config, options);

const reducer = apiSaga.reducer;
const sagas = apiSaga.sagas;
export const action = apiSaga.action;
function* saga() {
  yield all(apiSaga.sagas)
}

// create middlewares
const sagaMiddleware = createSagaMiddleware();
const middleware = applyMiddleware(sagaMiddleware);
// create store
const store = createStore(rootReducer, middleware);
export default store;
// run saga middleware
sagaMiddleware.run(saga);
```

### Usage

```js
// auth.jsx

import { action } from './store';

...

login(username, password) {
  this.props.dispatch(action({
    name: 'authToken',
    payload: { username, password }, // this will be passed as req.body of the XHR call
    getReqHeaders: () => ({}) // override default header,
  }));
}
```

```js
// puppy.jsx
import { action } from './store';

...

class PuppyImg extends React.Component {
  state = {};
  getPuppyImg = () => {
    this.props.dispatch(action({
      name: 'puppyJpg',
      payload: {},
      params: { imageId: 20345 }, // this will replace the param :imageId
      query: { resolution: 'HD' },
      // You can override success and error hooks
      onSuccess: () => {},
      onError: (error) => {
        console.error(typeof error === 'string' ? error : error.message);
      };
    }));
    // resultant API path -> http://localhost:3001/puppyJpg/20345?resolution=HD
  }
  render() {
    return (
      <div>
        <button onClick={this.getPuppyImg}>
          Test
        </button>
        <img src={this.props.puppyJpg} />
      </div>
    );
  }
}
 
const mapState = (state: RootStateType) => ({
  puppyJpg: state.puppyJpg,
});
 
export default connect(mapState)(PuppyImg);
```


