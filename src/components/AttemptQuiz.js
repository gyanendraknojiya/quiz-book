import React, { useEffect, useState } from "react";
import firebase from "firebase";

import BgImage from "../Assets/bg2.png";
import { useParams } from "react-router";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrophy } from "@fortawesome/free-solid-svg-icons";

function AttemptQuiz() {
  const [quizDetails, setQuizDetails] = useState({});
  const [allQuestions, setAllQuestions] = useState([]);
  let { id } = useParams();
  console.log(id);

  let alphabet = "abcdefghijklmnopqrstuvwxyz".split("");
  let QuizRef = firebase.firestore().collection("quiz");

  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    if (!id) {
      quizDetails["exists"] = false;
      setQuizDetails({ ...quizDetails });
      return;
    }

    QuizRef.where("short_id", "==", id)
      .get()
      .then((doc) => {
        if (!doc.empty) {
          setQuizDetails({
            exists: true,
            ...doc.docs[0].data(),
            id: doc.docs[0].id,
          });
          QuizRef.doc(doc.docs[0].id)
            .collection("AllQuestions")
            .get()
            .then((quiz) => {
              console.log(quiz);
              let tempAllQuestions = [];
              if (!quiz.empty) {
                quiz.docs.map((item) => {
                  tempAllQuestions.push({ ...item.data() });
                });
              }
              setAllQuestions(tempAllQuestions);
              console.log(tempAllQuestions);
            });
        } else {
          quizDetails["exists"] = false;
          setQuizDetails({ ...quizDetails });
        }
      });
  }, []);

  return (
    <div className="attemptQuiz" style={{ backgroundImage: `url(${BgImage})` }}>
      <div
        className="attemptQuiz-box"
        style={{
          backgroundColor: "#242a40",
        }}
      >
        <h5
          className=" p-2 rounded-top  "
          style={{
            backgroundColor: "#2c4259",
          }}
        >
          <FontAwesomeIcon icon={faTrophy} className="mr-1" />{" "}
          {quizDetails.quiz_name}
        </h5>
        <div className="  p-2 pt-4">
          Quiz: {quizDetails.number_of_question}
          <hr className="bg-light my-1 " />
        </div>
        {allQuestions.length && (
          <div className="mb-3">
            <div className="font-14 px-3">1. {allQuestions[0].question}</div>
            <div className="m-4">
              {allQuestions[0].allOptions.map((option, i) => (
                <div className="rounded-pill p-1 rounded-pill border m-2 font-13 d-flex align-items-center cp bg-light text-dark">
                  <div
                    className="text-center rounded-circle bg-warning font-weight-bold ml-1 mr-2 font-18 text-white"
                    style={{
                      height: "30px",
                      width: "30px",
                    }}
                  >
                    {alphabet[i].toUpperCase()}
                  </div>
                  {option.option_value}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default AttemptQuiz;
