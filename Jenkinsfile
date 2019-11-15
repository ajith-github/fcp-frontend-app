node {
   sh 'echo "hello"'
   sh '''#!/bin/bash
         pwd
         ls -la 
         whoami
      '''
   stage 'Checkout'
   git 'git@gitlab.com:learn-by-coding/badminton-manager.git'
}
