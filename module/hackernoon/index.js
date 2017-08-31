const {csvFormat} = require('d3-dsv');
const Nightmare = require('nightmare');
const {readFileSync, writeFileSync} = require('fs');

const numbers = readFileSync('./tesco-title-numbers.csv',{encoding: 'utf8'}).trim().split('\r\n');


const START = 'https://eservices.landregistry.gov.uk/wps/portal/Property_Search';

class Scrap {

  async getAddress (id) {
    console.log(`Now checking ${id}`);
    const nightmare = new Nightmare({show: true});

    try {
      await nightmare
        .goto(START)
        .wait('.bodylinkcopy:first-child')
        .click('.bodylinkcopy:first-child');
    } catch (e) {
      console.error(e);
    }

    // Type the title number into the appropriate box; click submit
    try {
      await nightmare
        .wait('input[name="titleNo"]')
        .type('input[name="titleNo"]', id)
        .click('input[value="Search »"]');
    } catch (e) {
      console.error(e);
    }

    try {
      const result = await nightmare
        .wait('.w80p')
        .evaluate(() => {
          return [...document.querySelectorAll('.w80p')]
            .map(el => el.innerText);
        })
        .end();
      return {id, address: result[0], lease: result[1]};
    } catch (e) {
      console.error(e);
      return undefined;
    }
  };
}
/*getAddress(numbers[0])
  .then(a => console.dir(a))
  .catch(e => console.error(e));*/

const scrap = new Scrap();

const series = numbers.reduce(async (queue, number) => {
  const dataArray = await queue;
  dataArray.push(await scrap.getAddress(number));
  return dataArray;
}, Promise.resolve([]));

series.then(data => {
  const csvData = csvFormat(data.prepare(i => i));
  writeFileSync('./output.csv', csvData, {encoding: 'utf8'});
})
  .catch(e => console.error(e));