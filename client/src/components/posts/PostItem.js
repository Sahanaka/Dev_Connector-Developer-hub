import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';

import formatDate from '../../utils/formatDate';

const PostItem = ({ auth,
    post: { _id, text, name, avatar, user, likes, comments, date } }) => {
    return (
        <div class="post bg-white p-1 my-1">
            <div>
                <a href="profile.html">
                    <img
                        class="round-img"
                        src="https://www.gravatar.com/avatar/205e460b479e2e5b48aec07710c08d50?s=200"
                        alt=""
                    />
                    <h4>John Doe</h4>
                </a>
            </div>
            <div>
                <p class="my-1">
                    Lorem ipsum dolor sit amet consectetur adipisicing elit. Sint
                    possimus corporis sunt necessitatibus! Minus nesciunt soluta
                    suscipit nobis. Amet accusamus distinctio cupiditate blanditiis
                    dolor? Illo perferendis eveniet cum cupiditate aliquam?
          </p>
                <p class="post-date">
                    Posted on 04/16/2019
          </p>
                <button type="button" class="btn btn-light">
                    <i class="fas fa-thumbs-up"></i>
                    <span>4</span>
                </button>
                <button type="button" class="btn btn-light">
                    <i class="fas fa-thumbs-down"></i>
                </button>
                <a href="post.html" class="btn btn-primary">
                    Discussion <span class='comment-count'>2</span>
                </a>
                <button
                    type="button"
                    class="btn btn-danger"
                >
                    <i class="fas fa-times"></i>
                </button>
            </div>
        </div>
    )
};

PostItem.propTypes = {
    post: PropTypes.object.isRequired,
    auth: PropTypes.object.isRequired,
};

const mapStateToProps = state => ({
    auth: state.auth
});

export default connect(mapStateToProps, {})(PostItem);
