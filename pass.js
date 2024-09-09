const InputSlider = document.querySelector("[InputSlider]");
const LengthDisplay = document.querySelector("[data-LengthDisplay]");
const dataDisplay = document.querySelector("[data-display]");
const CopyBtn = document.querySelector("[copyBtn]");
const CopyMsg = document.querySelector("[copyMsg]");
const UpperCase = document.querySelector("#UpperCase");
const LowerCase = document.querySelector("#LowerCase");
const Symbolchecked = document.querySelector("#symbol");
const Numbers = document.querySelector("#Numbers");
const Indecator = document.querySelector("[data-indecator]");
const GenerateBtn = document.querySelector(".Generate-btn");
const CheckboxAll = document.querySelectorAll("input[type=checkbox]");

const symbols = '!~`@#$%^&*(-+=_}{]|[<.,/?>"';

let password = "";
let passLength = 10;
let checkcount = 0;
handleslider();

function handleslider() {
  InputSlider.value = passLength;
  LengthDisplay.innerText = passLength;
}

function setIndicator(color) {
  Indecator.style.backgroundColor = color;
}

// function to get random Numbers
function getRndInt(min, max) {
  return Math.floor(Math.random() * (max - min) + min);
}

function GenerateRndNo() {
  return getRndInt(0, 9);
}

function GenerateLowerCase() {
  return String.fromCharCode(getRndInt(97, 123));
}

function GenerateUpperCase() {
  return String.fromCharCode(getRndInt(65, 91));
}

function GenerateSymbol() {
  const randN = getRndInt(0, symbols.length);

  return symbols.charAt(randN);
}

// Calculate Password Length 

function calcStrength() {
  let hasUpper = false;
  let hasLower = false;
  let hasNum = false;
  let hasSym = false;

  if (UpperCase.checked) hasUpper = true;
  if (LowerCase.checked) hasLower = true;
  if (Numbers.checked) hasNum = true;
  if (Symbolchecked.checked) hasSym = true;

  if (hasLower && hasUpper && (hasNum || hasSym) && passLength >= 8) {
    setIndicator("#0f0");
  } else if ((hasLower || hasUpper) && (hasNum || hasSym) && passLength >= 6) {
    setIndicator("#ff0");
  } else {
    setIndicator("#f00");
  }
}

// shuffle the password 
function shufflepass(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }
  let str = "";
  array.forEach((element) => (str += element));
  return str;
}

function handleCheckBox() {
  checkcount = 0;
  CheckboxAll.forEach((checkbox) => {
    if (checkbox.checked) checkcount++;
  });
  if (passLength < checkcount) passLength = checkcount;
  handleslider();
}

CheckboxAll.forEach((checkbox) => {
  checkbox.addEventListener("change", handleCheckBox);
});

async function Copycontent() {
  try {
    await navigator.clipboard.writeText(dataDisplay.value);
    CopyMsg.innerText = "copied";
  } catch (e) {
    CopyMsg.innerText = "failed";
  }
  // TO make Copied text visible
  CopyMsg.classList.add("active");

  // TO make Copied text invisible after 2s

  setTimeout(() => CopyMsg.classList.remove("active"), 2000);
}
//setting the  varing value of slider
InputSlider.addEventListener("input", (e) => {
  passLength = e.target.value;
  handleslider();
});

CopyBtn.addEventListener("click", () => {
  if (dataDisplay.value) Copycontent();
});

GenerateBtn.addEventListener("click", () => {
  if (checkcount <= 0) return;

  //special case
  if (passLength < checkcount) {
    passLength = checkcount;
    handleslider()
  }

  //let enter the world of password Generator.

  //Remove old password
  password = "";

  // To Fullfill all checked stuffs

  // if(UpperCaseCheck.checked){
  //     password +=GenerateUpperCase;
  // }

  // if(UpperCaseCheck.checked){
  //     password +=GenerateUpperCase;
  // }

  // if(LowerCaseCheck.checked){
  //     password +=GenerateLowerCase;
  // }

  // if(symbolCheck.checked){
  //     password +=GenerateSymbol;
  // }

  // if(NumbersCheck.checked){
  //     password +=GenerateRndNo;
  // }

  //Create an Array of  function
  let funcArr = [];

  //  Looking for checked checkbox for password Generation.
  if (UpperCase.checked) {
    funcArr.push(GenerateUpperCase);
  }

  if (LowerCase.checked) {
    funcArr.push(GenerateLowerCase);
  }

  if (Symbolchecked.checked) {
    funcArr.push(GenerateSymbol);
  }

  if (Numbers.checked) {
    funcArr.push(GenerateRndNo);
  }
  //Compulsory generation

  for (let i = 0; i <funcArr.length; i++) {
    password += funcArr[i]();
  }

  //Remaining generation.
  for (let i = 0; i < passLength - funcArr.length; i++) {
    let rndIndex = getRndInt(0, funcArr.length);
    password += funcArr[rndIndex]();
  }

  //shuffle the password .
  password = shufflepass(Array.from(password));
  //show in UI

  dataDisplay.value = password;

  // calculate strength
  calcStrength();
});
