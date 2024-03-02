node(){
    stage('Cloning Git') {
        checkout scm
    }

    stage('Install dependencies') {
        nodejs('nodejs') {
            //sh 'rm -r node_modules'
            sh 'npm install --force'
            sh 'npm install --legacy-peer-deps'
            echo "Modules installed"
        }
        
    }
    stage('Build') {
        nodejs('nodejs') {
            sh 'npm update'
            sh 'npm run build'
            //sh 'npm cache clean'
            echo "Build completed"
        }
        
    }

    stage('Package Build') {
        sh "tar -zcvf bundle.tar.gz dist/evolver-ai-new/"
    }

    stage('Artifacts Creation') {
        fingerprint 'bundle.tar.gz'
        archiveArtifacts 'bundle.tar.gz'
        echo "Artifacts created"
    }

    stage('Stash changes') {
        stash allowEmpty: true, includes: 'bundle.tar.gz', name: 'buildArtifacts'
    }
}

node('evolver_node_2') {
    echo 'Unstash'
    unstash 'buildArtifacts'
    echo 'Artifacts copied'

    echo 'Copy'
    sh "yes | sudo cp -R bundle.tar.gz /var/www/html && cd /var/www/html && sudo tar -xvf bundle.tar.gz"
        // sh "yes | sudo cp -R bundle.tar.gz /var/www && cd /var/www && sudo tar -xvf bundle.tar.gz"
    echo 'Copy completed'
}
