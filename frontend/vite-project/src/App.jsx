
import store from "./core/redux/store/store";
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router';
import OwnRouter from './core/router/OwnRouter';

function App() {


  return (
    <>
    
    <Provider store={store}>
      <BrowserRouter>
    <OwnRouter/>
    </BrowserRouter>
    </Provider>
    
    </>
  )
}

export default App
