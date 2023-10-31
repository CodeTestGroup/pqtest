out('Profile','title')

let idClassButton = document.getElementById('idClassButton')
let motivateQuote=document.getElementById('motivateQuote')
let myHeader = { "Accept":"application/json", 'Content-Type': 'application/json'}
let url = "/ProfileData";
    fetch(url, { headers: myHeader, method: 'GET'})
    .then((reponse) =>{ return reponse.json(); })
    .then((res) => {
        motivateQuote.innerHTML=`<p class="card-text" id="motivateQuote">${res.QUOTE}</p>`
        })

    url = "/getClassList";
        fetch(url, { headers: myHeader, method: 'GET'})
              .then((reponse) =>{ return reponse.json(); })
                  .then((res) => {
                    let year=''
                    let Class =''
                    for (const key in res[0]) {
                            if(key=='YEAR'){
                                year=res[0][key]
                            }
                            if(res[0][key]==1){
                                let temp=[key]+''
                                Class= Class.replace('XX',pad(year))+'<br>'+temp.replace('XX',pad(year))
                            }
                            }
                           idClassButton.innerHTML=Class.substr(4)
                          })



//right lets get user test data
function pad(d) {return (d < 10) ? '0' + d.toString() : d.toString();}

async function Fetch_POST(url, myHeader,obj) {
  const response = await fetch(url, { headers: myHeader, method: 'post',body: JSON.stringify(obj)})
  const data = await response.json();
  return data;
}
async function synchronousFetch(url) {
  let myHeader = {"Accept":"application/json",'Content-Type': 'application/json'}
  const response = await fetch(url, { headers: myHeader,method: 'GET'});
  const data = await response.json();
  return data;
}


function GET_QUIZCODE_RESULT(DATA){
     let totalQuestions=0
    let correctRESULT=0
    let attemptRESULT=0
     let LJ=JSON.parse(DATA.JSON)
                    const keys = Object.keys(LJ);
                    keys.forEach(key => {
                            totalQuestions++;
                        if(LJ[key].result==true){
                            correctRESULT++
                        }
                        attemptRESULT=attemptRESULT+LJ[key].attempts;
                    });
                    return {totalQuestions:totalQuestions,correctRESULT:correctRESULT,attemptRESULT:attemptRESULT}
}
// Example usage

function toggleAccordion(element) {
  const accordionContent = element.nextElementSibling;
  if (accordionContent.style.display === 'block') {
    accordionContent.style.display = 'none';
  } else {
    accordionContent.style.display = 'block';
  }
}



async function GetDepartment(){
let myHeader = { "Accept":"application/json", 'Content-Type': 'application/json'}

  const departments = await Fetch_POST('/REQUEST_STUDENT_RESULT_DEPARTMENT', myHeader,{} );
    return departments
}

async function GetSubject(DEPARTMENT){
let myHeader = { "Accept":"application/json", 'Content-Type': 'application/json'}

  const subject = await Fetch_POST('/REQUEST_STUDENT_RESULT_SUBJECT', myHeader,{ID_DEPARTMENT:DEPARTMENT} );
    return subject
}
async function GetModule(DEPARTMENT,Subject){
let myHeader = { "Accept":"application/json", 'Content-Type': 'application/json'}

  const module = await Fetch_POST('/REQUEST_STUDENT_RESULT_MODULE', myHeader,{ID_DEPARTMENT:DEPARTMENT, ID_SUBJECT:Subject} );
    return module
}
async function GetSubject(DEPARTMENT){
let myHeader = { "Accept":"application/json", 'Content-Type': 'application/json'}

  const subject = await Fetch_POST('/REQUEST_STUDENT_RESULT_SUBJECT', myHeader,{ID_DEPARTMENT:DEPARTMENT} );
    return subject
}
async function GetResult(DEPARTMENT,Subject, MODULE){
let myHeader = { "Accept":"application/json", 'Content-Type': 'application/json'}

  const RESULT = await Fetch_POST('/REQUEST_STUDENT_RESULT_RESULT', myHeader,{ID_DEPARTMENT:DEPARTMENT, ID_SUBJECT:Subject, ID_MODULE:MODULE} );
    return RESULT
}

