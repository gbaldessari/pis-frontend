import { gql } from "@apollo/client";

// ------------------- MUTATIONS ------------------- //

/**
 
Verifies a token and returns the user payload.
@return {Object} The user payload containing id, email, iat, and exp.
*/
export const VERIFY_TOKEN = gql`
  mutation verifyToken {
    verifyToken {
      id
      email
      iat
      exp
    }
  }
`;

/**
 * Registers a new user with the provided details (username, email, password, phone, address, and isProfessional).
 * @return {Object} The newly registered user's details, a message, and a success flag.
 */
export const REGISTER_USER = gql`
  mutation register(
    $username: String!,
    $email: String!,
    $password: String!,
    $phone: Int!,
    $address: String!,
    $isProfessional: Boolean
  ) {
    register(registerInput: {
      username: $username,
      email: $email,
      password: $password,
      phone: $phone,
      address: $address,
      isProfessional: $isProfessional
    }) {
      data
      message
      success
    }
  }
`;

/**
 * Logs in a user with the provided email and password.
 * @return {Object} The user's email, a token, a message, and a success flag.
 */
export const LOGIN_USER = gql`
  mutation login(
    $email: String!,
    $password: String!
  ) {
    login(loginInput: {
      email: $email,
      password: $password
    }) {
      data {
        token
        email
      }
      message
      success
    }
  }
`;

/**
 * Creates settings for a user specifying whether they receive emails and notifications.
 * @return {Object} The user's settings details, a message, and a success flag.
 */
export const CREATE_USER_SETTINGS = gql`
  mutation createUserSettings(
    $userID: Int!,
    $receiveEmails: Boolean!,
    $receiveNotifications: Boolean!
  ) {
    createUserSettings(userSettingsInput: {
      userID: $userID,
      receiveEmails: $receiveEmails,
      receiveNotifications: $receiveNotifications
    }) {
      data
      message
      success
    }
  }
`;

/**
 * Edits an existing user's details (username, email, password, phone, and address) based on their email.
 * @return {Object} The updated user's details, a message, and a success flag.
 */
export const EDIT_USER = gql`
  mutation editUser(
    $email: String!,
    $username: String,
    $password: String,
    $phone: Int,
    $address: String
  ) {
    editUser(
      email: $email,
      editUserInput: {
        username: $username,
        email: $email,
        password: $password,
        phone: $phone,
        address: $address
      }
    ) {
      data
      message
      success
    }
  }
`;

/**
 * Requests a password reset for the user associated with the provided email.
 * @return {Object} A message, the user's details, and a success flag.
 */
export const REQUEST_PASSWORD_RESET = gql`
  mutation requestPasswordReset($email: String!) {
    requestPasswordReset(email: $email) {
      data
      message
      success
    }
  }
`;

/**
 * Resets the user's password using the provided email, reset token, and new password.
 * @return {Object} A message, the updated user's details, and a success flag.
 */
export const RESET_PASSWORD = gql`
  mutation resetPassword(
    $email: String!,
    $resetPasswordToken: String!,
    $password: String!
  ) {
    resetPassword(resetPasswordInput: {
      email: $email,
      resetPasswordToken: $resetPasswordToken,
      password: $password
    }) {
      data
      message
      success
    }
  }
`;

// ------------------- QUERIES ------------------- //

/**
 * Fetches a list of all users.
 * @return {Array} A list of users.
 */
export const GET_USERS = gql`
  query {
    users {
      id
      username
      email
      phone
      address
      isProfessional
    }
  }
`;

/**
 * Fetches a user by their email.
 * @param {String} email - The email of the user to fetch.
 * @return {Object} The user's details and a success flag.
 */
export const GET_USER_BY_EMAIL = gql`
  query userByEmail($email: String!) {
    userByEmail(email: $email) {
      data {
        id
        username
        email
        phone
        address
        isProfessional
      }
      success
    }
  }
`;

/**
 * Fetches a user by their ID.
 * @param {Int} id - The ID of the user to fetch.
 * @return {Object} The user's details and a success flag.
 */
export const GET_USER_BY_ID = gql`
  query userById($id: Int!) {
    userById(id: $id) {
      data {
        id
        username
        email
        phone
        address
        isProfessional
      }
      success
    }
  }
`;

/**
 * Checks if a user has a meeting on a specific date.
 * @param {Int} id - The ID of the user.
 * @param {String} date - The date to check for meetings.
 * @return {Object} Whether the user has a meeting on the specified date and a success flag.
 */
export const USER_MEET_BY_DATE = gql`
  query userMeetByDate($id: Int!, $date: String!) {
    userMeetByDate(id: $id, date: $date) {
      data
      message
      success
    }
  }
`;

/**
 * Sends a recovery email to the user with the provided details.
 * @param {Object} user - The user details.
 * @return {Object} A message indicating the status of the email, the user's details, and a success flag.
 */
export const SEND_USER_RECOVERY = gql`
  query sendUserRecovery($user: UserInput!) {
    sendUserRecovery(user: $user) {
      data
      message
      success
    }
  }
`;