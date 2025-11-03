import{ combineReducers} from 'redux'
import loginReducer from '../../../components/landingPage/login/loginReducer'
import menuReducerHeader from "../../../components/MainLayaout/Header/headerReducer"

const reducers = combineReducers({
    loginReducer,
    menuReducerHeader
})

export default reducers