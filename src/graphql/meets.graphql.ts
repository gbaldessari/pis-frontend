import { gql } from "@apollo/client";

// ------------------- QUERIES ------------------- //

// ------------------- Meets ------------------- //

/**
 * Fetches a list of all meets.
 * @return {Object[]} A list of meets.
 */
export const GET_MEETS = gql`
  query meets {
    meets {
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
          address
        }
        requestsCount
      }
      idUser {
        id
        username
        email
        phone
        address
        isProfessional
      }
      meetDate
      startTime
      endTime
      isDone
    }
  }
`;

export const GET_MEET = gql`
  query meet($id: Int!) {
    meet(id: $id) {
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
            phone
            address
          }
          requestsCount
        }
        idUser {
          id
          username
          email
          phone
          address
        }
        meetDate
        startTime
        endTime
        isDone
      }
      success
    }
  }
`;

/**
 
Fetches the meets of the current logged-in user.
@return {Object[]} A list of meets for the user.
*/
export const GET_USER_MEETS = gql`
  query getUserMeets {
    getUserMeets {
    data{
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
          address
        }
        requestsCount
      }
      idUser {
        id
        username
        email
        address
      }
      meetDate
      startTime
      endTime
      isDone
    }
  }
  }
`;

export const GET_PROFESSIONAL_MEETS = gql`
  query getProfessionalMeets {
    getProfessionalMeets {
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
// ------------------- MUTATIONS ------------------- //

// ------------------- Meets ------------------- //

/**
 * Creates a new meet.
 * @param {Int} idJob - The ID of the job associated with the meet.
 * @param {String} meetDate - The date of the meet.
 * @param {String} startTime - The start time of the meet.
 * @param {String} endTime - The end time of the meet.
 * @return {Object} The created meet details, a message, and a success flag.
 */
export const CREATE_MEET = gql`
  mutation createMeet(
    $idJob: Int!,
    $meetDate: String!,
    $startTime: String!,
    $endTime: String!
  ) {
    createMeet(createMeetInput: {
      idJob: $idJob,
      meetDate: $meetDate,
      startTime: $startTime,
      endTime: $endTime
    }) {
      data {
        id
        idJob {
          id
          jobName
        }
        idUser {
          id
          username
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
 * Marks a meet as finished.
 * @param {Int} idMeet - The ID of the meet to mark as finished.
 * @return {Object} The updated meet details, a message, and a success flag.
 */
export const FINISH_MEET = gql`
  mutation finishMeet($idMeet: Int!) {
    finishMeet(idMeet: $idMeet) {
      data {
        id
        idJob {
          id
          jobName
        }
        idUser {
          id
          username
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
 * Removes a meet by its ID.
 * @param {Int} id - The ID of the meet to remove.
 * @return {Object} A message and a success flag.
 */
export const REMOVE_MEET = gql`
  mutation removeMeet($id: Int!) {
    removeMeet(id: $id) {
      message
      success
    }
  }
`;

