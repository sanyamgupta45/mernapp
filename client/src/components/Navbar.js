import React, { useContext, useRef, useEffect, useState } from "react";
import { Link, useHistory } from "react-router-dom";
import M from "materialize-css";

import { UserContext } from "../App";

const Navbar = () => {
  const searchModal = useRef(null);
  const history = useHistory();
  const { state, dispatch } = useContext(UserContext);
  const [search, setSearch] = useState("");
  const [userDetails, setUserDetails] = useState([]);
  useEffect(() => {
    M.Modal.init(searchModal.current);
  }, []);
  const renderList = () => {
    if (state) {
      return [
        <li key="1">
          <i
            data-target="modal1"
            className="large material-icons modal-trigger"
            style={{ color: "black", cursor: "pointer" }}
          >
            search
          </i>
        </li>,
        <li key="2">
          <a
            href="https://blooming-stream-69111.herokuapp.com/"
            target="_balnk"
          >
            Video Call and Chat
          </a>
        </li>,
        <li key="3">
          <Link to="/createpost">Create post</Link>
        </li>,
        <li key="4">
          <Link to="/profile">Profile</Link>
        </li>,
        <li key="5">
          <Link to="/myFollowersPosts">Feed</Link>
        </li>,
        <li key="6">
          <button
            type="submit"
            className="btn waves-effect hoverable #ff5252 red accent-1"
            onClick={() => {
              localStorage.clear();
              dispatch({ type: "CLEAR" });
              history.push("/login");
            }}
          >
            LogOut
          </button>
        </li>,
      ];
    } else {
      return [
        <li key="7">
          <Link to="/login">Login</Link>
        </li>,
        <li key="8">
          <Link to="/register">Register</Link>
        </li>,
      ];
    }
  };
  const fetchUsers = (query) => {
    setSearch(query);
    if (query.length > 0) {
      fetch("/search-users", {
        method: "post",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("jwt"),
        },
        body: JSON.stringify({
          query,
        }),
      })
        .then((res) => res.json())
        .then((result) => {
          setUserDetails(result.user);
        });
    } else {
      setUserDetails([]);
    }
  };
  return (
    <nav>
      <div className="nav-wrapper">
        <Link
          to={state ? "/" : "/login"}
          className="brand-logo left"
          style={{ padding: "0 25px" }}
        >
          ProjektHouse
        </Link>
        <ul
          id="nav-mobile"
          className="right hide-on-med-and-down"
          style={{ padding: "0 25px" }}
        >
          {renderList()}
        </ul>
      </div>
      <div id="modal1" className="modal" ref={searchModal}>
        <div className="modal-content">
          <input
            type="text"
            placeholder="search a user"
            value={search}
            onChange={(e) => fetchUsers(e.target.value)}
          />
          <ul
            class="collection"
            style={{ display: "flex", flexDirection: "column" }}
          >
            {userDetails.map((user) => {
              return (
                <li class="collection-item avatar" style={{ color: "black" }}>
                  <img src={user.pic} alt="profile pic" class="circle" />
                  <span class="title">{user.name}</span>
                  <p>{user.email}</p>
                  <Link
                    class="secondary-content modal-close"
                    to={
                      user._id !== state._id
                        ? `/profile/` + user._id
                        : "/profile"
                    }
                  >
                    <i class="material-icons">send</i>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
        <div className="modal-footer">
          <button
            className="modal-close waves-effect waves-green btn-flat"
            onClick={() => {
              setSearch("");
              setUserDetails([]);
            }}
          >
            close
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
