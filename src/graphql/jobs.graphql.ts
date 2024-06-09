import { gql } from "@apollo/client";

// ------------------- QUERIES ------------------- //


// ------------------- Jobs ------------------- //

/**
 * Fetches a list of all jobs.
 * @return {Object[]} A list of jobs.
 */
export const GET_JOBS = gql`
  query jobs {
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
        username
        email
      }
      requestsCount
      price
    }
  }
`;

/**
 * Fetches a job by its name.
 * @param {String} name - The name of the job to fetch.
 * @return {Object} The job details, a message, and a success flag.
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
          username
          email
        }
        requestsCount
        price
      }
      success
    }
  }
`;

/**
 * Fetches jobs by category.
 * @param {String} category - The category to filter jobs by.
 * @return {Object[]} A list of jobs in the specified category, a message, and a success flag.
 */
export const GET_JOBS_BY_CATEGORY = gql`
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
          username
          email
        }
        requestsCount
        price
      }
      message
      success
    }
  }
`;

/**
 * Fetches a job by its ID.
 * @param {Int} id - The ID of the job to fetch.
 * @return {Object} The job details, a message, and a success flag.
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
          username
          email
        }
        requestsCount
        price
      }
      success
    }
  }
`;

// ------------------- Categories ------------------- //

/**
 * Fetches a list of all categories.
 * @return {Object[]} A list of categories.
 */
export const GET_CATEGORIES = gql`
  query categories {
    categories {
      id
      categoryName
    }
  }
`;

/**
 * Fetches a category by its ID.
 * @param {Int} id - The ID of the category to fetch.
 * @return {Object} The category details, a message, and a success flag.
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
 * @return {Object} The category details, a message, and a success flag.
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

// ------------------- Reviews ------------------- //

/**
 * Checks if a review exists for a specific job.
 * @param {Int} idJob - The ID of the job to check.
 * @return {Object} A message and a success flag.
 */
export const EXIST_REVIEW = gql`
  query existReview($idJob: Int!) {
    existReview(idJob: $idJob) {
      message
      success
    }
  }
`;

/**
 * Fetches a review by its ID.
 * @param {Int} id - The ID of the review to fetch.
 * @return {Object} The review details, a message, and a success flag.
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
 * @return {Object[]} A list of reviews.
 */
export const GET_REVIEWS = gql`
  query reviews {
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

/**
 * Fetches reviews for a specific job.
 * @param {Int} idJob - The ID of the job to fetch reviews for.
 * @return {Object[]} A list of reviews for the specified job, a message, and a success flag.
 */
export const GET_REVIEWS_BY_JOB = gql`
  query getReviewsByJob($idJob: Int!) {
    getReviewsByJob(idJob: $idJob) {
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

// ------------------- MUTATIONS ------------------- //

// ------------------- Jobs ------------------- //

/**
 * Creates a new job.
 * @return {Object} A message and a success flag.
 */
export const CREATE_JOB = gql`
  mutation createJob(
    $jobName: String!,
    $description: String!,
    $idCategory: Int!,
    $price: Int!
  ) {
    createJob(createJobInput: {
      jobName: $jobName,
      description: $description,
      idCategory: $idCategory,
      price: $price
    }) {
      data
      message
      success
    }
  }
`;

/**
 * Updates an existing job.
 * @param {String} jobName - The name of the job to update.
 * @return {Object} A message and a success flag.
 */
export const UPDATE_JOB = gql`
  mutation updateJob(
    $jobName: String!,
    $description: String,
    $idCategory: Int,
    $requestsCount: Int,
    $price: Int
  ) {
    updateJob(jobName: $jobName, updateJobInput: {
      description: $description,
      idCategory: $idCategory,
      requestsCount: $requestsCount,
      price: $price
    }) {
      data
      message
      success
    }
  }
`;

/**
 * Removes a job by its ID.
 * @param {Int} id - The ID of the job to remove.
 * @return {Object} A message and a success flag.
 */
export const REMOVE_JOB = gql`
  mutation removeJob($id: Int!) {
    removeJob(id: $id) {
      message
      success
    }
  }
`;

// ------------------- Categories ------------------- //

/**
 * Creates a new category.
 * @param {String} name - The name of the category.
 * @return {Object} A message and a success flag.
 */
export const CREATE_CATEGORY = gql`
  mutation createCategory($name: String!) {
    createCategory(createCategoryInput: {name: $name}) {
      data
      message
      success
    }
  }
`;

// ------------------- Reviews ------------------- //

/**
 * Creates a new review.
 * @param {String} comment - The comment of the review.
 * @param {Int} rate - The rating of the review.
 * @param {Int} idJob - The ID of the job being reviewed.
 * @return {Object} The review details, a message, and a success flag.
 */
export const CREATE_REVIEW = gql`
  mutation createReview(
    $comment: String!,
    $rate: Int!,
    $idJob: Int!
  ) {
    createReview(createReviewInput: {
      comment: $comment,
      rate: $rate,
      idJob: $idJob
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

/**
 * Removes a review by its ID.
 * @param {Int} id - The ID of the review to remove.
 * @return {Object} A message and a success flag.
 */
export const REMOVE_REVIEW = gql`
  mutation removeReview($id: Int!) {
    removeReview(id: $id) {
      message
      success
    }
  }
`;
