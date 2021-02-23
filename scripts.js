/// GLOBAL VARS & CONSTANTS

const regions = [
  'Earth',
  'Rhom',
  'Corsus',
  'Yaesha',
  'Reisum',
];

const events = [
  'Item',
  'Side Dungeon',
  'Siege',
  'Point of Interest',
  'Mini-Boss',
  'World Boss',
];

const sublocations = {
  RootCultist: 'MarrowPass',
  RootWraith: 'TheHiddenSanctum',
  RootBrute: 'SunkenPassage',
  Brabus: 'CutthroatChannel',
  RootTumbleweed: 'TheTangledPass',
  RootEnt: 'TheChokingHollow',
  RootDragon: 'TheAshYard',
  HuntersHideout: 'HiddenGrotto',
  MadMerchant: 'Junktown',
  LizAndLiz: 'TheWarren',
  LastWill: 'FindMonkeyKey',
  RootShrine: 'TheGallows',
  SwarmMaster: 'TheIronRift',
  HoundMaster: 'TheBurrows',
  Sentinel: 'ShackledCanyon',
  Vyr: 'TheArdentTemple',
  WastelandGuardian: 'LoomOfTheBlackSun',
  TheHarrow: 'TheBunker',
  TheLostGantry: 'ConcourseOfTheSun',
  ArmorVault: 'VaultOfTheHeralds',
  TheCleanRoom: 'ThePurgeHall',
  SlimeHulk: 'TheDrownedTrench',
  Fatty: 'TheFetidGlade',
  Tyrant: 'TheCapillary',
  SwampGuardian: 'The Grotto',
  KinCaller: 'TheHallOfJudgement',
  BlinkFiend: 'Widow\'sPass',
  StuckMerchant: 'MerchantDungeon',
  BlinkThief: 'ForgottenUndercroft',
  StormCaller: 'Heretic\'sNest',
  ImmolatorAndZephyr: 'WitheringVillage',
  Wolf: 'TheScaldingGlade',
  TotemFather: 'TheScaldingGlade',
  TheRisen: 'Ahanae\'sLament',
  DoeShrine: 'Widow\'sVestry',
  WolfShrine: 'Martyr\'sSanctuary',
  Splitter: 'ResearchStationAlpha',
  BarbTerror: 'NeedleLair',
  QueensTemple: 'IskalTemple',
  BrainBug: 'StrangePass',
  Wisp: 'CircletHatchery',
  FetidPool: 'FetidPools',
  FlickeringHorror: 'HallOfWhispers',
};

const mainLocations = {
  'City Overworld Zone1': 'Fairview',
  'City Overworld Zone2': 'Westcourt',
  'Wasteland Overworld Zone1': 'TheEasternWind',
  'Wasteland Overworld Zone2': 'TheScouringWaste',
  'Jungle Overworld Zone1': 'TheVerdantStrand',
  'Jungle Overworld Zone2': 'TheScaldingGlade',
  'Swamp Overworld Zone1': 'TheFetidGlade',
  'Swamp Overworld Zone2': 'TheMistFen',
};

const eventNameOverrides = {
  // Bosses
  FlickeringHorror: 'DreamEater',
  Wisp: 'HiveWisps',
  TheRisen: 'Reanimators',
  LizAndLiz: 'LizChicagoTypewriter',
  Fatty: 'TheUncleanOne',
  WastelandGuardian: 'Claviger',
  RootEnt: 'EntBoss',
  Wolf: 'TheRavager',
  RootDragon: 'Singe',
  SwarmMaster: 'Scourge',
  RootWraith: 'Shroud',
  RootTumbleweed: 'TheMangler',
  Kincaller: 'Warden',
  Tyrant: 'Thrall',
  Vyr: 'ShadeAndShatter',
  ImmolatorAndZephyr: 'ScaldAndSear',
  RootBrute: 'Gorefist',
  SlimeHulk: 'Canker',
  BlinkFiend: 'Onslaught',
  Sentinel: 'Raze',
  Penitent: 'Letos Amulet',
  LastWill: 'SupplyRunAssaultRifle',
  SwampGuardian: 'Ixillis',
  Splitter: 'RiphideLetosArmor',
  // Items
  GunslignersRing: 'GunslingersRing', // yes... they actually made this typo in the save files
};

let searchTimeout;

/// CONVERSION FUNCTIONS

