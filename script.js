function updateResultMessage(elemId, message, isSuccess = false) {
  const resultMessage = document.getElementById(elemId);
  resultMessage.textContent = message;
  resultMessage.classList.remove("error-msg", "success-msg");
  resultMessage.classList.add(isSuccess ? "success-msg" : "error-msg");
}

function handleCalcBtnClick(evt) {
  evt.preventDefault();

  const initialUnitValue = document.getElementById("InitialUnit").valueAsNumber;
  const initialPriceValue =
    document.getElementById("InitialPrice").valueAsNumber;
  const finalUnitValue = document.getElementById("FinalUnit").valueAsNumber;
  const finalAmountValue = document.getElementById("FinalAmount").valueAsNumber;

  if (initialUnitValue && initialPriceValue) {
    updateResultMessage("resultMessageAmount", "", false);

    if (finalUnitValue) {
      const calcValue = parseFloat(
        ((initialPriceValue * finalUnitValue) / initialUnitValue).toFixed(2)
      );
      document.getElementById("FinalAmount").value = calcValue;
      updateResultMessage(
        "resultMessageAmount",
        `${finalUnitValue} ml/gm will cost ₹${calcValue}`,
        true
      );
    } else if (finalAmountValue) {
      const calcValue = parseFloat(
        ((initialUnitValue * finalAmountValue) / initialPriceValue).toFixed(2)
      );
      document.getElementById("FinalUnit").value = calcValue;
      updateResultMessage(
        "resultMessageAmount",
        `₹${finalAmountValue} will get you ${calcValue} ml/gm`,
        true
      );
    } else {
      updateResultMessage(
        "resultMessageAmount",
        "Please enter either output amount or output price!",
        false
      );
    }
  } else {
    updateResultMessage(
      "resultMessageAmount",
      "Please enter amount, price and either output amount or output price!",
      false
    );
  }
}

function clearOutputField(fieldId) {
  updateResultMessage("resultMessageAmount", "", false);
  document.getElementById(fieldId).value = null;
}

function resetFormFields(formId) {
  const formElem = document.getElementById(formId);
  if (formElem) {
    formElem.reset();
  }
}

function resetAmountForm() {
  updateResultMessage("resultMessageAmount", "", false);
  resetFormFields("calc-form");
}

function openTab(evt, tabName) {
  const tabcontent = document.getElementsByClassName("tabcontent");
  const tablinks = document.getElementsByClassName("tablinks");
  for (let i = 0; i < tabcontent.length; i++) {
    tabcontent[i].style.display = "none";
  }

  for (let i = 0; i < tablinks.length; i++) {
    tablinks[i].className = tablinks[i].className.replace(" active", "");
  }
  document.getElementById(tabName).style.display = "block";
  evt.currentTarget.className += " active";
}

function calculateAge(startDt, endDt) {
  // Convert the dates to Date objects
  const birth = new Date(startDt);
  const current = new Date(endDt);

  // Calculate the age difference in years, months, and days
  let years = current.getFullYear() - birth.getFullYear();
  let months = current.getMonth() - birth.getMonth();
  let days = current.getDate() - birth.getDate();

  // If the current month is earlier than the birth month, subtract 1 year and adjust months
  if (months < 0) {
    years--;
    months += 12;
  }

  // If the current day is earlier than the birth day in the current month, adjust months and days
  if (days < 0) {
    months--;
    // Get the number of days in the previous month
    const prevMonth = new Date(
      current.getFullYear(),
      current.getMonth() - 1,
      0
    );
    days += prevMonth.getDate(); // Get the last date of the previous month (i.e., number of days in that month)
  }

  return { years, months, days };
}

function handleAgeCalcBtnClick(evt) {
  evt.preventDefault();

  const startDateValue = document.getElementById("StartDate").value;
  const endDateValue = document.getElementById("EndDate").value;

  if (startDateValue > endDateValue) {
    updateResultMessage(
      "resultMessageAge",
      `Start date cannot be later than the end date. Please select a valid date range.`,
      false
    );
    return;
  }

  const { years, months, days } = calculateAge(startDateValue, endDateValue);

  updateResultMessage(
    "resultMessageAge",
    `Age is ${years} years, ${months} months, ${days} days`,
    true
  );
}

function resetAgeForm() {
  resetFormFields("age-calc-form");
  updateResultMessage("resultMessageAge", "", false);
}

document.addEventListener("DOMContentLoaded", () => {
  document.querySelector(".tablinks").click();
});

let coin = document.getElementById("coin");
let flipBtn = document.getElementById("flipBtn");
let currentRotation = 0;
let isFlipping = false;
let frontText = document.getElementById("frontText");
let backText = document.getElementById("backText");

// Lively confetti
function createConfetti() {
  const container = document.body;
  const colors =["#ff0000","#00ff00","#0000ff","#ffff00","#ff00ff","#00ffff","#ff7f00","#7fff00","#ff1493","#1e90ff","#ffd700","#adff2f","#ff69b4","#00fa9a","#ffa500","#8a2be2","#ff4500","#7cfc00","#00ced1","#ff1493"];

  for (let i = 0; i < 200; i++) {
    const confetti = document.createElement("div");
    confetti.classList.add("confetti");

    // Random small size
    const w = 3 + Math.random() * 5;
    const h = 6 + Math.random() * 12;
    confetti.style.width = w + "px";
    confetti.style.height = h + "px";

    confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];

    // Start at random X at top of page
    const startX = Math.random() * window.innerWidth;
    const startY = -10; // slightly above viewport
    confetti.style.position = "absolute";
    confetti.style.left = startX + "px";
    confetti.style.top = startY + "px";
    confetti.style.opacity = 0.9;
    confetti.style.borderRadius = "2px";
    
    // Random fall speed and sway
    const velocityY = 2 + Math.random() * 4;       // vertical speed
    const sway = Math.random() * 4 - 2;            // left/right sway per frame
    let posX = startX;
    let posY = startY;
    let rotation = Math.random() * 360;
    const rotationSpeed = Math.random() * 10;

    const fall = () => {
      posY += velocityY;
      posX += sway;
      rotation += rotationSpeed;
      confetti.style.transform = `translate(${posX - startX}px, ${posY}px) rotate(${rotation}deg)`;

      if (posY < window.innerHeight + 20) {
        requestAnimationFrame(fall);
      } else {
        confetti.remove();
      }
    };

    container.appendChild(confetti);
    requestAnimationFrame(fall);
  }
}

function flipCoin() {
  if (isFlipping) return;
  isFlipping = true;
  flipBtn.disabled = true;

  let name1 = document.getElementById("name1").value.trim() || "HEADS";
  let name2 = document.getElementById("name2").value.trim() || "TAILS";

  frontText.innerText = name1.toUpperCase();
  backText.innerText = name2.toUpperCase();

  let random = Math.random() < 0.5 ? 0 : 1;
  let targetAngle = random === 0 ? 0 : 180;

  let fullSpins = 3 + Math.floor(Math.random() * 3);
  currentRotation = Math.floor(currentRotation / 360) * 360;
  currentRotation += fullSpins * 360 + targetAngle;

  coin.style.transform = "rotateY(" + currentRotation + "deg)";

  setTimeout(() => {
    document.getElementById("result").innerText =
      "Winner: " + (random === 0 ? name1 : name2).toUpperCase();
    isFlipping = false;
    flipBtn.disabled = false;
    createConfetti(); // trigger lively confetti
  }, 5000);
}
