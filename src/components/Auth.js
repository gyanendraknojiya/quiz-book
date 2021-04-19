import React, { useState } from "react";

import firebase from "firebase";

const Auth = () => {
  const [user, setUser] = useState({});
  const [newUser, setNewUser] = useState(false);

  const handleFormChange = (e) => {
    user[e.target.name] = e.target.value;
    setUser(user);
  };

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    const { fName, lName, email, password, confirmPassword } = user;

    if (!newUser) {
      if (!email || !password) {
        alert("Please enter your email and password!");
        return;
      }

      firebase
        .auth()
        .signInWithEmailAndPassword(email, password)
        .catch((err) => {
          console.log(err);
          alert(err.message);
        });
    } else {
      if (!fName || !lName || !email || !password || !confirmPassword) {
        alert("All fields are required!");
        return;
      }
      if (password !== confirmPassword) {
        alert("Your password do not match!");
        return;
      }

      firebase
        .auth()
        .createUserWithEmailAndPassword(email, password)
        .then((doc) => {
          console.log(doc);
          firebase
            .firestore()
            .collection("Users")
            .doc(doc.user.uid)
            .set({
              fullName: fName + " " + lName,
              fName: fName,
              lName: lName,
              email: email,
              createdAt: new Date(),
            });
        })
        .catch((err) => console.log(err));
    }
  };

  return (
    <div>
      <form onSubmit={handleLoginSubmit} className="row mx-0">
        <div className="col-lg-4 col-md-5 col-sm-8 mx-auto mt-5 px-4">
          <div className="text-center display-4 my-4 ">
            {newUser ? "SignUp" : "Login"}
          </div>
          {!newUser ? (
            <div className="text-center">
              New user?{" "}
              <span className=" text-info cp" onClick={() => setNewUser(true)}>
                SignUp
              </span>{" "}
              here...
            </div>
          ) : (
            <div className="text-center">
              Already registered?{" "}
              <span className=" text-info cp" onClick={() => setNewUser(false)}>
                Login
              </span>{" "}
              here...
            </div>
          )}
          {newUser && (
            <>
              <div className="form-group mt-3">
                <label>First Name:</label>
                <input
                  type="text"
                  name="fName"
                  placeholder="Enter your first name"
                  className="form-control"
                  onChange={handleFormChange}
                  value={user.fName}
                />
              </div>
              <div className="form-group mt-3">
                <label>Last Name:</label>
                <input
                  type="text"
                  name="lName"
                  placeholder="Enter your last name"
                  className="form-control"
                  onChange={handleFormChange}
                  value={user.lName}
                />
              </div>
            </>
          )}
          <div className="form-group mt-3">
            <label>Email:</label>
            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              className="form-control"
              onChange={handleFormChange}
              value={user.email}
            />
          </div>
          <div className="form-group">
            <label>Password:</label>
            <input
              type="password"
              name="password"
              placeholder="Enter your password"
              className="form-control"
              onChange={handleFormChange}
              value={user.password}
            />
          </div>
          {newUser && (
            <div className="form-group">
              <label>Confirm password:</label>
              <input
                type="password"
                name="confirmPassword"
                placeholder="Confirm your password"
                className="form-control"
                onChange={handleFormChange}
                value={user.confirmPassword}
              />
            </div>
          )}
          <div className="my-2 text-center">
            <button className="btn btn-primary" type="submit">
              Submit
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default Auth;
