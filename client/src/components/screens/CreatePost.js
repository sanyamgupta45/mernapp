import React, { useState, useEffect } from "react";
import { Link, useHistory } from "react-router-dom";
import M from "materialize-css";

function CreatePost() {
  const history = useHistory();
  const [title, setTitle] = useState("");
  const [image, setImage] = useState("");
  const [url, setUrl] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    fetch("/createpost", {
      method: "post",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
      body: JSON.stringify({
        title,
        description,
        photo: url,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          M.toast({ html: data.error, classes: "#c62828 red darken-3" });
        } else {
          M.toast({ html: "Post Created Successfully", classes: " green" });
          history.push("/");
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }, [url]);

  const PostDetails = (e) => {
    e.preventDefault();
    if (image) {
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
    } else {
      setUrl(null);
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
              <b>Create Post</b>
            </h4>
          </div>
          <form noValidate>
            <div className="input-field col s12">
              <input
                id="title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
              <label htmlFor="title">Title</label>
            </div>
            <div className="input-field col s12">
              <textarea
                id="description"
                className="materialize-textarea"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              ></textarea>
              <label htmlFor="description">Description</label>
            </div>
            <div className="input-field col s12">
              <div className="file-field input-field">
                <div className="btn">
                  <span>File</span>
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
                className="btn btn-large waves-effect hoverable #ff5252 red accent-1"
                onClick={PostDetails}
              >
                Post
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default CreatePost;
