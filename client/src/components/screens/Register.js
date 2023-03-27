import React, { useState, useEffect } from "react";
import { Link, useHistory } from "react-router-dom";
import Axios from "axios";
import M from "materialize-css";

function Register() {
  const history = useHistory();
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [image, setImage] = useState("");
  const [url, setUrl] = useState(undefined);
  useEffect(() => {
    if (url) {
      uploadFields();
    }
  }, [url]);
  const uploadImage = () => {
    const data = new FormData();
    data.append("file", image);
    data.append("upload_preset", "projekthouse");
    data.append("cloud_name", "jainsanchit");
    fetch("https://api.cloudinary.com/v1_1/jainsanchit/image/upload", {
      method: "POST",
      body: data,
    })
      .then((response) => response.json()) // keep it in one line else use return res.json()
      .then((data) => {
        setUrl(data.url);
      })
      .catch((err) => {
        console.log(err.response);
      });
  };
  const uploadFields = () => {
    if (
      !/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
        email
      )
    ) {
      M.toast({
        html: "Invalid Email address",
        classes: "c62828 red darken-3",
      });
      return;
    }
    Axios.post("/signup", {
      name,
      email,
      password,
      pic: url,
    })
      .then((res) => {
        M.toast({ html: res.data.message, classes: " green" });
        history.push("/login");
      })
      .catch((err) => {
        M.toast({
          html: err.response.data.error,
          classes: "c62828 red darken-3",
        });
      });
  };
  const PostData = (e) => {
    e.preventDefault();
    if (image) {
      uploadImage();
    } else {
      uploadFields();
    }
  };
  return (
    <div className="container">
      <div style={{ marginTop: "4rem" }} className="row">
        <div className="col s8 offset-s2">
          <Link to="/" className="btn-flat waves-effect">
            <i className="material-icons left">keyboard_backspace</i>
            Back to home
          </Link>
          <div className="col s12" style={{ paddingLeft: "11.250px" }}>
            <h4>
              <b>Register</b> below
            </h4>
            <p className="grey-text text-darken-1">
              Already have an account? <Link to="/login">Login</Link>
            </p>
          </div>
          <form noValidate>
            <div className="input-field col s12">
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <label htmlFor="name">Name</label>
            </div>
            <div className="input-field col s12">
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <label htmlFor="email">Email</label>
            </div>
            <div className="input-field col s12">
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <label htmlFor="password">Password</label>
            </div>
            <div className="input-field col s12">
              <div className="file-field input-field">
                <div className="btn">
                  <span>Upload Profile Image</span>
                  <input
                    type="file"
                    onChange={(e) => setImage(e.target.files[0])}
                  />
                </div>
                <div className="file-path-wrapper">
                  <input className="file-path validate" type="text" />
                </div>
              </div>
            </div>

            <div className="col s12" style={{ paddingLeft: "11.250px" }}>
              <button
                style={{
                  width: "150px",
                  borderRadius: "3px",
                  letterSpacing: "1.5px",
                  marginTop: "1rem",
                }}
                type="submit"
                className="btn btn-large waves-effect  hoverable #ff5252 red accent-1"
                onClick={PostData}
              >
                Register
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Register;
