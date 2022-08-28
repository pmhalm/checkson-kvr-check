

var axios = require('axios');
var cron = require('node-cron');

  const getCookie = async function () {
    try {
    
    const response = await axios.get('https://terminvereinbarung.muenchen.de/bba/termin/?loc=BB');
    phpcookie = response.headers['set-cookie'].toString();
    return phpcookie;
    }
     catch (ex) {
      // ...
    }
  };



const getAppointments = async function () {
    try {
    const phpcookie = await getCookie();
    let headerConfig = {
        headers: {
            "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
            "Accept-Language": "de,en-US;q=0.7,en;q=0.3",
            "Referer": "https://terminvereinbarung.muenchen.de/bba/termin/?loc=BB",
            "ContentType": "application/x-www-form-urlencoded",
            "Origin": "https://terminvereinbarung.muenchen.de",
            //"Cookie" "JSESSIONID=20221A8C95AB473B87231043A73963F0"
            //"Cookie":"PHPSESSID=5kuraf3h14vakmq4gjaf3v8r23; path=/"
            "Cookie": phpcookie

        }
      }
          
      
    const response = await axios.post('https://terminvereinbarung.muenchen.de/bba/termin/index.php?loc=BB', 
        'step=WEB_APPOINT_SEARCH_BY_CASETYPES&CASETYPES%5BAn-+oder+Ummeldung+-+Einzelperson%5D=0&CASETYPES%5BAn-+oder+Ummeldung+-+Einzelperson+mit+eigenen+Fahrzeugen%5D=0&CASETYPES%5BAn-+oder+Ummeldung+-+Familie%5D=0&CASETYPES%5BAn-+oder+Ummeldung+-+Familie+mit+eigenen+Fahrzeugen%5D=0&CASETYPES%5BMeldebescheinigung%5D=0&CASETYPES%5BHaushaltsbescheinigung%5D=0&CASETYPES%5BFamilienstands%C3%A4nderung%2F+Namens%C3%A4nderung%5D=0&CASETYPES%5BAntrag+Personalausweis%5D=1&CASETYPES%5BAntrag+Reisepass%2FExpressreisepass%5D=0&CASETYPES%5BAntrag+vorl%C3%A4ufiger+Reisepass%5D=0&CASETYPES%5BAntrag+oder+Verl%C3%A4ngerung%2FAktualisierung+Kinderreisepass%5D=0&CASETYPES%5BAusweisdokumente+-+Familie+%28Minderj%C3%A4hrige+und+deren+gesetzliche+Vertreter%29%5D=0&CASETYPES%5BeID-Karte+beantragen+%28EU%2FEWR%29%5D=0&CASETYPES%5BNachtr%C3%A4gliche+Anschriften%C3%A4nderung+Personalausweis%2FReisepass%2FeAT%5D=0&CASETYPES%5BNachtr%C3%A4gliches+Einschalten+eID+%2F+Nachtr%C3%A4gliche+%C3%84nderung+PIN%5D=0&CASETYPES%5BWiderruf+der+Verlust-+oder+Diebstahlanzeige+von+Personalausweis+oder+Reisepass%5D=0&CASETYPES%5BVerlust-+oder+Diebstahlanzeige+von+Personalausweis%5D=0&CASETYPES%5BVerlust-+oder+Diebstahlanzeige+von+Reisepass%5D=0&CASETYPES%5BPersonalausweis%2C+Reisepass+oder+eID-Karte+abholen%5D=0&CASETYPES%5BF%C3%BChrungszeugnis+beantragen%5D=0&CASETYPES%5BGewerbezentralregisterauskunft+beantragen+%E2%80%93+nat%C3%BCrliche+Person%5D=0&CASETYPES%5BGewerbezentralregisterauskunft+beantragen+%E2%80%93+juristische+Person%5D=0&CASETYPES%5BBis+zu+5+Beglaubigungen+Unterschrift%5D=0&CASETYPES%5BBis+zu+5+Beglaubigungen+Dokument%5D=0&CASETYPES%5BBis+zu+20+Beglaubigungen%5D=0&CASETYPES%5BFahrzeug+wieder+anmelden%5D=0&CASETYPES%5BFahrzeug+au%C3%9Fer+Betrieb+setzen%5D=0&CASETYPES%5BAdress%C3%A4nderung+in+Fahrzeugpapiere+eintragen+lassen%5D=0&CASETYPES%5BNamens%C3%A4nderung+in+Fahrzeugpapiere+eintragen+lassen%5D=0',
        headerConfig);
    //console.log(response.data)  
    const searchTerm = ' var jsonAppoints = \'';
    const searchTermEnd ='var appointLocationHash'
    //console.log(response.data.includes("var jsonAppoints"))
    var pos1 = response.data.indexOf(searchTerm);
    var pos2 = response.data.indexOf(searchTermEnd)
    const jsonAppoints = JSON.parse(response.data.substring(pos1+searchTerm.length, pos2-15));
    //console.log(jsonAppoints)

    let appointCounter = 0;
    resultString ="";
    for (let [key, value] of Object.entries(jsonAppoints)) {
      for (let[dates,appointments] of Object.entries(value.appoints)) {
        
        if(appointments.length>0) {
          appointCounter += appointments.length;
          //console.log('\u0007');
          resultString +="+++ HIT +++ " + value.caption + ": " +  dates + " offers " + appointments.length + " appointments ("+ appointments.toString() + ")\n";
          //console.log(appointments);
          
          
        }
        else
        {
          //resultString +=" --- MISS --- " + value.caption + ": " +  dates + " offers " + appointments.length + " appointments\n";
          
        }
      }
      
    }
    resultString+="\n\nCurrently " + appointCounter + " appointments available";
    console.log(resultString);
    
    

    //var countPasing = jsonAppoints["Termin Wartezone 1 P"].appoints.reduce(function(key, value) {
  //      return key + (value.length? 1: 0);
//    }, 0);
//countPasing = jsonAppoints["Termin Wartezone 1 P"].appoints
    //console.log(countPasing)
    

    //console.log(response.request);
    } catch (ex) {
      // ...
    }
  };



  getAppointments();
  

/*

  var task = cron.schedule('* * * * *', () =>  {
    getAppointments();
    
  });
*/
//
//task.stop();
