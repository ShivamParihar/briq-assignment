import React from "react";
import { Container, Card, Row, Col, Alert } from "react-bootstrap";
import "./App.css";
import axios from "axios";
import Rating from "./components/Rating";
import PreviousQuotes from "./components/PreviousQuotes";
import { getSimilarQuote, getDissimilarQuote } from "./assets/cosineSimilarity";

export default class App extends React.Component {
  constructor() {
    super();
    this.state = {
      rating: [1, 1, 1, 0, 0],
      quote: { id: "", en: "", author: "" },
      alert: false,
    };
  }

  // first random quote
  componentDidMount = () => {
    axios
      .get("https://programming-quotes-api.herokuapp.com/quotes/random")
      .then(({ data }) => {
        this.setState({
          quote: { id: data["_id"], en: data["en"], author: data["author"] },
        });
      })
      .catch((err) => {
        console.error(err);
      });
  };

  // Get similar quote
  getSimilarQuote = () => {
    axios
      .get("https://programming-quotes-api.herokuapp.com/quotes")
      .then(({ data }) => {
        const { _id, en, author } = getSimilarQuote(
          this.state.quote,
          data,
          JSON.parse(localStorage.getItem("quotes")) || []
        );
        this.setState({
          quote: {
            id: _id,
            en: en,
            author: author,
          },
        });
      })
      .catch((err) => {
        console.error(err);
      });
  };

  // Get dissimilar quote
  getDissimilarQuote = () => {
    axios
      .get("https://programming-quotes-api.herokuapp.com/quotes")
      .then(({ data }) => {
        const { _id, en, author } = getDissimilarQuote(
          this.state.quote,
          data,
          JSON.parse(localStorage.getItem("quotes")) || []
        );
        this.setState({
          quote: {
            id: _id,
            en: en,
            author: author,
          },
        });
      })
      .catch((err) => {
        console.error(err);
      });
  };

  // handling state on changing rating
  onRatingChange = (index) => {
    const updatedRatingArray = [0, 0, 0, 0, 0];
    for (let i = 0; i <= index; i++) updatedRatingArray[i] = 1;
    this.setState({ rating: updatedRatingArray });
  };

  // sumbiting rating for a quote
  onRatingSubmit = () => {
    //find rating
    const currentRating = this.state.rating.reduce((a, b) => a + b, 0);

    //save to localstorage (history)
    const { en, author, id } = this.state.quote;
    const history = JSON.parse(localStorage.getItem("quotes")) || [];
    history.push({ en: en, author: author, id: id });
    localStorage.setItem("quotes", JSON.stringify(history));

    //save rating to API using POST
    axios
      .post("https://programming-quotes-api.herokuapp.com/quotes/vote", {
        quoteId: this.state.quote["id"],
        newVote: currentRating,
      })
      .then(({ data }) => {
        this.setState({ alert: true });
      })
      .catch((error) => {
        console.error(error);
      });

    // get next quote
    if (currentRating <= 3) {
      this.getDissimilarQuote();
    } else {
      this.getSimilarQuote();
    }
  };

  render() {
    return (
      <>
        {this.state.alert ? (
          <Alert
            variant="success"
            onClose={() => this.setState({ alert: false })}
            dismissible
          >
            Thank you! Your response has been submited
          </Alert>
        ) : (
          <></>
        )}
        <Container>
          <Row>
            <Col sm className="mt-3">
              <Card className="shadow">
                <Card.Img
                  variant="top"
                  src="https://source.unsplash.com/random/700x370/?programming"
                />
                <Card.Body className="text-center">
                  <Card.Text>{this.state.quote.en}</Card.Text>
                  <Card.Title>{this.state.quote.author}</Card.Title>
                  <hr />
                  <Rating
                    rating={this.state.rating}
                    onRatingChange={this.onRatingChange}
                  />
                  <br />
                  <button
                    className="btn btn-primary mt-3"
                    onClick={this.onRatingSubmit}
                  >
                    Submit
                  </button>
                </Card.Body>
              </Card>
            </Col>
            <Col sm className="mt-3">
              <Card
                style={{ maxHeight: "90vh" }}
                className="overflow-auto shadow"
              >
                <Card.Body className="text-center">
                  <Card.Title>History</Card.Title>
                  <PreviousQuotes
                    quotes={JSON.parse(localStorage.getItem("quotes")) || []}
                  />
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </>
    );
  }
}
