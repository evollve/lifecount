document.getElementById('calculateButton').addEventListener('click', calculate);

// Helper functions for fadeIn and fadeOut effects
function fadeIn(element) {
    element.style.opacity = 0;
    element.style.display = 'block';
    var last = +new Date();
    var tick = function() {
        element.style.opacity = +element.style.opacity + (new Date() - last) / 400;
        last = +new Date();

        if (+element.style.opacity < 1) {
            (window.requestAnimationFrame && requestAnimationFrame(tick)) || setTimeout(tick, 16);
        }
    };
    tick();
}

function fadeOut(element) {
    element.style.opacity = 1;
    var last = +new Date();
    var tick = function() {
        element.style.opacity = +element.style.opacity - (new Date() - last) / 400;
        last = +new Date();

        if (+element.style.opacity > 0) {
            (window.requestAnimationFrame && requestAnimationFrame(tick)) || setTimeout(tick, 16);
        } else {
            element.style.display = 'none';
        }
    };
    tick();
}

function calculate() {
    let birthdateValue = document.getElementById('birthdateInput').value;
    let birthDate = new Date(birthdateValue);
    let currentDate = new Date();
    let validationMessageElement = document.getElementById('validationMessage');

    // Clear previous validation messages
    validationMessageElement.textContent = '';

    // Validate the input date
    if (!birthdateValue || birthDate >= currentDate) {
        validationMessageElement.textContent = 'Please enter a valid birthdate in the past.';
        fadeIn(validationMessageElement);
        return;
    } else {
        fadeOut(validationMessageElement);
    }

    updateTimer(birthDate);
    updateLifeProgress(birthDate);
    displayAge(birthDate);
    displayMilestones(birthDate);

    // Show the results sections
    fadeIn(document.querySelector('.results'));
}

function updateTimer(birthDate) {
    const now = new Date();
    const countupTime = now - birthDate;
    const daysSince = Math.floor(countupTime / (1000 * 60 * 60 * 24));
    document.getElementById('countup').textContent = numberWithCommas(daysSince) + ' days';

    const expectedLifespan = 77; // This can be adjusted or calculated dynamically
    const endDate = new Date(birthDate.getFullYear() + expectedLifespan, birthDate.getMonth(), birthDate.getDate());
    const countdownTime = endDate - now;
    const daysToGo = Math.floor(countdownTime / (1000 * 60 * 60 * 24));
    document.getElementById('countdown').textContent = numberWithCommas(daysToGo) + ' days';
}

function updateLifeProgress(birthDate) {
    const now = new Date();
    const expectedLifespan = 77; // This can be adjusted or calculated dynamically
    const endDate = new Date(birthDate.getFullYear() + expectedLifespan, birthDate.getMonth(), birthDate.getDate());
    const totalLifeSpan = endDate - birthDate;
    const livedLifeSpan = now - birthDate;
    const lifeProgress = (livedLifeSpan / totalLifeSpan) * 100;

    const progressBar = document.getElementById('lifeProgressBar');
    progressBar.style.width = lifeProgress + '%';
    document.getElementById('lifeProgressPercentage').textContent = lifeProgress.toFixed(2) + '% of your life completed';
}

function displayAge(birthDate) {
    const now = new Date();
    let age = now.getFullYear() - birthDate.getFullYear();
    const m = now.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && now.getDate() < birthDate.getDate())) {
        age--;
    }
    document.getElementById('age').textContent = age + ' years old';
}

function displayMilestones(birthDate) {
    const now = new Date();
    const milestones = {
        '16th Birthday (Driving Age)': new Date(birthDate.getFullYear() + 16, birthDate.getMonth(), birthDate.getDate(), 12),
        '18th Birthday (Voting Age)': new Date(birthDate.getFullYear() + 18, birthDate.getMonth(), birthDate.getDate(), 12),
        '21st Birthday (Drinking Age)': new Date(birthDate.getFullYear() + 21, birthDate.getMonth(), birthDate.getDate(), 12),
        'Retirement Age (67 years)': new Date(birthDate.getFullYear() + 67, birthDate.getMonth(), birthDate.getDate(), 12)
    };
    

    let milestoneListHtml = '';
    for (let milestone in milestones) {
        const date = milestones[milestone];
        const isPast = now > date;
        milestoneListHtml += `<div class="milestone">${milestone}: ${date.toDateString()} ${isPast ? '(Passed)' : ''}</div>`;
    }

    document.getElementById('milestoneList').innerHTML = milestoneListHtml;
}

function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

// Initialize the validation message element
document.getElementById('validationMessage').style.display = 'none';


// Add this to your JavaScript file
// Assuming you have a list of milestone dates
const milestones = {
    "Born": "1990-01-01",
    "Graduated": "2008-05-20",
    "Married": "2015-06-15",
    // Add more milestones here
  };
  
  // Calculate the user's age and use it to position the milestones
  function placeMilestones() {
    const now = new Date();
    const birthDate = new Date(milestones["Born"]);
    const age = now.getFullYear() - birthDate.getFullYear();
    const timelineWidth = document.getElementById('userTimeline').offsetWidth;
  
    Object.keys(milestones).forEach(key => {
      const milestoneDate = new Date(milestones[key]);
      const milestoneAge = milestoneDate.getFullYear() - birthDate.getFullYear();
      const position = (milestoneAge / age) * timelineWidth;
  
      const milestoneElement = document.createElement('div');
      milestoneElement.className = 'milestone';
      milestoneElement.style.left = position + 'px';
      milestoneElement.title = key + ' - ' + milestoneDate.toDateString();
      document.getElementById('milestoneContainer').appendChild(milestoneElement);
    });
  }
  
  // Call this function when you want to display the timeline
  placeMilestones();
  
  flatpickr("#birthdateInput", {
    altInput: true,
    altFormat: "F j, Y",
    dateFormat: "Y-m-d",
    maxDate: "today"
});

function sanitizeInput(input) {
    const div = document.createElement('div');
    div.textContent = input;
    return div.innerHTML;
}

// Example: Sanitizing the birthdate input before using it
let birthdateValue = sanitizeInput(document.getElementById('birthdateInput').value);
