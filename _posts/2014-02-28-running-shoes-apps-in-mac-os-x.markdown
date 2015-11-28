---
layout: post
title: Running Shoes apps in Mac OS X
date: 2014-02-28
comments: true
categories: ruby
tags:
- mac-osx 
- shoes
disqus: y
share: y
---

This is one of the mini-posts -kind of like a development note that would be useful for shoes starters. First, [shoes](http://shoesrb.com/) is a GUI framework for ruby. It allows us to write GUI apps quickly in ruby. 

### Example of a GUI app

``` ruby app.rb
Shoes.app do
	def answer(v)
		@answer.replace v.inspect
  end	
	@list  = stack do
		button "Copy" do 
			answer "BBBB"
		end
	end
	@answer = para "Answers appear here"
end
```

### Running a shoes app
This is the tricky bit. You have to download Shoes from their website and install it your mac. Include the below code in your .bashrc or .zshrc file (If you have [zsh](https://github.com/robbyrussell/oh-my-zsh) installed).

``` bash
alias shoes='/Applications/Shoes.app/Contents/MacOS/shoes '
```

Now you can simply do `shoes app.rb` and it will run the shoes app.  