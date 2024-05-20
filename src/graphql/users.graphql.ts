import { gql } from "@apollo/client";

// ------------------- MUTATIONS ------------------- //

/**
 * Registers a new user with the provided details (username, email, password, phone, and address).
 * @return {Object} The newly registered user's details and a message.
 */
export const REGISTER_USER = gql`
    mutation register(
        $username: String!,
        $email: String!,
        $password: String!,
        $phone: Int!,
        $address:String!,
    ) {
        register(registerInput: {
            username: $username,
            email: $email,
            password: $password,
            phone: $phone,
            address: $address,
        }) {
            user {
                id
                username
                email
                phone
                address
            }
            message
        }
    }
`;

/**
 * Logs in a user with the provided email and password.
 * @return {Object} The user's email and a token.
 */
export const LOGIN_USER = gql`
    mutation login(
        $email: String!,
        $password: String!,
    ) {
        login(loginInput: {
            email: $email,
            password: $password,
        }) {
            email
            token
        }
    }
`;

/**
 * Creates settings for a user specifying whether they receive emails and notifications.
 * @return {Object} The user's settings.
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
      userID
      receiveEmails
      receiveNotifications
    }
  }
`;

/**
 * Edits an existing user's details (username, email, password, phone, and address) based on their email.
 * @return {Object} The updated user's details.
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
 * Requests a password reset for the user associated with the provided email.
 * @return {Object} A message and the user's details.
 */
export const REQUEST_PASSWORD_RESET = gql`
  mutation requestPasswordReset($email: String!) {
    requestPasswordReset(email: $email) {
      message
      data {
        id
        username
        email
        isProfessional
      }
    }
  }
`;

/**
 * Resets the user's password using the provided email, reset token, and new password.
 * @return {Object} A message and the updated user's details.
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
      message
      data {
        id
        username
        email
        isProfessional
      }
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
 * @return {Object} The user's details.
 */
export const GET_USER_BY_EMAIL = gql`
  query userByEmail($email: String!) {
    userByEmail(email: $email) {
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
 * Fetches a user by their ID.
 * @param {Int} id - The ID of the user to fetch.
 * @return {Object} The user's details.
 */
export const GET_USER_BY_ID = gql`
  query userById($id: Int!) {
    userById(id: $id) {
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
 * Checks if a user has a meeting on a specific date.
 * @param {Int} id - The ID of the user.
 * @param {String} date - The date to check for meetings.
 * @return {Boolean} Whether the user has a meeting on the specified date.
 */
export const USER_MEET_BY_DATE = gql`
  query userMeetByDate($id: Int!, $date: String!) {
    userMeetByDate(id: $id, date: $date)
  }
`;

/**
 * Sends a recovery email to the user with the provided details.
 * @param {Object} user - The user details.
 * @return {Object} A message indicating the status of the email.
 */
export const SEND_USER_RECOVERY = gql`
  query sendUserRecovery($user: UserInput!) {
    sendUserRecovery(user: $user) {
      message
    }
  }
`;