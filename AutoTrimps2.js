// ==UserScript==
// @name         AutoTrimps
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  try to take over the world!
// @author       zininzinin, spindrjr
// @include        *trimps.github.io*
// @grant        none
// ==/UserScript==


////////////////////////////////////////
//Variables/////////////////////////////
////////////////////////////////////////
var runInterval = 10; //How often to loop through logic
var enableDebug = true; //Spam console?
var running = false;

////////////////////////////////////////
//List Variables////////////////////////
////////////////////////////////////////
var equipmentList = {
    'Dagger': {
        Upgrade: 'Dagadder',
        Stat: 'attack',
        Resource: 'metal',
        Equip: true
    },
    'Mace': {
        Upgrade: 'Megamace',
        Stat: 'attack',
        Resource: 'metal',
        Equip: true
    },
    'Polearm': {
        Upgrade: 'Polierarm',
        Stat: 'attack',
        Resource: 'metal',
        Equip: true
    },
    'Battleaxe': {
        Upgrade: 'Axeidic',
        Stat: 'attack',
        Resource: 'metal',
        Equip: true
    },
    'Greatsword': {
        Upgrade: 'Greatersword',
        Stat: 'attack',
        Resource: 'metal',
        Equip: true
    },
    'Boots': {
        Upgrade: 'Bootboost',
        Stat: 'health',
        Resource: 'metal',
        Equip: true
    },
    'Helmet': {
        Upgrade: 'Hellishmet',
        Stat: 'health',
        Resource: 'metal',
        Equip: true
    },
    'Pants': {
        Upgrade: 'Pantastic',
        Stat: 'health',
        Resource: 'metal',
        Equip: true
    },
    'Shoulderguards': {
        Upgrade: 'Smoldershoulder',
        Stat: 'health',
        Resource: 'metal',
        Equip: true
    },
    'Breastplate': {
        Upgrade: 'Bestplate',
        Stat: 'health',
        Resource: 'metal',
        Equip: true
    },
    'Arbalest': {
        Upgrade: 'Harmbalest',
        Stat: 'attack',
        Resource: 'metal',
        Equip: true
    },
    'Gambeson': {
        Upgrade: 'GambesOP',
        Stat: 'health',
        Resource: 'metal',
        Equip: true
    },
    'Shield': {
        Upgrade: 'Supershield',
        Stat: 'health',
        Resource: 'wood',
        Equip: true
    },
    'Gym': {
        Upgrade: 'Gymystic',
        Stat: 'block',
        Resource: 'wood',
        Equip: false
    }
};

var upgradeList = ['Coordination', 'Speedminer', 'Speedlumber', 'Speedfarming', 'Speedscience', 'Megaminer', 'Megalumber', 'Megafarming', 'Megascience', 'Efficiency', 'Potency', 'TrainTacular', 'Miners', 'Scientists', 'Trainers', 'Explorers', 'Blockmaster', 'Battle', 'Bloodlust', 'Bounty', 'Egg', 'Anger', 'Formations', 'Dominance', 'Barrier', 'UberHut', 'UberHouse', 'UberMansion', 'UberHotel', 'UberResort', 'Trapstorm'];
var buildingList = ['Hut', 'House', 'Gym', 'Mansion', 'Hotel', 'Resort', 'Gateway', 'Collector', 'Warpstation', 'Tribute', 'Nursery']; //NOTE THAT I REMOVED WORMHOLE TEMPORARILY UNTILL I FIGURE OUT WHAT TO DO WITH IT
var pageSettings = [];
var bestBuilding;
var scienceNeeded;

var preBuyAmt = game.global.buyAmt;
var preBuyFiring = game.global.firing;
var preBuyTooltip = game.global.lockTooltip;


