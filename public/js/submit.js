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
    console.log(result.status);
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
    console.log(data);
  })
  .catch(function(error){
    console.log(error);
  })
}

function submit(){
  const inputs = document.querySelectorAll('input');
  let inputsValues = {}
  inputs.forEach((input) => {
    const inputName = input.attributes.name.nodeValue;
    const inputValue = input.value
    return inputsValues[inputName] = inputValue
  });
  postData(inputsValues);
}


document.querySelector('#submit').addEventListener("click", function(){
  submit();
})
document.querySelector('#search').addEventListener("click", function(){
  search();
})
