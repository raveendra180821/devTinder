-> TO CHECK THE CONFIGURATION
    > git config --global --list
    > git config --global user.name
    > git config --global user.email
----------------------------------------------------------------------
-> TO CHANGE THE CONFIGURATIONS
    > git config --global user.name "your name"
    > git config --global user.email "<email that matches you gitHub account>"

    These 'user.name' and 'user.email' (Git metadata) are to Track - authorship 
    Git uses these details to record who made each change.
----------------------------------------------------------------------

-> TO PERMANANTLY REMOVE THE .GIT FROM LOACAL (it permanently deletes the entire Git history and all commit data from your local repository.)
    > rm -rf .git

     Deletes the hidden .git folder from your project directory.

     That folder contains all Git tracking data:
        Commits
        Branches
        Staging info
        Remote settings
        Logs
        Configuration for that repo (.git/config)

    After running it, your folder becomes a normal, non-Git folder again — as if you never ran git init.

----------------------------------------------------------------------

-> TO CHECK ALL THE COMMITS
    > git log 
    > git log --oneline 

----------------------------------------------------------------------

-> TO STOP TRACKING ANY FILE (ex: database.js file)
    > git rm --cached src/config/database.js (--cached → removes the file from Git tracking, but keeps it locally (so it’s not deleted from yourcomputer)
    > git commit -m "Stop tracking database.js and add to .gitignore"
    > git push

----------------------------------------------------------------------
-> TO CHECK THE REMOTE CONNECTIONS
    > git remote -v
    > git remote show origin   (Show remote details)
    > git remote set-url origin <remote-url> (to change the remote url)
