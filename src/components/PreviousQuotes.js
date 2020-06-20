import React from "react";
import { Card } from "react-bootstrap";

export default function PreviousQuotes(props) {
  const previousQuotesArray = props.quotes.reverse().map((quote, index) => {
    return (
      <div className="border-top border-info pb-3 pt-2" key={index}>
        <Card.Text>{quote["en"]}</Card.Text>
        <h6>{quote["author"]}</h6>
      </div>
    );
  });
  return previousQuotesArray;
}
