Farewell to January 2026.

January 2026—it’s honestly astonishing that so much has happened in just a single month.
The biggest event originated from my research: I managed to blow up my dataset twice.
I went through the process of deleting and regenerating a total of 20 billion samples.

The first incident... I was betrayed by `float64`, which I trusted implicitly.
I had lived my life thinking `float64` was practically infinite.
But during the training process, I caught a strange phenomenon where learning just stopped at a certain point.

At first, I thought, "Is the logic wrong?" and "What’s the problem?"
I stared at my MacBook screen until it felt like my eyes were on fire, debugging relentlessly, but I found nothing wrong with the logic.
It was the biggest horror of 2026... sensing something was off, I opened up the very last chunk, chunk 49999, and...

At that moment, for the first time, it felt like everything was being denied.
The Stifel formula, which I use as the "success set" in my research, is as follows:

$$
a = 2n+1
$$

$$
b = 2n(n+1)
$$

$$
c = b+1
$$

Something was wrong. Looking at the dataset, I saw b = c... I rubbed my eyes and looked again, but clearly, c = b.
Logically, that would only be true if a = 0, but a was definitely not 0.
In the end, I had two choices:

a. Give up on research; maybe I’m not meant to be a researcher.
b. REGENERATE the entire dataset.

I chose 'b'. But the problem was that I had already exhausted all my Colab Pro computing units on this cursed dataset.
In other words, creating and training it again was like going from flying a fighter jet to pedaling a bicycle.
I decided to leave that "future me" to deal with it.

But... up until then, I thought it was going to be smooth sailing.
I soaked in my morning shower, wondering if I had the "face of a Turing Award winner," thinking I’d study English and Math and do my 6.0002 assignments while the data generated.
Life was good. Everything was great... or so I thought as the dataset finished.

It was 10 billion samples.

There was no way it could be wrong now. It had to be fine.

As the training ran, I spent every day cheering on the dashboard as the loss decreased and accuracy rose by 1% at a time.

I think it was around mid-January...
I woke up at 9 AM and looked at the Colab screen...
Wait... it looked exactly the same as the dashboard I saw before I went to bed at 3 AM.

Probabilistically, this was impossible.
I scrambled for my glasses and checked the timestamp in the bottom right of the dashboard.
It had stopped exactly at the hour I last saw it.

I felt despair from early morning. Breakfast didn’t taste like food.
I felt so pathetic standing in the falling snow that day as I re-examined my entire logic for the thousandth time.

I did a full investigative audit, even doing some "vibe coding," and looked through every piece of logic...
That’s when I found out.

Claude, or maybe it was Gemini, said something like this:
"Master! If you just use pandas or numpy directly, it might convert to int64! Hehe, you didn't know that, did you? I found it for you~ If this helped, please like and subscri..."

No way. This is ~~insane.~~
Freaking pandas, ~~or panda,~~ or whatever... more like too much "phi" (pie)...
Once again, I was at a crossroads:

a. Maybe I'm not meant to be a researcher. I really wasn't. Maybe I'm truly not...
b. Just cut out the rotten roots and regenerate partially.
c. Regenerate EVERYTHING.

