import React, {useState} from "react";
import {Button} from '@mui/material';

const PostItem = function (props) {
    console.log(props);
    return (
        <div className='post'>
          <div className='post_content'>
            <strong>{props.post.id}.{props.post.title}</strong>
            <div>{props.post.body}</div>
            <div className='post_btns'>
              <Button variant="contained" onClick={() => props.remove(props.post)}>Delete</Button>
              </div>
          </div>
        </div>
    )
}

export default PostItem;