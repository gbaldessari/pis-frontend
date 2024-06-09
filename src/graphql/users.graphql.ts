import { gql } from "@apollo/client";

// ------------------- MUTATIONS ------------------- //

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
 * @return {Object} The user's token, email, a message, and a success flag.
 */
export const LOGIN_USER = gql`
  mutation login($email: String!, $password: String!) {
    login(loginInput: {email: $email, password: $password}) {
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
 * Edits an existing user's details.
 * @return {Object} A message and a success flag.
 */
export const EDIT_USER = gql`
  mutation editUser(
    $username: String,
    $email: String,
    $password: String,
    $phone: Int,
    $address: String,
    $isProfessional: Boolean
  ) {
    editUser(editUserInput: {
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
 * Requests a password reset for a user by email.
 * @return {Object} A message and a success flag.
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
 * Resets a user's password using a reset token.
 * @return {Object} A message and a success flag.
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

/**
 * Verifies a user's token.
 * @return {Object} The user's id, email, issued at timestamp, and expiration timestamp.
 */
export const VERIFY_TOKEN = gql`
  mutation verifyToken {
    verifyToken {
      id
      email
      isAdmin
      iat
      exp
    }
  }
`;

// ------------------- QUERIES ------------------- //

/**
 * Fetches a list of all users.
 * @return {Object[]} A list of users.
 */
export const GET_USERS = gql`
  query users {
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
 * Fetches the total sales generated.
 * @return {Object} The total sales amount, a message, and a success flag.
 */
export const GET_TOTAL_SALES = gql`
  query totalSalesGenerated {
    totalSalesGenerated {
      data
      message
      success
    }
  }
`;

/**
 * Fetches the total sales for the current month.
 * @return {Object} The total sales amount for the month, a message, and a success flag.
 */
export const GET_TOTAL_SALES_MONTH = gql`
  query totalSalesMonth {
    totalSalesMonth {
      data
      message
      success
    }
  }
`;

/**
 * Fetches the five favorite jobs.
 * @return {Object} A list of five favorite jobs, a message, and a success flag.
 */
export const GET_FIVE_FAVORITE_JOBS = gql`
  query fiveFavoritesJobs {
    fiveFavoritesJobs {
      data {
        id
        jobName
        description
        averageRate
        idCategory {
          id
          name
        }
        idProfessional {
          id
          username
          email
        }
        requestsCount
      }
      message
      success
    }
  }
`;

/**
 * Fetches available times for a specific date.
 * @param {String} date - The date to fetch available times for.
 * @return {String[]} A list of available times for the specified date.
 */
export const GET_AVAILABLE_TIMES = gql`
  query getAvailableTimes($date: String!) {
    getAvailableTimes(date: $date)
  }
`;