////////////////////////////////////////
//Page Changes//////////////////////////
////////////////////////////////////////
document.getElementById("buyHere").innerHTML += '<div id="autoContainer" style="display: block; font-size: 12px;"> <div id="autoTitleDiv" class="titleDiv"> <div class="row"> <div class="col-xs-4"><span id="autoTitleSpan" class="titleSpan">Automation</span> </div> </div> </div> <br> <div class="autoBox" id="autoHere"> </div> <table style="text-align: left; vertical-align: top; width: 90%;" border="0" cellpadding="0" cellspacing="0"> <tbody> <tr> <td style="vertical-align: top;"> Loops <br> <input id="chkBuyStorage" title="Will buy storage when resource is almost full" type="checkbox">Buy Storage <br> <input id="chkManualStorage" title="Will automatically gather resources and trap trimps" type="checkbox">Manual Gather <br> <input id="chkBuyJobs" title="Buys jobs based on ratios configured" type="checkbox">Buy Jobs <br> <input id="chkBuyBuilding" title="Will buy non storage buildings as soon as they are available" type="checkbox">Buy Buildings <br> <input id="chkBuyUpgrades" title="autobuy non eqipment Upgrades" type="checkbox">Buy Upgrades <br>  <input id="chkAutoStance" title="automate setting stance" type="checkbox">Auto Stance</td> <td style="vertical-align: top;"> Equipment <br> <input id="chkBuyEquipH" title="Will buy the most efficient armor available" type="checkbox">Buy Armor <br> <input id="chkBuyPrestigeH" title="Will buy the most efficient armor upgrade available" type="checkbox">Buy Armor Upgrades <br> <input id="chkBuyEquipA" title="Will buy the most efficient weapon available" type="checkbox">Buy Weapons <br> <input id="chkBuyPrestigeA" title="Will buy the most efficient weapon upgrade available" type="checkbox">Buy Weapon Upgrades <br><br> Misc Settings <br> <input id="chkTrapTrimps" title="automate trapping trimps" type="checkbox">Trap Trimps<br><input id="geneticistTargetBreedTime" title="Breed time in seconds to shoot for using geneticists" style="width: 20%;color: #000000;font-size: 12px;" value="5">&nbsp;Geneticist Timer<br></td> </tr> <tr> <td style="vertical-align: middle; text-align: left;"> <br>Max Buildings to build <br> <input id="maxHut" style="width: 20%;color: #000000;font-size: 12px;" value="100">&nbsp; Hut <br> <input id="maxHouse" style="width: 20%;color: #000000;font-size: 12px;" value="100">&nbsp; House <br> <input id="maxMansion" style="width: 20%;color: #000000;font-size: 12px;" value="100">&nbsp; Mansion <br> <input id="maxHotel" style="width: 20%;color: #000000;font-size: 12px;" value="100">&nbsp; Hotel <br> <input id="maxResort" style="width: 20%;color: #000000;font-size: 12px;" value="100">&nbsp; Resort <br> <input id="maxGateway" style="width: 20%;color: #000000;font-size: 12px;" value="100">&nbsp; Gateway <br> <input id="maxCollector" style="width: 20%;color: #000000;font-size: 12px;" value="100">&nbsp; Collector <br> <input id="maxWarpstation" style="width: 20%;color: #000000;font-size: 12px;" value="-1">&nbsp; Warpstation <br> <input id="maxGym" style="width: 20%;color: #000000;font-size: 12px;" value="-1">&nbsp; Gym <br> <input id="maxTribute" style="width: 20%;color: #000000;font-size: 12px;" value="-1">&nbsp; Tribute <br> <input id="maxNursery" style="width: 20%;color: #000000;font-size: 12px;" value="-1">&nbsp; Nursery <br> <br> </td> <td style="text-align: left; vertical-align: top;"> <br>Maps <br> <input id="chkAutoUniqueMap" title="Auto run unique maps" type="checkbox"> Auto run unique maps <br> <input id="chkAutoProgressMap" title="Runs maps when cannot defeat current level" type="checkbox">Auto map when stuck <br> <input id="maxHitsTillStuck" style="width: 10%; color: #000000;" value="10">&nbsp;Max hits to kill enemy before stuck<br><br>Ratio<br><input id="FarmerRatio" style="width: 10%; color: #000000;" value="10">&nbsp;Farmer<br><input id="LumberjackRatio" style="width: 10%; color: #000000;" value="10">&nbsp;Lumberjack<br><input id="MinerRatio" style="width: 10%; color: #000000;" value="10">&nbsp;Miner<br><input id="chkScientist" type="checkbox">&nbsp;Scientist<br><input id="chkTrainer" type="checkbox">&nbsp;Trainer<br><input id="chkExplorer" type="checkbox">&nbsp;Explorer<br><input id="chkGym" type="checkbox">&nbsp;Gym<br><input id="chkTribute" type="checkbox">&nbsp;Tribute<br><input id="chkNursery" type="checkbox">&nbsp;Nursery</td> </tr> </tbody> </table></div>';


