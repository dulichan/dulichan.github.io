---
layout: post
title: Better management of git code bases
date: 2014-01-23 22:35:44
comments: true
categories: git
tags:
- github
- code-management
disqus: y
share: y
---

In this blog post I want to explain about how we manage our codebase of Enterprise Mobility platform at [WSO2](http://wso2mobile.com/ "Enterprise Mobility Management solution"). One of the reasons why I want to express my opinion in the subject is because I don't want you guys to fall into the same pitfalls I fell when we were starting off with git. I am not saying we have the best management process for git (We are getting there :) ) but the current workflow significantly increased our productivity.

# Multiple Repos to rule them all
First when we got started our whole product was just another JavaScript application (JaggeryJS actually). But soon it got complicated with 

* The [Enterprise Mobility Management server](https://github.com/WSO2Mobile/wso2mobileserver, "Enterprise Mobility Management server")
* App Publisher
* App Store
* Mobile Application Management console

Now we needed a process to manage it and after playing around with submodules and git-tree I figured git tree offered the best method. 

![Git repos overall view](https://docs.google.com/drawings/d/1vZc1yJJZ-BrfIfa3IuznrF_VWIf-3j15gbxrTm9WkvQ/pub?w=703&h=589)

<!-- more -->
Our current workflow has the server repo as our main repo and it is what everyone will build. It contains codebase that is regarding carbon and Jaggery modules. It also has our application repos as well. These application repos points to the master branch of each repo. When I want to get new updates from the child projects - I have to only pull the master branch inside the child project. I can go back to my server directory and commit the pulled codebase to the server codebase as updates from submodules. By having multiple projects in our workflow - dependencies created by child projects to each another is reduced.A minus point about this approach is that we have to pull changes from child projects. I'll be address this later in the blog post. But next comes the other important aspect of git. 

# Branching for good
Git is nothing without it's powerful branches. I like to quote [Jeff Atwood](http://www.codinghorror.com/blog/2007/10/software-branching-and-parallel-universes.html "Software Branching and Parallel Universes") on this - 

{% blockquote %}
Branching is widely misunderstood, and rarely implemented-- even though branching, like versioning, lies at the very heart of source control, and thus software engineering 
{% endblockquote %}

I like the example where he brings out the parallel world's concept. How we did our implementation of branching was - _Branch per Release_. The master branch has always the latest released code. Branches are frozen once the development is stopped and we merge the development branch to master branch. When we do a General Availability release - we tag the release so that it can be retrieved at a later stage if it required to be patched for bugs. 

![Branching strategy](https://docs.google.com/drawings/d/1w461q1wVwjv5yUVRd_IWMcQTZZCg_NNNQ57-Ay04zvI/pub?w=749&h=483)

Couple of experiments I am trying out these days is the [git-freeze plugin](https://github.com/smoynes/git-freeze "git-freeze") that allows us to retire a branch. 



# Automate it :)
With all the child projects comes the rearing. After couple of times pulling-pushing-merging becomes a headache. You start to scratch your head and wonder what command you need to do next. In our case it requires couple of additional cases. 

* Merging submodules in parent project
* Getting new development branches from github
* Merging development branch to master and pushing to Github

I wrote a couple of scripts that can be used inline with [oh-my-zsh](https://github.com/robbyrussell/oh-my-zsh "oh-my-zsh") that helps me do all of this. 

{% gist 8583865 admin.zsh %}


# Conclusion
Thinking about how git can be better used will lead you and your team to become more productive. 