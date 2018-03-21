const select = (element) => document.querySelector(element);

function postData(inputs){
  fetch('/surve-contract', {
    method: 'POST',
    headers: {
      Accept: 'application/json, text/plain, */*',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(inputs)
  })
  .then((response) => response.json())
  .then((result) => {
    if(result.status === true){
      window.location.assign('/contract.docx');
    }
  })
  .catch((err) => alert(err.message));
}

function search(){
  const orgNum = document.querySelector('#org_nr').value
  fetch('/search-org', {
    method: 'POST',
    headers: {
      Accept: 'application/json, text/plain, */*',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({orgNum: orgNum})
  })
  .then((response) => response.json())
  .then(function(data){
    const { org_name, org_address, org_city, org_postnr } = data;
    select('#org_name').value = org_name;
    select('#org_city').value = org_city;
    select('#org_address').value = org_address;
    select('#org_postnr').value = org_postnr;
    // select('#org_contact').value = org_contact;
  })
  .catch(function(error){
    // handle this error
    console.log(error);
  })
}

function submit(){
  const inputs = document.querySelectorAll('input');
  const selects = document.querySelectorAll('select');
  let inputsValues = {}
  inputs.forEach((input) => {
    const inputName = input.attributes.name.nodeValue;
    return inputsValues[inputName] = input.value;
  });
  selects.forEach((select) => {
    const selectID = select.attributes.id.nodeValue;
    return inputsValues[selectID] = select.value;
  })
  postData(inputsValues);
}


document.querySelector('#submit').addEventListener("click", function(){
  submit();
})
document.querySelector('#search').addEventListener("click", function(){
  search();
})
