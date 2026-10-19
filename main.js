/**
 * RUMAH ASISTEN WEDANA (KOTA METRO, LAMPUNG)
 * High-Impact Interactive Controller (ES6 Production-Grade)
 */

document.addEventListener('DOMContentLoaded', () => {
  initNavigation();
  initSoundscape();
  initChronicle();
  initBlueprintHotspots();
  initThenNowSlider();
  initWedanaSpaceAgenda();
  initHeritageMap();
  initVirtualAudioTour();
});

/* ==========================================================================
   01. NAVIGATION CONTROLLER
   ========================================================================== */
function initNavigation() {
  const mobileToggle = document.getElementById('mobileNavToggle');
  const navMenu = document.getElementById('navMenu');
  const navLinks = document.querySelectorAll('.nav-link');

  if (mobileToggle && navMenu) {
    mobileToggle.addEventListener('click', () => {
      navMenu.classList.toggle('open');
      mobileToggle.classList.toggle('active');
      const isOpen = navMenu.classList.contains('open');
      mobileToggle.setAttribute('aria-expanded', isOpen);
    });

    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('open');
        mobileToggle.classList.remove('active');
      });
    });
  }
}

/* ==========================================================================
   02. WEB AUDIO PROCEDURAL SOUNDSCAPE ENGINE
   ========================================================================== */
function initSoundscape() {
  const hudBtn = document.getElementById('soundscapeHud');
  const soundLabel = document.getElementById('soundLabel');
  if (!hudBtn) return;

  let audioCtx = null;
  let isPlaying = false;
  let windSource = null;
  let windGain = null;
  let chimeTimer = null;

  function createWindNoise(ctx) {
    const bufferSize = ctx.sampleRate * 4;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;

    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      b0 = 0.99886 * b0 + white * 0.0555179;
      b1 = 0.99332 * b1 + white * 0.0750759;
      b2 = 0.96900 * b2 + white * 0.1538520;
      b3 = 0.86650 * b3 + white * 0.3104856;
      b4 = 0.55000 * b4 + white * 0.5329522;
      b5 = -0.7616 * b5 - white * 0.0168980;
      data[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.05;
      b6 = white * 0.115926;
    }

    const noise = ctx.createBufferSource();
    noise.buffer = buffer;
    noise.loop = true;

    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(320, ctx.currentTime);

    const lfo = ctx.createOscillator();
    lfo.frequency.setValueAtTime(0.18, ctx.currentTime);
    const lfoGain = ctx.createGain();
    lfoGain.gain.setValueAtTime(120, ctx.currentTime);
    lfo.connect(lfoGain);
    lfoGain.connect(filter.frequency);
    lfo.start();

    noise.connect(filter);
    return { source: noise, output: filter };
  }

  function playSoftChime(ctx) {
    if (!isPlaying) return;
    const notes = [329.63, 392.00, 493.88, 587.33, 659.25];
    const freq = notes[Math.floor(Math.random() * notes.length)];

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, ctx.currentTime);

    gain.gain.setValueAtTime(0, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.04, ctx.currentTime + 0.1);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 3.8);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 4.0);

    const nextTime = Math.random() * 4000 + 3500;
    chimeTimer = setTimeout(() => playSoftChime(ctx), nextTime);
  }

  hudBtn.addEventListener('click', async () => {
    if (!audioCtx) {
      audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }

    if (audioCtx.state === 'suspended') {
      await audioCtx.resume();
    }

    if (!isPlaying) {
      const wind = createWindNoise(audioCtx);
      windSource = wind.source;
      windGain = audioCtx.createGain();
      windGain.gain.setValueAtTime(0.001, audioCtx.currentTime);
      windGain.gain.linearRampToValueAtTime(0.3, audioCtx.currentTime + 1.5);

      wind.output.connect(windGain);
      windGain.connect(audioCtx.destination);
      windSource.start();

      isPlaying = true;
      hudBtn.classList.add('playing');
      if (soundLabel) soundLabel.textContent = 'Memutar';
      playSoftChime(audioCtx);
    } else {
      if (windGain) {
        windGain.gain.linearRampToValueAtTime(0.001, audioCtx.currentTime + 0.8);
        setTimeout(() => {
          if (windSource) windSource.stop();
        }, 800);
      }
      clearTimeout(chimeTimer);
      isPlaying = false;
      hudBtn.classList.remove('playing');
      if (soundLabel) soundLabel.textContent = 'Suara Alam';
    }
  });
}

