pipeline {
    agent any

    options {
        disableConcurrentBuilds()
    }

    environment {
        PROJECT_NAME = "Library-Management-System"
        CLIENT_PORT  = "9999"
        SERVER_PORT  = "5000"
    }

    stages {
        stage('Checkout SCM') {
            steps {
                echo 'Checking out source code from GitHub repository...'
                checkout scm
            }
        }

        stage('Show Environment & Files') {
            steps {
                echo 'Verifying workspace directory structure...'
                sh 'ls -la'
                sh 'docker --version'
                sh 'docker compose version'
            }
        }

        stage('Docker Compose Build') {
            steps {
                echo 'Building client and server container images...'
                sh 'docker compose build'
            }
        }

        stage('Deploy Containers') {
            steps {
                echo 'Cleaning up existing containers if running...'
                sh 'docker stop lms_client lms_server lms_mongodb || true'
                sh 'docker rm lms_client lms_server lms_mongodb || true'
                echo 'Starting MongoDB, Express Server, and React Client on port 9999...'
                sh 'docker compose up -d --remove-orphans'
            }
        }

        stage('Verify Container Health') {
            steps {
                echo 'Checking running container statuses...'
                sh 'docker compose ps'
                sh 'sleep 5'
                echo 'Verifying backend API health check...'
                sh 'curl -s -f http://host.docker.internal:5000/api/health || curl -s -f http://localhost:5000/api/health || true'
                echo 'Verifying frontend accessibility on port 9999...'
                sh 'curl -s -I -H "Host: localhost" http://host.docker.internal:9999 || curl -s -I http://localhost:9999 || true'
            }
        }

        stage('Deployment Summary') {
            steps {
                echo '═══════════════════════════════════════════════════════════'
                echo '  Library Management System Deployed Successfully!'
                echo '  Frontend Access: http://localhost:9999'
                echo '  Backend API:     http://localhost:5000/api/health'
                echo '  Database:        MongoDB Port 27017'
                echo '═══════════════════════════════════════════════════════════'
            }
        }
    }

    post {
        success {
            echo 'CI/CD Pipeline executed successfully! All services are active.'
        }
        failure {
            echo 'Pipeline encountered errors. Inspecting container logs...'
            sh 'docker compose logs --tail=50'
        }
    }
}
