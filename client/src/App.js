import logo from './logo.svg';
import './App.css';
import Login from './components/Login';
import Welcome from './components/Welcome';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";
import {useDispatch, useSelector} from 'react-redux'
import Favorite from './components/Favorite';


function App() {
  const { token } = useSelector(state => state.user)
  

  

  return (
    <div className="App">
      <Router>
        <Switch>
          { token &&
          <>  
          <Route path="/favorite">
          <Favorite />
        </Route>
            <Route path="/welcome">
            <Welcome />
          </Route>
          </>
          }
          
          <Route path="/">
            <Login />
          </Route>
        </Switch>
    </Router>
    </div>
  );
}

export default App;
