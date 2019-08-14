import React, { Component } from "react";
import io from "socket.io-client";

import api from "../../services/api";

import { PostList } from "./styles";

import more from "../../assets/more.svg";
import like from "../../assets/like.svg";
import comment from "../../assets/comment.svg";
import send from "../../assets/send.svg";

export default class Feed extends Component {
  state = {
    feed: []
  };

  async componentDidMount() {
    this.registerToSocket();

    const response = await api.get("posts");

    this.setState({ feed: response.data });
  }

  registerToSocket() {
    const socket = io("http://localhost:3333");

    socket.on("post", newPost => {
      this.setState({
        feed: [
          newPost,
          ...this.state.feed.map(post =>
            post._id === newPost._id ? newPost : post
          )
        ]
      });
    });

    socket.on("like", likedPost => {
      this.setState({
        feed: this.state.feed.map(post =>
          post._id === likedPost._id ? likedPost : post
        )
      });
    });
  }

  handlerLike = async id => {
    await api.post(`posts/${id}/like`);
  };

  render() {
    return (
      <PostList>
        {this.state.feed.map(post => (
          <article key={post._id}>
            <header>
              <div className="user-info">
                <span>{post.author}</span>
                <span className="place">{post.place}</span>
              </div>

              <img src={more} alt="" />
            </header>

            <img src={`http://localhost:3333/files/${post.image}`} alt="" />

            <footer>
              <div className="actions">
                <img
                  src={like}
                  alt=""
                  onClick={() => this.handlerLike(post._id)}
                />
                <img src={comment} alt="" />
                <img src={send} alt="" />
              </div>

              <strong>{post.likes} curtidas</strong>

              <p>
                {post.description}
                <span>{post.hashtags}</span>
              </p>
            </footer>
          </article>
        ))}
      </PostList>
    );
  }
}
