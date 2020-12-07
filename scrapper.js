
function exportToCsv(filename, rows) {
    var processRow = function (row) {
        var finalVal = '';
        for (var j = 0; j < row.length; j++) {
            var innerValue = row[j] === null ? '' : row[j].toString();
            if (row[j] instanceof Date) {
                innerValue = row[j].toLocaleString();
            };
            var result = innerValue.replace(/"/g, '""');
            if (result.search(/("|,|\n)/g) >= 0)
                result = '"' + result + '"';
            if (j > 0)
                finalVal += ',';
            finalVal += result;
        }
        return finalVal + '\n';
    };

    var csvFile = '';
    for (var i = 0; i < rows.length; i++) {
        csvFile += processRow(rows[i]);
    }

    var blob = new Blob([csvFile], { type: 'text/csv;charset=utf-8;' });
    if (navigator.msSaveBlob) { // IE 10+
        navigator.msSaveBlob(blob, filename);
    } else {
        var link = document.createElement("a");
        if (link.download !== undefined) { // feature detection
            // Browsers that support HTML5 download attribute
            var url = URL.createObjectURL(blob);
            link.setAttribute("href", url);
            link.setAttribute("download", filename);
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    }
}

function getPaperLink(link) {
  return fetch(link).then(function (response) {
	// The API call was successful!
	return response.text();
  }).then(function (html) {
    
    // Convert the HTML string into a document object
    var parser = new DOMParser();
    var doc = parser.parseFromString(html, 'text/html');
    return doc.getElementsByClassName("card-link")[1].childNodes[3].href
    
  }).catch(function (err) {
    // There was an error
    console.warn('Something went wrong.', err);
    return "";
  });
}

async function scrape_info(elem) {
  const title = elem.getElementsByClassName("card-title")[0].textContent;
  const link = elem.getElementsByClassName("card-title")[0].parentElement.href;
  const authors = elem.getElementsByTagName("h6")[0].textContent.trim();
  const poster_sess_date = elem.getElementsByClassName("pp-card-header")[0].getElementsByTagName("div")[2].getElementsByTagName("span")[0].textContent;
  const poster_sess = elem.getElementsByClassName("pp-card-header")[0].getElementsByTagName("div")[2].getElementsByTagName("a")[0].textContent;
  const paper_link = await getPaperLink(link);
  return [title, authors, poster_sess_date, poster_sess, link, paper_link]
}

async function scrape_all_info(file_name) {
  var ret = []
  for (idx = 0, len = document.getElementsByClassName("myCard").length, text = ""; idx < len; idx++) {
    var info_prom = await scrape_info(document.getElementsByClassName("myCard")[idx]);
    ret.push(info_prom)
    console.log(idx)
  }
  exportToCsv(file_name, ret);
}
