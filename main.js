var url = "https://www.canada.ca/en/immigration-refugees-citizenship/corporate/mandate/policies-operational-instructions-agreements/ministerial-instructions/express-entry-rounds.html";

// $.get( url , function( data ) {
//    console.log(data);
//    debugger
//   });

  $.get( "./data.txt" , function( data ) {
   // console.log(data);
    debugger

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
        {"drawNo": 1, "details":"John", "date":"Doe", "immigrationProgram":"Doe", "invitationsIssued":"", "crsScore":"", "programsCovered": ""},
        {"details":"John", "date":"Doe", "immigrationProgram":"Doe", "invitationsIssued":"", "crsScore":"", "programsCovered": ""}
      ],
      "years" : [
        
      ]
    };

    var drawTotalCount = dom_nodes[0].rows.length;

    $(dom_nodes[0].rows).each(function( index ) {
      console.log( index + ": " + $( this ).text() );
    });

   });