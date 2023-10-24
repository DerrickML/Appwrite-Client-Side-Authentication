// File: public/verify.js
import { client, account } from './appwriteConfig.js'

// DOM Elements
const urlParams = new URLSearchParams(window.location.search)

// Variables
const secret = urlParams.get('secret')
const userId = urlParams.get('userId')

// Event Listeners
document.addEventListener('DOMContentLoaded', onDocumentLoaded)

function onDocumentLoaded () {
  verifyUser(userId, secret)
}

function verifyUser (userId, secret) {
  account
    .updateVerification(userId, secret)
    .then(response => {
      console.log(response)
      // Optionally redirect to a success page or update the UI to indicate successful verification
    })
    .catch(error => {
      console.error(error)
      // Optionally redirect to an error page or update the UI to indicate the verification failure
    })
}