////////////////////////////////////////
//Utility Functions/////////////////////
////////////////////////////////////////

//Loads the automation settings from browser cache
function loadPageVariables() {
    var temp = document.getElementById("autoContainer").innerHTML.split('input id="');
    temp.splice(0, 1);
    for (var i in temp) {
        pageSettings.push(temp[i].substring(0, temp[i].indexOf('"')));
    }

    //Set all the saved variables
    for (var index in pageSettings) {
        var setting = pageSettings[index];
        if (localStorage.getItem(setting) != null) {
            // debug(setting + ' is of type ' + document.getElementById(setting).type);
            var local = localStorage.getItem(setting);
            if (document.getElementById(setting).type == 'checkbox') {
                local = (local == 'true');
                if (document.getElementById(setting).checked != local) {
                    // debug('FIRST Setting ' + setting + ' to ' + local + ' from ' + document.getElementById(setting).checked);
                    document.getElementById(setting).checked = local;
                    // debug(setting + ' is set to ' + document.getElementById(setting).checked);
                }
            } else {
                if (document.getElementById(setting).value != localStorage.getItem(setting)) {
                    // debug('FIRST Setting ' + setting + ' to ' + localStorage.getItem(setting));
                    document.getElementById(setting).value = localStorage.getItem(setting);
                    // debug(setting + ' is set to ' + document.getElementById(setting).value);
                }
            }
        }
    }
}

//Saves automation settings to browser cache
function saveSettings() {
    // debug('Saved');
    for (var index in pageSettings) {
        var setting = pageSettings[index];
        // debug('Setting is ' +setting);
        if (document.getElementById(setting).type == 'checkbox') {
            localStorage.setItem(setting, document.getElementById(setting).checked);
        } else {
            localStorage.setItem(setting, document.getElementById(setting).value);
        }
    }
}

//Grabs the automation settings from the page
function getPageSetting(setting) {
    // debug('Looking for setting ' + setting);
    if (document.getElementById(setting).type == 'checkbox') {
        return document.getElementById(setting).checked;
    } else {
        return document.getElementById(setting).value;
    }
}

//Global debug message (need to implement debugging to in game window)
function debug(message) {
    if (enableDebug)
        console.log(timeStamp() + ' ' + message);
}

//Finds an element on the page and does the onClick() function
function clickButton(id) {
    debug('Trying to click button: ' + id);
    if (document.getElementById(id).style.visibility != 'hidden') {
        document.getElementById(id).click();
        setTimeout(function() {}, 10);
        return true;
    } else {
        debug('Cannot click button: ' + id);
        return false;
    }
}

//Simply returns a formatted text timestamp
function timeStamp() {
    var now = new Date();

    // Create an array with the current hour, minute and second
    var time = [now.getHours(), now.getMinutes(), now.getSeconds()];

    // If seconds and minutes are less than 10, add a zero
    for (var i = 1; i < 3; i++) {
        if (time[i] < 10) {
            time[i] = "0" + time[i];
        }
    }
    return time.join(":");
}

//Called before buying things that can be purchased in bulk
function preBuy() {
    preBuyAmt = game.global.buyAmt;
    preBuyFiring = game.global.firing;
    preBuyTooltip = game.global.lockTooltip;
}

//Called after buying things that can be purchased in bulk
function postBuy() {
    game.global.buyAmt = preBuyAmt;
    game.global.firing = preBuyFiring;
    game.global.lockTooltip = preBuyTooltip;
    tooltip('hide');
}

function safeBuyBuilding(building) {
    for (var b in game.global.buildingsQueue) {
        if (game.global.buildingsQueue[b].includes(building)) return false;
    }
    if (!canAffordBuilding(building)) return false;
    debug('Building ' + building);
    preBuy();
    game.global.buyAmt = 1;
    game.global.firing = false;
    buyBuilding(building);
    postBuy();
    return true;
}