/* ==========================================================================
   03. THE CHRONICLE DATA & CONTROLLER (SEJARAH KOTA METRO)
   ========================================================================== */
const chronicleData = {
  1935: {
    year: '1935',
    title: 'Pembukaan Kolonisasi Sukadana',
    desc: 'Rombongan kolonis pertama diberangkatkan dari Pulau Jawa menuju pedalaman Lampung. Kawasan yang semula hutan lebat dibuka bertahap melalui sistem penomoran bedeng. Wilayah pusat pemerintahan dibentuk di Bedeng 21, yang kemudian dinamai "Meterm" atau Metro (bahasa Belanda: pusat).',
    quote: '"Sebuah ikhtiar besar meretas rimba menjadi kota taman (garden city) dengan jaringan irigasi Way Sekampung."'
  },
  1937: {
    year: '1937',
    title: 'Peresmian Rumah Asisten Wedana',
    desc: 'Pada 9 Juni 1937, bangunan kediaman resmi sekaligus kantor Asisten Wedana diresmikan bersamaan dengan peresmian tugu peringatan Residen H.R. Rookmaaker. Bangunan ini menandai berdirinya pusat tata kepemerintahan modern yang mengawasi distrik kolonisasi.',
    quote: '"Simbol awal berdirinya pusat pemerintahan sipil di jantung Kota Metro."'
  },
  1945: {
    year: '1945',
    title: 'Era Pamong Praja Republik Indonesia',
    desc: 'Memasuki masa revolusi kemerdekaan, pamong praja lokal mengambil alih kendali administratif kawedanaan. Rumah ini menjadi pos koordinasi pemerintahan rakyat dalam menjaga stabilitas wilayah Metro selama masa agresi militer.',
    quote: '"Tegak berdiri menaungi peralihan sejarah dari era kolonial menuju Republik."'
  },
  2021: {
    year: '2021',
    title: 'Penetapan Resmi Cagar Budaya',
    desc: 'Pemerintah Kota Metro melalui Surat Keputusan Walikota secara resmi menetapkan Rumah Asisten Wedana sebagai Bangunan Cagar Budaya. Langkah ini menjamin keaslian arsitektur 1930-an terlindungi secara hukum dari ancaman pembongkaran.',
    quote: '"Merawat memori kolektif cikal bakal berdirinya Kota Metro bagi generasi masa depan."'
  },
  2026: {
    year: 'Hari Ini',
    title: 'Wedana Space: Creative Heritage Hub',
    desc: 'Melalui kolaborasi Pemkot Metro dan berbagai komunitas pemuda, kawasan ini direvitalisasi menjadi Wedana Space—ruang publik kreatif ramah cagar budaya dengan galeri arsip sejarah, sentra UMKM kopi, workshop seni, dan panggung festival tahunan Metro Mengingat.',
    quote: '"Cagar budaya yang hidup, berdenyut, dan menggerakkan kreativitas masyarakat."'
  }
};

