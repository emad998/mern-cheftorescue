import React, { useEffect, useState } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { addToken, nullingToken, addDatabaseId, nullingDatabaseId, stayLoggedInFalse, stayLoggedInTrue } from "../redux/user";
import { useHistory, Link } from "react-router-dom";
import './Welcome.css'
import { GoogleLogout } from 'react-google-login';

function Welcome() {
  const [clientUserName, setClientUserName] = useState(null);

  const [mealData, setMealData] = useState(null);
  const [ingredients, setIngredients] = useState([]);
  const [measures, setMeasures] = useState([]);
  const [imageSrc, setImageSrc] = useState("");
  const [youtubeLink, setYoutubeLink] = useState("");
  const [mealId, setMealId] = useState(null);

  const [yourLikes, setYourLikes] = useState([]);
  const [adding, setAdding] = useState(false);

  const dispatch = useDispatch();
  const history = useHistory();

  const { token } = useSelector((state) => state.user);
  const {databaseId} = useSelector((state) => state.user)

  const handleSignOut = () => {
    dispatch(nullingToken());
    dispatch(nullingDatabaseId())
    history.replace("/");
  };

  

  useEffect(() => {
    axios
      .post("http://localhost:5000/getuser", {
        token: token,
      })
      .then((res) => {
        dispatch(addDatabaseId(res.data._id))
        setClientUserName(res.data.userName)})
        .catch(err => console.log(err))
    
  }, []);


  


  const mealGenerator = () => {
    axios
      .get("https://www.themealdb.com/api/json/v1/1/random.php")
      .then((res) => {
        setMealData(res);
        let property = "";
        let ingredientsArray = [];
        let measuresArray = [];
        for (property in res.data.meals[0]) {
          for (let i = 0; i <= 20; i++) {
            if (property == "strIngredient" + i) {
              ingredientsArray.push(res.data.meals[0][property]);
            }
          }
        }
        for (property in res.data.meals[0]) {
          for (let i = 0; i <= 20; i++) {
            if (property == "strMeasure" + i) {
              measuresArray.push(res.data.meals[0][property]);
            }
          }
        }

        setIngredients(ingredientsArray);
        setMeasures(measuresArray);
        setImageSrc(res.data.meals[0].strMealThumb);
        setYoutubeLink(res.data.meals[0].strYoutube);
      });
  };

  const handleLike = (e, nameOfMeal, idOfmeal) => {
        console.log(idOfmeal)
        axios.post('http://localhost:5000/addlike', {
            token : token,
            databaseId: databaseId,
            nameOfMeal: nameOfMeal,
            idMeal: idOfmeal
        }).then(res => {
            console.log(res.data.favorites)
            setYourLikes(res.data.favorites)})
  }

  return (
    <div>
        
      <h1>Hello {clientUserName}</h1>
      <GoogleLogout
      clientId="418479286522-kdaphilh80lfvodbnn8dnehv1htea6rp.apps.googleusercontent.com"
      buttonText="Logout"
      onLogoutSuccess={handleSignOut}
    >
    </GoogleLogout>

      <button onClick={mealGenerator}>Generate A meal</button>
      <Link to="/favorite">Favorite</Link>

      {mealData && (
        <>
          <h1 className="centeringText">
            Meal Name: {mealData.data.meals[0].strMeal}
          </h1>
          <h1 className="centeringText">
            Cuisine: {mealData.data.meals[0].strArea}
          </h1>
          <h1 className="centeringText">
            Category: {mealData.data.meals[0].strCategory}
          </h1>

          <div className="displaying">
            <h5>Ingredients</h5>
            <ul>
              {ingredients.map((ingredient, index) => {
                if (ingredient) {
                  return <li key={index}>{ingredient}</li>;
                }
              })}
            </ul>

            <h5>Measure</h5>
            <ul>
              {measures.map((measure, index) => {
                if (measure && measure != " ") {
                  return <li key={index}>{measure}</li>;
                }
              })}
            </ul>
          </div>

          <img
            src={imageSrc}
            alt="meal photo"
            className="imageResponsive bordering"
          />
          <br />
          <p className="centeringText">
            <a href={youtubeLink}>Meal Video</a>
          </p>

          <button
            onClick={(e) =>
              handleLike(
                e,
                mealData.data.meals[0].strMeal,
                mealData.data.meals[0].idMeal
              )
            }
          >
            Like
          </button>

          <h5>Your Likes: </h5>
          <ul>
          {yourLikes && yourLikes.map((oneLike, index) => (
              <li key={index}>{oneLike.mealName}</li>
          ))}
          </ul>
        </>
      )}
    </div>
  );
}

export default Welcome;
