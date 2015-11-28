---
layout: post
title: Distraction and Genius
date: 2013-05-21 22:46
comments: true
categories: thoughts
---

Sometimes we always wonder if it's a good thing to get distracted. When we are working on something important getting distracted is always annoying when we are doing something important. While I was writing this post I was getting chat pings from a friend of mine with Viber and I found it very distracting. 

# Distraction as Innovative juice

But I think distraction is positive. Distraction allows us to feed new ideas into our heads. It allows us to be innovative, be more human. Every invention out there was created from man's distractions. Distraction allows humans who are focused on a single task to get a grasp of a different approach, a different direction.

## Light bulb

I am pretty sure Edison got the idea of a light bulb from a candle. And the idea for Candle was from the Sun or Fire. Human's observe nature - workings of nature and innovate new concepts and designs and ultimately new inventions.
<!-- more -->

## Productive way of distraction

For example we are developing on a javascript development environment called JaggeryJS. It's similar to NodeJS but it runs on Java (Rhino-based). We were writing code which looked a lot ugly and I thought why not use something like in Sinatra.

### Previous style
{% gist 62f3d49d1fe40a11b4c7 previousstyle.js %}

### New Sinatra-type style
{% gist 62f3d49d1fe40a11b4c7 gistfile1.js %}

So how did I get to the idea of using such a neat style for defining REST-apis in JaggeryJS? Well my love for new technologies got me to work on Sinatra, Redis, NodeJS and many more. Sinatra was my inspiration since it has neat routing that is just gorgeous. 

``` ruby Sinatra-style
get '/users' do
  # get a listing of all the users
end
```

I just now witnessed another great thing of distraction. I wanted to learn new programming languages after playing with Java for years. Ruby was one of my favorites cause you can even talk Ruby code :D. I am using Octopress for this blog and I had an issue with posting the above gist code snippets. The problem was in the regex expression used in the code. 

``` ruby Having a bug
 def render(context)
  if parts = @text.match(/([\d]*) (.*)/)
    gist, file = parts[1].strip, parts[2].strip
    script_url = script_url_for gist, file
    code       = get_cached_gist(gist, file) || get_gist_from_web(gist, file)
    html_output_for script_url, code
  else
    ""
  end
```

Since I was familiar with Ruby I got the bug figured and fixed - 

``` ruby Bug free
 def render(context)
  if parts = @text.match(/([\w]*) (.*)/)
    gist, file = parts[1].strip, parts[2].strip
    script_url = script_url_for gist, file
    code       = get_cached_gist(gist, file) || get_gist_from_web(gist, file)
    html_output_for script_url, code
  else
    ""
  end
```

Having a good grasp and knowledge of different sectors of technology allows oneself to be lot better. We get a good understanding of different paradigms used and how those can help solve our problems. 

Update :- The above bug I found was regarding sharing private gists. So if the gist is public the original code will work fine as well.

 