function initChronicle() {
  const tabs = document.querySelectorAll('.timeline-tab-btn');
  const yearEl = document.getElementById('chronicleYear');
  const titleEl = document.getElementById('chronicleEraTitle');
  const descEl = document.getElementById('chronicleDesc');
  const quoteEl = document.getElementById('chronicleQuote');
  const cardEl = document.getElementById('chronicleCardDisplay');

  if (!tabs.length || !cardEl) return;

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const era = tab.getAttribute('data-era');
      const data = chronicleData[era];
      if (!data) return;

      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      cardEl.style.opacity = '0.35';
      cardEl.style.transform = 'translateY(4px)';

      setTimeout(() => {
        if (yearEl) yearEl.textContent = data.year;
        if (titleEl) titleEl.textContent = data.title;
        if (descEl) descEl.textContent = data.desc;
        if (quoteEl) quoteEl.textContent = data.quote;

        cardEl.style.transition = 'all 0.3s ease';
        cardEl.style.opacity = '1';
        cardEl.style.transform = 'translateY(0)';
      }, 140);
    });
  });
}

/* ==========================================================================
   04. ARCHITECTURAL BLUEPRINT HOTSPOT CONTROLLER (METRO HOUSE)
   ========================================================================== */
const blueprintSpots = {
  pilar: {
    title: 'Pilar Geometris Indis',
    body: 'Pilar persegi berdinding plester tebal tanpa ornamen rumit, mencerminkan estetika arsitektur modern awal abad ke-20 di Hindia Belanda. Kokoh menopang atap serambi depan.',
    material: 'Tembok Bata & Plester Kolonial',
    elevation: 'Tinggi Pilar 3.8 Meter',
    function: 'Penopang Serambi & Penahan Angin'
  },
  krepyak: {
    title: 'Jendela Krepyak Kayu Jati',
    body: 'Bilah kayu horizontal ganda yang dirancang untuk mengalirkan sirkulasi udara silang secara pasif di iklim tropis, menjaga suhu dalam ruangan tetap sejuk tanpa AC.',
    material: 'Kayu Jati Asli 1937',
    elevation: 'Level Dinding Ruang Kerja',
    function: 'Sirkulasi Udara Tropis Alami'
  },
  pendopo: {
    title: 'Pendopo Serambi Luas (Terbuka)',
    body: 'Teras depan berlantai teraso yang luas dan teduh, berfungsi sebagai tempat musyawarah pamong praja kolonial bersama para pamong desa dan masyarakat pada masa pembukaan kota.',
    material: 'Lantai Ubin Teraso Vintage',
    elevation: 'Teras Depan Terbuka',
    function: 'Ruang Publik & Musyawarah'
  },
  atap: {
    title: 'Konstruksi Atap Limasan Tinggi',
    body: 'Sudut kemiringan atap curam khas arsitektur Indische Empire dengan ventilasi udara di bubungan atap, efektif membuang hawa panas dan menepis curah hujan deras.',
    material: 'Rangka Kayu & Genteng Press',
    elevation: 'Plafon Tinggi 4.5 Meter',
    function: 'Pelepas Hawa Panas Tropis'
  }
};

function initBlueprintHotspots() {
  const pins = document.querySelectorAll('.blueprint-hotspot-pin');
  const titleEl = document.getElementById('inspectorTitle');
  const bodyEl = document.getElementById('inspectorBody');
  const matEl = document.getElementById('inspectorMaterial');
  const elevEl = document.getElementById('inspectorElevation');
  const funcEl = document.getElementById('inspectorFunction');
  const inspectorCard = document.getElementById('blueprintInspectorCard');

  if (!pins.length || !inspectorCard) return;

  pins.forEach(pin => {
    pin.addEventListener('click', () => {
      const spotKey = pin.getAttribute('data-spot');
      const spot = blueprintSpots[spotKey];
      if (!spot) return;

      pins.forEach(p => p.classList.remove('active'));
      pin.classList.add('active');

      inspectorCard.style.opacity = '0.35';
      setTimeout(() => {
        if (titleEl) titleEl.textContent = spot.title;
        if (bodyEl) bodyEl.textContent = spot.body;
        if (matEl) matEl.textContent = spot.material;
        if (elevEl) elevEl.textContent = spot.elevation;
        if (funcEl) funcEl.textContent = spot.function;

        inspectorCard.style.transition = 'all 0.3s ease';
        inspectorCard.style.opacity = '1';
      }, 130);
    });
  });
}

