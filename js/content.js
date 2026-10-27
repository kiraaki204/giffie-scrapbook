/* ============================================================
   content.js · every personal string lives here — swap later
   ============================================================ */

window.BOOK_CONTENT = {

  cover: {
    title: "for Giffie",
    ornament: "❦"
  },

  openHint: "tap to open",

  /* ----------------------------------------------------------
     THE INTRODUCTION PAGE · the folded-paper fortune teller
     (inside front cover, immediately before the calendar)

     Edit colours, numbers, instructions and fortunes here.
     The flap the paper nudges is (colour index + number) % 4,
     so every one of the four fortunes is always reachable.
     ---------------------------------------------------------- */
  fortune: {
    heading: "a little fortune for you… ♡",
    note: "a collection of little things, for my favourite person ♡",
    resultLabel: "your fortune",
    colours: [
      { id: "pink",     name: "pink",       tone: "#ecc5c4", ink: "#7d3644", doodle: "heart" },
      { id: "cherry",   name: "cherry red", tone: "#b23a48", ink: "#fdf3e4", doodle: "star" },
      { id: "cream",    name: "cream",      tone: "#f4e8d3", ink: "#8a6435", doodle: "flower" },
      { id: "lavender", name: "lavender",   tone: "#c3b2d4", ink: "#4f3d63", doodle: "moon" }
    ],
    numbers: [1, 2, 3, 4],
    steps: {
      colour: "pick a colour — the paper is listening ♡",
      colourPicked: "{colour} it is… mind the folds ♡",
      number: "now a number, 1 to 4 ♡",
      numberPicked: "{number}… turn it over once more ♡",
      fortune: "the paper nudged one flap for you — open any of them ♡",
      revealed: "there it is ♡"
    },
    fortunes: [
      "unfortunately for you, you're stuck with me, sorry ♡",
      "a lifetime of ridiculous memories awaits us.",
      "no matter how many pages life turns, i'm glad you're in my story.",
      "your next mission: turn the page, birthday girl →"
    ],
    controls: {
      again: "play again ♡",
      next: "turn the page →"
    }
  },

  /* ----------------------------------------------------------
     STICKERS · the transparent PNGs in assets/ come first, the
     old flat jpgs stay as a fallback. `library` is the pool the
     pages scatter stickers from — the order is intentional so
     neighbouring stickers rarely repeat the same little drawing.
     ---------------------------------------------------------- */
  stickers: {
    named: {
      /* the "favorite person" label — its arrow points to October 28 */
      favp:  { png: "favp.png",          fallback: "favp.png" },
      bday:  { png: "bday.png",          fallback: "bday.png" },
      bday1: { png: "bday1.png",         fallback: "bday1.png" },
      hand:  { png: "hand-removebg-preview.png", fallback: "hand-removebg-preview.png" },
      tulips:{ png: "stk-tulips.png",    fallback: "stk-tulips.png" }
    },
    library: [
      { png: "stk-heart.png",        jpg: "stk-heart.png" },
      { png: "stk-star.png",         jpg: "stk-star.png" },
      { png: "stk-stars.png",        jpg: "stk-stars.png" },
      { png: "stk-kitty.png",        jpg: "stk-kitty.png" },
      { png: "stk-jellyfish.png",    jpg: "stk-jellyfish.png" },
      { png: "stk-planet.png",       jpg: "stk-planet.png" },
      { png: "stk-pixel-heart.png",  jpg: "stk-pixel-heart.png" },
      { png: "stk-pixel-env.png",    jpg: "stk-pixel-env.png" },
      { png: "stk-pixel-kitty.png",  jpg: "stk-pixel-kitty.png" },
      { png: "stk-bean.png",         jpg: "stk-bean.png" },
      { png: "stk-hug.png",          jpg: "stk-hug.png" },
      { png: "stk-doodle.png",       jpg: "stk-doodle.png" },
      { png: "stk-heart-balloon.png",jpg: "stk-heart-balloon.png" },
      { png: "stk-cat.png",          jpg: "stk-cat.png" },
      { png: "stk-lily.png",         jpg: "stk-lily.png" },
      { png: "stk-letter-g.png",     jpg: "stk-letter-g.png" },
      { png: "stk-spider.png",       jpg: "stk-spider.png" },
      { png: "stk-pony.png",         jpg: "stk-pony.png" },
      { png: "stk-sunshine.png",     jpg: "stk-sunshine.png" },
      { png: "stk-squiggle.png",     jpg: "stk-squiggle.png" },
      { png: "stk-arrow.png",        jpg: "stk-arrow.png" },
      { png: "stk-tulips.png",       jpg: "stk-tulips.png" },
      { png: "bday.png",             jpg: "bday.png" },
      { png: "bday1.png",            jpg: "bday1.png" },
      { png: "hand-removebg-preview.png",    jpg: "hand-removebg-preview.png" }
    ]
  },

  /* ----------------------------------------------------------
     The 10 letter leaves after page 16. The first eight have the
     current letter; the final two stay open for more writing later.
     ---------------------------------------------------------- */
  letterPages: [
    {
      lead: "writing more than 8 pages for you because someone was upset bout it before :O:",
      paragraphs: [
        "so let me start off by saying that HAPPY BIRTHDAY, first of all! even tho we are the same age now, u will always stay younger than me. im happy that i am able to wish you this birthday as well, and ill remain grateful for every birthday that i get to wish you later (i hope i stay alive till your 95th birthday).",
        "ill always remain grateful to ALLAH pak for making u a part of my life. you have taught me alot, from small to big things. your company has always brought out a better side of me, and i think knowing you has done more for me than i could ever properly put into words."
      ]
    },
    {
      paragraphs: [
        "Thankyou so much for not letting me go and for continuing to make me a part of your life as well. and even tho ive said it alot, ill be saying it again: thankyou so much for doing every possible good for me that u could have done up to your limits.",
        "thankyou so much for always trying your best for the people around you who are close to you and for holding onto them. thankyou so much for being the person through which i learned to deal with my feelings."
      ]
    },
    {
      paragraphs: [
        "and ill remain grateful that even in the bad times you were the person my bad times went with. even when we were apart, a part of me was still carrying everything i had learned from knowing you. the distance didnt erase what you meant to me, and the difficult parts back then didnt make the good parts any less real."
      ]
    },
    {
      paragraphs: [
        "everytime i still remember the memories we made—whether it was the time of assembly before the lecture when we used to come early and play badminton, or us standing behind each other in assembly; whether it was t. maria ka period when we didnt used to talk in her presence, or t. maham ka period when we used to go crazy tgt; whether it was breaktime when we used to go to pookie, or chuti time when we used to always stand and walk together or sit in that specific window. ill always treasure all of these memories forever. a part of my heart is filled with them and ill never forget them, because they mean sm to me and they are the only asset of us that is left with me now..."
      ]
    },
    {
      paragraphs: [
        "whenever u get tired or bored or annoyed or struggling with anything, always remember that ill be there for you whenever i can. may ALLAH always remind you that your worth is never measured by how much u can accomplish in a day. may Allah reward you for every little effort you make on the days when you have absolutely nothing left to give yourself, and may you come home from college everyday feeling proud of yourself instead of simply relieved that its over."
      ]
    },
    {
      paragraphs: [
        "may Allah pak help you with every tiniest inconvenience in your life and may Allah always surround you with the kind of people who never make you feel that you have to become smaller to be loved; people who celebrate the good in you without competing with it, correct you without humiliating you, and stay honest with you even when being honest becomes difficult for them.",
        "may ALLAH take especially gentle care of you on the days you tell everyone you are doing fine when u are not, and may he know exactly what your heart needs on the days you dont even know how to ask for it."
      ]
    },
    {
      paragraphs: [
        "may relief come to you before you have to explain your pain to anyone. may Allah make you a part of so many good moments that you forget to count the bad ones. may ALLAH always support you in taking your decisions and remaining firm on them.",
        "may Allah keep goodness between us even when life gets hard or busy and the world takes us in different directions. may we always have the maturity to understand that growing doesnt have to mean growing apart."
      ]
    },
    {
      paragraphs: [
        "and LASTLY may ALLAH turn your every bad day of college ahead of you into not just a good one but the best one. AMEEN.",
        "ALLAH pak knows you in ways i dont, so everytime i think of you i always try to think of you in the way ALLAH pak does."
      ]
    },
    { paragraphs: [] },
    { paragraphs: [] }
  ],

  /* ----------------------------------------------------------
     The scrapbook's 27 logical pages. The 10 letter leaves follow
     page 16; the finale now lives on page 27.
     ---------------------------------------------------------- */
  pages: [
    { n: 1,  key: "calendar",
      title: "October",
      year: "2026",
      highlight: 28,
      note1: "A day worth celebrating ♡",
      note2: "A little calendar for the day the world got you." },

    { n: 2,  key: "enough",
      title: "In case I didn't say it enough…",
      items: [
        "thankyou for trying your best everyday",
        "thankyou for holding onto us",
        "Thank you for all the words you've written for me, all the little cards you've made, and every piece of yourself you've put into making me feel loved",
        "thankyou for recognizing your mistakes and not repeating them and for trying to make it up for them",
        "Thank you for making memories with me that I'll carry with me for the rest of my life.",
        "Thank you for letting me be a part of your life and giving me the chance to be there for you, too.",
        "Thank you for trusting me with pieces of yourself that you don't show everyone",
        "Thank you for all the times you've tried to understand me, even when I struggled to explain myself properly.",
        "Thank you for being a part of so many versions of me and still being here to meet the ones I'm becoming.",
        "Thank you for being you, because I don't think I could ever properly explain how much that alone means to me."
      ] },

    { n: 3,  key: "soulmate",
      title: "soulmate",
      hint: "[ soo-l-meyt ] n.",
      definition: "The person destiny has chose for you. The missing piece that always puts up a smile on your face. A connection of minds and an unconditional, never-ending and effortless love",
      photoAssets: [
        "IMG-20250227-WA0011.jpg",
        "IMG-20250227-WA0032.jpg",
        "IMG-20250227-WA0009.jpg",
        "IMG-20250227-WA0034.jpg",
        "IMG-20250227-WA0023.jpg",
        "IMG-20250227-WA0035.jpg"
      ] },

    { n: 4,  key: "songs-a",
      title: "Songs that remind me of you :)",
      side: "side A",
      intro: "And then there are the songs that i cannot listen to without hearing you",
      songs: [
        { title: "Love Me Not", artist: "Ravyn Lenae",
          img: "song.jpeg",
          big: "Oh, no, I don't need you, but I miss you, come here" },
        { title: "we fell in love in october", artist: "girl in red",
          img: "song-2.jpg",
          big: "we fell in love in october ♡" },
        { title: "It's You", artist: "Ali Gatie",
          img: "song-4.jpg",
          big: "it's you, it's you, it's all for you" }
      ] },

    { n: 5,  key: "songs-b",
      title: "Songs that remind me of you :)",
      side: "side B",
      intro: "…and the ones that still sound like you ♡",
      songs: [
        { title: "K", artist: "CAS",
          img: "song-1.jpeg",
          big: "i think i wanna say i love you" },
        { title: "Blue", artist: "Yungkai",
          img: "song-5.jpg",
          big: "blue — all because of you" },
        { title: "a little extra song for you", artist: "our soundtrack", img: "song-6.jpeg", big: "one more for the playlist ♡" },
        { title: "Something About You", artist: "Eyedress",
          img: "song-3.jpg",
          big: "there's something about you…" }
      ] },

    { n: 6,  key: "little-things",
      title: "17 Little Things I'll Always Remember",
      sub: "…cuz it's your 17th birthday ♡",
      items: [
        "wiping your face with my school ka duppata",
        "you being the first person who appreciated my smile",
        "your never-ending, endless yap",
        "the nickname that I received from you",
        "sitting next to each other in school",
        "the ring u gave me in the 7th grade",
        "u trying to make me feel confident no matter how insecure i feel",
        "the butterflies that i got from you as a “surprise” in the notebook",
        "all the sticky notes that i'll always keep closest to my heart",
        "u always tying my shoe laces",
        "you always being so gentle with me",
        "our tiny little inside jokes",
        "u lifting me up in 9th grade :O",
        "the reassurance u always try giving me",
        "calling me up whenever i said — especially when i could only text",
        "me always wiping ur glasses clean",
        "u tearing off book edges and me getting annoyed for no reason"
      ] },

    { n: 7,  key: "photo-booth",
      title: "Our little photo booth.",
      marquee: "PHOTO BOOTH",
      kicker: "step inside, silly · 3 poses · 1 night",
      stripNo: "strip no. 01",
      date: "28 · 10",
      photos: ["pose 1 · be silly", "pose 2 · be soft", "pose 3 · be us"],
      photoAssets: [
        "IMG-20250227-WA0022.jpg",
        "IMG-20250227-WA0031.jpg",
        "IMG-20250227-WA0036.jpg"
      ],
      caption: "three frames, one night",
      tapHint: "tap to flip ♡",
      addHint: "+ add a photo",
      message: "i'll always remain grateful that i was with you that night",
      shoot: "take the pictures ♡",
      shootAgain: "one more strip ♡",
      countdown: ["3", "2", "1", "smile! ♡"],
      developing: "developing your strip…",
      developed: "printed just for us ♡",
      ticket: "admit one",
      ticketSub: "a little night, kept forever",
      note: "the booth closes, the pictures stay ♡" },

    { n: 8,  key: "dearest-friend",
      title: "Why you're my dearest friend ♡",
      photo1: "one of my favourite little memories ♡",
      photo2: "a moment worth keeping ♡",
      photoAsset: "IMG-20250227-WA0035.jpg",
      paragraphs: [
        "there are many reasons why you're my dearest friend, and somehow i'm supposed to fit them all on one page, unfortunately. so let me start off by telling u reason number one, which would probably be the connection that i've always felt with you.",
        "i do think that whenever someone ends up becoming close to you, they leave a print on your soul that always stays with you, and i'm so grateful that YOU were the person who left a print on my soul. the person i am now, sometimes i wonder how many little parts of the person i am today exist because of something you said, something you did, or something you helped me understand without even realising you were teaching me anything.",
        "and u were my dearest friend, and you will forever remain my dearest friend, inshaAllah. no matter how busy we get or how many times i msg u in a year, a part of my soul that you've left a print on will always remember u.",
        "and that's only reason number one, unfortunately for you. T_T but don't worry, other reasons will be given to you throughout your life on every bday — you'd have to wait for them. ♡"
      ] },

    { n: 9,  key: "universes",
      title: "Us in Every Universe",
      hint: "us, in every universe —",
      pairs: [
        { id: "spider",   img: "universe3.jpg", label: "spider-verse us" },
        { id: "flame",    img: "universe1.jpg", label: "flame & water drop" },
        { id: "pony",     img: "universe7.jpg", label: "two ponies of friendship" },
        { id: "cats",     img: "universe2.jpg", label: "two cool cats" },
        { id: "kitty",    img: "universe6.jpg", label: "kitty & daniel" },
        { id: "creeper",  img: "universe5.jpg", label: "two creepers & a heart" },
        { id: "dumpling", img: "universe4.jpg", label: "two little dumplings" },
        { id: "worlds",   img: "universe8.jpg", label: "the earth & the ring" },
        { id: "monkeys",  img: "universe.jpg",  label: "two lil monkeys" },
        { id: "toons",    img: "univrse9.jpg",  label: "us, in every cartoon" }
      ],
      note: "same soul, every single time." },

    { n: 10, key: "traffic",
      title: "STOP · WAIT · GO",
      stop: "STOP thinking you aren't good enough, because you are.",
      wait: "WAIT for me in every lifetime.",
      go: "GO and chase your dreams, and I will be right by your side cheering you on, always." },

    { n: 11, key: "red-string",
      title: "Red String Theory",
      belief: "an ancient belief that invisible red threads connect us to those we are destined to meet — no matter time, place or circumstance.",
      note: "the thread may stretch, tangle, or even break for a while… but it will never truly be gone." },

    { n: 12, key: "reminders",
      title: "Final Reminders",
      items: [
        "you're allowed to have bad days without feeling bad about having them.",
        "please be as gentle with yourself as you are with the people you love.",
        "drink enough water. T_T",
        "and if you ever forget how special you are, i hope life finds a hundred little ways to remind you. ♡",
        "u can always tell me bout ur problems and i'll always be there for you. ♡",
        "you can celebrate your wins with me, no matter how small they seem. i wanna hear about them too.",
        "never be embarrassed about the things that make you genuinely happy.",
        "keep being weird. i mean this in the most affectionate way possible."
      ] },

    { n: 13, key: "hug",
      title: "Ten Things I Hate About You",
      sub: "…my version ♡",
      stanzas: [
        {
                "t": "I hate how you stayed when I told you to go,\nHow you kept reaching out when I gave you a no."
        },
        {
                "t": "I hate how you made it so hard to pretend,\nThat you were just someone I'd lose in the end."
        },
        {
                "t": "I hate how you kept finding your way back,\nWhen I'd convinced myself that what we had lacked."
        },
        {
                "t": "I hate how you made me look back and see,\nThe person I was, and who I didn't want to be."
        },
        {
                "t": "I hate how you taught me that feelings aren't right,\nIf I use them as reasons to hurt you in spite."
        },
        {
                "t": "I hate how you showed me that friendships can stay,\nEven when there's a month, or a year in the way."
        },
        {
                "t": "I hate how I guarded you, scared I'd be replaced,\nLike someone else's presence could erase my place."
        },
        {
                "t": "I hate that I almost let you become the past,\nWhen all I wanted was for us to last."
        },
        {
                "t": "I hate that you live in the thoughts I don't share,\nIn the days we don't talk, you're still somehow there."
        },
        {
                "t": "And most of all, I hate that it's true—\nThat after everything, I still choose you."
        },
        {
                "t": "I hate that I can't hate you, not even a little,\nNot after we made it through something so brittle."
        },
        {
                "t": "Not after the days when I thought we were through.\nNot after all that.\nI just hate—\nThat I ever almost lost you."
        }
] },

    { n: 14, key: "quiz",
      title: "Do you love me?",
      options: ["yes, always ♡", "a million times over", "obviously!"],
      feedback: [
        "correct ♡ I knew it",
        "correct ♡ there's no other answer",
        "correct ♡ you're my favourite person"
      ] },

    { n: 15, key: "dots",
      title: "connect the dots-ily",
      hint: "drag between the dots ♡",
      reveal: "i love you" },

    { n: 16, key: "letter",
      title: "for later, from me",
      hint: "the real letter goes here",
      signature: "— your name here" },

    { n: 17, key: "letter-continuation", part: 0 },
    { n: 18, key: "letter-continuation", part: 1 },
    { n: 19, key: "letter-continuation", part: 2 },
    { n: 20, key: "letter-continuation", part: 3 },
    { n: 21, key: "letter-continuation", part: 4 },
    { n: 22, key: "letter-continuation", part: 5 },
    { n: 23, key: "letter-continuation", part: 6 },
    { n: 24, key: "letter-continuation", part: 7 },
    { n: 25, key: "letter-continuation", part: 8 },
    { n: 26, key: "letter-continuation", part: 9 },

    { n: 27, key: "the-end",
      title: "THE END",
      sub: "…for the book, not for us",
      credit: "by mie ♡",
      lines: [
        "you made it to the last page, Giffie.",
        "thank you for every page u turned with me —",
        "this little book is just paper,",
        "but you? you're the whole story. ♡"
      ],
      button: "one more thing ♡",
      reveal: "happy birthday, my dearest friend. i love you more than a scrapbook could ever say.",
      again: "read it again from the start ♡" }
  ]
};
