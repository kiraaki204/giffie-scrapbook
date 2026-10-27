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
      /* the "favorite person" label — it belongs ON October 28 */
      favp:  { png: "favp.png",          fallback: "bd22102ef58d3dae000ce5e58b48cd69.jpg" },
      bday:  { png: "bday.png",          fallback: "1775ae2a8718a489721decd4fd3f2d83.jpg" },
      bday1: { png: "bday1.png",         fallback: "2e5b0227aa34495e8744b30146b1fb78.jpg" },
      hand:  { png: "hand-removebg.png", fallback: "hand.jpg" },
      tulips:{ png: "stk-tulips.png",    fallback: "976d5c7bb460d587ae0580db19e69b65.jpg" }
    },
    library: [
      { png: "stk-heart.png",        jpg: "310b90af033c68568b2347fbf88c6de3.jpg" },
      { png: "stk-star.png",         jpg: "6711d24d4aa3a7a2ccab4701ec83b370.jpg" },
      { png: "stk-stars.png",        jpg: "sitcker1.jpg" },
      { png: "stk-kitty.png",        jpg: "d449fa0f4adf7461e2b01b99a68fcc0b.jpg" },
      { png: "stk-jellyfish.png",    jpg: "f52d01dc3787797a0efca1cb6ba3f433.jpg" },
      { png: "stk-planet.png",       jpg: "9a30371b5059345faf779a2172b7f64b.jpg" },
      { png: "stk-pixel-heart.png",  jpg: "312987af0984782fafad4243b761421a.jpg" },
      { png: "stk-pixel-env.png",    jpg: "44d26b2ee2704fe8c273e83730c1ec0e.jpg" },
      { png: "stk-pixel-kitty.png",  jpg: "d178aadd4723ef61824cda4784b01181.jpg" },
      { png: "stk-bean.png",         jpg: "1ef728e7cd81d64903bddc5330c5d48c.jpg" },
      { png: "stk-hug.png",          jpg: "2d49f0eb767593435c9ff56df489bec0.jpg" },
      { png: "stk-doodle.png",       jpg: "ab77a76888df77924f4b18b90a4886a5.jpg" },
      { png: "stk-heart-balloon.png",jpg: "03087c3c7ec42ea017e125932366d4dc.jpg" },
      { png: "stk-cat.png",          jpg: "80170864e0b942580d87b520e9647670.jpg" },
      { png: "stk-lily.png",         jpg: "93531682576dbb0ff07578ae32a43c69.jpg" },
      { png: "stk-letter-g.png",     jpg: "48cd4401bdfa0ebe4c80fdeaffee11b2.jpg" },
      { png: "stk-spider.png",       jpg: "5ab2e47e02d3dae411549c231aafa337.jpg" },
      { png: "stk-pony.png",         jpg: "07898c8fabd8c50047af31afffd9bb60.jpg" },
      { png: "stk-sunshine.png",     jpg: "bc26229d8dd43fddb14b1963e1f32f5a.jpg" },
      { png: "stk-squiggle.png",     jpg: "sticker.jpg" },
      { png: "stk-arrow.png",        jpg: "cd55b0d7f094b1cf1fe063b54416bb04.jpg" },
      { png: "stk-tulips.png",       jpg: "976d5c7bb460d587ae0580db19e69b65.jpg" },
      { png: "bday.png",             jpg: "1775ae2a8718a489721decd4fd3f2d83.jpg" },
      { png: "bday1.png",            jpg: "2e5b0227aa34495e8744b30146b1fb78.jpg" },
      { png: "hand-removebg.png",    jpg: "hand.jpg" }
    ]
  },

  /* ----------------------------------------------------------
     The 17 logical scrapbook pages.
     Order note: songs A + B sit side by side (spread 2|3… wait:
     spread map is [2,3],[4,5]… so songs are pages 4|5 together,
     and the letter comes just before the finale.
     ---------------------------------------------------------- */
  pages: [
    { n: 1,  key: "calendar",
      title: "October",
      year: "2024",
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
      definition: "The person destiny has chose for you. The missing piece that always puts up a smile on your face. A connection of minds and an unconditional, never-ending and effortless love" },

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

    { n: 8,  key: "best-friend",
      title: "Why you're my dearest friend ♡",
      photo1: "our photo goes here",
      photo2: "our photo goes here",
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
      options: ["Yes", "1", "2"],
      feedback: [
        "correct ♡ as expected of my best friend",
        "correct ♡ knew you'd say that",
        "correct ♡ option of the year"
      ] },

    { n: 15, key: "dots",
      title: "connect the dots-ily",
      hint: "drag between the dots ♡",
      reveal: "i love you" },

    { n: 16, key: "letter",
      title: "for later, from me",
      hint: "the real letter goes here",
      signature: "— your name here" },

    { n: 17, key: "the-end",
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
      reveal: "happy birthday, my best friend. i love you more than a scrapbook could ever say.",
      again: "read it again from the start ♡" }
  ]
};
