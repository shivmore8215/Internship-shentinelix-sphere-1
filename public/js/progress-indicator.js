/**
 * Progress Indicator - Shows user's progress through the demonstration
 * Enhancement #13
 */

const DEMO_STEPS = [
  { id: 1, label: 'Read Instructions', element: null },
  { id: 2, label: 'Copy Command', element: 'commandsList' },
  { id: 3, label: 'See Hijack', element: 'hijackResult' },
  { id: 4, label: 'Learn Prevention', element: 'educationalSection' }
];

let currentStep = 1;

/**
 * Initialize progress indicator
 */
function initProgressIndicator() {
  const container = document.querySelector('.header');
  if (!container) return;

  // Create progress indicator HTML
  const progressHTML = `
        <div class="progress-indicator" id="progressIndicator">
            ${DEMO_STEPS.map((step, index) => `
                <div class="progress-step" data-step="${step.id}">
                    <div class="progress-dot ${step.id === 1 ? 'active' : ''}" id="dot-${step.id}"></div>
                    <span class="progress-label ${step.id === 1 ? 'active' : ''}" id="label-${step.id}">${step.label}</span>
                </div>
                ${index < DEMO_STEPS.length - 1 ? '<div class="progress-connector" id="connector-' + step.id + '"></div>' : ''}
            `).join('')}
        </div>
    `;

  container.insertAdjacentHTML('beforeend', progressHTML);

  // Set up observers for automatic progress tracking
  setupProgressTracking();

  console.log('✅ Progress indicator initialized');
}

/**
 * Set up automatic progress tracking
 */
function setupProgressTracking() {
  // Track when user scrolls to instructions
  setTimeout(() => {
    updateProgress(1);
  }, 1000);

  // Track copy events
  document.addEventListener('copy', () => {
    if (currentStep < 2) {
      updateProgress(2);
    }
  });

  // Track when hijack result is shown
  const hijackObserver = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.target.id === 'hijackResult' && !mutation.target.classList.contains('hidden')) {
        if (currentStep < 3) {
          updateProgress(3);
        }
      }
    });
  });

  const hijackResult = document.getElementById('hijackResult');
  if (hijackResult) {
    hijackObserver.observe(hijackResult, { attributes: true, attributeFilter: ['class'] });
  }

  // Track when educational section is shown
  const eduObserver = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.target.id === 'educationalSection' && mutation.target.style.display !== 'none') {
        if (currentStep < 4) {
          updateProgress(4);
        }
      }
    });
  });

  const eduSection = document.getElementById('educationalSection');
  if (eduSection) {
    eduObserver.observe(eduSection, { attributes: true, attributeFilter: ['style'] });
  }
}

/**
 * Update progress to a specific step
 */
function updateProgress(step) {
  if (step <= currentStep) return; // Don't go backwards

  currentStep = step;

  // Update all steps up to current
  for (let i = 1; i <= step; i++) {
    const dot = document.getElementById(`dot-${i}`);
    const label = document.getElementById(`label-${i}`);
    const connector = document.getElementById(`connector-${i}`);

    if (dot) {
      dot.classList.remove('active');
      if (i < step) {
        dot.classList.add('completed');
      } else if (i === step) {
        dot.classList.add('active');
      }
    }

    if (label) {
      label.classList.remove('active');
      if (i < step) {
        label.classList.add('completed');
      } else if (i === step) {
        label.classList.add('active');
      }
    }

    if (connector && i < step) {
      connector.classList.add('completed');
    }
  }

  // Don't auto-scroll - let user stay where they are to read the hijacked content
}

// Initialize on page load
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initProgressIndicator);
} else {
  initProgressIndicator();
}

// Export for external use
window.updateProgress = updateProgress;
