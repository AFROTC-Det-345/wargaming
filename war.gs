/* @OnlyCurrentDoc */
var scriptPrp = PropertiesService.getScriptProperties()
// scriptPrp.setProperty('time', 0)
// scriptPrp.setProperty('timeRunning', false)

function ResetWar() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var wS = ss.getSheetByName("War Stats");
  var wR = ss.getSheetByName("War Results");
  wS.getRange("E2").setValue("Canada");
  wS.getRange("C5:C10").setValue(0);
  wS.getRange("E15").setValue("Canada");
  wS.getRange("C18:C23").setValue(0);
  wR.getRange("C4").setValue(0);
  wR.getRange("C5").setValue(0);
  SpreadsheetApp.getActive().toast("War Reset")
};

function RollDiceDefenders() {
  var ss         = SpreadsheetApp.getActiveSpreadsheet();
  var wS         = ss.getSheetByName("War Stats");
  var wR         = ss.getSheetByName("War Results");
  var numRolls   = wS.getRange("C26").getValue();
  var totalScore = 0;
  for (var i = 0; i < numRolls; i++){
    totalScore += Math.floor(Math.random() * 6) + 1;
  }
  wR.getRange("C4").setValue(totalScore);
}

function RollDiceAttackers() {
  var ss         = SpreadsheetApp.getActiveSpreadsheet();
  var wS         = ss.getSheetByName("War Stats");
  var wR         = ss.getSheetByName("War Results");
  var numRolls   = wS.getRange("C13").getValue();
  var totalScore = 0;
  for (var i = 0; i < numRolls; i++){
    totalScore += Math.floor(Math.random() * 6) + 1;
  }
  wR.getRange("C5").setValue(totalScore);
}

function ResetCountryStats() {
  if (alertMessageYesNoButton() === SpreadsheetApp.getUi().Button.YES) {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var eD = ss.getSheetByName("Extra Data V2");
    var cS = ss.getSheetByName("In-Game Stats")

    var data = eD.getRange("B11:M16").getValues()
    var countries = eD.getRange("A11:A16").getValues()
    var stats = eD.getRange("B10:M10").getValues()

    var coun = cS.getRange("A2:A7").getValues()
    var stat = cS.getRange("B1:K1").getValues()

    for (var i = 0; i < countries.length; i++) {
      for (var j = 0; j < stats[0].length; j++) {

        //Country Index
        for (var a = 0; a < coun.length; a++){
          if (coun[a][0] == countries[i][0]){
            break
          }
        }
        //Stats Index
        found = false
        for (var b = 0; b < stat[0].length; b++){
          var neww = stat[0][b]
          var old = stats[0][j]
          if (neww == old){
            found = true
            break
          }
        }
        if (found) {
          cS.getRange(a+2, b+2).setValue(data[i][j])
        }
      }
    }
  } else {
    SpreadsheetApp.getActive().toast("No changes were made.")
  }
}

function alertMessageYesNoButton() {
  var result = SpreadsheetApp.getUi().alert("You are about to reset the stats for all countries. Are you sure? (Don't do during a game)", SpreadsheetApp.getUi().ButtonSet.YES_NO);
  return result
}

function runTimer() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var cS = ss.getSheetByName("In-Game Stats")

  scriptPrp.setProperty('timeRunning', 1)
  while (scriptPrp.getProperty('timeRunning') == 1) {
    time = scriptPrp.getProperty('time')
    time++
    scriptPrp.setProperty('time', time)
    cS.getRange(19,1).setValue(scriptPrp.getProperty('time'))
    SpreadsheetApp.flush()
    Logger.log(scriptPrp.getProperty('time'))
    Logger.log(scriptPrp.getProperty('timeRunning'))
    if (scriptPrp.getProperty('time') >= cS.getRange(23, 1).getValue()) {
      scriptPrp.setProperty('time', 0)
      addSalary()
    }
    sleep(1000)
  }
  Logger.log("Stopped")
  //Add Salary
}

function pauseTimer() {
  scriptPrp.setProperty('timeRunning', 0)
  Logger.log(scriptPrp.getProperty('timeRunning'))
}

function resetTimer() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var cS = ss.getSheetByName("In-Game Stats")
  scriptPrp.setProperty('timeRunning', 0)
  scriptPrp.setProperty('time', 0)
  cS.getRange(19,1).setValue(scriptPrp.getProperty('time'))
}

function addSalary() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var eD = ss.getSheetByName("Extra Data V2");
  var cS = ss.getSheetByName("In-Game Stats")
  for (var i = 1; i < 6; i++) {
    var salary = eD.getRange(10+i, 12).getValue()
    cS.getRange(i+1, 3).setValue(cS.getRange(i+1, 3).getValue() + salary)
  }
}

function sleep(milliseconds) {
  const date = Date.now();
  let currentDate = null;
  do {
    currentDate = Date.now();
  } while (currentDate - date < milliseconds);
}

function trade() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var cS = ss.getSheetByName("In-Game Stats")
  
  sendingCountry = cS.getRange(28, 5).getValue()
  sendingGood = cS.getRange(29, 5).getValue()
  recievingCountry = cS.getRange(31, 5).getValue()
  recievingGood = cS.getRange(32, 5).getValue()

  for (var i = 0; i < 6; i++) {
    if (sendingCountry == cS.getRange(2+i, 1).getValue()){
      break
    }
  }

  for (var j = 0; j < 6; j++) {
    if (recievingCountry == cS.getRange(2+i, 1).getValue()){
      break
    }
  }

  for (var k = 0; k < 3; k++) {
    if (sendingGood == cS.getRange(2, 2 + k).getValue()){
      break
    }
  }

  for (var l = 0; l < 3; l++) {
    if (recievingGood == cS.getRange(2, 2 + k).getValue()){
      break
    }
  }

  sendingAmount = cS.getRange(30, 5).getValue()
  receivingAmount = cS.getRange(33, 5).getValue()

  //Swap Senders to Recievers
  cS.getRange(2+j, 2+l).setValue(cS.getRange(2+i, 2+k).getValue() + sendingAmount)  
  cS.getRange(2+i, 2+k).setValue(cS.getRange(2+j, 2+l).getValue() - sendingAmount)  

  //Swap Recievers to Senders
  cS.getRange(2+j, 2+l).setValue(cS.getRange(2+i, 2+k).getValue() - receivingAmount)  
  cS.getRange(2+i, 2+k).setValue(cS.getRange(2+j, 2+l).getValue() + receivingAmount) 
}
