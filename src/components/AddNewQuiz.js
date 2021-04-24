import React, { useState } from "react";
import {
  faArrowLeft,
  faArrowRight,
  faChevronRight,
  faTimesCircle,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import QuizImage from "../Assets/Quiz.png";
import ThinkingGirl from "../Assets/thinking-girl.png";
import "./index.css";
import { connect } from "react-redux";
import firebase from "firebase";


import BgImage from "../Assets/bg2.png";
const AddNewQuiz = ({ currentUser, setViewMode2, setIsLoading }) => {
  const [quiz, setQuiz] = useState({ quiz_name: "", questions: [] });
  const [quizName, setQuizName] = useState(null);
  const [error, setError] = useState({});
  const [selectedQuestionNumber, setSelectedQuestionNumber] = useState(null);

  const [allOptions, setAllOptions] = useState([
    { option_value: "", is_correct: true },
    { option_value: "", is_correct: false },
  ]);
  const [question, setQuestion] = useState("");
  const [allQuestions, setAllQuesttions] = useState([]);

  const handleSubmitQuizName = (e) => {
    e.preventDefault();
    if (!quizName) {
      error["quiz_name"] = true;
      setError({ ...error });
      return;
    }
    setQuiz({ ...quiz, quiz_name: quizName });
  };

  // ------------------------------- Handle add question -------------------------------------

  const handleAddQuestion = () => {
    if (!question) {
      error["question"] = true;
      setError({ ...error });
    }
    allOptions.map((option, idx) => {
      if (!option.option_value) {
        error[`option_error${idx}`] = true;
        setError({ ...error });
      }
    });
    error["noQuestionError"] = false;
    setError({ ...error });
    let is_error = false;

    for (const key in error) {
      if (error[key]) {
        is_error = true;
      }
    }
    if (is_error) return;
    console.log("No error");
    if (selectedQuestionNumber) {
      allQuestions[selectedQuestionNumber - 1] = {
        question,
        allOptions,
      };
    } else {
      allQuestions.push({
        question,
        allOptions,
      });
    }

    setSelectedQuestionNumber(null);
    setAllQuesttions([...allQuestions]);
    setQuestion("");
    setAllOptions([
      { option_value: "", is_correct: true },
      { option_value: "", is_correct: false },
    ]);
  };

  // ---------------------------------- *********** end *********** -------------------------------------

  const handlePublishQuiz = () => {
    if (question) {
      handleAddQuestion();
    }
    if (!allQuestions.length) {
      error["noQuestionError"] = true;
      setError({ ...error });
      return;
    }
    setIsLoading(true)

    firebase
      .firestore()
      .collection("quiz")
      .add({
        ...quiz,
        created_at: firebase.database.ServerValue.TIMESTAMP,
        craeted_by: currentUser.id,
      })
      .then((doc) => {
        allQuestions.map((item) => {
          firebase
            .firestore()
            .collection("quiz")
            .doc(doc.id)
            .collection("AllQuestions")
            .add({
              ...item,
              quiz_id: doc.id,
            });
        });
      })
      .then(() => {setIsLoading(false);setViewMode2("AllQuiz")})
      .catch((err) => {setIsLoading(false);console.log(err)});
  };

  const handleBackQuestion = () => {
    let backQuestionNumber;
    if (!allQuestions.length || selectedQuestionNumber === 1 ) return;
    if (selectedQuestionNumber) {
      backQuestionNumber = selectedQuestionNumber - 1;
    } else {
      backQuestionNumber = allQuestions.length;
    }
    setSelectedQuestionNumber(backQuestionNumber);
    setQuestion(allQuestions[backQuestionNumber - 1].question);
    setAllOptions(allQuestions[backQuestionNumber - 1].allOptions);
  };

  const handleNextQuestion = () => {
    console.log(allQuestions.length, selectedQuestionNumber);
    let NextQuestionNumber;
    if (
      !selectedQuestionNumber ||
      selectedQuestionNumber === allQuestions.length
    )
      return;
    NextQuestionNumber = selectedQuestionNumber + 1;
    setSelectedQuestionNumber(NextQuestionNumber);
    setQuestion(allQuestions[NextQuestionNumber - 1].question);
    setAllOptions(allQuestions[NextQuestionNumber - 1].allOptions);
  };

  const handleDeleteQuestion=()=>{
  console.log(allQuestions.length, selectedQuestionNumber);
    if(allQuestions.length === selectedQuestionNumber && selectedQuestionNumber === 1){
      setSelectedQuestionNumber(null);
      setAllQuesttions([]);
      setQuestion("");
      setAllOptions([
        { option_value: "", is_correct: true },
        { option_value: "", is_correct: false },
      ]);
    } else if(allQuestions.length === selectedQuestionNumber){
      let filered = allQuestions.filter((opt, i)=> i !== selectedQuestionNumber-1)
      setAllQuesttions(filered)
      handleBackQuestion()
    } else{
      let nextQestion = selectedQuestionNumber -1
      let filered =allQuestions.filter((opt, i)=> i!== nextQestion)
      setAllQuesttions(filered)
      setSelectedQuestionNumber(nextQestion + 1);
      setQuestion(filered[nextQestion].question);
      setAllOptions(filered[nextQestion].allOptions);
    }
  }

  return (
    <div className="addNewQuiz" style={{ backgroundImage: `url(${BgImage})` }}>
      <img
        src={QuizImage}
        alt="QuizImage"
        className="QuizImage"
        height="100px"
      />
      {!quiz.quiz_name && (
        <form className="quiz_details" onSubmit={handleSubmitQuizName}>
          <h2 style={{ fontFamily: "Orelega One" }}>Quiz title</h2>
          <input
            type="text"
            name="quiz_name"
            onChange={(e) => {
              error[e.target.name] = false;
              setError({ ...error });
              setQuizName(e.target.value);
            }}
            className="form-control  rounded-pill shadow mt-4 px-3 lead"
            placeholder="Enter quiz name..."
            autoFocus
          />
          {error.quiz_name && (
            <div className="text-center text-danger font-13 mt-2">
              Please enter quiz name!
            </div>
          )}
          <div className=" text-center mt-4">
            <button
              className="rounded-circle cp text-dark bg-light shadow p-2 border-0"
              type="submit"
            >
              <FontAwesomeIcon
                icon={faChevronRight}
                style={{ height: "16px", width: "24px" }}
              />
            </button>
          </div>
        </form>
      )}
      {!quiz.quiz_name && (
        <img
          src={ThinkingGirl}
          slt="ThinkingGirl"
          height="200px"
          className="ThinkingGirl-logo "
        />
      )}
      {quiz.quiz_name && (
        <div className="addQuestions">
          <div className="bg-primary font-weight-bold text-light rounded p-2 font-18">
            <div className="font-13 text-dark">Quiz title:</div>
            {quiz.quiz_name}
        
          </div>
          <form className="form-group p-3 bg-black rounded-lg mt-2">
            <div className="form-group">
              <label className="font-14 ">
                Question{" "}
                {selectedQuestionNumber
                  ? selectedQuestionNumber
                  : allQuestions.length
                  ? allQuestions.length + 1
                  : "1"}    
              </label>
              <textarea
                row="3"
                className="form-control"
                placeholder="Question"
                value={question}
                onChange={(e) => {
                  error["question"] = false;
                  setError({ ...error });
                  setQuestion(e.target.value);
                }}
              />
              {error["question"] && (
                <div className="text-danger font-12">
                  This field can not be empty!
                </div>
              )}
            </div>
            <div className="font-14 mb-2">Add options:</div>
            <div className="options-input">
              {allOptions.map((option, idx) => (
                <div className="mb-2">
                  <div class="input-group ">
                    <div class="input-group-prepend">
                      <label class="input-group-text cp" for={`option${idx}`}>
                        <input
                          type="radio"
                          name="correct-option"
                          id={`option${idx}`}
                          checked={option.is_correct}
                          onChange={() => {
                            allOptions.map((option, i) => {
                              if (i === idx) {
                                allOptions[i].is_correct = true;
                              } else {
                                allOptions[i].is_correct = false;
                              }
                            });

                            setAllOptions([...allOptions]);
                            console.log(allOptions);
                          }}
                        />
                      </label>
                    </div>
                    <input
                      type="text"
                      class="form-control font-14 border-0"
                      value={option.option_value}
                      onChange={(e) => {
                        error[`option_error${idx}`] = false;
                        setError({ ...error });
                        allOptions[idx].option_value = e.target.value;
                        setAllOptions([...allOptions]);
                        console.log(allOptions);
                      }}
                      placeholder={`Option ${idx + 1}`}
                    />
                   {idx > 1 && <span className="p-1 cp bg-danger rounded px-2" onClick={()=>{let newAllOptions = allOptions.filter((opt,i)=>i !== idx); setAllOptions([...newAllOptions])}} ><FontAwesomeIcon icon={faTimesCircle} /></span>}
                  </div>

                  {error[`option_error${idx}`] && (
                    <div className="text-danger font-12 ">
                      This field can not be empty!
                    </div>
                  )}
                </div>
              ))}
            </div>

           <div className="text-right" >
           <span
              className="my-2 btn btn-info btn-sm text-center"
              onClick={() => {
                allOptions.push({ option_value: "", is_correct: false });
                setAllOptions([...allOptions]);
              }}
            >
              Add option +
            </span>
           </div>
            <div className="my-1">
              <span
                className={`cp px-3 ${
                  allQuestions.length ? "text-light" : "text-muted"
                }`}
                onClick={handleBackQuestion}
              >
                <small>
                  <FontAwesomeIcon icon={faArrowLeft} /> Back
                </small>
              </span>
              <span
                className={`cp px-3 float-right ${
                  selectedQuestionNumber &&
                  allQuestions.length > selectedQuestionNumber
                    ? "text-light"
                    : "text-muted"
                }`}
                onClick={handleNextQuestion}
              >
                <small>
                  Next <FontAwesomeIcon icon={faArrowRight} className="mt-1" />
                </small>
              </span>
            </div>
           {selectedQuestionNumber &&  <div className=" text-center" >
            <span className="btn btn-danger btn-sm rounded-pill" onClick={handleDeleteQuestion} ><span className="font-13 font-weight-bold" >Delete question <FontAwesomeIcon icon={faTrash} className="ml-1" /></span></span>
            </div>}
          </form>
          <button
            className="my-2 btn btn-primary text-center w-100"
            onClick={handleAddQuestion}
          >
            Add question +
          </button>
          <div className="text-right" >
          <button
            className="my-2 btn btn-success text-center w-100"
            onClick={handlePublishQuiz}
          >
            Publish Quiz
          </button>
          </div>
          {error.noQuestionError && (
            <div className="text-danger font-12 mt-2">
              Please add a question!
            </div>
          )}
        </div>
      )}
    </div>
  );
};

const mapStatetoProps = (state) => ({
  currentUser: state.user.currentUser,
});

export default connect(mapStatetoProps)(AddNewQuiz);
