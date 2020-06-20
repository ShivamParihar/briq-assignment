import React from "react";

export default function Rating(props) {
  const ratingArray = props.rating.map((checked, index) => (
    <span
      key={index}
      className={`fa fa-star ${checked ? "checked" : ""} `}
      onClick={() => {
        props.onRatingChange(index);
      }}
    ></span>
  ));
  return ratingArray;
}
