window.addEventListener('load', () => {
  waitForContent();
});

function waitForContent() {
  // keep checking every 100ms until the elements exist
  const interval = setInterval(() => {
    const allPhotos = document.querySelectorAll('.g-photo-wrapper');
    const allTextDivs = document.querySelectorAll('.body-size');

    // check if index.js has finished rendering
    if (allPhotos.length === 0 || allTextDivs.length === 0) {
      return; // not ready yet, wait for next interval
    }

    clearInterval(interval); // elements exist, stop checking
    tagElements(allPhotos, allTextDivs);
    buildIntroScene();
    initScrollMagic();

  }, 100);
}

function tagElements(allPhotos, allTextDivs) {
  // tag the first photo as the trapped gif
  if (allPhotos[0]) {
    allPhotos[0].id = 'trapped-gif-wrapper';
    const img = allPhotos[0].querySelector('img');
    if (img) img.id = 'trapped-gif';
  }

  // tag the black room quote
  allTextDivs.forEach(div => {
    const p = div.querySelector('p');
    if (p && p.textContent.includes('Picture a black room')) {
      div.id = 'black-room-quote';
    }
  });
}

function buildIntroScene() {
  const gif = document.getElementById('trapped-gif-wrapper');
  const quote = document.getElementById('black-room-quote');
  const container = document.getElementById('main-container');

  // safety check — if either element still isn't found, log it clearly
  if (!gif) { console.error('trapped-gif-wrapper not found'); return; }
  if (!quote) { console.error('black-room-quote not found'); return; }

  const introScene = document.createElement('div');
  introScene.id = 'intro-scene';

  const introSticky = document.createElement('div');
  introSticky.id = 'intro-sticky';

  introSticky.appendChild(gif);
  introSticky.appendChild(quote);
  introScene.appendChild(introSticky);
  container.insertBefore(introScene, container.firstChild);
}

function initScrollMagic() {
  const controller = new ScrollMagic.Controller();

  new ScrollMagic.Scene({
    triggerElement: '#intro-scene',
    triggerHook: 0,
    offset: 100,
    duration: '30%'
  })
  .on('enter', () => {
    document.getElementById('trapped-gif').style.opacity = '1';
  })
  .on('leave', () => {
    document.getElementById('trapped-gif').style.opacity = '0';
  })
  .addTo(controller);

  new ScrollMagic.Scene({
    triggerElement: '#intro-scene',
    triggerHook: 0,
    offset: 100, // was 500
    duration: '60%' // was 30%
  })
  .on('enter', () => {
    const quote = document.getElementById('black-room-quote');
    quote.style.opacity = '1';
    quote.style.transform = 'translateX(-50%) translateY(0)';
  })
  .on('leave', () => {
    const quote = document.getElementById('black-room-quote');
    quote.style.opacity = '0';
    quote.style.transform = 'translateX(-50%) translateY(60px)';
  })
  .addTo(controller);

  new ScrollMagic.Scene({
    triggerElement: '#intro-scene',
    triggerHook: 0,
    offset: 2200,
    duration: '10%'
  })
  .on('enter', () => {
    document.getElementById('intro-scene').style.opacity = '0';
    document.querySelectorAll('#main-container > *:not(#intro-scene)').forEach((el, i) => {
      setTimeout(() => el.classList.add('revealed'), i * 100);
    });
  })
  .on('leave', () => {
    document.getElementById('intro-scene').style.opacity = '1';
  })
  .addTo(controller);
}