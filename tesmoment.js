const moment = require("moment");
const localize = require("moment/locale/id");
// moment.updateLocale("id", localize);

function convert(time) {
  const data = {
    hari: moment(time).local("id").format("dddd"),
    tanggal: moment(time).local("id").format("LL"),
    jam: parseInt(moment(time).local("id").format("HH")),
    menit: moment(time).local("id").format("mm"),
  };

  return data;
}

// const result = convert(1693764900000);

// console.log(result.hari);
// console.log(result.tanggal);
// console.log(result.jam);
// console.log(result.menit);

module.exports = convert;
