# Project Memory - TechShop Premium

## Deployment Information
- **Public IP:** 18.134.129.246
- **Frontend URL:** `http://18.134.129.246`
- **Backend API URL:** `http://18.134.129.246:8000/api`
- **PEM Key:** `C:\Users\dell\Downloads\cle-projet-devop.pem`
- **GitHub Repository:** [Dominique12345678/projet-finale--devops-groupe-5](https://github.com/Dominique12345678/projet-finale--devops-groupe-5)

## CI/CD Configuration
- **CI Pipeline:** Runs tests for backend and builds frontend to ensure code quality.
- **CD Pipeline:** Automatically deploys to the EC2 instance via SSH.
  - **Required GitHub Secrets:**
    - `AWS_ACCESS_KEY_ID`: AWS access key for ECR.
    - `AWS_SECRET_ACCESS_KEY`: AWS secret key for ECR.
    - `GROUPE5_SECRET`: Content of the `.pem` file for SSH access to the instance.

## Changes Applied
1. **Google Auth Removal:** Completely removed Google Login components and provider from the frontend as requested.
2. **IP Deployment:** Updated `apiConfig.ts` and `cd.yml` to target the static IP `18.134.129.246`.
3. **API Routing:** Configured the CD pipeline to expose the frontend on port 80 and the backend on port 8000.
4. **CI Robustness:** Added database readiness check in the CI pipeline to prevent race conditions during tests.