//Outlines the most efficient housing based on gems (credits to Belaith)
function highlightHousing() {
    game.global.buyAmt = 1;
    var allHousing = ["Mansion", "Hotel", "Resort", "Collector", "Warpstation"];
    var unlockedHousing = [];
    for (house in allHousing) {
        if (game.buildings[allHousing[house]].locked == 0) {
            unlockedHousing.push(allHousing[house]);
        }
    }
    if (unlockedHousing.length) {
        var obj = {};
        for (var house in unlockedHousing) {
            var building = game.buildings[unlockedHousing[house]];
            var cost = 0;
            cost += getBuildingItemPrice(building, "gems");
            var ratio = cost / building.increase.by;
            obj[unlockedHousing[house]] = ratio;
            if (document.getElementById(unlockedHousing[house]).style.border = "1px solid #00CC00") {
                document.getElementById(unlockedHousing[house]).style.border = "1px solid #FFFFFF";
                // document.getElementById(unlockedHousing[house]).removeEventListener("click", update);
            }
        }
        var keysSorted = Object.keys(obj).sort(function(a, b) {
            return obj[a] - obj[b]
        });
        bestBuilding = keysSorted[0];
        document.getElementById(bestBuilding).style.border = "1px solid #00CC00";
        // document.getElementById(bestBuilding).addEventListener('click', update, false);
    } else {
        bestBuilding = null;
    }
}

function buyFoodEfficientHousing() {
    var houseWorth = game.buildings.House.locked ? 0 : game.buildings.House.increase.by / getBuildingItemPrice(game.buildings.House, "food");
    var hutWorth = game.buildings.Hut.increase.by / getBuildingItemPrice(game.buildings.Hut, "food");

    if (houseWorth > hutWorth && canAffordBuilding('House')) {
        safeBuyBuilding('House');
    } else {
        safeBuyBuilding('Hut');
    }
}

function safeBuyJob(jobTitle, amount) {
    if (amount == undefined) amount = 1;
    if (amount === 0) return false;
    preBuy();
    if (amount < 0) {
        game.global.firing = true;
        amount = Math.abs(amount);
    } else {
        game.global.firing = false;
    }
    game.global.buyAmt = amount;
    if (!canAffordJob(jobTitle, false)) {
        postBuy();
        return false;
    }
    // debug((game.global.firing ? 'Firing ' : 'Hiring ') + game.global.buyAmt + ' ' + jobTitle);
    buyJob(jobTitle);
    postBuy();
    return true;
}

function getScienceCostToUpgrade(upgrade) {
    var upgradeObj = game.upgrades[upgrade];
    if (upgradeObj.cost.resources.science != undefined) {
        return Math.floor(upgradeObj.cost.resources.science[0] * Math.pow(upgradeObj.cost.resources.science[1], (upgradeObj.done)));
    } else {
        return 0;
    }
}

function evaluateEfficiency(equipName) {
    var equip = equipmentList[equipName];
    var gameResource = equip.Equip ? game.equipment[equipName] : game.buildings[equipName];
    if (equipName == 'Shield') {
        if (gameResource.blockNow) {
            equip.Stat = 'block';
        } else {
            equip.Stat = 'health';
        }
    }
    var Eff = Effect(gameResource, equip);
    var Cos = Cost(gameResource, equip);
    var Res = Eff / Cos;
    var Status = 'white';
    var Wall = false;

    //white - Upgrade is not available
    //yellow - Upgrade is not affordable
    //orange - Upgrade is affordable, but will lower stats
    //red - Yes, do it now!
    if (!game.upgrades[equip.Upgrade].locked) {
        //Evaluating upgrade!
        var CanAfford = canAffordTwoLevel(game.upgrades[equip.Upgrade]);
        if (equip.Equip) {
            var NextEff = PrestigeValue(equip.Upgrade);
            var NextCost = getNextPrestigeCost(equip.Upgrade) * Math.pow(1 - game.portal.Artisanistry.modifier, game.portal.Artisanistry.level);
            Wall = NextEff / NextCost > Res;
        }

        if (!CanAfford) {
            Status = 'yellow';
        } else {
            if (!equip.Equip) {
                //Gymystic is always cool, fuck shield - lol
                Status = 'red';
            } else {
                var CurrEff = gameResource.level * Eff;

                var NeedLevel = Math.ceil(CurrEff / NextEff);
                var Ratio = gameResource.cost[equip.Resource][1];

                var NeedResource = NextCost * (Math.pow(Ratio, NeedLevel) - 1) / (Ratio - 1);

                if (game.resources[equip.Resource].owned > NeedResource) {
                    Status = 'red';
                } else {
                    Status = 'orange';
                }
            }
        }
    }

    return {
        Stat: equip.Stat,
        Factor: Res,
        Status: Status,
        Wall: Wall
    };
}