/* ==========================================================================
   05. THEN VS NOW TIME-SLIDER
   ========================================================================== */
function initThenNowSlider() {
  const card = document.getElementById('timeSliderCard');
  const beforeWrapper = document.getElementById('beforeImageWrapper');
  const handle = document.getElementById('sliderPillHandle');
  const beforeImg = document.getElementById('imgThen');

  if (!card || !beforeWrapper || !handle || !beforeImg) return;

  let isDragging = false;

  function updateSlider(clientX) {
    const rect = card.getBoundingClientRect();
    let offsetX = clientX - rect.left;
    if (offsetX < 0) offsetX = 0;
    if (offsetX > rect.width) offsetX = rect.width;

    const percentage = (offsetX / rect.width) * 100;
    beforeWrapper.style.width = `${percentage}%`;
    handle.style.left = `${percentage}%`;

    beforeImg.style.width = `${rect.width}px`;
    card.style.setProperty('--container-width', `${rect.width}px`);
  }

  card.addEventListener('pointerdown', (e) => {
    isDragging = true;
    updateSlider(e.clientX);
    card.setPointerCapture(e.pointerId);
  });

  card.addEventListener('pointermove', (e) => {
    if (!isDragging) return;
    updateSlider(e.clientX);
  });

  const stopDrag = (e) => {
    if (isDragging) {
      isDragging = false;
      try { card.releasePointerCapture(e.pointerId); } catch (_) {}
    }
  };

  card.addEventListener('pointerup', stopDrag);
  card.addEventListener('pointercancel', stopDrag);

  window.addEventListener('resize', () => {
    const rect = card.getBoundingClientRect();
    beforeImg.style.width = `${rect.width}px`;
    card.style.setProperty('--container-width', `${rect.width}px`);
  });

  setTimeout(() => {
    const rect = card.getBoundingClientRect();
    beforeImg.style.width = `${rect.width}px`;
    card.style.setProperty('--container-width', `${rect.width}px`);
  }, 200);
}

/* ==========================================================================
   06. WEDANA SPACE AGENDA FILTER (LIVING HERITAGE)
   ========================================================================== */
