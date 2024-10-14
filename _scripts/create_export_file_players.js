const fs = require('node:fs');
const exportdates = require('./list_of_exported_dates.js');
const convertJsonToCsv = require('./converter/json_to_csv.js')

create_export_file('regions')
//create_export_file('players')
//create_export_file('teams')
create_export_file('champion')
function create_export_file(of){
    var datesOfExport = exportdates.dates();
    var exportArray = [];
    let directory = __dirname+'/../data/elo_raw/'+of+'/';
    let i=0;
    console.log(__dirname+'/../data/elo_raw/'+of);
    fs.readdir(directory, (err, files) => {
        if (err) throw err;
        for (const file of files) {
            i++;
            if(file != '.gitignore' && file != '.gitkeep' && file != 'checks' && file != 'check' && file != 'oe-team' ){
                console.log(file);
                let thisElArray = {name:file.replace('.json','')}
                let thisElement = fs.readFileSync(directory+file);
                thisElement = JSON.parse(thisElement);
                datesOfExport.forEach(dateToFind=>{
                    let curscore = 1000;
                    let currentDateToFind = new Date(Date.parse(dateToFind));
                    thisElement.forEach(el=>{
                        let thisGameDate = new Date(Date.parse(el.time));
                        if(thisGameDate < currentDateToFind){
                            curscore = el.score;
                        }
                    })
                    thisElArray[dateToFind] = curscore;
                })
                exportArray.push(thisElArray);
                console.log((i/files.length*100).toFixed(3)+'% ('+i+'/'+files.length+') '+of+' scanned.');
            }
        }
        fs.writeFileSync(__dirname+'/../results/'+of+'.json',JSON.stringify(exportArray));
        fs.writeFileSync(__dirname+'/../results/'+of+'.csv',convertJsonToCsv.jsonToCsv(exportArray));
    })
}