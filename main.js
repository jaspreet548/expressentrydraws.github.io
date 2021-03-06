var url = "https://www.canada.ca/en/immigration-refugees-citizenship/corporate/mandate/policies-operational-instructions-agreements/ministerial-instructions/express-entry-rounds.html";

var jsonData = {
  "immigrationPrograms": {
    "types" : [	
    ],
    "totalDraws" : []
  },
  "draws":[],
  "years" : [],
  "invitationsIssued" : 0
};



  $.get( "./data.txt" , function( data ) {
   // console.log(data);

    var startIndexoOfTable = data.indexOf('<table class="wb-tables table"');
    var lastIndexoOfTable = data.indexOf("</table>") + 8;

    var table = data.substring(startIndexoOfTable, lastIndexoOfTable);
    var dom_nodes = $($.parseHTML(table));
    console.log(dom_nodes);    

    $(dom_nodes[0].rows).each(function( index ) {
      if (index!=0){
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
        
        jsonData.draws.push(tempData);
        jsonData.invitationsIssued += parseInt(tempData.invitationsIssued);

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
          value: item,
          text : item 
      }));
    });

    var firstDrawVal = jsonData.draws[jsonData.draws.length-1].immigrationProgram + ", Crs : " + jsonData.draws[jsonData.draws.length-1].crsScore +", Date - " + jsonData.draws[jsonData.draws.length-1].date;
    $('#spnFirstDraw').text(firstDrawVal);

    var dateThisYear = new Date(new Date().getFullYear(), 0, 1);
    var thisYearDraws = jsonData.draws.filter(draw => (new Date(draw.date)) >= dateThisYear);
    var firstDrawTY = thisYearDraws[0].immigrationProgram + ", Crs : " + thisYearDraws[0].crsScore +", Date - " + thisYearDraws[0].date;
    var lastDrawTY = thisYearDraws[thisYearDraws.length -1].immigrationProgram + ", Crs : " + thisYearDraws[thisYearDraws.length -1].crsScore +", Date - " + thisYearDraws[thisYearDraws.length -1].date;
    $('#spnFirstDrawTY').text(firstDrawTY);
    $('#spnLastDrawTY').text(lastDrawTY);
    
    var dateLastYearFirstMonth = new Date(new Date().getFullYear() -1 , 0, 1);
    var dateLastYearLastMonth = new Date(new Date().getFullYear() -1 , 11, 31);
    var lastYearDraws = jsonData.draws.filter(draw => (new Date(draw.date)) >= dateLastYearFirstMonth && (new Date(draw.date)) <= dateLastYearLastMonth);
    var firstDrawLY = lastYearDraws[0].immigrationProgram + ", Crs : " + lastYearDraws[0].crsScore +", Date - " + lastYearDraws[0].date;
    var lastDrawLY = lastYearDraws[lastYearDraws.length -1].immigrationProgram + ", Crs : " + lastYearDraws[lastYearDraws.length -1].crsScore +", Date - " + lastYearDraws[lastYearDraws.length -1].date;
    $('#spnFirstDrawLY').text(firstDrawLY);
    $('#spnLastDrawLY').text(lastDrawLY);

    var drawTotalCount = jsonData.draws[0].drawNo;
    jsonData.immigrationPrograms.totalDraws[0] = drawTotalCount;    
    $('#spnTotalDraws').text(drawTotalCount);
    $("#spnTDFilter").text(drawTotalCount);
     
    $("#ddlYears").change(function () {
      var year = $(this).val();
      var categoryVal = $("#ddlCategory").val();
      sortData(year, categoryVal);

    });

    $("#ddlCategory").change(function () {
      var year = $("#ddlYears").val();
      var categoryVal = $(this).val();
      sortData(year, categoryVal);
    });

    $("#spnNFilter").text(jsonData.invitationsIssued);

    var last5Draws = jsonData.draws.slice(0,5);
    $.each(last5Draws, function (i, item) {
      var tableTr = "<tr><td>" + item.drawNo+ "</td>" + 
      "<td>" + item.date + "</td>" +
      "<td>" + item.immigrationProgram + "</td>" +
      "<td>" + item.crsScore + "</td>" +
      "<td>" + item.invitationsIssued + "</td>" +
      "<td>" + item.programsCovered + "</td>" +
      "</tr>";

      $('#tblLast5Draws').append(tableTr);
    });

    console.log(jsonData);
   });

   function sortData(year, categoryVal){
    var drawsLength = 0;
    var draws = [];
      if(categoryVal !=0 && year !=0){
        draws = jsonData.draws.filter(draw => (new Date(draw.date)).getFullYear() == year && (draw.immigrationProgram) == categoryVal);
      } else if(categoryVal ==0 && year ==0){
        draws = jsonData.draws;
      }else if(categoryVal ==0 && year !=0){
        draws = jsonData.draws.filter(draw => (new Date(draw.date)).getFullYear() == year);
      } else if(categoryVal !=0 && year ==0){
        draws = jsonData.draws.filter(draw => (draw.immigrationProgram) == categoryVal);        
      }
      drawsLength = draws.length;
      $("#spnTDFilter").text(drawsLength);
      
      $("#tblDrawsCategory tbody").empty();
      var invitationsIssuedTemp = 0;
      var maxCRSTemp = 0;
      var minCRSTemp = 1000;
      var avgCRSTemp = 0;
      $.each(draws, function (i, item) {
        invitationsIssuedTemp += parseInt(item.invitationsIssued);
        maxCRSTemp =  maxCRSTemp < parseInt(item.crsScore) ? parseInt(item.crsScore) : maxCRSTemp;
        minCRSTemp = minCRSTemp > parseInt(item.crsScore) ? parseInt(item.crsScore) : minCRSTemp;
        avgCRSTemp += parseInt(item.crsScore);

        var tableTr = "<tr><td>" + item.drawNo+ "</td>" + 
        "<td>" + item.date + "</td>" +
        "<td>" + item.immigrationProgram + "</td>" +
        "<td>" + item.crsScore + "</td>" +
        "<td>" + item.invitationsIssued + "</td>" +
        "<td>" + item.programsCovered + "</td>" +
        "</tr>";

        $('#tblDrawsCategory tbody').append(tableTr);
      });

      if(categoryVal ==0 && year ==0){
        $("#spnNFilter").text(jsonData.invitationsIssued);
      }else{
        $("#spnNFilter").text(invitationsIssuedTemp);
      }    

      if(draws.length == 0){
        minCRSTemp = 0;
      }

      $("#spnMiniCrsFilter").text(minCRSTemp);
      $("#spnMaxCrsFilter").text(maxCRSTemp);
      $("#spnAvgCrsFilter").text(avgCRSTemp/drawsLength);

   }

   $("#btnUpdate").click(function(){
    $.get( url , function( data ) {
      console.log(data);
      // using (System.IO.StreamWriter file = new System.IO.StreamWriter("C:\Users\Public\TestFolder\WriteLines2.txt", true))
      // {
      //     file.WriteLine(text);
      // }
    });
  }); 