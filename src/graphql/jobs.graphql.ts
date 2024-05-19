import { gql } from "@apollo/client";

// ------------------- MUTATIONS ------------------- //

/**
 * Creates a new job with the provided details (jobName, description, idCategory, idProfessional).
 * @return {Object} The newly created job's details and a message.
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
      job {
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
      message
    }
  }
`;

/**
 * Updates an existing job with the provided details (jobName, description, idCategory, idProfessional).
 * @return {Object} The updated job's details and a message.
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
      job {
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
      message
    }
  }
`;

/**
 * Removes a job with the provided ID.
 * @return {Object} A message indicating the status of the removal.
 */
export const REMOVE_JOB = gql`
  mutation removeJob($id: Int!) {
    removeJob(id: $id) {
      message
    }
  }
`;

/**
 * Creates a new category with the provided name.
 * @return {Object} The newly created category's details and a message.
 */
export const CREATE_CATEGORY = gql`
  mutation createCategory(
    $name: String!
  ) {
    createCategory(createCategoryInput: {
      name: $name
    }) {
      category {
        id
        categoryName
      }
      message
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
        username
        email
        password
        phone
        address
      }
      requestsCount
    }
  }
`;

/**
 * Fetches a job by its name.
 * @param {String} name - The name of the job to fetch.
 * @return {Object} The job's details.
 */
export const GET_JOB_BY_NAME = gql`
  query jobByName($name: String!) {
    jobByName(name: $name) {
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
        password
        phone
        address
      }
      requestsCount
    }
  }
`;

/**
 * Fetches a job by its category.
 * @param {String} category - The category of the job to fetch.
 * @return {Object} The job's details.
 */
export const GET_JOB_BY_CATEGORY = gql`
  query jobByCategory($category: String!) {
    jobByCategory(category: $category) {
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
        password
        phone
        address
      }
      requestsCount
    }
  }
`;

/**
 * Fetches a job by its ID.
 * @param {Int} id - The ID of the job to fetch.
 * @return {Object} The job's details.
 */
export const GET_JOB_BY_ID = gql`
  query jobById($id: Int!) {
    jobById(id: $id) {
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
        password
        phone
        address
      }
      requestsCount
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
 * @return {Object} The category's details.
 */
export const GET_CATEGORY_BY_ID = gql`
  query categoryById($id: Int!) {
    categoryById(id: $id) {
      id
      categoryName
    }
  }
`;

/**
 * Fetches a category by its name.
 * @param {String} name - The name of the category to fetch.
 * @return {Object} The category's details.
 */
export const GET_CATEGORY_BY_NAME = gql`
  query categoryByName($name: String!) {
    categoryByName(name: $name) {
      id
      categoryName
    }
  }
`;
