-> To check the configuration
    > git config --global --list
    > git config --global user.name
    > git config --global user.email

-> To change the configurations
    > git config --global user.name "your name"
    > git config --global user.email "<email that matches you gitHub account>"

    These 'user.name' and 'user.email' (Git metadata) are to Track - authorship 
    Git uses these details to record who made each change.


-> To permanantly remove the .git from loacal (it permanently deletes the entire Git history and all commit data from your local repository.)
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

-> To check all the commits
    > git log 
    > git log --oneline 

-> To stop tracking any file (ex: database.js file)
    > git rm --cached src/config/database.js (--cached → removes the file from Git tracking, but keeps it locally (so it’s not deleted from yourcomputer)
    > git commit -m "Stop tracking database.js and add to .gitignore"
    > git push
