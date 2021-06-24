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

   });