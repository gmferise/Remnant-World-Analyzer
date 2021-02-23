import {
  regions,
  events,
  sublocations,
} from './scripts/constants.js';

/// UI GLOBALS
let searchTimeout;

/// CONVERSION FUNCTIONS

function humanToId(string) {
  return string.toLowerCase().replace(/[\s\-']+/, '-');
}

/// FILTER FUNCTIONS

function updateTable() {
  document.querySelectorAll('tr:not(.header-row)').forEach((el) => {
    el.classList.add('hidden');
  });

  // Filter events & regions
  for (let r = 0; r < regions.length; r++) {
    for (let e = 0; e < events.length; e++) {
      if (document.getElementById(`fe-${humanToId(events[e])}`).checked && document.getElementById(`fr-${humanToId(regions[r])}`).checked) {
        document.querySelectorAll('tr:not(.header-row)').forEach((el) => {
          if (el.innerHTML.search(events[e]) !== -1 && el.innerHTML.search(regions[r]) !== -1) {
            el.classList.remove('hidden');
          }
        });
      }
    }
  }

  // Filter name
  const name = document.getElementById('f-name').value;
  if (name.length > 0) {
    document.querySelectorAll('tr:not(.header-row)').forEach((el) => {
      if (el.closest('td:eq(2)').innerText.toLowerCase().search(name.toLowerCase()) === -1) {
        el.hide();
      }
    });
  }
}

function changeMode(event) {
  document.querySelectorAll('.mode-select').forEach((el) => {
    el.classList.remove('locked');
  });
  event.target.classList.add('locked');
}

function changeAll(event) {
  const labels = event.target.parentElement.parentElement.parentElement.children[1].children;
  const action = event.target.textContent === 'check_circle';
  for (let i = 0; i < labels.length; i++) {
    labels[i].children[0].checked = action;
  }
  updateTable();
}

function clearSearch(event) {
  document.getElementById('f-name').value = '';
  updateTable();
}

function timedRefresh(event) {
  if (!searchTimeout) {
    clearTimeout(searchTimeout);
  }
  searchTimeout = setTimeout(() => {
    updateTable();
  }, 1000);
}

/// CLIPBOARD COPIER

// Copies textContent of a <code> element to clipboard (bound)
async function copyCode(event) {
  // navigator.clipboard doesn't work in IE only... oh well!
  if (!navigator.clipboard) return;
  try {
    await navigator.clipboard.writeText(event.target.innerText);
    event.target.classList.add('green');
  }
  catch (error) {
    console.error('Failed to copy to clipboard', error);
    event.target.classList.add('red');
  }
}

/// FILE INPUT FUNCTIONS

function clearFile(event) {
  document.getElementById('file-input').files = new DataTransfer().files;
  event.target.classList.add('hidden');
  updateTable();
}

function readFile(event) {
  document.getElementById('clear-file').classList.remove('hidden');
  const file = event.target.files[0];
  const reader = new FileReader();
  reader.onload = (e) => {
    processFile(e.target.result);
  };
  reader.readAsText(file); // async, fires onload event
  // onload function effectively triggers here
}

function startFileDrop(event) {
  document.getElementById('drop-area').classList.add('block');
}

function finishFileDrop(event) {
  document.getElementById('drop-area').classList.remove('block');
}

function hoverFileDrop(event) {
  event.dataTransfer.dropEffect = 'copy';
  event.preventDefault();
}

function handleFileDrop(event) {
  event.preventDefault();
  finishFileDrop(event);
  if (event.dataTransfer.files.length === 1 && event.dataTransfer.files[0].name.match(/\.(sav|bak)$/)) {
    document.getElementById('file-input').files = event.dataTransfer.files;
    event.target.files = event.dataTransfer.files;
    readFile(event);
  }
}

/// PAGE LOAD EXECUTION

// A closure
(() => {
  // PROCEDURAL ELEMENT GENERATION

  // Create region checkbox HTML from regions array
  document.getElementById('region-filters').innerHTML = regions.reduce((output, region) => (
    `${output}
    <label>
      <input type="checkbox" id="fr-${humanToId(region)}" class="filter" checked />
      ${region}
    </label>`
  ), '');

  // Create event checkbox HTML from events array
  document.getElementById('event-filters').innerHTML = events.reduce((output, event) => (
    `${output}
    <label>
      <input type="checkbox" id="fe-${humanToId(event)}" class="filter" checked />
      ${event}
    </label>`
  ), '');

  // EVENT BINDINGS

  // legacy
  // $('#apply').on('click', updateTable);

  // Copy text events
  document.querySelectorAll('code').forEach((el) => {
    el.addEventListener('click', copyCode);
    el.addEventListener('mouseleave', (event) => {
      event.target.classList.remove(...['green', 'red']);
    });
  });

  // Campaign/Adventure buttons
  document.querySelectorAll('.mode-select').forEach((el) => {
    el.addEventListener('click', changeMode);
  });

  // File drop events
  window.addEventListener('dragenter', startFileDrop);
  const dropArea = document.getElementById('drop-area');
  dropArea.addEventListener('dragenter', hoverFileDrop);
  dropArea.addEventListener('dragover', hoverFileDrop);
  dropArea.addEventListener('dragleave', finishFileDrop);
  dropArea.addEventListener('drop', handleFileDrop);

  // Direct file input
  document.getElementById('file-input').addEventListener('change', readFile);

  // Clear file button
  document.getElementById('clear-file').addEventListener('click', clearFile);

  // Auto-refresh filter binds
  document.querySelectorAll('.filter').forEach((el) => {
    el.addEventListener('click', updateTable);
  });

  // Toggle-all-checkboxes buttons - includes a refresh
  document.querySelectorAll('.filter-all').forEach((el) => {
    el.addEventListener('click', changeAll);
  });

  document.getElementById('f-name').addEventListener('beforeinput', timedRefresh);

  // Clear text filter
  document.getElementById('clear-filter').addEventListener('click', clearSearch);
})();