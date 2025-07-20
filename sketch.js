let panorama;
let sound;
let angle = 0;
let zOffset = -800;

let audioDropdown, textureDropdown;
let currentSound, currentTexture;
let currentMessage = "";
let messageStartTime = 0;
const messageDuration = 4000;

let emotion1Files = []; // Happy images
let emotion2Files = []; // Angry images
let happyAudioFiles = [];
let angerAudioFiles = [];

let currentAudioEmotion = 'Anger';
let currentImageEmotion = 'Happy';

let font;

function preload() {
  font = loadFont('font/Vanlose_BookType.otf'); // Ensure this font is in your project

  for (let i = 1; i <= 9; i++) {
    emotion1Files.push(`Happy_Image/happy_C${i}.jpg`);
    emotion2Files.push(`Anger_Image/anger_C${i}.jpg`);
    happyAudioFiles.push(`Happy_Audio/happy_C${i}.mp3`);
    angerAudioFiles.push(`Anger_Audio/anger_C${i}.mp3`);
  }

  currentTexture = random(emotion1Files);
  currentSound = random(angerAudioFiles);

  panorama = loadImage(currentTexture);
  soundFormats('mp3', 'ogg');
  sound = loadSound(currentSound);
}

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  textureMode(NORMAL);
  noStroke();

  setupDropdowns();
  userStartAudio().then(() => {
    if (!sound.isPlaying()) sound.loop();
  });

  checkAndTriggerMessage();
}

function draw() {
  background(0);

  push();
  translate(0, 0, zOffset);
  rotateY(angle);
  rotateX(angle * 0.5);
  angle += 0.01;
  scale(-1, 1, 1);
  texture(panorama);
  box(1000);
  pop();

  drawOverlayText();
}

function drawOverlayText() {
  const elapsed = millis() - messageStartTime;
  if (elapsed < messageDuration && currentMessage !== "") {
    const alpha = map(elapsed, 0, messageDuration, 255, 0);
    resetMatrix();
    textFont(font);
    textAlign(CENTER, CENTER);
    textSize(80);
    fill(255, alpha);
    text(currentMessage, 0, 0);
  }
}

function setupDropdowns() {
  // Texture Dropdown
  textureDropdown = createSelect();
  textureDropdown.option('Visual: Happy', 'Happy');
  textureDropdown.option('Visual: Anger', 'Anger');
  textureDropdown.selected('Happy');
  textureDropdown.changed(changeTexture);
  styleDropdown(textureDropdown, 170, 10);

  // Audio Dropdown
  audioDropdown = createSelect();
  audioDropdown.option('Audio: Anger', 'Anger');
  audioDropdown.option('Audio: Happy', 'Happy');
  audioDropdown.selected('Anger');
  audioDropdown.changed(changeSound);
  styleDropdown(audioDropdown, 10, 10);
}

function styleDropdown(dropdown, x, y) {
  dropdown.position(x, y);
  dropdown.style('font-size', '18px');
  dropdown.style('padding', '10px');
  dropdown.style('background-color', '#fff');
  dropdown.style('color', '#000');
  dropdown.style('border-radius', '8px');
  dropdown.style('border', '1px solid #ccc');
}

function changeSound() {
  const selected = audioDropdown.value();
  let newSound = selected === 'Happy'
    ? random(happyAudioFiles)
    : random(angerAudioFiles);

  if (sound.isPlaying()) sound.stop();
  currentSound = newSound;
  sound = loadSound(currentSound, () => sound.loop());

  currentAudioEmotion = selected;
  checkAndTriggerMessage();
}


function changeTexture() {
  const selected = textureDropdown.value();
  let newTexture = selected === 'Happy'
    ? random(emotion1Files)
    : random(emotion2Files);

  currentTexture = newTexture;
  panorama = loadImage(currentTexture);

  currentImageEmotion = selected;
  checkAndTriggerMessage();
}


function checkAndTriggerMessage() {
  if (currentImageEmotion === 'Happy' && currentAudioEmotion === 'Happy') {
    currentMessage = "Sincere Happiness";
  } else if (currentImageEmotion === 'Happy' && currentAudioEmotion === 'Anger') {
    currentMessage = "Sarcasm";
  } else if (currentImageEmotion === 'Anger' && currentAudioEmotion === 'Happy') {
    currentMessage = "Kind Irony";
  } else if (currentImageEmotion === 'Anger' && currentAudioEmotion === 'Anger') {
    currentMessage = "Sincere Anger";
  } else {
    currentMessage = "";
  }

  messageStartTime = millis();
}

function mouseWheel(event) {
  zOffset += event.delta;
  zOffset = constrain(zOffset, -3000, -200);
  return false;
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
