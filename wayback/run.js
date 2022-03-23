const axios = require("axios");
const fs = require("fs");

async function run(){
  try{
    let domain = "asos.com";
    let fetchurl = `https://web.archive.org/cdx/search?url=${domain}%2F&matchType=prefix&collapse=urlkey&output=json&fl=original%2Cstatuscode`;

    let response = await axios.get(fetchurl)
    let data = response.data;
    if (data.length > 0) {
      let result = [];
      let headers = data[0];
      for await (line of data) {
        let lineIdx = headers.indexOf("original");
        let statusCodeIdx = headers.indexOf("statuscode");
        if (lineIdx != -1) { // validate header and line for "original"
          var url = line[lineIdx];
          var statusCode = line[statusCodeIdx];
          // because a lot of URLs have ports, lets just clean them
          var cleanurl = url.replace(
            domain.split("/")[0] + ":80/",
            domain + "/"
          );
          result.push('"' + statusCode + '", "' + cleanurl + '"');
        }
      }
      let txt = result.join("\n");
      // csv
      fs.writeFileSync("dump.txt", txt, "utf8");
      console.log("fin");
      // fs.writeFileSync("wayback.json", JSON.stringify(result, null, 4));
    } else {
      console.log("NO DATA?");
    }

  }catch(e){
    console.log('Error', e)
    process.exit(0)
  }
}

run()