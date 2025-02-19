// Story Data with Animation and Image URLs
const lessons = [
  {
    story: "ভোগী বাঘ বনের সবচেয়ে অলস প্রাণী ছিল। অন্যান্য বাঘেরা যখন শিকার করতে যেত, তখন সে গাছের নিচে হেলান দিয়ে বসে থাকত আর ভাবত,
👉 “উফ! শিকার করা যে কী কষ্টের কাজ! কেউ যদি আমার জন্য খাবার এনে দিত!”

তাই সে একদিন এক চালাক শিয়ালের কাছে গেল এবং বলল—
🦊: “ভাই শিয়াল, তুমি যদি প্রতিদিন আমার জন্য খাবার এনে দাও, তাহলে আমি তোমাকে রাজ্যের প্রধান উপদেষ্টা বানিয়ে দেব!”

শিয়াল মনে মনে হাসল আর ভাবল, “এতো বড় সুযোগ!” 😆",
    prompt: "ভোগী বাঘ বনের সবচেয়ে অলস প্রাণী ছিল। অন্যান্য বাঘেরা যখন শিকার করতে যেত, তখন সে গাছের নিচে হেলান দিয়ে বসে থাকত আর ভাবত,“উফ! শিকার করা যে কী কষ্টের কাজ! কেউ যদি আমার জন্য খাবার এনে দিত! তাই সে একদিন এক চালাক শিয়ালের কাছে গেল এবং বলল— “ভাই শিয়াল, তুমি যদি প্রতিদিন আমার জন্য খাবার এনে দাও, তাহলে আমি তোমাকে রাজ্যের প্রধান উপদেষ্টা বানিয়ে দেব!",

    animation: "https://assets1.lottiefiles.com/packages/lf20_5tkzkblw.json",
    image: ""
  },
  {
    story: "শিয়াল প্রতিদিন খাবার এনে দিত, কিন্তু আসল মজাটা এখানে— সে সবজির সাথে একটু একটু করে মাংস মিশিয়ে দিত! 🤣
প্রথম দিন গরুর মাংসের সাথে আলু,
দ্বিতীয় দিন হাঁসের মাংসের সাথে লাউ,
তৃতীয় দিন মুরগির মাংসের সাথে শাক!

ভোগী বাঘ প্রথমে টের পেল না, কিন্তু এক সপ্তাহ পরে সে আয়নার সামনে দাঁড়িয়ে দেখল—",
    prompt: "শিয়াল প্রতিদিন খাবার এনে দিত, কিন্তু আসল মজাটা এখানে— সে সবজির সাথে একটু একটু করে মাংস মিশিয়ে দিত!
প্রথম দিন গরুর মাংসের সাথে আলু,
দ্বিতীয় দিন হাঁসের মাংসের সাথে লাউ,
তৃতীয় দিন মুরগির মাংসের সাথে শাক!

ভোগী বাঘ প্রথমে টের পেল না, কিন্তু এক সপ্তাহ পরে সে আয়নার সামনে দাঁড়িয়ে দেখল",
    animation: "https://lottie.host/a7caad47-43c7-45d0-bb5e-7c98590a1843/rFfeIXnXsA.json",
    image: ""
  },
  {
    story: "কিন্তু মানচিত্র পড়তে গেলেই দেখা দিল রহস্যময় সমস্যা!",
    prompt: "রহস্যময় সমস্যা দেখা দিল",
    animation: "https://assets2.lottiefiles.com/packages/lf20_touohax0.json",
    image: "https://example.com/image3.jpg"
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