function humanToId(string) {
  return string.toLowerCase().replace(/[\s\-']+/, '-');
}

/// FILTER FUNCTIONS

function updateTable() {
  document.querySelectorAll('tr:not(.header-row)').forEach((el) => {
    el.hide();
  });

  // Filter events & regions
  for (let r = 0; r < regions.length; r++) {
    for (let e = 0; e < events.length; e++) {
      if (document.getElementById(`fe-${humanToId(events[e])}`).checked && document.getElementById(`fr-${humanToId(regions[r])}`).checked) {
        document.querySelectorAll('tr:not(.header-row)').forEach((el) => {
          if (el.innerHTML.search(events[e]) !== -1 && el.innerHTML.search(regions[r]) !== -1) {
            el.show();
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
  if (!navigator.clipboard) {
    return;
  }
  try {
    await navigator.clipboard.writeText(event.target.textContent);
    event.target.classList.add('green');
  }
  catch (error) {
    console.error('Failed to copy to clipboard', error);
    event.target.classList.add('red');
  }
}

// Holy hell this function desperately needs refactoring
function getWorldData(textArray, worldMode) {
  const zones = {
    Earth: {},
    Rhom: {},
    Yaesha: {},
    Corsus: {},
    Reisum: {},
  };

  let currentMainLocation;

  if (worldMode == 'adventure') {
    currentMainLocation = textArray[1].split('/')[1].split('_')[1];
  }
  else {
    currentMainLocation = 'Fairview';
  }

  let currentSublocation = '';

  for (i = 0; i < textArray.length; i++) {
    var zone;
    var eventType;
    var eventName;
    var lastEventname;
    let inSmallDungeon = true;

    textLine = textArray[i];

    if (!textLine.split('/')[1]) {
      // hack shit because I'm getting weird extra lines
      // could perhaps safely remove this by starting at i=1
      continue;
    }

    // translate world/region names to readable text
    if (textLine.search('World_City') != -1) {
      zone = 'Earth';
    }
    if (textLine.search('World_Wasteland') != -1) {
      zone = 'Rhom';
    }
    if (textLine.search('World_Jungle') != -1) {
      zone = 'Yaesha';
    }
    if (textLine.search('World_Swamp') != -1) {
      zone = 'Corsus';
    }

    lastEventname = eventName;

    // look for side dungeons
    if (textLine.search('SmallD') != -1) {
      eventType = 'Side Dungeon';
      eventName = textLine.split('/')[3].split('_')[2];
      currentSublocation = sublocations[eventName];
      if (currentSublocation == undefined) {
        currentSublocation = 'Not added yet';
      }
      inSmallDungeon = true;
    }
    // look for overworld POI's
    if (textLine.search('OverworldPOI') != -1) {
      eventType = 'Point of Interest';
      eventName = textLine.split('/')[3].split('_')[2];
      currentSublocation = currentMainLocation;
      if (worldMode == 'adventure') {
        currentSublocation = '';
      }
      if (currentSublocation == undefined) {
        currentSublocation = 'Not added yet';
      }
      inSmallDungeon = true;
    }

    // Look for quest bosses
    if (textLine.search('Quest_Boss') != -1) {
      eventType = 'World Boss';
      eventName = textLine.split('/')[3].split('_')[2];
      currentSublocation = sublocations[eventName];
      if (currentSublocation == undefined) {
        currentSublocation = 'Not added yet';
      }
    }

    // look for sieges
    if (textLine.search('Siege') != -1) {
      eventType = 'Siege';
      eventName = textLine.split('/')[3].split('_')[2];
      currentSublocation = sublocations[eventName];
      if (currentSublocation == undefined) {
        currentSublocation = 'Not added yet';
      }
    }

    // look for minibosses
    if (textLine.search('Mini') != -1) {
      eventType = 'Mini-Boss';
      eventName = textLine.split('/')[3].split('_')[2];
      currentSublocation = sublocations[eventName];
      if (currentSublocation == undefined) {
        currentSublocation = 'Not added yet';
      }
    }

    // look for Item drops
    if (textLine.search('Quest_Event') != -1) {
      eventType = 'Item';
      eventName = textLine.split('/')[3].split('_')[2];

      // edge case for out of order items
      if (textLine.split('/')[1].split('_')[1] != textArray[i - 1].split('/')[1].split('_')[1]) {
        currentSublocation = '';
      }
    }

    if (textLine.search('Overworld_Zone') != -1) {
      currentMainLocation = `${textLine.split('/')[3].split('_')[1]} ${textLine.split('/')[3].split('_')[2]} ${textLine.split('/')[3].split('_')[3]}`;
      currentMainLocation = mainLocations[currentMainLocation];
    }

    // Renames the bosses
    if (eventName != lastEventname) {
      // Replacements
      if (eventName != undefined) {
        eventName = eventName.replace('FlickeringHorror', 'DreamEater')
          .replace('Wisp', 'HiveWisps')
          .replace('TheRisen', 'Reanimators')
          .replace('LizAndLiz', 'LizChicagoTypewriter')
          .replace('Fatty', 'TheUncleanOne')
          .replace('WastelandGuardian', 'Claviger')
          .replace('RootEnt', 'EntBoss')
          .replace('Wolf', 'TheRavager')
          .replace('RootDragon', 'Singe')
          .replace('SwarmMaster', 'Scourge')
          .replace('RootWraith', 'Shroud')
          .replace('RootTumbleweed', 'TheMangler')
          .replace('Kincaller', 'Warden')
          .replace('Tyrant', 'Thrall')
          .replace('Vyr', 'ShadeAndShatter')
          .replace('ImmolatorAndZephyr', 'ScaldAndSear')
          .replace('RootBrute', 'Gorefist')
          .replace('SlimeHulk', 'Canker')
          .replace('BlinkFiend', 'Onslaught')
          .replace('Sentinel', 'Raze')
          .replace('Penitent', 'Letos Amulet')
          .replace('LastWill', 'SupplyRunAssaultRifle')
          .replace('SwampGuardian', 'Ixillis')
          .replace('Splitter', 'RiphideLetosArmor');
      }
      // This populates the table for data to be pulled
      if (zone != undefined && eventType != undefined && eventName != undefined) {
        if (zones[zone][eventType] != undefined) {
          if (zones[zone][eventType].search(eventName) == -1) {
            zones[zone][eventType] += `, ${eventName}`;

            if (worldMode == 'adventure') {
              mainLocationText = '';
            }
            else {
              mainLocationText = `${currentMainLocation.split(/(?=[A-Z])/).join(' ')}: `;
            }
            html = `<tr><td>${zone}: ${mainLocationText}${currentSublocation.split(/(?=[A-Z])/).join(' ')}</td><td>${eventType}</td><td>${eventName.split(/(?=[A-Z])/).join(' ')}</td></tr>`;
          }
        }
        else {
          zones[zone][eventType] = eventName;

          if (worldMode == 'adventure') {
            mainLocationText = '';
          }
          else {
            mainLocationText = `${currentMainLocation.split(/(?=[A-Z])/).join(' ')}: `;
          }

          html = `<tr><td>${zone}: ${mainLocationText}${currentSublocation.split(/(?=[A-Z])/).join(' ')}</td><td>${eventType}</td><td>${eventName.split(/(?=[A-Z])/).join(' ')}</td></tr>`;
        }
        $(`#table-${worldMode}`).append(html);
      }
      $('#filters').show();
    }
  }
}

/// FILE INPUT FUNCTIONS

function clearFile(event) {
  document.getElementById('file-input').files = new DataTransfer().files;
  event.target.classList.add('hidden');
  updateTable();
}

function processFile(data) {
  document.querySelectorAll('tr:not(.header-row)').forEach((el) => {
    el.remove();
  });

  let text = data;
  text = text.split('/Game/Campaign_Main/Quest_Campaign_Ward13.Quest_Campaign_Ward13')[0];
  const mainCampaign = text.split('/Game/Campaign_Main/Quest_Campaign_City.Quest_Campaign_City')[1];
  if (mainCampaign) {
    text = mainCampaign.replace(/Game/g, '\n');
  }
  else { // subject 2923 campaign
    text = text.split('/Game/Campaign_Clementine/Quests/WardPrime/Quest_WardPrime_Template.Quest_WardPrime_Template')[0];
    text = text.split('/Game/World_Rural/Templates/Template_Rural_Overworld_02.Template_Rural_Overworld_02')[1].replace(/Game/g, '\n');
  }

  const textArray = text.split('\n');

  let adText = data;

  adText = adText.split('\n');
  const tempList = [];
  for (let i = 0; i < adText.length; i++) {
    if (String(adText[i]).includes('Adventure') === true) {
      tempList.push(adText[i]);
    }
  }
  // regardless of campaign type, the last line collected will have our current adventure data
  adText = tempList[tempList.length - 1];

  let adventureMode = false;
  let adTextArray = [];
  if (adText !== undefined) {
    adventureMode = true;
    adText = adText.replace(/Game/g, '\n');
    adTextArray = adText.split('\n');
  }

  if (adventureMode) {
    getWorldData(adTextArray, 'adventure');
  }
  getWorldData(textArray, 'catampaign');

  document.getElementById('table-campaign').parentElement.classList.add('block');
  document.getElementById('table-adventure').parentElement.classList.add('block');
}

function readFile(event) {
  document.getElementById('clear-file').classList.remove('hidden');
  const file = event.target.files[0];
  const reader = new FileReader();
  reader.onload = function (event) {
    processFile(event.target.result);
  };
  reader.readAsText(file); // async --> onload
  // onload triggers here
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

(() => {
  // PROCEDURAL ELEMENT GENERATION

  // Region checkboxes
  let html = '';
  regions.forEach((reg) => {
    html += `
    <label>
      <input type="checkbox"
        id="fr-${humanToId(reg)}"
        class="filter"
        checked
      />
      ${reg}
    </label>`;
  });

  document.getElementById('region-filters').innerHTML = html;

  // Event checkboxes
  html = '';
  for (let i = 0; i < events.length; i++) {
    html += `<label>
                    <input  type="checkbox"
                            id="fe-${humanToId(events[i])}"
                            class="filter"
                            checked
                    />
                    ${events[i]}
                </label>`;
  }
  document.getElementById('event-filters').innerHTML = html;

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