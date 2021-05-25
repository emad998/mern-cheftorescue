import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, Link } from "react-router-dom";
import axios from "axios";
import { addToken, nullingToken, addDatabaseId, nullingDatabaseId } from "../redux/user";
import { GoogleLogout } from 'react-google-login';

function Favorite() {
    const [clientUserName, setClientUserName] = useState(null);

    const [mealData, setMealData] = useState(null)
  const [yourLikes, setYourLikes] = useState([]);
  const [ingredients, setIngredients] = useState([]);
  const [measures, setMeasures] = useState([])
  const [imageSrc, setImageSrc] = useState('')
  const [youtubeLink, setYoutubeLink] = useState('')
  const [deleting, setDeleting] = useState(false)

    const dispatch = useDispatch()
    const history = useHistory()

    const { token } = useSelector((state) => state.user);
  const {databaseId} = useSelector((state) => state.user)

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

      useEffect(() => {
          axios.post("http://localhost:5000/getlikes", {
              token: token,
              databaseId: databaseId,

          }).then(res => setYourLikes(res.data))

      }, [])


    const handleSignOut = () => {
        dispatch(nullingToken());
        dispatch(nullingDatabaseId())
        history.replace("/");
      };

      const handleShowMeal = (e, idOfMeal) => {
        axios.get(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${idOfMeal}`)
    .then((res) => 
    {setMealData(res)
    let property = "";
        let ingredientsArray = [];
        let measuresArray = []
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
        setMeasures(measuresArray)
        setImageSrc(res.data.meals[0].strMealThumb)
        setYoutubeLink(res.data.meals[0].strYoutube)
    })
      }

      const handleDeleteMeal = (e, nameOfMeal, idOfMeal) => {
        axios.post('http://localhost:5000/deletemeal', {
            token: token,
            databaseId: databaseId,
            nameOfMeal: nameOfMeal,
            idOfMeal: idOfMeal
        }).then(res => setYourLikes(res.data.favorites))
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
            <h1>This is favorite page</h1>

            {yourLikes &&
          yourLikes.map((oneLike, index) => (
            <div key={index}>
                <h5>{oneLike.mealName}</h5>
                <button onClick={(e) => handleShowMeal(e, oneLike.mealId)}>Show Meal</button>
                <button onClick={(e) => handleDeleteMeal(e, oneLike.mealName, oneLike.mealId)}>Delete Meal</button>
            </div>
          ))}


        {mealData &&
        <>
        <h1 className='centeringText'>Meal Name: {mealData.data.meals[0].strMeal}</h1>
          <h1 className='centeringText'>Cuisine: {mealData.data.meals[0].strArea}</h1>
          <h1 className='centeringText'>Category: {mealData.data.meals[0].strCategory}</h1>
        
            <div className='displaying'>
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
             
              if (measure) {
                return <li key={index}>{measure}</li>;
              }
            })}
          </ul>
          </div>
        
        <img src={imageSrc} alt="meal photo" className='imageResponsive bordering'/>
        <br />
        <p className="centeringText">
        <a href={youtubeLink} >Meal Video</a>
        </p>
        </>
        }
        </div>
    )
}

export default Favorite
