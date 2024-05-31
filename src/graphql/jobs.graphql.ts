import { gql } from "@apollo/client";

// ------------------- MUTATIONS ------------------- //

/**
 * Creates a new job with the provided details (jobName, description, idCategory, idProfessional).
 * @return {Object} A message and a success flag.
 */
export const CREATE_JOB = gql`
  mutation createJob(
    $jobName: String!,
    $description: String!,
    $idCategory: Int!,
    $idProfessional: Int!
  ) {
    createJob(createJobInput: {
      jobName: $jobName,
      description: $description,
      idCategory: $idCategory,
      idProfessional: $idProfessional
    }) {
      data
      message
      success
    }
  }
`;

/**
 * Updates an existing job with the provided details (jobName, description, idCategory, idProfessional).
 * @return {Object} A message and a success flag.
 */
export const UPDATE_JOB = gql`
  mutation updateJob(
    $jobName: String!,
    $description: String,
    $idCategory: Int,
    $idProfessional: Int
  ) {
    updateJob(
      jobName: $jobName,
      updateJobInput: {
        jobName: $jobName,
        description: $description,
        idCategory: $idCategory,
        idProfessional: $idProfessional
      }
    ) {
      data
      message
      success
    }
  }
`;

/**
 * Removes a job with the provided ID.
 * @return {Object} A message indicating the status of the removal and a success flag.
 */
export const REMOVE_JOB = gql`
  mutation removeJob($id: Int!) {
    removeJob(id: $id) {
      message
      success
    }
  }
`;

/**
 * Creates a new category with the provided name.
 * @return {Object} A message and a success flag.
 */
export const CREATE_CATEGORY = gql`
  mutation createCategory(
    $name: String!
  ) {
    createCategory(createCategoryInput: {
      name: $name
    }) {
      data
      message
      success
    }
  }
`;

/**
 * Creates a new review with the provided details (comment, rate, idJob, idUser).
 * @return {Object} A message and a success flag.
 */
export const CREATE_REVIEW = gql`
  mutation createReview(
    $comment: String!,
    $rate: Int!,
    $idJob: Int!,
    $idUser: Int!
  ) {
    createReview(createReviewInput: {
      comment: $comment,
      rate: $rate,
      idJob: $idJob,
      idUser: $idUser
    }) {
      data {
        id
        comment
        rate
        idJob {
          id
          jobName
        }
        idUser {
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

// ------------------- QUERIES ------------------- //

/**
 * Fetches a list of all jobs.
 * @return {Array} A list of jobs.
 */
export const GET_JOBS = gql`
  query {
    jobs {
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
        email
      }
      requestsCount
    }
  }
`;

/**
 * Fetches a job by its name.
 * @param {String} name - The name of the job to fetch.
 * @return {Object} The job's details and a success flag.
 */
export const GET_JOB_BY_NAME = gql`
  query jobByName($name: String!) {
    jobByName(name: $name) {
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
          email
        }
        requestsCount
      }
      success
    }
  }
`;

/**
 * Fetches jobs by their category.
 * @param {String} category - The category of the jobs to fetch.
 * @return {Object} The list of jobs, a message, and a success flag.
 */
export const GET_JOB_BY_CATEGORY = gql`
  query jobByCategory($category: String!) {
    jobByCategory(category: $category) {
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
 * Fetches a job by its ID.
 * @param {Int} id - The ID of the job to fetch.
 * @return {Object} The job's details and a success flag.
 */
export const GET_JOB_BY_ID = gql`
  query jobById($id: Int!) {
    jobById(id: $id) {
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
          email
        }
        requestsCount
      }
      success
    }
  }
`;

/**
 * Fetches a list of all categories.
 * @return {Array} A list of categories.
 */
export const GET_CATEGORIES = gql`
  query {
    categories {
      id
      categoryName
    }
  }
`;

/**
 * Fetches a category by its ID.
 * @param {Int} id - The ID of the category to fetch.
 * @return {Object} The category's details and a success flag.
 */
export const GET_CATEGORY_BY_ID = gql`
  query categoryById($id: Int!) {
    categoryById(id: $id) {
      data {
        id
        categoryName
      }
      success
    }
  }
`;

/**
 * Fetches a category by its name.
 * @param {String} name - The name of the category to fetch.
 * @return {Object} The category's details and a success flag.
 */
export const GET_CATEGORY_BY_NAME = gql`
  query categoryByName($name: String!) {
    categoryByName(name: $name) {
      data {
        id
        categoryName
      }
      success
    }
  }
`;

/**
 * Checks if a review exists for a given job and user.
 * @param {Int} idJob - The ID of the job.
 * @param {Int} idUser - The ID of the user.
 * @return {Object} A message and a success flag.
 */
export const EXIST_REVIEW = gql`
  query existReview($idJob: Int!, $idUser: Int!) {
    existReview(idJob: $idJob, idUser: $idUser) {
      message
      success
    }
  }
`;

/**
 * Fetches a review by its ID.
 * @param {Int} id - The ID of the review to fetch.
 * @return {Object} The review's details and a success flag.
 */
export const GET_REVIEW_BY_ID = gql`
  query getReviewById($id: Int!) {
    getReviewById(id: $id) {
      data {
        id
        comment
        rate
        idJob {
          id
          jobName
        }
        idUser {
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

/**
 * Fetches a list of all reviews.
 * @return {Array} A list of reviews.
 */
export const GET_REVIEWS = gql`
  query {
    reviews {
      id
      comment
      rate
      idJob {
        id
        jobName
      }
      idUser {
        id
        username
        email
      }
    }
  }
`;
