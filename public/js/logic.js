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
  const orgNum = select('#org_nr').value;
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
    const { org_name, org_address, org_city, org_postnr, org_contact } = data;
    select('#org_name').value = org_name;
    select('#org_city').value = org_city;
    select('#org_address').value = org_address;
    select('#org_postnr').value = org_postnr;
    const orgNameOptions = document.querySelectorAll('option');
    orgNameOptions.forEach((option) => {
      if (option.attributes.name && option.attributes.name.nodeValue === 'org_name') {
        option.value = org_name;
        option.textContent = org_name;
      };
    });
  })
  .catch(function(error){
    // handle me
    console.log(error);
  });
};

function submit(){
  const inputs = document.querySelectorAll('input');
  const selects = document.querySelectorAll('select');
  let inputsValues = {}
  inputs.forEach((input) => {
    let inputName;
    if (input.attributes.name) {
      inputName = input.attributes.name.nodeValue;
    }
    return inputsValues[inputName] = input.value;
  });
  selects.forEach((select, index) => {
    const selectID = select.attributes.id.nodeValue;
    if (!select.value) {
      let requiredElement = '';
      if (index <= 7) {
        requiredElement = `jur_u`;
      } else if (index >7 && index <=21) {
        requiredElement = `jur_sub`;
      } else if (index >21 && index <=28) {
        requiredElement = `jur_bb`
      }
      requiredElement += `${selectID.split('_')[2]}`
      const newValue = document.querySelector(`#${requiredElement}`);
      inputsValues[selectID] = newValue.value;
    } else {
      inputsValues[selectID] = select.value;
    }
  });
  postData(inputsValues);
};


select('#submit').addEventListener("click", function(){
  submit();
});
select('#search').addEventListener("click", function(){
  search();
});
