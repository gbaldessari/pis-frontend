import { gql } from '@apollo/client';

// ------------------- QUERIES ------------------- //

// ------------------- Users ------------------- //

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
 * Fetches the current logged-in user.
 * @return {Object} The user details and a success flag.
 */
export const GET_USER = gql`
  query user {
    user {
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
 * Fetches the meets of the current logged-in user.
 * @return {Object[]} A list of meets for the user, a message, and a success flag.
 */
export const GET_USER_MEETS = gql`
  query getUserMeets {
    getUserMeets {
      data {
        id
        idJob {
          id
          jobName
          description
          averageRate
          idCategory {
            id
            categoryName
          }
          idProfessional {
            id
            username
            email
          }
          requestsCount
        }
        meetDate
        startTime
        endTime
        isDone
      }
      message
      success
    }
  }
`;

/**
 * Fetches the total sales generated.
 * @return {Object} The total sales data, a message, and a success flag.
 */
export const GET_TOTAL_SALES_GENERATED = gql`
  query totalSalesGenerated {
    totalSalesGenerated {
      data
      message
      success
    }
  }
`;

/**
 * Fetches the total sales for the month.
 * @return {Object} The total sales data, a message, and a success flag.
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
 * Fetches five favorite jobs.
 * @return {Object[]} A list of five favorite jobs, a message, and a success flag.
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
          categoryName
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

export const GET_AVAILABLE_TIMES = gql`
  query getAvailableTimes($idProfessional: Int!, $date: String!) {
    getAvailableTimes(avaibleTimesInput: { idProfessional: $idProfessional, date: $date }) {
      data
      message
      success
    }
  }
`;

/**Fetches a list of all reviews.
@return {Object[]} A list of reviews.
*/
export const GET_USER_REVIEWS = gql`
query getUserReviews {
  getUserReviews {
    data {
      id
      comment
      rate
      job {
        id
        jobName
      }
      user {
        id
        username
        email
      }
    }
    message
    success
  }
}
`;

// ------------------- MUTATIONS ------------------- //

// ------------------- Users ------------------- //

/**
 * Registers a new user.
 * @param {String} username - The username of the user.
 * @param {String} email - The email of the user.
 * @param {String} password - The password of the user.
 * @param {Int} phone - The phone number of the user.
 * @param {String} address - The address of the user.
 * @param {Boolean} isProfessional - Whether the user is a professional.
 * @return {Object} A message and a success flag.
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
 * Logs in a user.
 * @param {String} email - The email of the user.
 * @param {String} password - The password of the user.
 * @return {Object} The login token, email, a message, and a success flag.
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
 * Edits a user's details.
 * @param {Int} userID - The ID of the user.
 * @param {String} username - The new username of the user.
 * @param {String} email - The new email of the user.
 * @param {String} password - The new password of the user.
 * @param {Int} phone - The new phone number of the user.
 * @param {String} address - The new address of the user.
 * @param {Boolean} isProfessional - The new professional status of the user.
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
 * Requests a password reset.
 * @param {String} email - The email of the user.
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
 * Resets a user's password.
 * @param {String} email - The email of the user.
 * @param {String} resetPasswordToken - The reset password token.
 * @param {String} password - The new password.
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
 * Verifies a token.
 * @return {Object} The token payload (ID, email, isAdmin, iat, exp).
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
