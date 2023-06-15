const axios = require('axios')
require('dotenv').config()

const FORM = require('./form.json')
const SUBMISSION = require('./submission.json')

NAME="Bench Mark"
SLUG="bench-mark"


function request(method, url, params, body, message) {
  return axios({
    method,
    url: process.env.HOST+url,
    data: body,
    params,
    auth: {
      username: process.env.USERNAME,
      password: process.env.PASSWORD
    }
  })
    .then(resp => console.log(`${message} SUCCESS:`, resp.data))
    .catch(error => {
      if (error.request) {
        console.log(`${message} ERROR:`, error.response.data)
      } else {
        console.log(`${message} ERROR:`, error.message)
      }
    })
}

function get() {
  request(
    "Get",
    "/app/api/v1/kapps?limit=1000",
    {
      direction:"ASC", 
      include:"details"
    },
    null,
    "From get method"
  )
}

function postKapp() {
  return request(
    'Post',
    '/app/api/v1/kapps', 
    {      
      include:"details"
    },{ 
      "name": NAME,
      "slug": SLUG,
    },
    "From postKapp method"
  )
}

function postForm() {  
  return request(
    'Post',
    `/app/api/v1/kapps/${SLUG}/forms`,
    {
      include:"details"
    },
    FORM,
    "From postForm method"
  )
}

function postSubmission() {
  return request(
    'Post',
    `/app/api/v1/kapps/${SLUG}/forms/${FORM.slug}/submissions`,
    {
      include:"values"
    },
    SUBMISSION,
    "From postSubmission method"
  )
}

function deleteKapp() {
  return request('Delete',
    `/app/api/v1/kapps/${SLUG}`,
    {
      include:"details"
    }, 
    null,
    "From deleteKapp method"
  )
}

async function initialize() {
  await postKapp();
  await postForm();
  for (x = 0; x < process.env.MAX; x++) {
    await postSubmission();
  }
}

async function cleanup() {
  await deleteKapp();
}

async function run() {
  // get();
  await initialize()
  await cleanup()
}

run()