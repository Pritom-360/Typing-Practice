// Story Data with Animation and Image URLs
const lessons = [
  {
    "story": "বাঘের নাম ছিল ভোগী বাঘ। সে ছিল অসম্ভব খাদ্যপ্রেমী এবং ভয়ংকর অলস!",
    "prompt": "ভোগী বাঘের অলসতা",
    "animation": "https://assets2.lottiefiles.com/packages/lf20_1m8la2bt.json",
    "image": "https://example.com/image1.jpg"
  },
  {
    "story": "ভোগী বাঘ শিয়ালকে বলল, 'তুমি যদি প্রতিদিন আমার জন্য খাবার এনে দাও, তাহলে তোমাকে রাজ্যের প্রধান উপদেষ্টা বানাবো!'",
    "prompt": "শিয়ালের চালাকি শুরু",
    "animation": "https://assets2.lottiefiles.com/packages/lf20_qax8ox0c.json",
    "image": "https://example.com/image2.jpg"
  },
  {
    "story": "শিয়াল ধীরে ধীরে সবজির সাথে মাংস মিশিয়ে দিতে শুরু করল, আর ভোগী বাঘ টেরই পেল না!",
    "prompt": "বাঘের খাবারে চালাকি",
    "animation": "https://assets2.lottiefiles.com/packages/lf20_s5d3lgnr.json",
    "image": "https://example.com/image3.jpg"
  },
  {
    "story": "এক সপ্তাহ পর বাঘ আয়নার সামনে দাঁড়িয়ে দেখল— তার শরীরের সব মাংস কোথায় গেল!",
    "prompt": "বাঘের দুঃখজনক আবিষ্কার",
    "animation": "https://assets2.lottiefiles.com/packages/lf20_vy8tx5n5.json",
    "image": "https://example.com/image4.jpg"
  },
  {
    "story": "শিয়ালের বুদ্ধিতে ভোগী বাঘ হয়ে গেল বনভেজিটারিয়ান!",
    "prompt": "শিয়ালের বিজয়",
    "animation": "https://assets2.lottiefiles.com/packages/lf20_kjwgs0bl.json",
    "image": "https://example.com/image5.jpg"
  },
  {
    "story": "🔥 অলস হলে শিয়ালের ঠকবাজি খেতে হয়! 🔥",
    "prompt": "গল্পের শিক্ষা",
    "animation": "https://assets2.lottiefiles.com/packages/lf20_h9zixw7j.json",
    "image": "https://example.com/image6.jpg"
  }
];

let currentLesson = 0;
let mistakes = [];
let startTime = Date.now();

// Initialize Lesson
function initLesson() {
  const lesson = lessons[currentLesson];
  document.getElementById('storyText').innerHTML = lesson.story;
  document.getElementById('lottie').load(lesson.animation);
  document.getElementById('storyImage').src = lesson.image;
  document.getElementById('typingInput').value = '';
  renderPrompt(lesson.prompt);
  startTime = Date.now();
  document.getElementById('bgMusic').play();
}

// Render Prompt with Character Spans
function renderPrompt(text) {
  const promptDiv = document.getElementById('typingPrompt');
  promptDiv.innerHTML = text.split('').map(char => 
    `<span class="character" data-char="${char}">${char}</span>`
  ).join('');
}

// Real-time Input Check
document.getElementById('typingInput').addEventListener('input', (e) => {
  const userText = e.target.value.split('');
  const promptChars = [...document.querySelectorAll('#typingPrompt .character')];
  let newMistakes = [];

  promptChars.forEach((span, index) => {
    const expectedChar = span.dataset.char;
    const userChar = userText[index];

    span.classList.remove('character-correct', 'character-incorrect');
    if (userChar === undefined) {
      span.classList.remove('character-extra');
    } else if (userChar === expectedChar) {
      span.classList.add('character-correct');
    } else {
      span.classList.add('character-incorrect');
      newMistakes.push({ expected: expectedChar, actual: userChar, position: index });
    }
  });

  // Check Extra Characters
  const extraChars = userText.slice(promptChars.length);
  if (extraChars.length > 0) {
    newMistakes.push({ expected: 'END', actual: extraChars.join(''), position: promptChars.length });
  }

  mistakes = newMistakes;
  updateFeedback();
  checkCompletion();
});

// Update Feedback
function updateFeedback() {
  const mistakeSummary = document.getElementById('mistakeSummary');
  mistakeSummary.innerHTML = mistakes.map(m => 
    `📍 অবস্থান ${m.position + 1}: আশা করা হয়েছিল <span class="text-red-500">"${m.expected}"</span>, আপনি লিখেছেন <span class="text-blue-500">"${m.actual}"</span>`
  ).join('<br>');

  // Play Sounds
  if (mistakes.length > 0) {
    document.getElementById('wrongSound').play();
  } else {
    document.getElementById('correctSound').play();
  }
}

// Check Lesson Completion
function checkCompletion() {
  const isComplete = mistakes.length === 0 &&
    document.getElementById('typingInput').value.length === lessons[currentLesson].prompt.length;

  document.getElementById('nextBtn').disabled = !isComplete;
  updateProgress();
}

// Update Progress
function updateProgress() {
  const progress = ((currentLesson + 1) / lessons.length) * 100;
  document.getElementById('progressBar').style.width = `${progress}%`;
  document.getElementById('progressText').textContent = `${Math.round(progress)}%`;

  // Calculate Speed & Accuracy
  const timeElapsed = (Date.now() - startTime) / 60000; // minutes
  const words = document.getElementById('typingInput').value.split(' ').length;
  document.getElementById('speed').textContent = `গতি: ${Math.round(words / timeElapsed)} শব্দ/মিনিট`;
  document.getElementById('accuracy').textContent = `নির্ভুলতা: ${100 - Math.round((mistakes.length / lessons[currentLesson].prompt.length) * 100)}%`;
}

// Next Lesson
document.getElementById('nextBtn').addEventListener('click', () => {
  currentLesson = (currentLesson + 1) % lessons.length;
  initLesson();
});

// Start First Lesson
initLesson();