function Effect(gameResource, equip) {
    if (equip.Equip) {
        return gameResource[equip.Stat + 'Calculated'];
    } else {
        //That be Gym
        var oldBlock = gameResource.increase.by * gameResource.owned;
        var Mod = game.upgrades.Gymystic.done ? (game.upgrades.Gymystic.modifier + (0.01 * (game.upgrades.Gymystic.done - 1))) : 1;
        var newBlock = gameResource.increase.by * (gameResource.owned + 1) * Mod;
        return newBlock - oldBlock;
    }
}

function Cost(gameResource, equip) {
    var price = parseFloat(getBuildingItemPrice(gameResource, equip.Resource, equip.Equip));
    if (equip.Equip) price = Math.ceil(price * (Math.pow(1 - game.portal.Artisanistry.modifier, game.portal.Artisanistry.level)));
    return price;
}

function PrestigeValue(what) {
    var name = game.upgrades[what].prestiges;
    var equipment = game.equipment[name];
    var stat;
    if (equipment.blockNow) stat = "block";
    else stat = (typeof equipment.health !== 'undefined') ? "health" : "attack";
    var toReturn = Math.round(equipment[stat] * Math.pow(1.19, ((equipment.prestige) * game.global.prestige[stat]) + 1));
    return toReturn;
}

function setScienceNeeded() {
    scienceNeeded = 0;
    for (var upgrade in upgradeList) {
        upgrade = upgradeList[upgrade];
        if (game.upgrades[upgrade].allowed > game.upgrades[upgrade].done) { //If the upgrade is available
            scienceNeeded += getScienceCostToUpgrade(upgrade);
        }
    }
}

function breedTime(genes) {
    var trimps = game.resources.trimps;

    if (trimps.owned - trimps.employed < 2 || game.global.challengeActive == "Trapper") {
        return 0;
    }

    var potencyMod = trimps.potency;
    potencyMod = potencyMod * (1 + game.portal.Pheromones.level * game.portal.Pheromones.modifier);

    if (game.unlocks.quickTrimps) {
        potencyMod *= 2;
    }
    if (game.global.brokenPlanet) {
        potencyMod /= 10;
    }
    if (game.jobs.Geneticist.owned > 0) {
        potencyMod *= Math.pow(.98, game.jobs.Geneticist.owned);
    }

    var multiplier = 1;
    if (genes >= 0) {
        multiplier *= Math.pow(.98, genes);
    } else {
        multiplier *= Math.pow((1 / 0.98), -genes);
    }

    var soldiers = game.portal.Coordinated.level ? game.portal.Coordinated.currentSend : trimps.maxSoldiers;
    var numerus = (trimps.realMax() - trimps.employed) / (trimps.realMax() - (soldiers + trimps.employed));
    var base = potencyMod * multiplier + 1;

    return Math.log(numerus) / Math.log(base);
}


////////////////////////////////////////
//Main Functions////////////////////////
////////////////////////////////////////

function initializeAutoTrimps() {
    debug('initializeAutoTrimps');
    loadPageVariables();
}

function easyMode(){
	if (game.jobs.Farmer.owned > 1000000) {
		document.getElementById("FarmerRatio").value = 3;
		document.getElementById("LumberjackRatio").value = 1;
		document.getElementById("MinerRatio").value = 4;
	} else if (game.jobs.Farmer.owned > 100000) {
		document.getElementById("FarmerRatio").value = 3;
		document.getElementById("LumberjackRatio").value = 3;
		document.getElementById("MinerRatio").value = 5;
	} else {
		document.getElementById("FarmerRatio").value = 1;
		document.getElementById("LumberjackRatio").value = 1;
		document.getElementById("MinerRatio").value = 1;
	}
}

