import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { UserContext } from "../../App";

function SubsPosts() {
  const [data, setData] = useState([]);
  const { state, dispatch } = useContext(UserContext);
  useEffect(() => {
    fetch("/getSubPost", {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
    })
      .then((res) => res.json())
      .then((result) => {
        setData(result.posts);
      });
  }, []);

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
                style={{ color: "black" }}
              >
                <img
                  src={item.postedBy.pic}
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
              <h6>{item.title}</h6>
              <p>{item.description}</p>
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
                        onClick={(e) => deleteComment(item._id, comment._id)}
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
  );
}

export default SubsPosts;
