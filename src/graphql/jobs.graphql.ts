import { gql } from "@apollo/client";

// ------------------- MUTATIONS ------------------- //

/**
 * Creates a new job with the provided details (jobName, description, idCategory, idProfessional).
 * @return {Object} The newly created job's details, a message, and a success flag.
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
 * Updates an existing job with the provided details (jobName, description, idCategory, idProfessional).
 * @return {Object} The updated job's details, a message, and a success flag.
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
 * @return {Object} The newly created category's details, a message, and a success flag.
 */
export const CREATE_CATEGORY = gql`
  mutation createCategory(
    $name: String!
  ) {
    createCategory(createCategoryInput: {
      name: $name
    }) {
      data {
        id
        categoryName
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
