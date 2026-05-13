pipeline {
    agent any

    tools {
        nodejs 'NodeJS'
    }

    environment {
        DOCKERHUB_USERNAME = '02240360'
        IMAGE_TAG = '02240360'
        BE_IMAGE = "${DOCKERHUB_USERNAME}/be-todo:${IMAGE_TAG}"
        FE_IMAGE = "${DOCKERHUB_USERNAME}/fe-todo:${IMAGE_TAG}"
    }

    stages {

        // Stage 1: Checkout code from GitHub
        stage('Checkout') {
            steps {
                echo 'Checking out source code...'
                checkout scm
            }
        }

        // Stage 2: Install backend dependencies
        stage('Install Dependencies') {
            steps {
                echo 'Installing backend dependencies...'
                dir('todo-app/backend') {
                    script {
                        if (isUnix()) {
                            sh 'npm install'
                        } else {
                            bat 'npm install'
                        }
                    }
                }
            }
        }

        // Stage 3: Build
        stage('Build') {
            steps {
                echo 'Running build...'
                dir('todo-app/backend') {
                    script {
                        if (isUnix()) {
                            sh 'npm run build'
                        } else {
                            bat 'npm run build'
                        }
                    }
                }
            }
        }

        // Stage 4: Run unit tests
        stage('Test') {
            steps {
                echo 'Running unit tests...'
                dir('todo-app/backend') {
                    script {
                        if (isUnix()) {
                            sh 'npm test'
                        } else {
                            bat 'npm test'
                        }
                    }
                }
            }
            post {
                always {
                    junit 'todo-app/backend/junit.xml'
                }
            }
        }

        // Stage 5: Build and push Docker images
        stage('Deploy') {
            steps {
                echo 'Building and pushing Docker images...'
                script {
                    docker.withRegistry('https://registry.hub.docker.com', 'docker-hub-creds') {
                        // Build and push backend
                        def beImage = docker.build("${BE_IMAGE}", './todo-app/backend')
                        beImage.push()

                        // Build and push frontend
                        def feImage = docker.build("${FE_IMAGE}", './todo-app/frontend')
                        feImage.push()
                    }
                }
            }
        }
    }

    post {
        success {
            echo 'Pipeline completed successfully!'
        }
        failure {
            echo 'Pipeline failed. Check the logs above.'
        }
    }
}