//Buys all available non-equip upgrades listed in var upgradeList
function buyUpgrades() {
    for (var upgrade in upgradeList) {
        upgrade = upgradeList[upgrade];
        var gameUpgrade = game.upgrades[upgrade];
        if ((game.jobs.Scientist.locked && upgrade != 'Battle') ? (canAffordTwoLevel(upgrade) && upgrade == 'Scientists') : (gameUpgrade.allowed > gameUpgrade.done && canAffordTwoLevel(upgrade))) {
            buyUpgrade(upgrade);
        }
    }
}

//Buys more storage if resource is over 90% full
function buyStorage() {
    var packMod = 1 + game.portal.Packrat.level * game.portal.Packrat.modifier;
    var Bs = {
        'Barn': 'food',
        'Shed': 'wood',
        'Forge': 'metal'
    };
    for (var B in Bs) {
        if (game.resources[Bs[B]].owned > game.resources[Bs[B]].max * packMod * 0.9) {
            // debug('Buying ' + B + '(' + Bs[B] + ') at ' + Math.floor(game.resources[Bs[B]].owned / (game.resources[Bs[B]].max * packMod * 0.99) * 100) + '%');
            if (canAffordBuilding(B)) {
                safeBuyBuilding(B);
            }
        }
    }
}

//Buy all non-storage buildings
function buyBuildings() {
    highlightHousing();

    //if housing is highlighted
    if (bestBuilding != null) {
        //insert gigastation logic here ###############
        if (!safeBuyBuilding(bestBuilding)) {
            buyFoodEfficientHousing();
        }
    } else {
        buyFoodEfficientHousing();
    }

    //Buy non-housing buildings
    if (getPageSetting('chkGym') && !game.buildings.Gym.locked) {
        safeBuyBuilding('Gym');
    }
    if (getPageSetting('chkTribute') && !game.buildings.Tribute.locked) {
        safeBuyBuilding('Tribute');
    }
    if (getPageSetting('chkNursery') && !game.buildings.Nursery.locked) {
        safeBuyBuilding('Nursery');
    }
}

function setTitle() {
    document.title = '(' + game.global.world + ')' + ' Trimps ' + document.getElementById('versionNumber').innerHTML;
}

function buyJobs() {
    //Implement Ratio thingy
    var freeWorkers = Math.ceil(game.resources.trimps.realMax() / 2) - game.resources.trimps.employed;
    var totalDistributableWorkers = freeWorkers + game.jobs.Farmer.owned + game.jobs.Miner.owned + game.jobs.Lumberjack.owned;

    var farmerRatio = parseInt(getPageSetting('FarmerRatio'));
    var lumberjackRatio = parseInt(getPageSetting('LumberjackRatio'));
    var minerRatio = parseInt(getPageSetting('MinerRatio'));
    var totalRatio = farmerRatio + lumberjackRatio + minerRatio;

    // debug('Total farmers to add = ' + Math.floor((farmerRatio / totalRatio * totalDistributableWorkers) - game.jobs.Farmer.owned));



    //Simple buy if you can
    if (getPageSetting('chkTrainer')) {
        game.global.buyAmt = 1;
        while (canAffordJob('Trainer', false)) {
            freeWorkers = Math.ceil(game.resources.trimps.realMax() / 2) - game.resources.trimps.employed;
            if (!freeWorkers) safeBuyJob('Farmer', -1);
            safeBuyJob('Trainer');
        }
    }
    if (getPageSetting('chkExplorer')) {
        game.global.buyAmt = 1;
        while (canAffordJob('Explorer', false)) {
            freeWorkers = Math.ceil(game.resources.trimps.realMax() / 2) - game.resources.trimps.employed;
            if (!freeWorkers) safeBuyJob('Farmer', -1);
            safeBuyJob('Explorer');
        }
    }

    if (getPageSetting('chkScientist') && !game.jobs.Scientist.locked) {
        // debug('Total needed science ' +scienceNeeded);
        if (game.resources.science.owned < scienceNeeded) {
            safeBuyJob('Farmer', game.jobs.Farmer.owned * -1);
            safeBuyJob('Lumberjack', game.jobs.Lumberjack.owned * -1);
            safeBuyJob('Miner', game.jobs.Miner.owned * -1);
            safeBuyJob('Scientist', Math.ceil(game.resources.trimps.realMax() / 2) - game.resources.trimps.employed);
        } else {
            safeBuyJob('Scientist', game.jobs.Scientist.owned * -1);
        }
    }

    //Distribute Farmer/Lumberjack/Miner
    safeBuyJob('Farmer', Math.ceil((farmerRatio / totalRatio * totalDistributableWorkers) - game.jobs.Farmer.owned));
    safeBuyJob('Lumberjack', Math.ceil((lumberjackRatio / totalRatio * totalDistributableWorkers) - game.jobs.Lumberjack.owned));
    safeBuyJob('Miner', Math.ceil((minerRatio / totalRatio * totalDistributableWorkers) - game.jobs.Miner.owned));
}

