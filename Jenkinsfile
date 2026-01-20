pipeline {
    agent any
    
    tools {
        nodejs 'NodeJS 20'
        maven 'Maven 3.9'
        jdk 'JDK 17'
    }
    
    environment {
        MAVEN_OPTS = '-Xmx1024m'
        NODE_OPTIONS = '--max-old-space-size=4096'
    }
    
    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }
        
        stage('Install Dependencies') {
            steps {
                sh 'npm ci'
            }
        }
        
        stage('Lint') {
            parallel {
                stage('Lint Frontend') {
                    steps {
                        sh 'npx nx lint frontend'
                    }
                }
            }
        }
        
        stage('Build') {
            parallel {
                stage('Build Frontend') {
                    steps {
                        sh 'npx nx build frontend'
                    }
                }
                stage('Build Backend') {
                    steps {
                        sh 'npx nx build backend'
                    }
                }
            }
        }
        
        stage('Test') {
            parallel {
                stage('Test Frontend') {
                    steps {
                        sh 'npx nx test frontend'
                    }
                }
                stage('Test Backend') {
                    steps {
                        sh 'npx nx test backend'
                    }
                }
            }
        }
        
        stage('Build Storybook') {
            steps {
                sh 'npx nx build-storybook frontend'
            }
        }
        
        stage('Archive Artifacts') {
            steps {
                archiveArtifacts artifacts: 'dist/**/*', fingerprint: true
                archiveArtifacts artifacts: 'apps/backend/target/*.jar', fingerprint: true
            }
        }
    }
    
    post {
        always {
            cleanWs()
        }
        success {
            echo 'Build succeeded!'
        }
        failure {
            echo 'Build failed!'
        }
    }
}
