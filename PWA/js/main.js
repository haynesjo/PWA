window.onload = () => {
  'use strict';

  if ('serviceWorker' in navigator) {
    navigator.serviceWorker
             .register('./sw.js');
  }
};

function loadJSON() {
    if (document.getElementById("divLoanList").childElementCount > 1) {
        alert("Reload the page for security reasons clicking loan three times is sus. If you want to calculate again reload page.")
    }
            var decPrincipal = document.getElementById("txtPrincipal").value;
            var intMonths = document.getElementById("txtMonths").value;
            var decAPR = document.getElementById("txtAPR").value;
//Is there a way to check if these are numbers
if (!isNumber(decPrincipal)) {
   document.getElementById("txtPrincipal").focus();
   return false;
}

            var data_file = "https://loandata.azurewebsites.net/loandata";
            data_file += "/" + decPrincipal + "/" + intMonths + "/" + decAPR;
            
            var http_request = new XMLHttpRequest();
            try{
               // Opera 8.0+, Firefox, Chrome, Safari
               http_request = new XMLHttpRequest();
            }catch (e) {
               // Internet Explorer Browsers
               try{
                  http_request = new ActiveXObject("Msxml2.XMLHTTP");
					
               }catch (e) {
				
                  try{
                     http_request = new ActiveXObject("Microsoft.XMLHTTP");
                  }catch (e) {
                     // Something went wrong
                     alert("Your browser broke!");
                     return false;
                  }
					
               }
            }
			
            http_request.onreadystatechange = function() {
			
               if (http_request.readyState == 4  ) {
                  // Javascript function JSON.parse to parse JSON data
                  var jsonObj = JSON.parse(http_request.responseText);

                  // jsonObj variable now contains the data structure and can
                  // be accessed as jsonObj.name and jsonObj.country.
                  var NewLoan = document.getElementById("divLoanTemplate").cloneNode(true);
                  
                   NewLoan.getElementsByClassName("divPrincipal")[0].innerHTML = MoneyFormat(jsonObj.Amount);
                  NewLoan.getElementsByClassName("divMonths")[0].innerHTML = jsonObj.Months;
                   NewLoan.getElementsByClassName("divMonthlyPayment")[0].innerHTML = MoneyFormat(jsonObj.MonthlyPayment);
                   NewLoan.getElementsByClassName("divAPR")[0].innerHTML = (jsonObj.APR);
                  //This is whre I add the APR stuff
                  NewLoan.classList.remove("Removed"); //This will allow us to see the new loan

                  //This is where we add the full schedule
                  var ScheduleLineArray = jsonObj.Schedule.Schedule; //Get the array data into its own object

                   //new line with header
                   var NewLoanLine = document.getElementById("divScheduleTemplate").cloneNode(true);
                   NewLoanLine.classList.remove("Removed"); //This will allow us to see the new loan
                   NewLoanLine.classList.add("Header");
                   NewLoan.getElementsByClassName("divLoanSchedule")[0].appendChild(NewLoanLine);
                  for (let index = 0; index < ScheduleLineArray.length; index++) {
                     const line = ScheduleLineArray[index];
                     
                  
                     //Create a new line and add it to the loan
                     var NewLoanLine = document.getElementById("divScheduleTemplate").cloneNode(true);
                      NewLoanLine.classList.remove("Removed"); //This will allow us to see the new loan
                      
                     NewLoanLine.getElementsByClassName("divDate")[0].innerHTML = DateFormat(line.PaymentDate);
                     NewLoanLine.getElementsByClassName("divBalance")[0].innerHTML = MoneyFormat(line.EndingBalance);
                      NewLoanLine.getElementsByClassName("divPayment")[0].innerHTML = MoneyFormat(line.PrincipalPayment);
                     NewLoan.getElementsByClassName("divLoanSchedule")[0].appendChild(NewLoanLine);
                  }
                  //Add a listener for the Show Hide Button
                  NewLoan.getElementsByClassName("btnShowHide")[0].addEventListener("click", function() {

                     if (this.value=='Show') {
                        this.value = 'Hide';
                        NewLoan.getElementsByClassName("divLoanSchedule")[0].classList.remove("Removed");
                     }else{ 
                        this.value = 'Show';
                        NewLoan.getElementsByClassName("divLoanSchedule")[0].classList.add("Removed");
                     }
                  });

               
                  //Add the loan to the list
                  document.getElementById("divLoanList").appendChild(NewLoan);
               }
            }
			
            http_request.open("GET", data_file, true);
            http_request.send();
         }


function DateFormat(CurrentDate) {
   return CurrentDate.substring(0, 10);
}
function MoneyFormat(currentMoney) {
   return currentMoney.toLocaleString('en-US', 
         { style: 'currency', currency: 'USD' });
}

function isNumber(value) {
if (value == '') {
   return false;
}

   if ((undefined === value) || (null === value)) {
       return false;
   }
   if (typeof value == 'number') {
       return true;
   }
   return !isNaN(value - 0);
}

//https://stackoverflow.com/questions/2808184/restricting-input-to-textbox-allowing-only-numbers-and-decimal-point
// Example Decimal usage;
// <input type="text"  oninput="ValidateNumber(this, true);" />
// Example Integer usage:
// <input type="text"  oninput="ValidateNumber(this, false);" />
function ValidateNumber(elm, isDecimal) {
   try {

       // For integers, replace everything except for numbers with blanks.
       if (!isDecimal) 
           elm.value = elm.value.replace(/[^0-9]/g, ''); 
       else {
           // 1. For decimals, replace everything except for numbers and periods with blanks.
           // 2. Then we'll remove all leading ocurrences (duplicate) periods
           // 3. Then we'll chop off anything after two decimal places.

           // 1. replace everything except for numbers and periods with blanks.
           elm.value = elm.value.replace(/[^0-9.]/g, '');

           //2. remove all leading ocurrences (duplicate) periods
           elm.value = elm.value.replace(/\.(?=.*\.)/g, '');

           // 3. chop off anything after two decimal places.
           // In comparison to lengh, our index is behind one count, then we add two for our decimal places.
           var decimalIndex = elm.value.indexOf('.');
           if (decimalIndex != -1) { elm.value = elm.value.substr(0, decimalIndex + 3); }
       }
   }
   catch (err) {
       alert("ValidateNumber " + err);
   }
}
