import React from "react";

import firebase from "firebase"

import Logo from "../Assets/logo-sm.png";
import dummyUser from "../Assets/dummy.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEllipsisV,
  faList,
  faPlus,
  faPoll,
  faSignOutAlt,
  faTrophy,
} from "@fortawesome/free-solid-svg-icons";

const SideMenu = ({viewMode, setViewMode,  viewMode2 ,setViewMode2, currentUser}) => {
  return (
    <div className=" side-menu ">
      <div className="p-3">
        <img src={Logo} alt="Logo" height="40px" />
        <span className="header-text">Quiz book</span>
      </div>
      <div className=" side-menu-items">
        <div
          className={`p-2 my-2 cp ${
            viewMode === "Quiz" && "text-white font-weight-bold border-bottom"
          }`}
          onClick={() => {
            setViewMode("Quiz");
            setViewMode2("AllQuiz");
          }}
        >
          <FontAwesomeIcon icon={faTrophy} className="mr-1" /> Quiz
        </div>
        {viewMode === "Quiz" && (
          <div className="ml-3 font-13">
            <div
              className={`p-1  cp ${
                viewMode2 === "AllQuiz" && "text-white font-weight-bold"
              }`}
              onClick={() => setViewMode2("AllQuiz")}
            >
              <FontAwesomeIcon icon={faList} className="mr-1" /> All quizs
            </div>
            <div
              className={`p-1  cp ${
                viewMode2 === "AddNewQuiz" && "text-white font-weight-bold"
              }`}
              onClick={() => setViewMode2("AddNewQuiz")}
            >
              <FontAwesomeIcon icon={faPlus} className="mr-1" /> Add new quiz
            </div>
          </div>
        )}
        <div
          className={`p-2 my-2 cp ${
            viewMode === "Poll" && "text-white font-weight-bold border-bottom"
          }`}
          onClick={() => {
            setViewMode("Poll");
            setViewMode2("AllPolls");
          }}
        >
          <FontAwesomeIcon icon={faPoll} className="mr-1" /> Poll
        </div>
        {viewMode === "Poll" && (
          <div className="ml-3 font-13">
            <div
              className={`p-1  cp ${
                viewMode2 === "AllPolls" && "text-white font-weight-bold"
              }`}
              onClick={() => setViewMode2("AllPolls")}
            >
              <FontAwesomeIcon icon={faList} className="mr-1" /> All polls
            </div>
            <div
              className={`p-1  cp ${
                viewMode2 === "AddNewPoll" && "text-white font-weight-bold"
              }`}
              onClick={() => setViewMode2("AddNewPoll")}
            >
              <FontAwesomeIcon icon={faPlus} className="mr-1" /> Add new poll
            </div>
          </div>
        )}
      </div>
      <div className="bottom-user-info">
        <img
          src={dummyUser}
          alt="Logo"
          height="30px"
          className="rounded-circle mr-2"
        />
        <span>{currentUser.fName}</span>
        <span class=" dropleft">
          <span
            type="button"
            className=" float-right p-1 cp"
            data-toggle="dropdown"
            aria-haspopup="true"
            aria-expanded="false"
          >
            <FontAwesomeIcon icon={faEllipsisV} />
          </span>

          <div
            class="dropdown-menu bg-danger text-white text-center cp"
            onClick={() => firebase.auth().signOut()}
          >
            <small>
              LogOut <FontAwesomeIcon icon={faSignOutAlt} className="ml-1" />
            </small>
          </div>
        </span>
      </div>
    </div>
  );
};

export default SideMenu
