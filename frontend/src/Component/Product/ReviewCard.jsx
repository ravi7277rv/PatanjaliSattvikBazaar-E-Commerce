//import { Rating } from "@material-ui/lab";
import React from "react";
import profilePng from "../../images/Profile.png";
import './ProductDetails.css'
 import ReactStars from "react-rating-stars-component";

const ReviewCard = ({ review }) => {
  const options = {
    edit: false,
    color:"rgba(20,20,20,0.1)",
    activeColor: " #fdcd0de9",
    value: review.rating,
    size: window.innerWidth < 600 ? 20 : 25,
    isHalf: true,
  };
  

//   const options = {
//     size: "medium",
//     value: review.ratings,
//     readOnly: true,
//     precision: 0.5,
// };

  return (
    <div className="reviewCard">
      <img src={profilePng} alt="User" />
      <p>{review.name}</p>
      <ReactStars {...options} />
      <span className="reviewCardComment">{review.comment}</span>
    </div>
  );
};

export default ReviewCard;
