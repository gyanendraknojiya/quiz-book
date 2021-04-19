import React, { useState } from "react";
import { faChevronRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import QuizImage from "../Assets/Quiz.png";
import ThinkingGirl from "../Assets/thinking-girl.png";
import "./index.css";

import BgImage from "../Assets/bg2.png";
const AddNewQuiz = ({}) => {
  const [quiz, setQuiz] = useState({ quiz_name: "", questions:[] });
  const [quizName, setQuizName] = useState(null);
  const [error, setError] = useState({});

  const [allOptions, setAllOptions] = useState([
    { option_value: "", is_correct: true },
    { option_value: "", is_correct: false },
  ]);
  const [question, setQuestion] = useState("");

  const handleAddQuestion =()=>{
if(!question){
  error["question"] = true;
  setError({...error})
}
allOptions.map((option, idx)=>{
if(!option.option_value){
  error[`option_error${idx}`]=true 
  setError({...error})
}
})

let is_error = false

for (const key in error) {
  if(error[key]){
    is_error = true;
  }
}
console.log(error);
console.log(is_error);
if(is_error) return
console.log("No error");
quiz.questions.push({
  question,
  allOptions
})
setQuiz({...quiz});
setQuestion("");
setAllOptions([
  { option_value: "", is_correct: true },
  { option_value: "", is_correct: false },
])
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
        <form
          className="quiz_details"
          onSubmit={(e) => {
            e.preventDefault();
            if (!quizName) {
              error["quiz_name"] = true;
              setError({ ...error });
              return;
            }
            setQuiz({ ...quiz, quiz_name: quizName });
          }}
        >
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
              <label className="font-14">Question {quiz.questions ?quiz.questions.length + 1 :"1"}</label>
              <textarea
                row="3"
                className="form-control"
                placeholder="Question"
                value={question}
                onChange={(e) => {
                  error["question"] = false;
                  setError({...error})
                  setQuestion(e.target.value)
                }}
              />
              {error["question"] &&  <div className="text-danger font-12">This field can not be empty!</div> }
            </div>
            <div className="font-14 mb-2">Add options:</div>
            <div className="options-input">
              {allOptions.map((option, idx) => (
                <div className="mb-2" >
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
                    class="form-control font-14"
                    value={option.option_value}
                    onChange={(e)=>{
                      error[`option_error${idx}`]=false 
                      setError({...error})
                      allOptions[idx].option_value = e.target.value;
                      setAllOptions([...allOptions]);
                      console.log(allOptions);
                    }}
                    placeholder={`Option ${idx + 1}`}
                  />
                </div>
                
                {error[`option_error${idx}`] && <div className="text-danger font-12 ">This field can not be empty!</div>}
                </div>
              ))}
            </div>

            <span
              className="my-2 btn btn-info text-center w-100"
              onClick={() => {
                allOptions.push({ option_value: "", is_correct: false });
                setAllOptions([...allOptions]);
              }}
            >
              Add option +
            </span>
          </form>

          <button className="my-2 btn btn-outline-warning text-center w-100" onClick={handleAddQuestion} >
            Add question +
          </button>

          <button className="my-2 btn btn-success text-center w-100">
            Publish Quiz
          </button>
        </div>
      )}
    </div>
  );
};

export default AddNewQuiz;
