# Assignment 3 Report

## Steps taken
1. Built Docker images for frontend and backend.
2. Tagged images for Docker Hub.
3. Pushed images to Docker Hub.
4. Created GitHub Actions workflow to build and push images.
5. Deployed backend and frontend on Render.

## Challenges faced
- Ensuring correct environment variables and ports for Render services.
- Verifying Docker tags and repository names before pushing.

## Learning outcomes
- Learned how to automate Docker image builds with GitHub Actions.
- Practiced publishing images to Docker Hub.
- Deployed a multi-service app on Render.

## Screenshots
GitHub Actions workflow success:

![GitHub Actions success](image/2github.png)

DockerHub pushed image:

![DockerHub push](image/3docker.png)

Render.com deployment:

![Render deployment](image/3deploy.png)

## Links
Render deployments:
- Backend: https://be-todo-w6ew.onrender.com
- Frontend: https://fe-todo-845u.onrender.com

Docker Hub images:
- https://hub.docker.com/r/02240360/fe-todo
- https://hub.docker.com/r/02240360/be-todo
