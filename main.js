var url = "https://www.canada.ca/en/immigration-refugees-citizenship/corporate/mandate/policies-operational-instructions-agreements/ministerial-instructions/express-entry-rounds.html";

// $.get( url , function( data ) {
//    console.log(data);
//    debugger
//   });

  $.get( "./data.txt" , function( data ) {
   // console.log(data);

    var startIndexoOfTable = data.indexOf('<table class="wb-tables table"');
    var lastIndexoOfTable = data.indexOf("</table>") + 8;

    var table = data.substring(startIndexoOfTable, lastIndexoOfTable);
    var dom_nodes = $($.parseHTML(table));
    console.log(dom_nodes);

    var jsonData = {
      "immigrationPrograms": {
        "types" : [	
          "All"
        ],
        "totalDraws" : []
      },
      "draws":[],
      "years" : []
    };

    var drawTotalCount = dom_nodes[0].rows.length - 1;
    jsonData.immigrationPrograms.totalDraws[0] = drawTotalCount;

    $(dom_nodes[0].rows).each(function( index ) {
      if (index!=0){
                //console.log( index + ": " + $( this ).text() );
        let tempData= {};
        $(this.children).each(function( childrenIndex ) {                    
            if (childrenIndex==0){
              let tempDetailUrl = "https://www.canada.ca/en/immigration-refugees-citizenship/corporate/mandate/policies-operational-instructions-agreements/ministerial-instructions/express-entry-rounds/invitations-"+ this.innerText +".html";
              tempData.drawNo = this.innerText;
              tempData.details = tempDetailUrl;
            }
            else if(childrenIndex == 1){
              tempData.date = new Date(this.innerText);
              let year = tempData.date.getFullYear();
              if(!jsonData.years.includes(year)){
                jsonData.years.push(year);
              }
            }else if(childrenIndex == 2){
              tempData.immigrationProgram = this.innerText;

              if(!jsonData.immigrationPrograms.types.includes(this.innerText)){
                jsonData.immigrationPrograms.types.push(this.innerText);
                jsonData.immigrationPrograms.totalDraws.push(0);
              }

              let typesIndex = jsonData.immigrationPrograms.types.findIndex(element => element == tempData.immigrationProgram);
              jsonData.immigrationPrograms.totalDraws[typesIndex] = jsonData.immigrationPrograms.totalDraws[typesIndex] + 1;

            }else if(childrenIndex == 3){
              tempData.invitationsIssued = this.innerText;
            }else if(childrenIndex == 4){
              tempData.crsScore = this.innerText;
            }else if(childrenIndex == 6){
              tempData.programsCovered = this.innerText;
            }          
        });
        
        jsonData.draws.unshift(tempData);

      }
    });

    $.each(jsonData.years, function (i, item) {
      $('#ddlYears').append($('<option>', { 
          value: item,
          text : item 
      }));
    });

    $.each(jsonData.immigrationPrograms.types, function (i, item) {
      $('#ddlCategory').append($('<option>', { 
          value: i,
          text : item 
      }));
    });

    var firstDrawVal = jsonData.draws[0].immigrationProgram + ", Crs : " + jsonData.draws[0].crsScore +", Date - " + jsonData.draws[0].date;
    $('#spnFirstDraw').text(firstDrawVal);

    var dateThisYear = new Date(new Date().getFullYear(), 0, 1);
    var thisYearFirstDraw = jsonData.draws.filter(draw => (new Date(draw.date)) >= dateThisYear);
    var firstDrawTY = jsonData.draws[0].immigrationProgram + ", Crs : " + jsonData.draws[0].crsScore +", Date - " + jsonData.draws[0].date;
    $('#spnFirstDrawTY').text(firstDrawTY);
    
    console.log(jsonData);
   });