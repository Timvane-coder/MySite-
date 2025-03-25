module.exports = async (ptz, m) => {
const { type, content, sender, pushName, isGroup, mtype } = m
try {
if (global.db.data == null) await loadDatabase()
    require('./src/schema')(m);
    var chats = global.db.data.chats[m.chat],
        users = global.db.data.users[m.sender]
        settings = global.db.data.settings
const body = (
  m.mtype === 'conversation' ? m.message.conversation :
  m.mtype === 'imageMessage' ? m.message.imageMessage.caption :
  m.mtype === 'videoMessage' ? m.message.videoMessage.caption :
  m.mtype === 'extendedTextMessage' ? m.message.extendedTextMessage.text :
  m.mtype === 'buttonsResponseMessage' ? m.message.buttonsResponseMessage.selectedButtonId :
  m.mtype === 'listResponseMessage' ? m.message.listResponseMessage.singleSelectReply.selectedRowId :
  m.mtype === 'InteractiveResponseMessage' ? JSON.parse(m.message.interactiveResponseMessage.nativeFlowResponseMessage.paramsJson)?.id :
  m.mtype === 'templateButtonReplyMessage' ? m.message.templateButtonReplyMessage.selectedId :
  m.mtype === 'messageContextInfo' ?
    m.message.buttonsResponseMessage?.selectedButtonId ||
    m.message.listResponseMessage?.singleSelectReply.selectedRowId ||
    m.message.InteractiveResponseMessage.NativeFlowResponseMessage ||
    m.text :
  ''
);

//Database 
const pendaftar = JSON.parse(fs.readFileSync('./lib/database/pendaftar.json'))
let limitnya = db.data.users[m?.sender].limit
let balancenya = db.data.users[m?.sender].balance
const isSticker = (type == 'stickerMessage')
const isImage = (type == 'imageMessage')
const isVideo = (type == 'videoMessage')
const isAudio = (type == 'audioMessage')

const isQuotedImage = type === 'extendedTextMessage' && content.includes('imageMessage')
const isQuotedVideo = type === 'extendedTextMessage' && content.includes('videoMessage')
const isQuotedSticker = type === 'extendedTextMessage' && content.includes('stickerMessage')
const isQuotedAudio = type === 'extendedTextMessage' && content.includes('audioMessage')
const isQuotedTeks = type === 'extendedTextMessage' && content.includes('quotedMessage')
const isQuotedTag = type === 'extendedTextMessage' && content.includes('mentionedJid')
const isQuotedReply = type === 'extendedTextMessage' && content.includes('Message')
const isQuotedText = type === 'extendedTextMessage' && content.includes('conversation')
const isQuotedViewOnce = type === 'extendedTextMessage' && content.includes('viewOnceMessageV2')

const budy = (typeof m.text === 'string') ? m.text : '';
const from = m.key.remoteJid
const prefixRegex = /^[°zZ#$@*+,.?=''():√%!¢£¥€π¤ΠΦ_&><`™©®Δ^βα~¦|/\\©^]/;
const fatkuns = m && (m?.quoted || m);
const quoted = (fatkuns.mtype == 'buttonsMessage') ? fatkuns[Object.keys(fatkuns)[1]] : (fatkuns.mtype == 'templateMessage') ? fatkuns.hydratedTemplate[Object.keys(fatkuns.hydratedTemplate)[1]] : (fatkuns.mtype == 'product') ? fatkuns[Object.keys(fatkuns)[0]] : m.quoted ? m.quoted : m
const prefix = prefixRegex.test(body) ? body.match(prefixRegex)[0] : '.';
const isCmd = body.startsWith(prefix);
const mime = ((quoted?.msg || quoted) || {}).mimetype || '';
const command = isCmd ? body.slice(prefix.length).trim().split(' ').shift().toLowerCase() : '';
const args = body.trim().split(/ +/).slice(1)
const canvas = createCanvas(700, 250);
const ctx = canvas.getContext('2d');
const text = q = args.join(" ")
const sender = m.key.fromMe ? (ptz.user.id.split(':')[0]+'@s.whatsapp.net' || ptz.user.id) : (m.key.participant || m.key.remoteJid)
const botNumber = await ptz.decodeJid(ptz.user.id)
const senderNumber = sender.split('@')[0]
const isCreator = [ptz.decodeJid(ptz.user.id), ...global.rowner.map(([number]) => number), ].map((v) => v.replace(/[^0-9]/g, "") + "@s.whatsapp.net").includes(m.sender);
const pushname = m.pushName || `${senderNumber}`
const isBot = botNumber.includes(senderNumber)
const isUser = pendaftar.includes(m.sender)
const isMedia = /image|video|sticker|audio/.test(mime)
const qmsg = (quoted.msg || quoted)
let who = m.mentionedJid && m.mentionedJid[0] ? m.mentionedJid[0] : m.quoted ? m.quoted.sender : m.sender;
const isPremium = db.data.users[m?.sender].premium == true ? true : m?.sender == rowner ? true : false
const welcm = m.isGroup ? wlcm.includes(from) : false
// GROUP
const groupMetadata = m?.isGroup ? await ptz.groupMetadata(m?.chat).catch(e => {}) : {};
//SCRAPE
const uploadImage = require('./lib/uploadImage.js')
let Button = require("./lib/button");
let btn = new Button();
//Group 
const groupName = m?.isGroup ? groupMetadata.subject || '' : '';
const participants = m?.isGroup ? await groupMetadata.participants || [] : [];
const groupAdmins = m?.isGroup ? await getGroupAdmins(participants) || [] : [];
const isBotAdmins = m?.isGroup ? groupAdmins.includes(botNumber) : false;
const isAdmins = m?.isGroup ? groupAdmins.includes(m?.sender) : false;
const isPetualang = users.petualang
const isMonay = users.balance
const isCekDarah = users.darah
const isUmpan = users.umpan
//const isSewa = _sewa.checkSewaGroup(from, sewa)
const isPotion = users.potion
const isIkan = users.ikan
const isAyam = users.ayam
const isKelinci = users.kelinci
const isDomba = users.domba
const isSapi = users.sapi
const isGajah = users.gajah
const isBesi = users.besi
const isEmas = users.emas
const isEmerald = users.emerald
//Functions

async function uselimit() {
if (isCreator) return
global.db.data.users[m?.sender].limit -= 1

try {
let id = m.chat;
let timeout = 180000;
let hadiah = randomNumber(10000, 20000);
let users = global.db.data.users[m.sender];
let budy = typeof m.body == 'string' ? m.body : false;
ptz.bomb = ptz.bomb ? ptz.bomb : {};

if (ptz.bomb[id] && !isNaN(body) && !isCmd) {
let json = ptz.bomb[id][1].find(v => v.position == body);
if (!json) return
if (json.emot == '💥') {
json.state = true;
let bomb = ptz.bomb[id][1];
let teks = `*DUARRRRRR 💥*\n\n`;
teks += bomb.slice(0, 3).map(v => v.state ? v.emot : v.number).join('') + '\n';
teks += bomb.slice(3, 6).map(v => v.state ? v.emot : v.number).join('') + '\n';
teks += bomb.slice(6).map(v => v.state ? v.emot : v.number).join('') + '\n\n';
teks += `@${m.sender.split("@")[0]} membuka kotak yang berisi *Bom* Game di hentikan!`
ptz.sendMessage(m.chat, {text: teks, contextInfo: {mentionedJid: [m.sender], externalAdReply: {thumbnailUrl: "https://telegra.ph/file/da5e5612ccead39af2e93.jpg", title: " 🎮  𝗚 𝗔 𝗠 𝗘 - 𝗧 𝗘 𝗕 𝗔 𝗞 - 𝗕 𝗢 𝗢 𝗠  🎮", body: null, renderLargerThumbnail: true, sourceUrl: null, mediaType: 1}}}, {quoted: kalgans}).then(() => {
clearTimeout(ptz.bomb[id][2]);
delete ptz.bomb[id];
});
} else if (json.state) {
return ptz.sendText(m.chat, `Kotak ${json.number} sudah di buka silahkan pilih kotak yang lain!`, m);
} else {
json.state = true;
let changes = ptz.bomb[id][1];
let open = changes.filter(v => v.state && v.emot != '💥').length;

if (open >= 8) {
let teks = `*🎮 GAME TEBAK BOM 🎮*\n\nKirim angka *1* - *9* untuk membuka *9* kotak nomor di bawah ini :\n\n`;
teks += changes.slice(0, 3).map(v => v.state ? v.emot : v.number).join('') + '\n';
teks += changes.slice(3, 6).map(v => v.state ? v.emot : v.number).join('') + '\n';
teks += changes.slice(6).map(v => v.state ? v.emot : v.number).join('') + '\n\n';
teks += `*Permainan selesai!* kotak berisi bom tidak terbuka\n*+ $${toRupiah(hadiah)} balance* ke @${m.sender.split("@")[0]}`;

ptz.sendMessage(m.chat, {text: teks, contextInfo: {mentionedJid: [m.sender]}}, {quoted: kalgans}).then(() => {
db.data.users[m.sender].balance += hadiah;
clearTimeout(ptz.bomb[id][2]);
delete ptz.bomb[id];
});
} else {
let teks = `*🎮 GAME TEBAK BOM 🎮*\n\nKirim angka *1* - *9* untuk membuka *9* kotak nomor di bawah ini :\n\n`;
teks += changes.slice(0, 3).map(v => v.state ? v.emot : v.number).join('') + '\n';
teks += changes.slice(3, 6).map(v => v.state ? v.emot : v.number).join('') + '\n';
teks += changes.slice(6).map(v => v.state ? v.emot : v.number).join('') + '\n\n';
teks += `Waktu : *${((timeout / 1000) / 60)} menit*\n`;
teks += `Kotak berisi bom tidak terbuka\n*+ $${toRupiah(hadiah)} balance* ke @${m.sender.split("@")[0]}`;

ptz.sendMessage(m.chat, {text: teks, contextInfo: {mentionedJid: [m.sender]}}, {quoted: kalgans}).then(() => {
db.data.users[m.sender].balance += hadiah;
});
}
}
}
} catch (e) {
return ptz.sendText(m.chat, e.toString(), m);
}

if ((from in tebakgambar2)) {
let { soal, jawaban, hadiah, waktu } = tebakgambar2[from]
if (budy.toLowerCase() == "nyerah") {
m.reply(`*KAMU PAYAH ಠ⁠﹏⁠ಠ*\n\nJawabannya adalah *${tebakgambar2[from].jawaban}*`);
delete tebakgambar2[from]
clearTimeout(waktu);
} else if (body.toLowerCase().includes(jawaban)) {
await m.reply(`*JAWABAN BENAR*\n\n*Penebak :* ${tag}\n*Jawaban :* ${jawaban}\n*Hadiah Saldo :* Rp. 150`);
ptz.sendMessage(m.chat, {react: {text: '🟢', key: m.key}})
users.balance += 150
clearTimeout(waktu);
delete tebakgambar2[from];
} else ptz.sendMessage(sender, {react: {text: '❌', key: m.key}})
}

switch(command) {

module.exports = async (ptz, m) => {
const { type, content, sender, pushName, isGroup, mtype } = m
try {
if (global.db.data == null) await loadDatabase()
    require('./src/schema')(m);
    var chats = global.db.data.chats[m.chat],
        users = global.db.data.users[m.sender]
        settings = global.db.data.settings
const body = (
  m.mtype === 'conversation' ? m.message.conversation :
  m.mtype === 'imageMessage' ? m.message.imageMessage.caption :
  m.mtype === 'videoMessage' ? m.message.videoMessage.caption :
  m.mtype === 'extendedTextMessage' ? m.message.extendedTextMessage.text :
  m.mtype === 'buttonsResponseMessage' ? m.message.buttonsResponseMessage.selectedButtonId :
  m.mtype === 'listResponseMessage' ? m.message.listResponseMessage.singleSelectReply.selectedRowId :
  m.mtype === 'InteractiveResponseMessage' ? JSON.parse(m.message.interactiveResponseMessage.nativeFlowResponseMessage.paramsJson)?.id :
  m.mtype === 'templateButtonReplyMessage' ? m.message.templateButtonReplyMessage.selectedId :
  m.mtype === 'messageContextInfo' ?
    m.message.buttonsResponseMessage?.selectedButtonId ||
    m.message.listResponseMessage?.singleSelectReply.selectedRowId ||
    m.message.InteractiveResponseMessage.NativeFlowResponseMessage ||
    m.text :
  ''
);

//Database 
const pendaftar = JSON.parse(fs.readFileSync('./lib/database/pendaftar.json'))
let limitnya = db.data.users[m?.sender].limit
let balancenya = db.data.users[m?.sender].balance
const isSticker = (type == 'stickerMessage')
const isImage = (type == 'imageMessage')
const isVideo = (type == 'videoMessage')
const isAudio = (type == 'audioMessage')

const isQuotedImage = type === 'extendedTextMessage' && content.includes('imageMessage')
const isQuotedVideo = type === 'extendedTextMessage' && content.includes('videoMessage')
const isQuotedSticker = type === 'extendedTextMessage' && content.includes('stickerMessage')
const isQuotedAudio = type === 'extendedTextMessage' && content.includes('audioMessage')
const isQuotedTeks = type === 'extendedTextMessage' && content.includes('quotedMessage')
const isQuotedTag = type === 'extendedTextMessage' && content.includes('mentionedJid')
const isQuotedReply = type === 'extendedTextMessage' && content.includes('Message')
const isQuotedText = type === 'extendedTextMessage' && content.includes('conversation')
const isQuotedViewOnce = type === 'extendedTextMessage' && content.includes('viewOnceMessageV2')

const budy = (typeof m.text === 'string') ? m.text : '';
const from = m.key.remoteJid
const prefixRegex = /^[°zZ#$@*+,.?=''():√%!¢£¥€π¤ΠΦ_&><`™©®Δ^βα~¦|/\\©^]/;
const fatkuns = m && (m?.quoted || m);
const quoted = (fatkuns.mtype == 'buttonsMessage') ? fatkuns[Object.keys(fatkuns)[1]] : (fatkuns.mtype == 'templateMessage') ? fatkuns.hydratedTemplate[Object.keys(fatkuns.hydratedTemplate)[1]] : (fatkuns.mtype == 'product') ? fatkuns[Object.keys(fatkuns)[0]] : m.quoted ? m.quoted : m
const prefix = prefixRegex.test(body) ? body.match(prefixRegex)[0] : '.';
const isCmd = body.startsWith(prefix);
const mime = ((quoted?.msg || quoted) || {}).mimetype || '';
const command = isCmd ? body.slice(prefix.length).trim().split(' ').shift().toLowerCase() : '';
const args = body.trim().split(/ +/).slice(1)
const canvas = createCanvas(700, 250);
const ctx = canvas.getContext('2d');
const text = q = args.join(" ")
const sender = m.key.fromMe ? (ptz.user.id.split(':')[0]+'@s.whatsapp.net' || ptz.user.id) : (m.key.participant || m.key.remoteJid)
const botNumber = await ptz.decodeJid(ptz.user.id)
const senderNumber = sender.split('@')[0]
const isCreator = [ptz.decodeJid(ptz.user.id), ...global.rowner.map(([number]) => number), ].map((v) => v.replace(/[^0-9]/g, "") + "@s.whatsapp.net").includes(m.sender);
const pushname = m.pushName || `${senderNumber}`
const isBot = botNumber.includes(senderNumber)
const isUser = pendaftar.includes(m.sender)
const isMedia = /image|video|sticker|audio/.test(mime)
const qmsg = (quoted.msg || quoted)
let who = m.mentionedJid && m.mentionedJid[0] ? m.mentionedJid[0] : m.quoted ? m.quoted.sender : m.sender;
const isPremium = db.data.users[m?.sender].premium == true ? true : m?.sender == rowner ? true : false
const welcm = m.isGroup ? wlcm.includes(from) : false
// GROUP
const groupMetadata = m?.isGroup ? await ptz.groupMetadata(m?.chat).catch(e => {}) : {};
//SCRAPE
const uploadImage = require('./lib/uploadImage.js')
let Button = require("./lib/button");
let btn = new Button();
//Group 
const groupName = m?.isGroup ? groupMetadata.subject || '' : '';
const participants = m?.isGroup ? await groupMetadata.participants || [] : [];
const groupAdmins = m?.isGroup ? await getGroupAdmins(participants) || [] : [];
const isBotAdmins = m?.isGroup ? groupAdmins.includes(botNumber) : false;
const isAdmins = m?.isGroup ? groupAdmins.includes(m?.sender) : false;
const isPetualang = users.petualang
const isMonay = users.balance
const isCekDarah = users.darah
const isUmpan = users.umpan
//const isSewa = _sewa.checkSewaGroup(from, sewa)
const isPotion = users.potion
const isIkan = users.ikan
const isAyam = users.ayam
const isKelinci = users.kelinci
const isDomba = users.domba
const isSapi = users.sapi
const isGajah = users.gajah
const isBesi = users.besi
const isEmas = users.emas
const isEmerald = users.emerald
//Functions

async function uselimit() {
if (isCreator) return
global.db.data.users[m?.sender].limit -= 1

try {
let id = m.chat;
let timeout = 180000;
let hadiah = randomNumber(10000, 20000);
let users = global.db.data.users[m.sender];
let budy = typeof m.body == 'string' ? m.body : false;
ptz.bomb = ptz.bomb ? ptz.bomb : {};

if (ptz.bomb[id] && !isNaN(body) && !isCmd) {
let json = ptz.bomb[id][1].find(v => v.position == body);
if (!json) return
if (json.emot == '💥') {
json.state = true;
let bomb = ptz.bomb[id][1];
let teks = `*DUARRRRRR 💥*\n\n`;
teks += bomb.slice(0, 3).map(v => v.state ? v.emot : v.number).join('') + '\n';
teks += bomb.slice(3, 6).map(v => v.state ? v.emot : v.number).join('') + '\n';
teks += bomb.slice(6).map(v => v.state ? v.emot : v.number).join('') + '\n\n';
teks += `@${m.sender.split("@")[0]} membuka kotak yang berisi *Bom* Game di hentikan!`
ptz.sendMessage(m.chat, {text: teks, contextInfo: {mentionedJid: [m.sender], externalAdReply: {thumbnailUrl: "https://telegra.ph/file/da5e5612ccead39af2e93.jpg", title: " 🎮  𝗚 𝗔 𝗠 𝗘 - 𝗧 𝗘 𝗕 𝗔 𝗞 - 𝗕 𝗢 𝗢 𝗠  🎮", body: null, renderLargerThumbnail: true, sourceUrl: null, mediaType: 1}}}, {quoted: kalgans}).then(() => {
clearTimeout(ptz.bomb[id][2]);
delete ptz.bomb[id];
});
} else if (json.state) {
return ptz.sendText(m.chat, `Kotak ${json.number} sudah di buka silahkan pilih kotak yang lain!`, m);
} else {
json.state = true;
let changes = ptz.bomb[id][1];
let open = changes.filter(v => v.state && v.emot != '💥').length;

if (open >= 8) {
let teks = `*🎮 GAME TEBAK BOM 🎮*\n\nKirim angka *1* - *9* untuk membuka *9* kotak nomor di bawah ini :\n\n`;
teks += changes.slice(0, 3).map(v => v.state ? v.emot : v.number).join('') + '\n';
teks += changes.slice(3, 6).map(v => v.state ? v.emot : v.number).join('') + '\n';
teks += changes.slice(6).map(v => v.state ? v.emot : v.number).join('') + '\n\n';
teks += `*Permainan selesai!* kotak berisi bom tidak terbuka\n*+ $${toRupiah(hadiah)} balance* ke @${m.sender.split("@")[0]}`;

ptz.sendMessage(m.chat, {text: teks, contextInfo: {mentionedJid: [m.sender]}}, {quoted: kalgans}).then(() => {
db.data.users[m.sender].balance += hadiah;
clearTimeout(ptz.bomb[id][2]);
delete ptz.bomb[id];
});
} else {
let teks = `*🎮 GAME TEBAK BOM 🎮*\n\nKirim angka *1* - *9* untuk membuka *9* kotak nomor di bawah ini :\n\n`;
teks += changes.slice(0, 3).map(v => v.state ? v.emot : v.number).join('') + '\n';
teks += changes.slice(3, 6).map(v => v.state ? v.emot : v.number).join('') + '\n';
teks += changes.slice(6).map(v => v.state ? v.emot : v.number).join('') + '\n\n';
teks += `Waktu : *${((timeout / 1000) / 60)} menit*\n`;
teks += `Kotak berisi bom tidak terbuka\n*+ $${toRupiah(hadiah)} balance* ke @${m.sender.split("@")[0]}`;

ptz.sendMessage(m.chat, {text: teks, contextInfo: {mentionedJid: [m.sender]}}, {quoted: kalgans}).then(() => {
db.data.users[m.sender].balance += hadiah;
});
}
}
}
} catch (e) {
return ptz.sendText(m.chat, e.toString(), m);
}

if ((from in tebakgambar2)) {
let { soal, jawaban, hadiah, waktu } = tebakgambar2[from]
if (budy.toLowerCase() == "nyerah") {
m.reply(`*KAMU PAYAH ಠ⁠﹏⁠ಠ*\n\nJawabannya adalah *${tebakgambar2[from].jawaban}*`);
delete tebakgambar2[from]
clearTimeout(waktu);
} else if (body.toLowerCase().includes(jawaban)) {
await m.reply(`*JAWABAN BENAR*\n\n*Penebak :* ${tag}\n*Jawaban :* ${jawaban}\n*Hadiah Saldo :* Rp. 150`);
ptz.sendMessage(m.chat, {react: {text: '🟢', key: m.key}})
users.balance += 150
clearTimeout(waktu);
delete tebakgambar2[from];
} else ptz.sendMessage(sender, {react: {text: '❌', key: m.key}})
}


Complete the game using the code below

switch(command) {
case 'tebakgambar':
  if (from in tebakgambar2) return m.reply('🚨 You still have an ongoing game.');

  var { img, jawaban, deskripsi } = pickRandom(JSON.parse(fs.readFileSync('./media/game/tebakgambar.json')));
  console.log('Jawaban : ' + jawaban);

  let userItems = users.inventory || {};
  let availableItems = Object.keys(userItems).filter(i => userItems[i] > 0);
  
  let itemText = availableItems.length > 0 
    ? `🎒 *Your Items Available to Use*\n${availableItems.map(i => `🔹 ${i.replace(/_/g, " ")} (${userItems[i]}x)`).join("\n")}\n\nUse: *use <item>*`
    : `❌ No items available.`;

  var teks1 = `🎮 *Tebak Gambar Game*\n\n🖼️ Image Below!\n🔍 Clue: ${monospace(jawaban.replace(/[bcdfghjklmnpqrstvwxyz]/gi, '-'))}\n📜 Description: ${deskripsi}\n🕒 Time: ${gamewaktu} seconds\n\n${itemText}`;

  await ptz.sendMessage(from, { image: { url: img }, caption: teks1 }, { quoted: m });

  tebakgambar2[from] = {
    soal: img,
    jawaban: jawaban.toLowerCase(),
    hadiah: randomNomor(10, 20),
    waktu: setTimeout(() => {
      if (tebakgambar2[from]) {
        m.reply(`⏳ Time's up!\nThe correct answer was: ${tebakgambar2[from].jawaban}`);
        delete tebakgambar2[from];
      }
    }, gamewaktu * 1000)
  };
  break;

case 'shop':
  let shopText = `🛒 *Tebak Gambar Shop*\n\n`;

  shopItems.forEach(item => {
    shopText += `🛍️ *${item.name}*\n`;
    shopText += `💰 Price: ${item.price} coins\n`;
    shopText += `📜 ${item.description}\n`;
    shopText += `🆔 ID: ${item.index}\n`;
    shopText += `🖼️ Image: ${item.img}\n\n`;
  });

  shopText += `🔹 Use *buy <ID>* to purchase an item.`;

  ptz.sendMessage(m.chat, { text: shopText }, { quoted: m });
  break;

case 'buy':
  if (!args[0]) return m.reply('🔹 Use *buy <ID>* to purchase an item.');

  let shopItems = JSON.parse(fs.readFileSync('./media/game/shop.json'));
  let itemId = parseInt(args[0]);
  let item = shopItems.find(i => i.index === itemId);

  if (!item) return m.reply('⚠️ Invalid item ID.');

  if (users.balance < item.price) return m.reply('❌ You don\'t have enough coins.');

  users.balance -= item.price;
  if (!users.inventory) users.inventory = {};
  let itemKey = item.name.toLowerCase().replace(/\s+/g, "_");
  users.inventory[itemKey] = (users.inventory[itemKey] || 0) + 1;

  m.reply(`✅ You purchased *${item.name}* for 💰 ${item.price} coins.`);
  break;

case 'buy':
  if (!args[0]) return m.reply('🔹 Use *buy <ID>* to purchase an item.');

  let shopItems = JSON.parse(fs.readFileSync('./media/game/shop.json'));
  let itemId = parseInt(args[0]);
  let item = shopItems.find(i => i.index === itemId);

  if (!item) return m.reply('⚠️ Invalid item ID.');

  if (users.balance < item.price) return m.reply('❌ You don\'t have enough coins.');

  users.balance -= item.price;
  if (!users.inventory) users.inventory = {};
  let itemKey = item.name.toLowerCase().replace(/\s+/g, "_");
  users.inventory[itemKey] = (users.inventory[itemKey] || 0) + 1;

  m.reply(`✅ You purchased *${item.name}* for 💰 ${item.price} coins.`);
  break;

case 'inventory':
  let invText = `🎒 *Your Inventory*\n\n`;
  let shopItems = JSON.parse(fs.readFileSync('./media/game/shop.json'));

  if (!users.inventory || Object.keys(users.inventory).length === 0) {
    invText += "Your inventory is empty.";
  } else {
    for (let item in users.inventory) {
      let itemInfo = shopItems.find(i => i.name.toLowerCase().replace(/\s+/g, "_") === item);
      invText += `🔹 ${itemInfo.name} - ${users.inventory[item]}x\n`;
      invText += `🖼️ ${itemInfo.img}\n\n`;
    }
  }

  ptz.sendMessage(m.chat, { text: invText }, { quoted: m });
  break;

case 'use':
  if (!args[0]) return m.reply('🔹 Use *use <item>* to activate an item.');

  let itemName = args.join("_").toLowerCase();
  let userItems = users.inventory || {};
  
  if (!userItems[itemName] || userItems[itemName] <= 0) {
    return m.reply(`❌ You don't have *${itemName.replace(/_/g, " ")}*.`);
  }

  if (!(from in tebakgambar2)) {
    return m.reply('❌ You can only use items during the game.');
  }

  switch (itemName) {
    case "extra_time":
      clearTimeout(tebakgambar2[from].waktu);
      tebakgambar2[from].waktu = setTimeout(() => {
        if (tebakgambar2[from]) {
          m.reply(`⏳ Time's up!\nThe correct answer was: ${tebakgambar2[from].jawaban}`);
          delete tebakgambar2[from];
        }
      }, (gamewaktu + 10) * 1000);
      m.reply('⏳ *Extra Time Activated!* +10 seconds added.');
      break;

    case "skip_question":
      delete tebakgambar2[from];
      m.reply('⏭️ *Question Skipped!*');
      break;

    case "auto_guess":
      m.reply(`🤖 *Auto Guess Activated!* The correct answer is: *${tebakgambar2[from].jawaban}*`);
      delete tebakgambar2[from];
      break;

    case "double_reward":
      tebakgambar2[from].hadiah *= 2;
      m.reply('💰 *Double Reward Activated!* You will earn double coins for this round.');
      break;

    case "auto_reveal_hint":
      let hint = tebakgambar2[from].jawaban.slice(0, Math.ceil(tebakgambar2[from].jawaban.length / 2));
      m.reply(`💡 *Auto Reveal Hint Activated!*\nThe hint: *${hint}...*`);
      break;

    default:
      return m.reply('⚠️ Invalid item.');
  }

  // Reduce the item count
  users.inventory[itemName]--;
  if (users.inventory[itemName] <= 0) delete users.inventory[itemName];

  break;
