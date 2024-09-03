# Online_Judge

### Problem Statement:
Creating a Minimum Viable Product (MVP) for an Online Judge platform using the MERN (MongoDB, Express.js, React.js, Node.js) stack. The platform allows users to participate in coding challenges, submit solutions, and receive automated evaluations. 

### Overview:
The MVP Online Judge platform enables user registration, problem listing, problem details viewing, code submission, and solution evaluation. It focuses on simplicity and usability, catering to users with basic coding skills. Mainly the focus would be to first implement a basic system where people can submit code in a selected set of programming languages which the system supports and get scored/evaluated based on it.

### Features:
1. **User Registration**
   - Users can register by providing basic details such as name, email, and password.
   - Simplified registration process without email verification for faster onboarding.

2. **Problem Listing:**
   - The platform displays a curated list of coding problems for users to solve.
   - Each problem is categorized by difficulty level to guide users.

3. **Problem Details Viewing:**
   - Users can view detailed descriptions of each problem, including the statement and input/output specifications.

4. **Code Submission:**
   - Users can submit their solutions to the provided problems.
   - Solutions can be entered directly into a text editor on the platform.

5. **Solution Evaluation:**
   - Submitted solutions are automatically evaluated against predefined test cases.
   - Verdicts (e.g., "Accepted," "Wrong Answer", “TLE”) are generated based on evaluation results.

### High-Level Design:
#### 1. Database Design:
   - MongoDB is used for data storage with collections for users, problems, test cases, and solutions.
   - Document structures are simple and intuitive, focusing on essential fields for MVP functionality.

   Collections:
   - **Users**
     - userId: String (Unique identifier for each user)
     - password: String (Hashed password for user authentication)
     - email: String (User's email address)
     - fullName: String (User's full name)
     - dob: Date (User's date of birth)
   - **Problems**
     - problemId: String (Unique identifier for each problem)
     - name: String (Name/title of the problem)
     - statement: String (Description/statement of the problem)
     - code: String (Code snippet or template for the problem, if applicable)
     - difficulty: String (Optional field indicating the difficulty level of the problem)
   - **Test Cases**
     - testCaseId: String (Unique identifier for each test case)
     - problemId: String (Foreign key referencing the associated problem)
     - input: String (Input data for the test case)
     - output: String (Expected output for the given input)
   - **Submissions**
     - submissionId: String (Unique identifier for each solution)
     - problemId: String (Foreign key referencing the associated problem)
     - userId: String (Foreign key referencing the user who submitted the solution)
     - verdict: String (Verdict/result of the solution evaluation, e.g., "Accepted," "Wrong Answer")
     - submittedAt: Date (Timestamp indicating when the solution was submitted)

#### 2. Web Server Design:
   - Express.js handles API endpoints for user management, problem listing, and submission handling at the backend.
   - Using JWT Tokens for authentication and later down the line using OAuth directly.
   - React.js frontend provides a simple user interface with screens for:
     - Problem listing
     - Problem details viewing 
     - Code submission.
   - Using UI Library like Chakra UI for components to be minimalistic and user-friendly, facilitating easy navigation and interaction.

#### 3. Code Evaluation System:
   - Pre-configured container for popular programming languages ensure compatibility and efficiency.
   - Time limits and resource constraints prevent excessive resource consumption and execution delays.

### Future Work:
   - Caching & Plagiarism Checking & Contests
