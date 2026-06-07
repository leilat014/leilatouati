window.addEventListener("load", () => {
  waitForContent();
});

function waitForContent() {
  const interval = setInterval(() => {
    const allPhotos = document.querySelectorAll(".g-photo-wrapper");
    const allTextDivs = document.querySelectorAll(".body-size");

    if (allPhotos.length === 0 || allTextDivs.length === 0) {
      return;
    }

    clearInterval(interval);
    tagElements(allPhotos, allTextDivs);
    buildIntroScene();
    initScrollMagic();
    wrapChapterHeaders();
    initVideoAutoplay();
  }, 100);
}

function initVideoAutoplay() {
  const videos = document.querySelectorAll('.g-video-wrapper video');

  const observer = new IntersectionObserver ((entries) => {
    entries.forEach(entry => {
      const video = entry.target;
      if (entry.isIntersecting) {
        // video.muted = true;
        video.play();
      } else {
        video.pause();
      }
    });
  }, { threshold: 0.5 });

  videos.forEach(video => {
    video.muted = false;
    video.loop = false;
    video.controls = true;
    observer.observe(video);
  }
  );
}

// function wrapTextVideoSections() {
//   const container = document.getElementById('main-container');
//   const children = Array.from(container.children);

//   children.forEach(child => {
//     if (!child.classList.contains('g-video-wrapper')) return;

//     const prevEl = child.previousElementSibling;
//     if (!prevEl || !prevEl.classList.contains('body-size')) return;

//     // collect all consecutive body-size siblings before this video
//     // so the sticky video sits beside multiple paragraphs
//     const textBlocks = [];
//     let cursor = prevEl;
//     while (cursor && cursor.classList.contains('body-size')) {
//       textBlocks.unshift(cursor);
//       cursor = cursor.previousElementSibling;
//     }

//     // only pair if there are text blocks
//     if (textBlocks.length === 0) return;

//     const pair = document.createElement('div');
//     pair.className = 'text-video-pair';

//     const textCol = document.createElement('div');
//     textCol.className = 'text-col';

//     const videoCol = document.createElement('div');
//     videoCol.className = 'video-col';

//     // insert wrapper before the first text block
//     container.insertBefore(pair, textBlocks[0]);

//     // move text blocks into text column
//     textBlocks.forEach(block => textCol.appendChild(block));

//     // move video into video column
//     videoCol.appendChild(child);

//     pair.appendChild(textCol);
//     pair.appendChild(videoCol);
//   });
// }


function tagElements(allPhotos, allTextDivs) {
  if (allPhotos[0]) {
    allPhotos[0].id = "trapped-gif-wrapper";
    const img = allPhotos[0].querySelector("img");
    if (img) img.id = "trapped-gif";
  }

  allTextDivs.forEach((div) => {
    const p = div.querySelector("p");
    if (p && p.textContent.includes("Picture a black room")) {
      div.id = "black-room-quote";
    }
  });

  const headlineWrapper = document.querySelector(".headline-wrapper");
  if (headlineWrapper) headlineWrapper.id = "headline-wrapper";
}

function buildIntroScene() {
  const gif = document.getElementById("trapped-gif-wrapper");
  const quote = document.getElementById("black-room-quote");
  const headline = document.getElementById("headline-wrapper");
  const container = document.getElementById("main-container");
  const bylines = document.getElementById(".bylines");

  // find the ratio embed — parallax goes after this
  const allEmbeds = document.querySelectorAll(".embed-wrapper");
  const ratioEmbed = allEmbeds[0]; // first embed is the ratio graphic

  if (!gif) {
    console.error("trapped-gif-wrapper not found");
    return;
  }
  if (!quote) {
    console.error("black-room-quote not found");
    return;
  }

  // ── HEADLINE BLOCK ──
  // sits at the very top of main-container, separate from the parallax
  const headlineBlock = document.createElement("div");
  headlineBlock.id = "intro-headline-block";

  const headlineClone = headline ? headline.cloneNode(true) : null;
  if (headlineClone) {
    headlineClone.id = "intro-headline";
    headlineBlock.appendChild(headlineClone);
  }

  if (headline) headline.style.display = "none";

  container.insertBefore(headlineBlock, container.firstChild);

  // ── PARALLAX SCENE ──
  // goes after the ratio graphic
  const introScene = document.createElement("div");
  introScene.id = "intro-scene";

  const introSticky = document.createElement("div");
  introSticky.id = "intro-sticky";

  const gifClone = gif.cloneNode(true);
  const quoteClone = quote.cloneNode(true);
  gifClone.id = "trapped-gif-wrapper";
  gifClone.querySelector("img").id = "trapped-gif";
  quoteClone.id = "black-room-quote";

  introSticky.appendChild(gifClone);
  introSticky.appendChild(quoteClone);
  introScene.appendChild(introSticky);

  // insert parallax scene after the ratio graphic
  if (ratioEmbed && ratioEmbed.nextSibling) {
    container.insertBefore(introScene, ratioEmbed.nextSibling);
  } else {
    container.appendChild(introScene);
  }

  // hide all originals
  gif.style.display = "none";
  quote.style.display = "none";
  if (headline) headline.style.display = "none";

  const universityEl = document.querySelector(".university");
  if (universityEl) universityEl.style.display = "none";
}

