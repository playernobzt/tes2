const qrcode = require("qrcode-terminal");
const convert = require("./tesmoment");
const axios = require("axios");
const { Client, LocalAuth, MessageMedia } = require("whatsapp-web.js");
const client = new Client({
  authStrategy: new LocalAuth(),
  puppeteer: {
    args: ["--no-sandbox"],
  },
});

client.on("qr", (qr) => {
  qrcode.generate(qr, { small: true });
});

client.on("ready", () => {
  console.log("Client is ready!");
});

client.on("message", async (msg) => {
  const chat = await msg.getContact();
  const namaPengirim = chat.pushname;
  const noPengirim = chat.number;
  const pesan = await msg.getChat();
  const waktupesan = pesan.timestamp;

  const attachmentData = (await msg.downloadMedia()).mimetype;

  if (pesan.isGroup && msg.hasMedia && attachmentData == "image/jpeg") {
    const result = convert(waktupesan * 1000);
    const keterangan = result.jam < 16 ? "Masuk" : "Pulang";
    const keterangan2 =
      result.jam >= 9 && result.jam <= 16 ? "Mar *TERLAMBAT*" : "";

    axios
      .get(
        `https://script.google.com/macros/s/AKfycbwkGMkfLFCv1LIA87kOYJdvzQ74kgr4UUHAKrNj5uX0rdYg6pS2Pw4VaoaILk-Kl00biQ/exec?action=register&keterangan=${keterangan}&tanggal=${result.tanggal}&jam=${result.jam}:${result.menit}&hari=${result.hari}&nama=${namaPengirim}&whatsapp=${noPengirim}`
      )
      .then(async (response) => {
        const { succsess, data } = response.data;
        if (succsess) {
          msg.react("👌");
          client.sendMessage(
            "6282347431338@c.us",
            `Lapor Bos !!\n\n*${namaPengirim}* so ba absen *${keterangan}* ${keterangan2}`
          );
        }
      });
  }
});

client.initialize();