function initWedanaSpaceAgenda() {
  const filterBtns = document.querySelectorAll('.agenda-tab-btn');
  const agendaCards = document.querySelectorAll('.agenda-item-card');

  if (!filterBtns.length || !agendaCards.length) return;

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const filter = btn.getAttribute('data-filter');

      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      agendaCards.forEach(card => {
        const cat = card.getAttribute('data-cat');
        if (filter === 'all' || cat === filter) {
          card.style.display = 'grid';
          card.style.opacity = '0';
          setTimeout(() => {
            card.style.transition = 'opacity 0.25s ease';
            card.style.opacity = '1';
          }, 50);
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
}

/* ==========================================================================
   07. METRO HERITAGE TRAIL (LEAFLET MAP - KOTA METRO PUSAT)
   ========================================================================== */
function initHeritageMap() {
  const mapEl = document.getElementById('heritageMap');
  if (!mapEl || typeof L === 'undefined') return;

  const centerCoords = [-5.1147, 105.3068];
  const map = L.map('heritageMap', {
    center: centerCoords,
    zoom: 16,
    scrollWheelZoom: false
  });

  L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  }).addTo(map);

  const trailStops = [
    {
      id: 'trailStop1',
      title: 'Rumah Asisten Wedana',
      coords: [-5.1147, 105.3068],
      num: '1',
      desc: 'Jl. P. Diponegoro, Imopuro. Cagar Budaya Kolonial 1937 & Wedana Space.'
    },
    {
      id: 'trailStop2',
      title: 'Menara Air Kolonial (Ledeng)',
      coords: [-5.1132, 105.3079],
      num: '2',
      desc: 'Ikon menara air kolonial bersejarah di dekat Taman Merdeka.'
    },
    {
      id: 'trailStop3',
      title: 'Klinik & Rumah Dokter Cagar Budaya',
      coords: [-5.1158, 105.3045],
      num: '3',
      desc: 'Layanan kesehatan pertama kolonisasi Belanda di Metro.'
    },
    {
      id: 'trailStop4',
      title: 'Taman Merdeka & Samber Park',
      coords: [-5.1125, 105.3090],
      num: '4',
      desc: 'Pusat tata kota taman (garden city) dan alun-alun kebanggaan warga.'
    }
  ];

  const markers = [];

  trailStops.forEach(stop => {
    const customIcon = L.divIcon({
      className: 'custom-heritage-pin',
      html: `<div style="
        width: 28px;
        height: 28px;
        background: #A8482E;
        color: #FFFFFF;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-family: sans-serif;
        font-weight: 600;
        font-size: 12px;
        box-shadow: 0 2px 8px rgba(0,0,0,0.25);
      ">${stop.num}</div>`,
      iconSize: [28, 28],
      iconAnchor: [14, 14],
      popupAnchor: [0, -16]
    });

    const marker = L.marker(stop.coords, { icon: customIcon }).addTo(map);
    marker.bindPopup(`
      <div style="font-family: sans-serif; padding: 4px;">
        <strong style="font-size: 1rem; color: #1C1917; display: block; margin-bottom: 2px;">${stop.title}</strong>
        <span style="font-size: 0.82rem; color: #5E584F;">${stop.desc}</span>
      </div>
    `);

    markers.push({ id: stop.id, marker: marker, coords: stop.coords });
  });

  const cards = document.querySelectorAll('.trail-stop-card');
  cards.forEach(card => {
    card.addEventListener('click', () => {
      const cardId = card.id;
      cards.forEach(c => c.classList.remove('active'));
      card.classList.add('active');

      const found = markers.find(m => m.id === cardId);
      if (found) {
        map.flyTo(found.coords, 16, { duration: 1.0 });
        found.marker.openPopup();
      }
    });
  });

  // Ensure map tiles properly compute container dimensions after DOM layout & on resize
  setTimeout(() => {
    map.invalidateSize();
  }, 350);

  window.addEventListener('resize', () => {
    map.invalidateSize();
  });
}

/* ==========================================================================
   08. VIRTUAL AUDIO TOUR GUIDE (NATIVE WEB SPEECH & REALTIME TRANSCRIPT)
   ========================================================================== */
const audioChapters = {
  1: {
    tag: 'BABAK 01 DARI 03',
    title: 'Kelahiran Bedeng 21 & Kota Metro',
    duration: '01:05',
    sentences: [
      'Selamat datang di Cagar Budaya Rumah Asisten Wedana, tonggak awal peradaban Kota Metro.',
      'Pada tahun 1935, rombongan kolonis pertama diberangkatkan dari Pulau Jawa menuju pedalaman rimba Lampung.',
      'Para perintis membuka hutan secara bergotong royong dan mendirikan pemukiman bersistem penomoran bedeng.',
      'Bedeng 21 dipilih sebagai pusat kota dan dinamai Metro, yang berakar dari kata Meterm dalam bahasa Belanda, bermakna pusat.',
      'Tepat pada tanggal 9 Juni 1937, rumah dinas ini diresmikan bersamaan dengan monumen Residen Rookmaaker, menandai lahirnya pusat kota modern.'
    ]
  },
  2: {
    tag: 'BABAK 02 DARI 03',
    title: 'Di Balik Meja Asisten Wedana',
    duration: '01:10',
    sentences: [
      'Sebagai pimpinan kawedanaan, Asisten Wedana merupakan pamong praja pembantu bupati pada masa Hindia Belanda.',
      'Beliau menjadi jembatan diplomasi penting antara pejabat kolonial dengan para kepala desa dan masyarakat adat Lampung.',
      'Di serambi pendopo yang luas inilah, musyawarah pembagian air irigasi Way Sekampung dan batas desa dirumuskan.',
      'Konstruksi dinding tebal dan jendela krepyak kayu jati dirancang agar udara tetap sejuk di tengah terik tropis.',
      'Ketika revolusi kemerdekaan pecah pada 1945, rumah ini bertransformasi menjadi markas koordinasi pemuda pejuang Republik.'
    ]
  },
  3: {
    tag: 'BABAK 03 DARI 03',
    title: 'Menghidupkan Kembali Wedana Space',
    duration: '01:15',
    sentences: [
      'Setelah sempat lama terbengkalai, muncul gerakan pemuda bersama pemerintah Kota Metro untuk menyelamatkan bangunan ini.',
      'Melalui Surat Keputusan Walikota, Rumah Asisten Wedana resmi dilindungi sebagai Bangunan Cagar Budaya.',
      'Kawasan ini diaktivasi menjadi Wedana Space, ruang publik kreatif ramah cagar budaya dengan sentra kopi lokal dan workshop seni.',
      'Setiap tahunnya, Festival Metro Mengingat digelar di halaman ini untuk merawat memori kolektif antar-generasi.',
      'Tempat ini menjadi bukti nyata bahwa cagar budaya dapat hidup, berdenyut, dan menggerakkan ekonomi kreatif warganya.'
    ]
  }
};

function initVirtualAudioTour() {
  const chapterCards = document.querySelectorAll('.chapter-card');
  const playerTag = document.getElementById('playerTag');
  const playerTitle = document.getElementById('playerTopicTitle');
  const statusBadge = document.getElementById('playerStatusBadge');
  const btnPlay = document.getElementById('btnPlayTour');
  const playIcon = document.getElementById('playIcon');
  const pauseIcon = document.getElementById('pauseIcon');
  const progressFill = document.getElementById('playerProgressFill');
  const currentTimeEl = document.getElementById('playerCurrentTime');
  const totalTimeEl = document.getElementById('playerTotalTime');
  const transcriptContent = document.getElementById('transcriptContent');

  if (!btnPlay || !transcriptContent) return;

  let currentChapter = 1;
  let isPlaying = false;
  let currentSentenceIndex = 0;
  let speechSynth = window.speechSynthesis;
  let currentUtterance = null;
  let timerInterval = null;
  let secondsElapsed = 0;

  function loadChapter(chapterNum) {
    stopPlayback();
    currentChapter = chapterNum;
    const data = audioChapters[chapterNum];
    if (!data) return;

    if (playerTag) playerTag.textContent = data.tag;
    if (playerTitle) playerTitle.textContent = data.title;
    if (totalTimeEl) totalTimeEl.textContent = data.duration;
    if (currentTimeEl) currentTimeEl.textContent = '00:00';
    if (progressFill) progressFill.style.width = '0%';
    if (statusBadge) {
      statusBadge.textContent = 'Siap Diputar';
      statusBadge.classList.remove('speaking');
    }

    // Populate Transcript
    transcriptContent.innerHTML = '';
    data.sentences.forEach((sentence, idx) => {
      const span = document.createElement('span');
      span.className = 'transcript-sentence';
      span.setAttribute('data-index', idx);
      span.textContent = sentence + ' ';
      span.addEventListener('click', () => {
        jumpToSentence(idx);
      });
      transcriptContent.appendChild(span);
    });

    currentSentenceIndex = 0;
    secondsElapsed = 0;
  }

  function highlightSentence(idx) {
    const allSpans = transcriptContent.querySelectorAll('.transcript-sentence');
    allSpans.forEach(s => s.classList.remove('active'));
    if (allSpans[idx]) {
      allSpans[idx].classList.add('active');
      allSpans[idx].scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }

  function playNextSentence() {
    const data = audioChapters[currentChapter];
    if (!data || currentSentenceIndex >= data.sentences.length) {
      stopPlayback();
      return;
    }

    highlightSentence(currentSentenceIndex);

    // Update progress
    const pct = ((currentSentenceIndex + 1) / data.sentences.length) * 100;
    if (progressFill) progressFill.style.width = `${pct}%`;

    const textToSpeak = data.sentences[currentSentenceIndex];

    if (speechSynth) {
      speechSynth.cancel();
      currentUtterance = new SpeechSynthesisUtterance(textToSpeak);
      currentUtterance.lang = 'id-ID';
      currentUtterance.rate = 0.95;

      const voices = speechSynth.getVoices();
      const idVoice = voices.find(v => v.lang.includes('id') || v.lang.includes('ID'));
      if (idVoice) currentUtterance.voice = idVoice;

      currentUtterance.onend = () => {
        if (!isPlaying) return;
        currentSentenceIndex++;
        if (currentSentenceIndex < data.sentences.length) {
          playNextSentence();
        } else {
          stopPlayback();
        }
      };

      currentUtterance.onerror = () => {
        if (!isPlaying) return;
        currentSentenceIndex++;
        if (currentSentenceIndex < data.sentences.length) {
          setTimeout(playNextSentence, 800);
        } else {
          stopPlayback();
        }
      };

      speechSynth.speak(currentUtterance);
    } else {
      // Fallback timer if speech synth unavailable
      setTimeout(() => {
        if (!isPlaying) return;
        currentSentenceIndex++;
        playNextSentence();
      }, 5000);
    }
  }

  function startPlayback() {
    isPlaying = true;
    if (playIcon) playIcon.style.display = 'none';
    if (pauseIcon) pauseIcon.style.display = 'block';
    if (statusBadge) {
      statusBadge.textContent = 'Sedang Berbicara';
      statusBadge.classList.add('speaking');
    }

    clearInterval(timerInterval);
    timerInterval = setInterval(() => {
      secondsElapsed++;
      const m = String(Math.floor(secondsElapsed / 60)).padStart(2, '0');
      const s = String(secondsElapsed % 60).padStart(2, '0');
      if (currentTimeEl) currentTimeEl.textContent = `${m}:${s}`;
    }, 1000);

    playNextSentence();
  }

  function pausePlayback() {
    isPlaying = false;
    if (speechSynth) speechSynth.pause();
    clearInterval(timerInterval);
    if (playIcon) playIcon.style.display = 'block';
    if (pauseIcon) pauseIcon.style.display = 'none';
    if (statusBadge) {
      statusBadge.textContent = 'Jeda';
      statusBadge.classList.remove('speaking');
    }
  }

  function stopPlayback() {
    isPlaying = false;
    if (speechSynth) {
      speechSynth.cancel();
    }
    clearInterval(timerInterval);
    if (playIcon) playIcon.style.display = 'block';
    if (pauseIcon) pauseIcon.style.display = 'none';
    if (statusBadge) {
      statusBadge.textContent = 'Selesai';
      statusBadge.classList.remove('speaking');
    }
    const allSpans = transcriptContent.querySelectorAll('.transcript-sentence');
    allSpans.forEach(s => s.classList.remove('active'));
  }

  function jumpToSentence(idx) {
    currentSentenceIndex = idx;
    if (!isPlaying) {
      startPlayback();
    } else {
      playNextSentence();
    }
  }

  btnPlay.addEventListener('click', () => {
    if (!isPlaying) {
      if (speechSynth && speechSynth.paused) {
        speechSynth.resume();
        isPlaying = true;
        if (playIcon) playIcon.style.display = 'none';
        if (pauseIcon) pauseIcon.style.display = 'block';
        if (statusBadge) {
          statusBadge.textContent = 'Sedang Berbicara';
          statusBadge.classList.add('speaking');
        }
      } else {
        startPlayback();
      }
    } else {
      pausePlayback();
    }
  });

  // Chapter card clicking
  chapterCards.forEach(card => {
    card.addEventListener('click', () => {
      const ch = parseInt(card.getAttribute('data-chapter'), 10);
      chapterCards.forEach(c => c.classList.remove('active'));
      card.classList.add('active');
      loadChapter(ch);
    });
  });

  // Initial load
  loadChapter(1);
}
