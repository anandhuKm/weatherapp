pipeline {
    agent any
    
    tools {nodejs "node"}
    
    stages {
        stage('Cloning Git') {
            steps {
                git 'https://github.com/anandhuKm/weatherapp.git'
            }
        }
	stage('redirecting'){
            steps {
                sh 'cd docs'
            }
        }
        stage('Install Dependencies'){
            steps {
                sh 'npm install'
            }
        }
        stage ('Run') {
            steps {
                sh 'node server.js'
            }
        }
    }
}
