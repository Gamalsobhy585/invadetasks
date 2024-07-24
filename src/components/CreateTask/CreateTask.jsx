import React from 'react';
import { Helmet } from 'react-helmet';

import axios from 'axios';

import { Link } from 'react-router-dom';

export default function CreateTask() {
  return (
    <>
       <Helmet>
        <meta charSet="utf-8" />
        <title>Create a New Task</title>
      </Helmet>
    </>
  )
}