My decision was 'c'.
Why? Because, while 'b' was the easiest and most comfortable, I felt like my confidence in my own research would vanish.
Even if I tried to submit to ICML or NeurIPS later... I felt like I would suddenly hesitate.
I decided that I must protect the core of research: integrity. ~~(I truly don't regret this choice. I mean it. I probably mean it... I have to mean it... I probably do... I mean it!!)~~

Instead, this time, with the single-minded determination that I would NEVER regenerate this dataset again,
I searched and researched endlessly... and the resulting solution (or shield) was:

a. Introduce BigInt!
b. Introduce the Decimal library!
c. Explicitly set dtypes.

I implemented a, b, and c. And I added one more thing.
I stopped the dataset generation every 5000 chunks, manually checked if the local verification logic gave an "OK," and only after I—the human—pressed Enter, would it resume from the 5001st chunk... ~~(I truly don't regret this choice either. I mean it... I probably do...)~~

I went to sleep wearing my Apple Watch, waking up every hour to check and press Enter. I could see the gap under my eyes (dark circles) getting longer too... ~~I guess I should stop thinking about growing any taller...~~

Finally, after going through all that, I submitted the preprint to ArXiv.
But I hit another crisis there. ArXiv requires an endorser...

**NO WAY.**
I’m not even a college student yet, I don't belong to a lab, and I am alone.
At first, I looked on Reddit, believing there would be someone like me.
There were... but the risk was too high. You never know when someone will do it, or if they’ll ever do it at all.
That was my biggest worry: that absolutely no one would ever do it.

Deciding Reddit wasn't the way, I closed it and looked for alternatives on my legal pad.
I decided to ask someone who has always given me so much teaching and help.
They graciously agreed, and I am so, so grateful that I was able to finish the endorsement in a relatively short time and upload to ArXiv. (I don't know if they will ever see this, but I want to say thank you again.)

Then, on January 13th, I finally succeeded in the submission, and about a day or two later, my profile appeared on Google Scholar. Haha.
It’s a strange feeling—scary yet scary, but also happy... that kind of feeling.

Now that the timestamp was marked, I wanted to focus purely on training while looking at other things.
Math and English. Math... well, in the end, it’s not an exaggeration to say AI/ML starts and ends with math.
~~Honestly, I was a bit embarrassed that every time a math formula appeared in a paper, I was opening Gemini.~~

So I decided to study math, starting from 10th-grade high school math.
For English, I’m using a book called "Grammar in Use"...

But the biggest problem arose.
**I AM SO EMBARRASSED.**

~~Me, at age 21, doing polynomial multiplication in a "General Math 1" textbook.
Me, at age 21, doing "am are is."~~

It’s not like anyone is watching, but I feel like someone is staring right at me.
Still, I kept going. Even if my face was turning red inside, on the outside, I acted with the mindset: **"I’m the king of this area."**

And so, January passed... with so many twists and turns and so many worries.
January... was this really just one month? So much work and so many shifts were packed into it.

In some ways, it feels fast, but around January 15th or 16th, I remember getting chills, thinking, "Wait, it's only been half the month?"

As for February... now "training" <-- as long as this goes well, it's fine.
Ah, and 6.0002 also ends in February!
I think I’ll be taking CS50x next, but before that, I need to use the Lunar New Year holidays to organize 6.0001, 6.0002, and the General Math 1 & 2 content I studied in Obsidian.

Seeing myself occasionally write "slef" instead of "self," it seems like I’m **LACKING REVIEW.**
And given that I spend 4 days agonizing over a PSet, only to find that on Friday I can implement it in words but it's a bit ambiguous in code—there’s definitely a point that isn't properly tidy yet.

Ah... and Dev.to... I need to write there...
But I have absolutely no time to write... I'm really so busy. I have one body but I'm doing 3 projects.
Lately, I don't even have time to watch *Peaky Blinders*... running something until 4 AM, waking up at 10 AM, and doing something else again... my routine is so constant that when I lie down in bed, the logic is exactly this:

1. "Man, I'm gonna die, this is so hard, wahhh..."
2. "Zzzzzzzz..."

Still, health comes first, so I’m working out consistently.
But honestly, my body already hurts, and when muscle soreness is added to that, it feels like taking the tires off a broken car...
Making the situation even more critical...

Anyway!
February... once March comes, I’ll be going to university.
So I must check and re-check everything for the final time.

I need to audit my plans for March to December 2026 in advance.
Check if there's anything to add, or if they overlap with midterms or finals.
And check if there's any impact on 2027 or even up to 2030.

I need to verify and proofread everything, one by one.

January 2026, which will never come again.
And that's it!
