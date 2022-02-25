import React, { useState, useEffect } from "react";
import "./Homepage.css";

import firebase from "firebase"

import Logo from "../Assets/logo-sm.png";
import dummyUser from "../Assets/dummy.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars } from "@fortawesome/free-solid-svg-icons";

import { connect } from "react-redux";
import { UserSelector } from "../Redux/User/User.selector";
import { createStructuredSelector } from "reselect";

import SideMenu from "./SideMenu"
import AddNewQuiz from "./AddNewQuiz";
import Loader from "./loader";
import AllQuiz from "./AllQuiz";
import { ToastProvider } from 'react-toast-notifications';

import SwipeableDrawer from '@material-ui/core/SwipeableDrawer';

const Homepage = ({ currentUser }) => {
  const [viewMode, setViewMode] = useState("Quiz");
  const [viewMode2, setViewMode2] = useState("AllQuiz");
  const [isLoading , setIsLoading] = useState(false)
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)

  const toggleDrawer = (anchor, open) => (event) => {
    if (event && event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }

    setIsDrawerOpen(open)
  };
  return (
    <ToastProvider 
    placement='bottom-right' autoDismissTimeout="3000">
    <div className="homepage">
      <span style={{
        position:"absolute",
        top:"15px",
        left:"15px"
      }}
      className="bg-light px-2 pt-1 rounded shadow cp"
      
      onClick={toggleDrawer("left", true)}
      >
        
      <FontAwesomeIcon icon={faBars} className="font-22" />
      </span>
      <SwipeableDrawer
            anchor={"left"}
            open={isDrawerOpen}
            onClose={toggleDrawer("left", false)}
            onOpen={toggleDrawer("left", true)}
          >
           <SideMenu viewMode={viewMode} show={true} setViewMode={setViewMode}  viewMode2={viewMode2} setViewMode2={setViewMode2}  currentUser={currentUser} />

          </SwipeableDrawer>
      <Loader isLoading={isLoading}/>
      <SideMenu viewMode={viewMode} setViewMode={setViewMode}  viewMode2={viewMode2} setViewMode2={setViewMode2}  currentUser={currentUser} />
      <div  >
        {viewMode2 === "AddNewQuiz" &&
        <AddNewQuiz setViewMode2={setViewMode2} setIsLoading={setIsLoading}/>
        }
        {viewMode2 === "AllQuiz" &&
        <AllQuiz setViewMode2={setViewMode2} setIsLoading={setIsLoading} currentUser={currentUser}/>
        }
      </div>
  </div>
  </ToastProvider>
  );
};

const mapStatetoProps = createStructuredSelector({
  currentUser: UserSelector,
});

export default connect(mapStatetoProps)(Homepage);