async function GET_results() {
  let DepartmentHTML = '';
  let Result = [];
  let ModuleHTML = '';
  let colourDyslexic = '';

  let departments = await GetDepartment();

  for (let d = 0; d < departments.length; d++) {
    let SubjectHTML = '';

    let Subject = await GetSubject(departments[d].ID_DEPARTMENT);
    for (let s = 0; s < Subject.length; s++) {
      ModuleHTML = '';

      let Module = await GetModule(departments[d].ID_DEPARTMENT, Subject[s].ID_SUBJECT);
      for (let m = 0; m < Module.length; m++) {
        Result = await GetResult(departments[d].ID_DEPARTMENT, Subject[s].ID_SUBJECT, Module[m].ID_MODULE);
        let ResultHTML = ''; // Reset ResultHTML for each module

        for (let key in Result) {
          colourDyslexic = stringToDyslexicColorCode(Module[m].ID_MODULE);
          ResultHTML += `<div style="background-color: ${colourDyslexic};" class='ResultBoxContainerSmall'><img src="/ICON/cup.png"  width="20"  id="icon" alt="">${Module[m].ID_MODULE}<br>Lesson:${key}<br>Score:${Result[key].AVSCORE}%<br>Attempts:${Result[key].AVQRATE}%</div>`;
        }

        ModuleHTML += `<div class='ResultBox'>${ResultHTML}</div>`;
      }

      let buttonPROP = `<button style='display: block; width: 30vw; padding:5px; margin: 5px; border-radius: 5px; background-color: ${colourDyslexic}; border: 3px solid black; color: rgb(5, 86, 144); text-decoration: none; font-weight: bold;'>`;

      SubjectHTML += `<div>
                        <div>
                            <div class="accordion">
                                <div class="accordion-header" onclick="toggleAccordion(this)">
                                    <button style='display: block; width: 40vw; padding:10px; margin: 5px; border-radius: 5px; background-color: ${colourDyslexic}; border: 3px solid black; color: rgb(5, 86, 144); text-decoration: none; font-weight: bold;'>${Subject[s].ID_SUBJECT}</button>
                                </div>
                                <div class="accordion-content" style="display: none; padding: 10px;">${ModuleHTML}</div>
                            </div>
                        </div>
                    </div>`;
    }

    let buttonPROP = `<button style='display: block; width: 65vw;  padding: 15px;margin: 5px;  border-radius: 3px; background-color: #d8d33d6; border: 3px solid black; color: black; text-decoration: none; font-weight: bold;'>`;

    DepartmentHTML += `<div class="Resultcontainer" id="RESULTS_DISPLAY" style="margin:20px; width:70vw">  <div><div class="accordion"><div class="accordion-header" onclick="toggleAccordion(this)">${buttonPROP}<div>${departments[d].ID_DEPARTMENT}</div></button></div><div class="accordion-content">${SubjectHTML}</div></div></div></div>`;
  }

  document.getElementById('RESResults').innerHTML = DepartmentHTML;
  document.querySelectorAll('.accordion-content').forEach(function(content) {
  content.style.display = 'none';
});
}



async function qGET_results() {
  let DepartmentHTML =''
  let SubjectHTML=''
  let ResultHTML=''
  let Subject = []
  let Module=[]
  let Result=[]
  let ModuleHTML =''
  let colourDyslexic=''
    let departments = await GetDepartment()

        for (d=0; d<departments.length;d++){

              Subject = await GetSubject(departments[d].ID_DEPARTMENT)
             for (s=0; s<Subject.length;s++){
                        Module = await GetModule(departments[d].ID_DEPARTMENT,Subject[s].ID_SUBJECT )
                        ModuleHTML=''
                for (m=0; m<Module.length;m++){
                         Result = await GetResult(departments[d].ID_DEPARTMENT,Subject[s].ID_SUBJECT,Module[m].ID_MODULE )
                      for (let key in Result) {
                        colourDyslexic = stringToDyslexicColorCode(Module[m].ID_MODULE)
                              ResultHTML=ResultHTML+`<div style="background-color: ${colourDyslexic};" class='ResultBoxContainerSmall'><img src="/ICON/cup.png"  width="20"  id="icon" alt="">${Module[m].ID_MODULE}<br>Lesson:${key}<br>Score:${Result[key].AVSCORE}%<br>Attempts:${Result[key].AVQRATE}%</div>`
                        }

                        ModuleHTML=ModuleHTML+`<div class='ResultBox'>${ResultHTML}</div>`
                        ResultHTML=''
                }
                let buttonPROP = `<button style='display: block; width: 100%; padding:10px; margin: 5px; border-radius: 5px; background-color: ${colourDyslexic}; border: 3px solid black; color: rgb(5, 86, 144); text-decoration: none; font-weight: bold;'>`;

                    SubjectHTML=SubjectHTML+`<div><div><div class="accordion"><div class="accordion-header" onclick="toggleAccordion(this)">${buttonPROP}${Subject[s].ID_SUBJECT}</button></div>
  <div class="accordion-content" style="display: none; padding: 10px;">${ModuleHTML}</div></div></div>`
             }

       //  DepartmentHTML=DepartmentHTML+`<div>${departments[d].ID_DEPARTMENT}</div>`
         let buttonPROP = `<button style='display: block; width: 75vw;  padding: 40px;margin: 5px;  border-radius: 3px; background-color: rgb(255, 254, 203); border: 3px solid black; color: rgb(5, 86, 144); text-decoration: none; font-weight: bold;'>`;
DepartmentHTML = DepartmentHTML + `<div><div class="accordion"><div class="accordion-header" onclick="toggleAccordion(this)">${buttonPROP}<div>${departments[d].ID_DEPARTMENT}</div></button></div><div class="accordion-content">${SubjectHTML}</div></div></div>`;

        SubjectHTML=''
    }


     document.getElementById('RESResults').innerHTML=DepartmentHTML
}


// JavaScript code to set accordion content as collapsed by default
document.querySelectorAll('.accordion-content').forEach(function(content) {
  content.style.display = 'none';
});

console.log( document.getElementById('RESResults').innerHTML)
GET_results();


function stringToDyslexicColorCode(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  let color = "#";
  for (let i = 0; i < 3; i++) {
    let value = (hash >> (i * 8)) & 0xFF;
    let addValue = value % 128 + 128;
    color += ("00" + addValue.toString(16)).substr(-2);
  }
  return color;
}

function out(message,colour){
    let enable = 1
if (colour=='title'){
    console.log('\x1b[41m%s\x1b[0m', message);
}else if((typeof(message)=='object') && (enable==1)){
    console.log(message)
}else if((typeof(message)=='array') && (enable==1)){
    console.log(message)
}else if((typeof(colour)=='undefined') && (enable==1)){
    console.log('%c   ' +'  '+message, 'color: #8c8c8c');
}else{
    if (enable==1){
   console.log('%c   ' +'  '+message, 'color: '+colour);
    }
}
}
