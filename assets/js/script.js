const API_KEY = 'LIT8qr7pH33mmaJYvLiJX--E-hc';
const API_URL = 'https://ci-jshint.herokuapp.com/api';
const resultsModal = new bootstrap.Modal(document.getElementById('resultsModal'));

document.getElementById('status').addEventListener('click', e => getStatus(e));
document.getElementById('submit').addEventListener('click', e => postForm(e));

async function getStatus(e) {
    const queryString = `${API_URL}?api_key=${API_KEY}`;
    const response = await fetch(queryString);
    const data = await response.json();
    if (response.ok) {
        displayStatus(data);
    } else {
        displayExceptions(data);
        throw new Error(data);
    }
}

function displayStatus(data) {
    document.getElementById('resultsModalTitle').innerText = 'API Key Status';
    document.getElementById('results-content').textContent = `Your key is valid until ${data.expiry}`;
    resultsModal.show();
}

async function postForm(e) {
    const form = processOptions(new FormData(document.getElementById('checksform')));
    const response = await fetch(API_URL, {
                        method: 'POST',
                        headers: {
                                    'Authorization': API_KEY,
                                 },
                                 body: form,
                        })
    const data = await response.json();
    if (response.ok) {
        displayErrors(data);
    } else {
        displayExceptions(data);
        throw new Error(data.error);
    }
}

function displayErrors(data) {
    if (data.total_errors === 0) {
        results = `div class='no_errors'>No errors reported!</div>`;
    } else {
        results = `<div>Total Errors: <span class='error_count'>${data.total_errors}</span></div>`;
        for (let error of data.error_list) {
            results += `<div>At line <span class='line'>${error.line}</span>, `;
            results += `column <span class='column'>${error.col}</span></div>`;
            results += `<div class'error'>${error.error}</div>`;
        }
    }
    document.getElementById('resultsModalTitle').innerText = `JSHint results for ${data.file}`;
    document.getElementById('results-content').innerHTML = results;
    resultsModal.show();
}

function processOptions(form) {
    let optArray = [];
    for (let entry of form.entries()) {
        if (entry[0] === 'options') {
            optArray.push(entry[1]);
        }
    }
    form.delete('options');
    form.append('options', optArray.join());
    return form;
}

function displayExceptions(data) {
    results1 = `<div>The API returned status code ${data.status_code}</div>`;
    results2 = `<div>Error number: <strong>${data.error_no}</strong></div>`;
    results3 = `<div>Error text: <strong>${data.error}</strong></div>`;
    document.getElementById('resultsModalTitle').innerText = 'An Exception Has Occcured';
    document.getElementById('results-content').innerHTML = `${results1}\n${results2}\n${results3}`
    resultsModal.show();
}