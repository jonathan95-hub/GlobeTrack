import './App.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import '@fontsource/kavoon';
import store from "./core/redux/store/store";
import LandingPage from './pages/landingPage/LandingPage'
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
