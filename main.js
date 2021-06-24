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
        "totalDraws" : [
        ]
      },
      "draws":[
      ],
      "years" : [
        
      ]
    };

    var drawTotalCount = dom_nodes[0].rows.length;


    $(dom_nodes[0].rows).each(function( index ) {
      if (index!=0){
                //console.log( index + ": " + $( this ).text() );
        let tempData= [];
        $(this.children).each(function( childrenIndex ) {
          if (childrenIndex!=5){            
            if (childrenIndex==0){
              let tempDetailUrl = "en/immigration-refugees-citizenship/corporate/mandate/policies-operational-instructions-agreements/ministerial-instructions/express-entry-rounds/invitations-"+ this.innerText +".html";
              tempData.push(this.innerText);
            }
            else if(childrenIndex == 1){
              tempData.push(new Date(this.innerText));
            }else{
              tempData.push(this.innerText);
            }
          }
        });
        
        jsonData.draws.push({drawNo=tempData[0], details=tempData[1], date=tempData[2], immigrationProgram=tempData[3],
          invitationsIssued=tempData[4], crsScore=tempData[5], programsCovered=tempData[6] });



      }
    });
    
    console.log(jsonData);
   });