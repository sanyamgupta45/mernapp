import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "../../App";
import { Link } from "react-router-dom";

function Profile() {
  const [data, setData] = useState([]);
  const [image, setImage] = useState("");
  const { state, dispatch } = useContext(UserContext);
  useEffect(() => {
    fetch("/mypost", {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
    })
      .then((res) => res.json())
      .then((result) => {
        setData(result.myposts);
      });
  }, []);
  useEffect(() => {
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
          fetch("/updatepic", {
            method: "put",
            headers: {
              "Content-Type": "application/json",
              Authorization: "Bearer " + localStorage.getItem("jwt"),
            },
            body: JSON.stringify({
              pic: data.url,
            }),
          })
            .then((res) => res.json())
            .then((result) => {
              localStorage.setItem(
                "user",
                JSON.stringify({ ...state, pic: result.pic })
              );
              dispatch({ type: "UPDATE_PIC", payload: result.pic });
            });
        })
        .catch((err) => {
          console.log(err.response);
        });
    }
  }, [image]);
  const updatePhoto = (file) => {
    setImage(file);
  };
  const likePost = (id) => {
    fetch("/like", {
      method: "put",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
      body: JSON.stringify({
        postId: id,
      }),
    })
      .then((res) => res.json())
      .then((result) => {
        const newData = data.map((item) => {
          if (result._id == item._id) return result;
          else return item;
        });
        setData(newData);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const unlikePost = (id) => {
    fetch("/unlike", {
      method: "put",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
      body: JSON.stringify({
        postId: id,
      }),
    })
      .then((res) => res.json())
      .then((result) => {
        const newData = data.map((item) => {
          if (result._id == item._id) return result;
          else return item;
        });
        setData(newData);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const makeComment = (text, postId) => {
    fetch("/comment", {
      method: "put",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
      body: JSON.stringify({
        postId,
        text,
      }),
    })
      .then((res) => res.json())
      .then((result) => {
        const newData = data.map((item) => {
          if (result._id == item._id) return result;
          else return item;
        });
        setData(newData);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const deletePost = (postId) => {
    fetch(`/deletepost/${postId}`, {
      method: "delete",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
    })
      .then((res) => res.json())
      .then((result) => {
        const newData = data.filter((item) => {
          return item._id != result._id;
        });
        setData(newData);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const deleteComment = (postId, commentId) => {
    fetch(`/deletecomment/${postId}/${commentId}`, {
      method: "delete",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
    })
      .then((res) => res.json())
      .then((result) => {
        const newData = data.map((item) => {
          if (result._id == item._id) return result;
          else return item;
        });
        setData(newData);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  return (
    <>
      {state ? (
        <div className="container" style={{ maxWidth: "900px" }}>
          <div
            style={{
              margin: "30px 10px",
              borderBottom: "1px solid",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-around",
              }}
            >
              <div>
                <img
                  style={{
                    height: "200px",
                    width: "200px",
                    borderRadius: "50%",
                  }}
                  src={state ? state.pic : "loading.."}
                />
                <div className="file-field input-field">
                  <div className="btn" style={{ marginBottom: "1rem" }}>
                    <span>Update Profile Image</span>
                    <input
                      type="file"
                      onChange={(e) => updatePhoto(e.target.files[0])}
                    />
                  </div>
                  <div className="file-path-wrapper" style={{ width: "0" }}>
                    <input className="file-path validate" type="text" />
                  </div>
                </div>
              </div>
              <div>
                <h4>{state ? state.name : ""}</h4>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    width: "110%",
                  }}
                >
                  <h6>{data.length} Posts</h6>
                  <h6>{state.followers.length} Followers</h6>
                  <h6>{state.following.length} Following</h6>
                </div>
              </div>
            </div>
          </div>
          {/* <div className="gallery">
            {data.map((item) => {
              return <img className="item" src={item.photo} key={item._id} />;
            })}
          </div> */}
          <div className="home container">
            {data.map((item) => {
              return (
                <div className="card home-card" key={item._id}>
                  <h5 style={{ padding: "10px 15px" }}>
                    <Link
                      to={
                        item.postedBy._id !== state._id
                          ? `/profile/` + item.postedBy._id
                          : "/profile"
                      }
                      style={{
                        color: "black",
                      }}
                      className="namePost"
                    >
                      <img
                        src={state.pic}
                        style={{
                          height: "40px",
                          width: "40px",
                          borderRadius: "50%",
                          marginRight: "10px",
                          padding: "0",
                          marginBottom: "-15px",
                        }}
                      />
                      {item.postedBy.name}
                    </Link>{" "}
                    {item.postedBy._id == state._id ? (
                      <i
                        className="material-icons"
                        style={{ float: "right", cursor: "pointer" }}
                        onClick={(e) => deletePost(item._id)}
                      >
                        delete
                      </i>
                    ) : (
                      ""
                    )}
                  </h5>
                  <hr></hr>
                  <div style={{ paddingLeft: "25px" }}>
                    <p style={{ fontSize: "21px" }}>
                      <b>{item.title}</b>
                    </p>

                    <p style={{ fontSize: "18px" }}>{item.description}</p>
                  </div>
                  <div className="card-image">
                    <img src={item.photo} />
                  </div>
                  <div className="card-content">
                    <i
                      className="material-icons"
                      style={{ cursor: "pointer", marginRight: "15px" }}
                    >
                      favorite_border
                    </i>
                    {item.likes.includes(state._id) ? (
                      <i
                        className="material-icons"
                        onClick={() => unlikePost(item._id)}
                        style={{ cursor: "pointer" }}
                      >
                        thumb_down
                      </i>
                    ) : (
                      <i
                        className="material-icons"
                        onClick={() => likePost(item._id)}
                        style={{ cursor: "pointer" }}
                      >
                        thumb_up
                      </i>
                    )}

                    <h6>{item.likes.length} Likes</h6>

                    <b>
                      <h6 style={{ fontWeight: "900" }}>
                        <u>Comments</u>
                      </h6>
                    </b>
                    {item.comments.map((comment) => {
                      return (
                        <h6 key={comment._id}>
                          <span style={{ fontWeight: "700" }}>
                            {comment.postedBy.name}
                          </span>
                          {" : "}
                          {comment.text}
                          {(item.postedBy._id == state._id ||
                            comment.postedBy._id == state._id) && (
                            <i
                              className="material-icons"
                              style={{ float: "right", cursor: "pointer" }}
                              onClick={(e) =>
                                deleteComment(item._id, comment._id)
                              }
                            >
                              delete
                            </i>
                          )}
                        </h6>
                      );
                    })}
                    <form
                      onSubmit={(e) => {
                        e.preventDefault();
                        makeComment(e.target[0].value, item._id);
                      }}
                    >
                      <input type="text" placeholder="Add comment here" />
                    </form>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <h2>Loading....</h2>
      )}
    </>
  );
}

export default Profile;