function autoLevelEquipment() {
    var Best = {
        'healthwood': {
            Factor: 0,
            Name: '',
            Wall: false,
            Status: 'white'
        },
        'healthmetal': {
            Factor: 0,
            Name: '',
            Wall: false,
            Status: 'white'
        },
        'attackmetal': {
            Factor: 0,
            Name: '',
            Wall: false,
            Status: 'white'
        },
        'blockwood': {
            Factor: 0,
            Name: '',
            Wall: false,
            Status: 'white'
        }
    };
    for (var equipName in equipmentList) {
        var equip = equipmentList[equipName];
        // debug('Equip: ' + equip + ' EquipIndex ' + equipName);
        var gameResource = equip.Equip ? game.equipment[equipName] : game.buildings[equipName];
        // debug('Game Resource: ' + gameResource);
        if (!gameResource.locked) {
            document.getElementById(equipName).style.color = 'white';
            var evaluation = evaluateEfficiency(equipName);
            // debug(equipName + ' evaluation ' + evaluation.Status);
            var BKey = equip.Stat + equip.Resource;
            // debug(equipName + ' bkey ' + BKey);

            if (Best[BKey].Factor == 0 || Best[BKey].Factor < evaluation.Factor) {
                Best[BKey].Factor = evaluation.Factor;
                Best[BKey].Name = equipName;
                Best[BKey].Wall = evaluation.Wall;
                Best[BKey].Status = evaluation.Status;
            }

            document.getElementById(equipName).style.borderColor = evaluation.Status;
            if (evaluation.Status != 'white' && evaluation.Status != 'yellow') {
                document.getElementById(equip.Upgrade).style.color = evaluation.Status;
            }
            if (evaluation.Status == 'yellow') {
                document.getElementById(equip.Upgrade).style.color = 'white';
            }
            if (evaluation.Wall) {
                document.getElementById(equipName).style.color = 'yellow';
            }

            if (
                evaluation.Status == 'red' &&
                (
                    (
                        getPageSetting('chkBuyPrestigeA') &&
                        equipmentList[equipName].Stat == 'attack'
                    ) ||
                    (
                        getPageSetting('chkBuyPrestigeH') &&
                        (
                            equipmentList[equipName].Stat == 'health' ||
                            equipmentList[equipName].Stat == 'block'
                        )
                    )
                )
            ) {
                var upgrade = equipmentList[equipName].Upgrade;
                debug('Upgrading ' + upgrade);
                buyUpgrade(upgrade);
                // tooltip('hide');
            }
        }
    }

    for (var stat in Best) {
        if (Best[stat].Name != '') {
            var DaThing = equipmentList[Best[stat].Name];
            document.getElementById(Best[stat].Name).style.color = Best[stat].Wall ? 'orange' : 'red';
            if ((getPageSetting('chkBuyEquipA') && DaThing.Stat == 'attack') || (getPageSetting('chkBuyEquipH') && (DaThing.Stat == 'health' || DaThing.Stat == 'block'))) {
                if (DaThing.Equip && !Best[stat].Wall && canAffordBuilding(Best[stat].Name, null, null, true)) {
                    debug('Leveling equipment ' + Best[stat].Name);
                    buyEquipment(Best[stat].Name);
                    tooltip('hide');
                }
            }
        }
    }
}

