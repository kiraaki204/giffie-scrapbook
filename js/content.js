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
      songs: [
        { title: "K", artist: "CAS",
          img: "song-1.jpeg",
          big: "i think i wanna say i love you" },
        { title: "Blue", artist: "Yungkai",
          img: "song-5.jpg",
          big: "blue — all because of you" },
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
      photos: ["photo here", "photo here", "photo here"],
      caption: "three frames, one night",
      tapHint: "tap a photo ♡",
      message: "i'll always remain grateful that i was with you that night" },

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
        { t: "I hate the little things you do,\nThe things that make me think of you." },
        { t: "I hate the way you make me laugh,\nThen leave me smiling at our past.", i: true },
        { t: "I hate how you can make me laugh when I'm determined not to smile,\nThen somehow leave me missing you for quite a little while.", i: true },
        { t: "I hate the things you say and do,\nThat somehow make a bad day new" },
        { t: "I hate the way our books lost bits of every outer side,\nA tiny crime against the pages that you never even tried to hide." },
        { t: "I hate the way you know me well,\nThe things I never have to tell." },
        { t: "I hate how you could make me stay,\nEven when I wanted to walk away." },
        { t: "I hate how you kept reaching out when I'd told you we were through,\nAnd how some stubborn part of me kept waiting there for you." },
        { t: "I hate how you became someone\nI couldn't bear to lose and run." },
        { t: "I hate that I once thought we'd end,\nThat you'd become a stranger, not my friend.", i: true },
        { t: "I hate how much I've learned from all the things we made it through,\nAnd how the girl I nearly lost is still the girl I run to.", i: true },
        { t: "And most of all, I hate it's true:\nI could never hate the girl who's you." },
        { t: "Because I hate the thought of days gone by,\nWhen I almost let our friendship die." },
        { t: "I hate that I can't go back and do\nAll the things I wish I'd done for you." },
        { t: "But if I had one thing to say,\nI'd hate to ever lose you that way." },
        { t: "And maybe that's the worst part, too—" }
      ],
      coda: [
        "I have ten things I hate about you.",
        "But not one of them",
        "Could make me stop loving you."
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
