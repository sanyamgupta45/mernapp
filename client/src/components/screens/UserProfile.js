import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { UserContext } from "../../App";
import { Link } from "react-router-dom";

function UserProfile() {
  const [userProfile, setUserProfile] = useState(null);
  const [data, setData] = useState([]);
  const { state, dispatch } = useContext(UserContext);
  const { userId } = useParams();
  useEffect(() => {
    fetch(`/user/${userId}`, {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
    })
      .then((res) => res.json())
      .then((result) => {
        setUserProfile(result);
        setData(result.posts);
      });
  }, []);

  const followUser = () => {
    fetch("/follow", {
      method: "put",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
      body: JSON.stringify({
        followId: userId,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        dispatch({
          type: "UPDATE",
          payload: { following: data.following, followers: data.followers },
        });
        localStorage.setItem("user", JSON.stringify(data));
        setUserProfile((prevState) => {
          return {
            ...prevState,
            user: {
              ...prevState.user,
              followers: [...prevState.user.followers, data._id],
            },
          };
        });
        // setFollowed(false);
      });
  };

  const unfollowUser = () => {
    fetch("/unfollow", {
      method: "put",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
      body: JSON.stringify({
        unfollowId: userId,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        dispatch({
          type: "UPDATE",
          payload: { following: data.following, followers: data.followers },
        });
        localStorage.setItem("user", JSON.stringify(data));
        setUserProfile((prevState) => {
          const newFollowers = prevState.user.followers.filter(
            (item) => item != data._id
          );
          return {
            ...prevState,
            user: {
              ...prevState.user,
              followers: newFollowers,
            },
          };
        });
        // setFollowed(true);
      });
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
      {userProfile ? (
        <div className="container" style={{ maxWidth: "900px" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-around",
              margin: "30px 10px",
              borderBottom: "1px solid",
            }}
          >
            <div>
              <img
                style={{ height: "200px", width: "200px", borderRadius: "50%" }}
                src={userProfile.user ? userProfile.user.pic : "loading.."}
              />
            </div>
            <div>
              <h4>{userProfile.user.name}</h4>
              <h5>{userProfile.user.email}</h5>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  width: "110%",
                }}
              >
                <h6>{userProfile.posts.length} Posts</h6>
                <h6>{userProfile.user.followers.length} followers</h6>
                <h6>{userProfile.user.following.length} following</h6>
              </div>
              {userProfile.user.followers.includes(state._id) ? (
                <button
                  style={{
                    width: "120px",
                    borderRadius: "3px",
                    letterSpacing: "1.5px",
                    marginTop: "1rem",
                    marginBottom: "1rem",
                  }}
                  type="submit"
                  className="btn btn-medium waves-effect hoverable #ff5252 red accent-1"
                  onClick={() => unfollowUser()}
                >
                  UnFollow
                </button>
              ) : (
                <button
                  style={{
                    width: "100px",
                    borderRadius: "3px",
                    letterSpacing: "1.5px",
                    marginTop: "1rem",
                    marginBottom: "1rem",
                  }}
                  type="submit"
                  className="btn btn-medium waves-effect hoverable #ff5252 red accent-1"
                  onClick={() => followUser()}
                >
                  Follow
                </button>
              )}
            </div>
          </div>
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
                        src={userProfile.user.pic}
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

export default UserProfile;
