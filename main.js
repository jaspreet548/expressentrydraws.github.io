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
          "All",
          "Canadian Experience Class",
          "Provincial Nominee Program",
          "Federal Skilled Worker (No program specified)",
          "Federal Skilled Trades"
        ],
        "totalDraws" : [0,0,0,0,0]
      },
      "draws":[],
      "years" : []
    };

    var drawTotalCount = dom_nodes[0].rows.length;
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
              if(tempData.immigrationProgram == "Canadian Experience Class"){
                jsonData.immigrationPrograms.totalDraws[1] = jsonData.immigrationPrograms.totalDraws[1] + 1;
              }else if(tempData.immigrationProgram == "Provincial Nominee Program"){
                jsonData.immigrationPrograms.totalDraws[2] = jsonData.immigrationPrograms.totalDraws[2] + 1;
              }else if(tempData.immigrationProgram == "No program specified"){
                jsonData.immigrationPrograms.totalDraws[3] = jsonData.immigrationPrograms.totalDraws[3] + 1;
              }else if(tempData.immigrationProgram == "Federal Skilled Trades"){
                jsonData.immigrationPrograms.totalDraws[4] = jsonData.immigrationPrograms.totalDraws[4] + 1;
              }
            }else if(childrenIndex == 3){
              tempData.invitationsIssued = this.innerText;
            }else if(childrenIndex == 4){
              tempData.crsScore = this.innerText;
            }else if(childrenIndex == 6){
              tempData.programsCovered = this.innerText;
            }          
        });
        
        jsonData.draws.push(tempData);

      }
    });
    
    console.log(jsonData);
   });