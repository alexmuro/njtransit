## Git Strategy (ripped from Diaspora)

If you're a developer who wants to work on the source code and submit your changes for consideration to be merged into the master branch, here's how.  Thanks to [ThinkUp](https://github.com/ginatrapani/ThinkUp) for their awesome developer guide, which inspired ours.

# Quickfire Do's and Don't's

If you're familiar with git and GitHub, here's the short version of what you need to know. Once you fork and clone the code:

*  **Don't develop on the master branch.** Always create a development branch specific to [the issue](https://github.com/MarketArt/market_art_ems/issues) you're working on. Name it by issue # and description. For example, if you're working on Issue #359, an aspect naming fix, your development branch should be called 359-aspect-names. If you decide to work on another issue mid-stream, create a new branch for that issue--don't work on both in one branch.

* **Do not merge** the upstream master with your development branch; **rebase** your branch on top of the upstream master.

* **A single development branch should represent changes related to a single issue.** If you decide to work on another issue, create another branch.

# Step-by-step (the short version)

1. Fork on GitHub (click Fork button)
2. Clone to computer (`$ git clone git@github.com:you/market_art_ems.git`)
3. Don't forget to cd into your repo: (`$ cd market_art_ems/`)
4. Set up remote upstream (`$ git remote add upstream git://github.com/MarketArt/market_art_ems.git`)
5. Create a branch for new issue (`$ git checkout -b 100-new-feature`, if you don't have a bug report no worries just skip the number)
6. Develop on issue branch. _[Time passes, the main EMS repository accumulates new commits]_
7. Commit changes to issue branch. (`$ git add . ; git commit -m 'commit message'`)
8. Fetch upstream (`$ git fetch upstream`)
9. Update local master (`$ git checkout master; git pull upstream master`)
10. Repeat steps 5-8 till dev is complete
11. Rebase issue branch (`$ git checkout 100-new-feature; git rebase master`)
12. Push branch to GitHub (`$ git push origin 100-new-feature`)
13. Issue pull request (Click Pull Request button)

# Step-by-step (the long version)

If you're new to git and GitHub, here's the longer version of these instructions.

## Create an account on GitHub and fork the repository.

1. Create a free account on GitHub, and log in.
2. Go to [the main EMS page on GitHub](http://github.com/MarketArt/market_art_ems).
3. Click the "Fork" button near the top of the screen. This will get you your own copy that you can make changes to.

## Establish connectivity between your GitHub account and your development machine.

1. Generate an SSH key on your development machine. Here's a "good guide":http://help.github.com/key-setup-redirect that gives you specific directions for whatever OS you're accessing the page with.
2. Make sure you've got an SSH public key on your machine and recorded in your GitHub account. You can see your SSH Public Keys on the Account Overview section of your GitHub account.
3. To test the GitHub authentication run:

```
$ ssh git@github.com
```

If all is well, you should see something like this:

```
PTY allocation request failed on channel 0
ERROR: Hi username! You've successfully authenticated, but GitHub does not provide shell access
Connection to github.com closed.
```

## Clone your GitHub fork to your development machine

Run a clone command against your GitHub fork. It will look something like this except that it will use your GitHub account name instead of "you":

```
$ git clone git@github.com:you/market_art_ems.git
```

That downloads your copy of the EMS to a git repository on your development machine. Change directory into the new market_art_ems directory.

Now you need to install everything you need to run it - which is quite a lot of stuff. We have a guide below which should help. Pop into Campfire if you have problems.

You'll know you're done when you can run specs by doing this:

```
$ rake spec
```

**We try to make sure these always succeed.**

## Figure out what to work on

Maybe you have a feature addition in mind or from Trajectory, but if not, check out our [issue tracker](https://github.com/MarketArt/market_art_ems/issues), or come ask in Campfire what needs doing.

## Create an Issue-Specific Development Branch

Before you start working on a new feature or bugfix, create a new branch in your local repository that's dedicated to that one change. Name it by issue number (if applicable, if there's no issue just skip it) and description. For example, if you're working on issue #359, a aspect naming bugfix, create a new branch called 359-aspect-names, like this:

```
$ git checkout -b 359-aspect-names
```

## Write awesome code

You must write tests for all bugfixes, no matter how small. We can help you!

Edit and test the files on your development machine. When you've got something the way you want and established that it works, commit the changes to your branch on your development server's git repo.

```
$ git add <filename>
$ git commit -m 'Issue #359: Some kind of descriptive message'
```

You'll need to use git add for each file that you created or modified. There are ways to add multiple files, but I highly recommend a more deliberate approach unless you know what you're doing.

Then, you can push your new branch to GitHub, like this (replace 359-aspect-names with your branch name):

```
$ git push origin 359-aspect-names
```

You should be able to log into your GitHub account, switch to the branch, and see that your changes have been committed. Then click the Pull button to request that your commits get merged into the Diapsora development trunk.

## Keep Your Repository Up to Date

In order to get the latest updates from the development trunk do a one-time setup to establish the main GitHub repo as a remote by entering:

```
$ git remote add upstream git://github.com/MarketArt/market_art_ems.git
```

Verify you've now got "origin" and "upstream" remotes by entering:

```
$ git remote
```

You'll see upstream listed there.

## Rebase Your Development Branch on the Latest Upstream

To keep your development branch up to date, rebase your changes on top of the current state of the upstream master. Check out _What's git-rebase?_ below to learn more about rebasing.

If you've set up an upstream branch as detailed above, and a development branch called 100-retweet-bugfix, you'd update upstream, update your local master, and rebase your branch from it like so:

```
$ git fetch upstream
$ git checkout master
$ git rebase upstream/master
$ git checkout 100-retweet-bugfix
[make sure all is committed as necessary in branch]
$ git rebase master
```

You may need to resolve conflicts that occur when a file on the development trunk and one of your files have both been changed. Edit each file to resolve the differences, then commit the fixes to your development server repo and test. Each file will need to be "added" before running a "commit."

p. Conflicts are clearly marked in the code files. Make sure to take time in determining what version of the conflict you want to keep and what you want to discard.

```
$ git add <filename>
$ git commit
```

To push the updates to your GitHub repo, replace 100-retweet-bugfix with your branch name and run:

```
$ git push origin 100-retweet-bugfix
```

## Send MarketArt a pull request on github

Github will notify us and we'll review your patch and either pull it in or comment on it

Helpful hint: You can always edit your last commit message by using:

```
$ git commit --amend
```

## Some gotchas

***Be careful not to commit any of your configuration files, logs, or throwaway test files to your GitHub repo.*** These files can contain information you wouldn't want publicly viewable and they will make it impossible to merge your contributions into the main development trunk of the EMS.

Most of these special files are listed in the *.gitignore* file and won't be included in any commit, but you should carefully review the files you have modified and added before staging them and committing them to your repo. The git status command will display detailed information about any new files, modifications and staged.

```
$ git status
```

***One thing you may not want to do is to issue a git commit with the -a option. This automatically stages and commits every modified file that's not expressly defined in .gitignore, including your crawler logs.***

```
$ git commit -a
```

## What's git-rebase?

Using `git-rebase` helps create clean commit trees and makes keeping your code up-to-date with the current state of the upstream master easy. Here's how it works.

Let's say you're working on Issue #212 a new plugin in your own branch and you start with something like this:

```
          1---2---3 #212-my-new-plugin
         /
    A---B #master
```

You keep coding for a few days and then pull the latest upstream stuff and you end up like this:

```
          1---2---3 #212-my-new-plugin
         /
    A---B--C--D--E--F #master
```

So all these new things (C,D,..F) have happened since you started. Normally you would just keep going (let's say you're not finished with the plugin yet) and then deal with a merge later on, which becomes a commit, which get moved upstream and ends up grafted on the tree forever.

A cleaner way to do this is to use rebase to essentially rewrite your commits as if you had started at point F instead of point B. So just do:

```
git rebase master 212-my-new-plugin
```

git will rewrite your commits like this:

```
                      1---2---3 #212-my-new-plugin
                     /
    A---B--C--D--E--F #master
```

It's as if you had just started your branch. One immediate advantage you get is that you can test your branch now to see if C, D, E, or F had any impact on your code (you don't need to wait until you're finished with your plugin and merge to find this out). And, since you can keep doing this over and over again as you develop your plugin, at the end your merge will just be a fast-forward (in other words no merge at all).

So when you're ready to send the new plugin upstream, you do one last rebase, test, and then merge (which is really no merge at all) and send out your pull request. Then in most cases, Gina has a simple fast forward on her end (or at worst a very small rebase or merge) and over time that adds up to a simpler tree.

More info on the git man page here:
[Git rebase: man page](http://schacon.github.com/git/git-rebase.html)