function manualLabor() {
    var ManualGather = 'metal';
    //If you can autofight - set autofight to true
    if (game.upgrades.Bloodlust.done == 1 && game.global.pauseFight) {
        pauseFight();
    }
    //if we have more than 2 buildings in queue, or our modifier is real fast, build
    if (game.global.buildingsQueue.length ? (game.global.buildingsQueue[0].startsWith("Trap") ? (game.global.buildingsQueue.length > 1) : true) : false) {
        // debug('Gathering buildings??');
        setGather('buildings');
    }
    //if we can gather more science in 1 min by ourselves than we currently have, get some science
    else if (game.resources.science.owned < scienceNeeded) {
        // debug('Science needed ' + scienceNeeded);
        setGather('science');
    } else {
        var manualResourceList = {
            'food': 'Farmer',
            'wood': 'Lumberjack',
            'metal': 'Miner',
        };
        var lowestResource = 'food';
        var lowestResourceRate = -1;
        var haveWorkers = true;
        for (var resource in manualResourceList) {
            var job = manualResourceList[resource];
            var currentRate = game.jobs[job].owned * game.jobs[job].modifier;
            // debug('Current rate for ' + resource + ' is ' + currentRate + ' is hidden? ' + (document.getElementById(resource).style.visibility == 'hidden'));
            if (document.getElementById(resource).style.visibility != 'hidden') {
                // debug('INNERLOOP for resource ' +resource);
                if (currentRate == 0) {
                    currentRate = game.resources[resource].owned;
                    // debug('Current rate for ' + resource + ' is ' + currentRate + ' lowest ' + lowestResource + lowestResourceRate);
                    if ((haveWorkers) || (currentRate < lowestResourceRate)) {
                        // debug('New Lowest1 ' + resource + ' is ' + currentRate + ' lowest ' + lowestResource + lowestResourceRate+ ' haveworkers ' +haveWorkers);
                        haveWorkers = false;
                        lowestResource = resource;
                        lowestResourceRate = currentRate;
                    }
                }
                if ((currentRate < lowestResourceRate || lowestResourceRate == -1) && haveWorkers) {
                    // debug('New Lowest2 ' + resource + ' is ' + currentRate + ' lowest ' + lowestResource + lowestResourceRate);
                    lowestResource = resource;
                    lowestResourceRate = currentRate;
                }
            }
            // debug('Current Stats ' + resource + ' is ' + currentRate + ' lowest ' + lowestResource + lowestResourceRate+ ' haveworkers ' +haveWorkers);
        }

        if (game.global.playerGathering != lowestResource && !haveWorkers) {
        	// debug('Set gather lowestResource');
            setGather(lowestResource);
        } else if (game.global.playerGathering != ManualGather) {
        	// debug('Set gather ManualGather');
            setGather(ManualGather);
        }
    }
}




////////////////////////////////////////
//Logic Loop////////////////////////////
////////////////////////////////////////

initializeAutoTrimps();

//This is totally cheating Only use for debugging
// game.settings.speed = 1;
// game.settings.speedTemp = 1;
// setTimeout(function() {
//     game.settings.speed = 2;
// }, 1000);

setTimeout(mainLoop, runInterval);

function mainLoop() {
    setTitle();
    setScienceNeeded();

    easyMode(); //This needs a UI input

    if (getPageSetting('chkBuyUpgrades')) buyUpgrades();
    if (getPageSetting('chkBuyStorage')) buyStorage();
    if (getPageSetting('chkBuyBuilding')) buyBuildings();
    if (getPageSetting('chkBuyJobs')) buyJobs();
    if (getPageSetting('chkManualStorage')) manualLabor();
    autoLevelEquipment();

    //Manually fight instead of using builtin auto-fight
    if (game.global.autoBattle) {
        if (!game.global.pauseFight) {
            pauseFight(); //Disable autofight
        }
    }
    if (!game.global.fighting && game.global.gridArray.length != 0 && (game.resources.trimps.realMax() <= game.resources.trimps.owned + 1) || game.global.soldierHealth > 0 || breedTime(0) < 2) {
        fightManual();
    }

    saveSettings();
    setTimeout(mainLoop, runInterval);
}