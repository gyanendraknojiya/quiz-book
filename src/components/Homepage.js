import React, { useState, useEffect } from "react";
import "./Homepage.css";

import firebase from "firebase"

import Logo from "../Assets/logo-sm.png";
import dummyUser from "../Assets/dummy.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
} from "@fortawesome/free-solid-svg-icons";

import { connect } from "react-redux";
import { UserSelector } from "../Redux/User/User.selector";
import { createStructuredSelector } from "reselect";

import SideMenu from "./SideMenu"
import AddNewQuiz from "./AddNewQuiz";
import Loader from "./loader";

const Homepage = ({ currentUser }) => {
  const [viewMode, setViewMode] = useState("Quiz");
  const [viewMode2, setViewMode2] = useState("AllQuiz");
  const [isLoading , setIsLoading] = useState(false)
  return (
    <div className="homepage">
      <Loader isLoading={isLoading}/>
      <SideMenu viewMode={viewMode} setViewMode={setViewMode}  viewMode2={viewMode2} setViewMode2={setViewMode2}  currentUser={currentUser} />
      <div  >
        {viewMode2 === "AddNewQuiz" &&
        <AddNewQuiz setViewMode2={setViewMode2} setIsLoading={setIsLoading}/>
        }
      </div>
  </div>
  );
};

const mapStatetoProps = createStructuredSelector({
  currentUser: UserSelector,
});

export default connect(mapStatetoProps)(Homepage);
