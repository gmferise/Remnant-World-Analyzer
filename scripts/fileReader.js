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

  if (worldMode === 'adventure') {
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
  getWorldData(textArray, 'campaign');

  document.getElementById('table-campaign').parentElement.classList.add('block');
  document.getElementById('table-adventure').parentElement.classList.add('block');
}