function initScrollMagic() {
  const controller = new ScrollMagic.Controller();

  // Scene 1: fade in the GIF
  new ScrollMagic.Scene({
    triggerElement: "#intro-scene",
    triggerHook: 0,
    offset: 100,
    duration: "60%",
  })
    .on("enter", () => {
      document.getElementById("trapped-gif").style.opacity = "1";
    })
    .on("leave", () => {
      document.getElementById("trapped-gif").style.opacity = "0";
    })
    .addTo(controller);

  // Scene 2: slide up the quote
  new ScrollMagic.Scene({
    triggerElement: "#intro-scene",
    triggerHook: 0,
    offset: 500,
    duration: "65%",
  })
    .on("enter", () => {
      const quote = document.getElementById("black-room-quote");
      quote.style.opacity = "1";
      quote.style.transform = "translateX(-50%) translateY(0)";
    })
    .on("leave", () => {
      const quote = document.getElementById("black-room-quote");
      quote.style.opacity = "0";
      quote.style.transform = "translateX(-50%) translateY(60px)";
    })
    .addTo(controller);

  // Scene 3: fade out intro, reveal article
  //   new ScrollMagic.Scene({
  //     triggerElement: "#intro-scene",
  //     triggerHook: 0,
  //     offset: 2600,
  //     duration: "15%",
  //   })
  //     .on("enter", () => {
  //       document.getElementById("intro-scene").style.opacity = "0";
  //       document
  //         .querySelectorAll("#main-container > *:not(#intro-scene)")
  //         .forEach((el, i) => {
  //           setTimeout(() => el.classList.add("revealed"), i * 100);
  //         });
  //     })
  //     .on("leave", () => {
  //       document.getElementById("intro-scene").style.opacity = "1";
  //     })
  //     .addTo(controller);
}

function wrapChapterHeaders() {
  const chapterTitles = {
    "chapter-first-steps": "The first steps on campus",
    "chapter-home": "Home, not-so-sweet, home",
    "chapter-bias": "Encounters with bias and discrimination",
    "chapter-rep": "Seeking representation",
    "chapter-action": "Performative action and deaf ears",
    "chapter-sanctuary": "A sanctuary in cultural clubs",
    "chapter-light": "Finding the light",
  };

  // keep checking until all 7 chapter headers are loaded
  const interval = setInterval(() => {
    const headers = document.querySelectorAll(".chapter-header-block");
    console.log("chapter headers found so far:", headers.length);

    if (headers.length < 7) return; // not all loaded yet

    clearInterval(interval);
    console.log("all chapter headers loaded, wrapping now");

    const embeds = document.querySelectorAll(".embed-wrapper");

    embeds.forEach((embed) => {
      const header = embed.querySelector(".chapter-header-block");
      if (!header) return;

      const nextEl = embed.nextElementSibling;
      if (!nextEl || !nextEl.classList.contains("g-photo-wrapper")) {
        console.warn("No g-photo-wrapper after:", header.id);
        return;
      }

      const anchorId = header.id;
      const chapterScene = document.createElement("div");
      chapterScene.className = "chapter-scene";

      if (anchorId) {
        chapterScene.id = anchorId;
        header.removeAttribute("id");
      }

      const titleOverlay = document.createElement("div");
      titleOverlay.className = "chapter-title-overlay";
      const titleText = chapterTitles[anchorId] || "";
      titleOverlay.innerHTML = `<h2>${titleText}</h2>`;

      nextEl.style.position = "relative";
      nextEl.appendChild(titleOverlay);

      embed.parentNode.insertBefore(chapterScene, embed);
      chapterScene.appendChild(embed);
      chapterScene.appendChild(nextEl);
    });
  }, 200); // check every 200ms
}
