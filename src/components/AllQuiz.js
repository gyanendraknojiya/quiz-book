import {
  faCircleNotch,
  faFrown,
  faSearch,
  faTrophy,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useState } from "react";

import Accordion from "@material-ui/core/Accordion";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";

import firebase from "firebase";
import BgImage from "../Assets/bg2.png";
import Swal from "sweetalert2";

import { useToasts } from "react-toast-notifications";
import AddNewQuiz from "./AddNewQuiz";

const AllQuiz = ({ setViewMode2, currentUser, setIsLoading }) => {
  const [AllQuiz, setAllQuiz] = useState([]);
  const [isLoadingAllQuiz, setIsLoadingAllQuiz] = useState(true);
  const [expanded, setExpanded] = useState(false);

  const [editQuizId, setEditQuizId] = useState(null);

  const [isCopied, setIsCopied] = useState(false);

  useEffect(() => {
    if (isCopied) {
      setTimeout(() => {
        setIsCopied(false);
      }, [2000]);
    }
  }, [isCopied]);

  const { addToast } = useToasts();

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  useEffect(() => {
    firebase
      .firestore()
      .collection("quiz")
      .where("created_by", "==", currentUser.id)
      .orderBy("created_at", "desc")
      .onSnapshot((doc) => {
        console.log(doc);

        let tempAllQuiz = [];
        if (!doc.empty) {
          doc.docs.map((quiz) => {
            console.log(quiz.data());
            tempAllQuiz.push({ ...quiz.data(), id: quiz.id });
          });
        }
        setIsLoadingAllQuiz(false);
        setAllQuiz(tempAllQuiz);
      });
  }, []);

  const handleDeleteQuiz = (id) => {
    Swal.fire({
      title: "warning!",
      text: "Do you want to continue",
      icon: "error",
      background: "#000",
      showDenyButton: true,
      confirmButtonText: "Yes",
      denyButtonColor: "green",
      confirmButtonColor: "red",
      focusConfirm: false,
    }).then((value) => {
      if (value.isConfirmed) {
        setIsLoading(true);
        firebase
          .firestore()
          .collection("quiz")
          .doc(id)
          .delete()
          .then(() => {
            setIsLoading(false);
            addToast("Done! Quiz deleted successfully....", {
              appearance: "success",
              autoDismiss: true,
            });
          })
          .catch((err) => {
            setIsLoading(false);
            console.log(err);
            addToast("Something went wrong! Please try again...", {
              appearance: "error",
              autoDismiss: true,
            });
          });
      }
    });
  };

  const CopyUrl = (value) => {
    var input = document.createElement("input");
    input.value = value;
    document.body.appendChild(input);
    input.select();
    try {
      setIsCopied(true);
      return document.execCommand("copy"); 
    } catch (err) {
      console.warn("Copy to clipboard failed.", err);
      return false;
    } finally {
      document.body.removeChild(input);
    }
  };

  return !editQuizId ? (
    <div className="AllQuiz" style={{ backgroundImage: `url(${BgImage})` }}>
      <div className="bg-black AllQuiz-box">
        <div className="bg-info p-2 rounded text-dark font-weight-bold">
          <span>
            <FontAwesomeIcon icon={faTrophy} className="mr-2" />
            All quiz
          </span>
          <span className="float-right cp">
            <FontAwesomeIcon icon={faSearch} />
          </span>
        </div>
        <div className="text-center my-3">
          <span
            className="btn btn-primary btn-sm shadow px-5 rounded-pill"
            onClick={() => setViewMode2("AddNewQuiz")}
          >
            Add new quiz +
          </span>
        </div>
        <div className="p-2">
          {isLoadingAllQuiz ? (
            <div className="py-3 text-center">
              <span className="text-success mb-2">
                <FontAwesomeIcon
                  className="fa-spin"
                  icon={faCircleNotch}
                  size="2x"
                />
              </span>
              <br />
              <small>Loading all quiz... Please wait!</small>
            </div>
          ) : AllQuiz.length ? (
            <div>
              {AllQuiz.map((quiz, idx) => (
                <Accordion
                  expanded={expanded === `panel ${idx}`}
                  onChange={handleChange(`panel ${idx}`)}
                  className="bg-black-light text-light rounded"
                >
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    className="w-100"
                  >
                    <span className="font-14">
                      {idx + 1}.{" "}
                      {quiz.quiz_name.length > 25
                        ? quiz.quiz_name.slice(0, 25) + "..."
                        : quiz.quiz_name}
                    </span>
                    <br />
                    <span className="ml-auto  font-12 text-warning">
                      {quiz.created_at?.toDate().toDateString()}
                      {/* {quiz.created_at.toDate().toLocaleTimeString()} */}
                    </span>
                  </AccordionSummary>
                  <AccordionDetails className="bg-secondary">
                    <div className="w-100">
                      <h6 className="text-center text-dark font-weight-bold">
                        Quiz title
                      </h6>
                      <div className="font-13">{quiz.quiz_name}</div>
                      <table className="table mt-2 mb-0">
                        <tr>
                          <td className="font-weight-bold">Total Questions:</td>
                          <td>{quiz.number_of_question}</td>
                        </tr>
                        <tr>
                          <td className="font-weight-bold">Attempted by:</td>
                          <td>
                            {quiz.attempted_by?.length
                              ? quiz.attempted_by.length + 1
                              : 0}
                          </td>
                        </tr>
                      </table>
                      <div className="row mx-0">
                        <div className="col-12">Actions:</div>
                        <div className="col-6 my-2">
                          <span
                            className="btn btn-sm btn-warning w-100"
                            onClick={() => setEditQuizId(quiz.id)}
                          >
                            Edit
                          </span>
                        </div>
                        <div className="col-6 my-2">
                          <span
                            className="btn btn-sm btn-danger w-100"
                            onClick={() => handleDeleteQuiz(quiz.id)}
                          >
                            Delete
                          </span>
                        </div>
                        <div className="col-6">
                          <span className="btn btn-sm btn-info w-100">
                            View responses
                          </span>
                        </div>
                        <div className="col-6">
                          <span
                            className="btn btn-sm btn-success w-100"
                            onClick={() =>
                              CopyUrl(
                                window.location.protocol +
                                  "//" +
                                  window.location.host +
                                  "/attemptQuiz/" +
                                  quiz.short_id
                              )
                            }
                          >
                            {isCopied ? "Copied!" : "Copy link"}
                          </span>
                          <input
                            type="hidden"
                            id="linkUrl"
                            value={
                              window.location.protocol +
                              "//" +
                              window.location.host +
                              "/attemptQuiz/" +
                              quiz.short_id
                            }
                          />
                        </div>
                      </div>
                    </div>
                  </AccordionDetails>
                </Accordion>
              ))}
            </div>
          ) : (
            <div className=" text-center">
              <FontAwesomeIcon icon={faFrown} size="2x" />
              <br /> No quiz added!
              <br />
              <i>
                <small>Please add a quiz.</small>
              </i>
            </div>
          )}
        </div>
      </div>
    </div>
  ) : (
    <AddNewQuiz
      setViewMode2={setViewMode2}
      setIsLoading={setIsLoading}
      editQuizId={editQuizId}
      setEditQuizId={setEditQuizId}
    />
  );
};

export default AllQuiz;
