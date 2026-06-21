---
layout: mypost
title: "[CTF][flare-on] 1 - frog"
categories: [CTF, Flare On]
---

> 来源：[Washi1337/ctf-writeups](https://github.com/Washi1337/ctf-writeups) &nbsp;·&nbsp; flare-on 2024

# 1 - frog 

**Time spent:** 3 minutes

**Tools used:** Python

As with any Flare-On, challenge 1 is a glorified CAPTCHA challenge.
This time around, it is a game featuring a frog that needs to get to a statue.

![](https://raw.githubusercontent.com/Washi1337/ctf-writeups/master/writeups/flare-on/2024/1/img/01.png)

However, the statue is boxed in by walls.

If we look into the provided code in `frog.py`, we can scroll to an interesting function `AttemptPlayerMove`.
It features code that stops the frog from moving through walls.

![](https://raw.githubusercontent.com/Washi1337/ctf-writeups/master/writeups/flare-on/2024/1/img/02.png)

If we get rid of this code, we are no longer obstructed by any walls, and can easily get the frog to the statue...

![](https://raw.githubusercontent.com/Washi1337/ctf-writeups/master/writeups/flare-on/2024/1/img/03.gif)

... revealing the flag!
