const { ryozingodConnect, downloadContentFromMessage, emitGroupParticipantsUpdate, emitGroupUpdate, generateWAMessageContent, generateWAMessage, makeInMemoryStore, prepareWAMessageMedia, generateWAMessageFromContent, MediaType, areJidsSameUser, WAMessageStatus, downloadAndSaveMediaMessage, AuthenticationState, GroupMetadata, initInMemoryKeyStore, getContentType, MiscMessageGenerationOptions, useSingleFileAuthState, BufferJSON, WAMessageProto, MessageOptions, WAFlag, WANode, WAMetric, ChatModification, MessageTypeProto, WALocationMessage, ReconnectMode, WAContextInfo, proto, WAGroupMetadata, ProxyAgent, waChatKey, MimetypeMap, MediaPathMap, WAContactMessage, WAContactsArrayMessage, WAGroupInviteMessage, WATextMessage, WAMessageContent, WAMessage, BaileysError, WA_MESSAGE_STATUS_TYPE, MediaConnInfo, URL_REGEX, WAUrlInfo, WA_DEFAULT_EPHEMERAL, WAMediaUpload, mentionedJid, processTime, Browser, MessageType, Presence, WA_MESSAGE_STUB_TYPES, Mimetype, relayWAMessage, Browsers, GroupSettingChange, DisconnectReason, WASocket, getStream, WAProto, isBaileys, AnyMessageContent, fetchLatestBaileysVersion, templateMessage, InteractiveMessage, Header } = require('@whiskeysockets/baileys')

require("./config")
const fs = require('fs')
const os = require('os');
const util = require('util')
const chalk = require("chalk");
const axios = require('axios')
const { exec } = require("child_process")
const { getYoutubeVideoInfo, getYoutubeMP4, getYoutubeMP3} = require('./lib/ytdl');
const {ytmp3,search} = require('./lib/youtube');
const { randomBytes } = require('crypto') 
const levelling = require("./lib/levelling");
const { formatSize, sleep, runtime, getBuffer, getRandom, fetchJson, jsonformat, toRupiah, getGroupAdmins, randomNumber } = require("./lib/myfunc");

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

const pendaftar = JSON.parse(fs.readFileSync('./lib/database/pendaftar.json'))

let limitnya = db.data.users[m?.sender].limit
let balancenya = db.data.users[m?.sender].balance

const { editmsg, IosShot, location, sendPaymentInfoMessage, coresix, zodyck, sendAnnotations } = require("./bug/system");

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


const welcm = m.isGroup ? wlcm.includes(from) : false
let Button = require("./lib/button");
let btn = new Button();

//Functions
async function uselimit() {
if (isCreator) return
global.db.data.users[m?.sender].limit -= 1
}


async function reply(txt) {
const RiooAjah = {      
contextInfo: {
forwardingScore: 999,
isForwarded: true,
forwardedNewsletterMessageInfo: {
newsletterName: botname,
newsletterJid: "120363192092636321@newsletter",
},
externalAdReply: {  
showAdAttribution: true,
title: `Anyone - MD V0.1.3`,
body: 'Subscribe My YouTube',
thumbnailUrl: 'https://telegra.ph/file/a474435589bd136998d19.jpg',
sourceUrl: 'https://www.youtube.com/@GhostXdzz2',
},
},
text: txt,
}
return ptz.sendMessage(m.chat, RiooAjah, {
quoted: m,
})
}

//ResponsGame

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

if ((from in caklontong)) {
let { soal, jawaban, hadiah, waktu } = caklontong[from]

if (budy.toLowerCase() == "nyerah") {
m.reply(`*KAMU PAYAH ಠ⁠﹏⁠ಠ*\n\nJawabannya adalah *${jawaban}*`);
delete caklontong[from];
clearTimeout(waktu);
} else if (body.toLowerCase().includes(jawaban)) {
await m.reply(`Selamat Jawaban Kamu Benar🥳\n\nSoalan:\n${monospace(soal)}\nJawaban: ${jawaban}\nHadiah: $${hadiah} balance`);
users.balance += hadiah
clearTimeout(waktu);
delete caklontong[from];
} else falseR()
}

if ((from in family100)) {
let { soal, jawaban, hadiah, waktu } = family100[from]
for (let i of jawaban){
if (body.toLowerCase().includes(i)) {
let anu = jawaban.indexOf(i)
jawaban.splice(anu, 1)
await m.reply(`*GAME FAMILY 100*\n\nJawaban kamu benar!\nJawaban: ${i}\nHadiah: $${hadiah}\n\n${jawaban.length < 1 ? 'Selamat semua jawaban sudah tertebak!\ningin bermain lagi? kirim '+prefix+'family100' : 'Jawaban yang belum tertebak: '+jawaban.length}`)
users.balance += hadiah
} else falseR()
}
if (budy.toLowerCase() == "nyerah") {
let teks = `*KAMU PAYAH ಠ⁠﹏⁠ಠ*\n\nJawabannya adalah\n`
let jwb = jawaban
for (let i of jwb){teks += `\n${i}`}
m.reply(teks)
delete family100[from];
clearTimeout(waktu);
}
if (jawaban.length < 1){
clearTimeout(waktu);
delete family100[from];
}
}

if ((from in tebakbendera)) {
let { soal, jawaban, hadiah, waktu } = tebakbendera[from]

if (budy.toLowerCase() == "nyerah") {
m.reply(`*KAMU PAYAH ಠ⁠﹏⁠ಠ*\n\nJawabannya adalah *${jawaban}*`);
delete tebakbendera[from];
clearTimeout(waktu);
} else if (body.toLowerCase().includes(jawaban)) {
await m.reply(`Selamat Jawaban Kamu Benar🥳\n\nSoalan: ${monospace(soal)}\nJawaban: ${jawaban}\nHadiah: $${hadiah} balance`);
users.balance += hadiah
clearTimeout(waktu);
delete tebakbendera[from];
} else falseR()
}

let roof = Object.values(suit).find(roof => roof.id && roof.status && [roof.p, roof.p2].includes(sender))
if (roof) {
let win = ''
let tie = false
if (sender == roof.p2 && /^(acc(ept)?|y|gas|oke?|tolak|gamau|nanti|ga(k.)?bisa|y)/i.test(body) && m.isGroup && roof.status == 'wait') {
if (/^(gamau|nanti|ga(k.)?bisa)/i.test(body)) {
global.db.data.users[m.sender].balance -= 1000
pokl = `@${roof.p2.split('@')[0]} menolak suit, suit dibatalkan\nDan player dikenakan sanksi -1000 balance karna menolak ajakan pemain`
await ptz.sendTextWithMentions(from, pokl, m)
delete suit[roof.id]
return !0
}
roof.status = 'play'
roof.asal = from
clearTimeout(roof.waktu)

teksbbb = `AYO PILIH SUIT MU`
ggy = `Suit telah dikirimkan ke chat

@${roof.p.split('@')[0]} dan @${roof.p2.split('@')[0]}

Silahkan pilih suit di nomor bot"
➩ wa.me/${botNumber.split('@')[0]}`
await ptz.sendMessage(m.chat, {text: 'Suit telah dikirimkan ke chat\nSilahkan pilih suit di chat masing²', contextInfo: {mentionedJid: [roof.p, roof.p2]}}, {quoted: m})
if (!roof.pilih) await ptz.sendTextWithMentions(roof.p, `*Silahkan pilih dibawah ini :*\n✂ Gunting\n📄 Kertas\n🗿 Batu\n\nContoh jika kamu ingin memilih gunting ketik *Gunting*`, m)
if (!roof.pilih2) await ptz.sendTextWithMentions(roof.p2, `*Silahkan pilih dibawah ini :*\n✂ Gunting\n📄 Kertas\n🗿 Batu\n\nContoh jika kamu ingin memilih gunting ketik *Gunting*`, m)
roof.waktu_milih = setTimeout(async() => {
if (!roof.pilih && !roof.pilih2) await ptz.sendMessage(from, {text: `Kedua pemain tidak niat main,\nSuit dibatalkan`})
else if (!roof.pilih || !roof.pilih2) {
win = !roof.pilih ? roof.p2 : roof.p
global.db.data.users[m.sender].balance -= 1000
sffp = `@${(roof.pilih ? roof.p2 : roof.p).split('@')[0]} tidak memilih suit, game berakhir\nDan Player dikenakan sanksi pengurangan Rp. 1,000 saldo karna menolak ajakan pemain`
await reply(sffp)
}
delete suit[roof.id]
return !0
}, roof.timeout)
}
let jwb = sender == roof.p
let jwb2 = sender == roof.p2
let g = /gunting/i
let b = /batu/i
let k = /kertas/i
let reg = /^(gunting|batu|kertas)/i
if (jwb && reg.test(body) && !roof.pilih && !m.isGroup) {
roof.pilih = reg.exec(budy.toLowerCase())[0]
roof.text = body
await ptz.sendMessage(from, {text: `Kamu telah memilih ${body} ${!roof.pilih2 ? `\n\nMenunggu lawan memilih` : ''}`}, {quoted:kalgans})
if (!roof.pilih2) await ptz.sendMessage(roof.p2, {text: '_Lawan sudah memilih_\nSekarang giliran kamu'})
}
if (jwb2 && reg.test(body) && !roof.pilih2 && !m.isGroup) {
roof.pilih2 = reg.exec(budy.toLowerCase())[0]
roof.text2 = body

tyu = `Kamu telah memilih ${body} ${!roof.pilih ? `\n\nMenunggu lawan memilih` : ''}`
await ptz.sendMessage(from, {text: tyu}, {quoted:m})

if (!roof.pilih) await ptz.sendMessage(roof.p, {text: '_Lawan sudah memilih_\nSekarang giliran kamu'})
}
let stage = roof.pilih
let stage2 = roof.pilih2
if (roof.pilih && roof.pilih2) {
clearTimeout(roof.waktu_milih)
if (b.test(stage) && g.test(stage2)) win = roof.p
else if (b.test(stage) && k.test(stage2)) win = roof.p2
else if (g.test(stage) && k.test(stage2)) win = roof.p
else if (g.test(stage) && b.test(stage2)) win = roof.p2
else if (k.test(stage) && b.test(stage2)) win = roof.p
else if (k.test(stage) && g.test(stage2)) win = roof.p2
else if (stage == stage2) tie = true
await ptz.sendTextWithMentions(roof.asal, `${tie ? '*HASIL SERI*\n\n' : ''}@${roof.p.split('@')[0]} *${roof.text}* ${tie ? '' : roof.p == win ? ' Menang' : ' Kalah'}\n@${roof.p2.split('@')[0]} *${roof.text2}* ${tie ? '' : roof.p2 == win ? ' Menang' : ' Kalah'}${tie ? '' : '\n\nHadiah Balance : 1000 '}`)
if (roof.p == win) {
global.db.data.users[roof.p].balance += 1000
} else if (roof.p2 == win) {
global.db.data.users[roof.p2].balance += 1000
}
delete suit[roof.id]
}
}


const isTicTacToe = (from, _dir) => {
let status = false
Object.keys(_dir).forEach((i) => {
if (_dir[i].id === from) {
status = true
}
})
return status
}
const getPosTic = (from, _dir) => {
let position = null
Object.keys(_dir).forEach((i) => {
if (_dir[i].id === from) {
position = i
}
})
if (position !== null) {
return position
}
}
const KeisiSemua = (tic) => {
let status = true
for (let i of tic){
if (i !== '❌' && i !== '⭕'){
status = false
}
}
return status
}
const cekIsi = (nomor, tic) => {
let status = false
if (tic[nomor] === '❌' || tic[nomor] === '⭕'){
status = true
}
return status
}
const cekTicTac = (tic) => {
let status = false
if (tic[0] === '❌' && tic[1] === '❌' && tic[2] === '❌' || tic[0] === '⭕' && tic[1]=== '⭕' && tic[2] === '⭕'){
status = true
} else if (tic[3] === '❌' && tic[4] === '❌' && tic[5] === '❌' || tic[3] === '⭕' && tic[4] === '⭕' && tic[5] === '⭕'){
status = true
} else if (tic[6] === '❌' && tic[7] === '❌' && tic[8] === '❌' || tic[6] === '⭕' && tic[7] === '⭕' && tic[8] === '⭕'){
status = true
} else if (tic[0] === '❌' && tic[3] === '❌' && tic[6] === '❌' || tic[0] === '⭕' && tic[3] === '⭕' && tic[6] === '⭕'){
status = true
} else if (tic[1] === '❌' && tic[4] === '❌' && tic[7] === '❌' || tic[1] === '⭕' && tic[4] === '⭕' && tic[7] === '⭕'){
status = true
} else if (tic[2] === '❌' && tic[5] === '❌' && tic[8] === '❌' || tic[2] === '⭕' && tic[5] === '⭕' && tic[8] === '⭕'){
status = true
} else if (tic[0] === '❌' && tic[4] === '❌' && tic[8] === '❌' || tic[0] === '⭕' && tic[4] === '⭕' && tic[8] === '⭕'){
status = true
} else if (tic[2] === '❌' && tic[4] === '❌' && tic[6] === '❌' || tic[2] === '⭕' && tic[4] === '⭕' && tic[6] === '⭕'){
status = true
}
return status 
}
if (isTicTacToe(from, tictactoe)) {
try {
// TicTacToe
if (isTicTacToe(from, tictactoe)){
let nomor = [1, 2, 3, 4, 5, 6, 7, 8, 9]
let posi = tictactoe[from]
let anu = posi.TicTacToe
if (posi.status === null){
if (sender === posi.ditantang){
if (body.toLowerCase() === 'y'){
the = `@${posi.ditantang.split('@')[0]} menerima tantangan

@${posi.penantang.split('@')[0]} = ❌
@${posi.ditantang.split('@')[0]} = ⭕

${anu[0]}${anu[1]}${anu[2]}
${anu[3]}${anu[4]}${anu[5]}
${anu[6]}${anu[7]}${anu[8]}

Giliran @${posi.penantang.split('@')[0]}`
ptz.sendText(from, the, m)

tictactoe[from].status = true
} else if (body.toLowerCase() === 'n'){
db.data.users[m.sender].balance -= 100
the1 = `@${posi.ditantang.split('@')[0]} menolak, game dibatalkan\nDan Player dikenakan sanksi -100 balance karna menolak ajakan pemain`
ptz.sendText(from, the1, m)
delete tictactoe[from];
}
}
} else if (posi.status === true){
if (sender === posi.penantang){
for (let i of nomor){
if (Number(body) === i){
if (cekIsi(Number(body) - 1, anu)) return m.reply(`Nomor tersebut sudah terisi`)
tictactoe[from].TicTacToe[Number(body) - 1] = '❌'
if (cekTicTac(tictactoe[from].TicTacToe)){
the2 = `@${posi.penantang.split('@')[0]} Menang

@${posi.penantang.split('@')[0]} = ❌
@${posi.ditantang.split('@')[0]} = ⭕

${anu[0]}${anu[1]}${anu[2]}
${anu[3]}${anu[4]}${anu[5]}
${anu[6]}${anu[7]}${anu[8]}

Hadiah : ${posi.hadiah} balance
Ingin bermain lagi? ${prefix}tictactoe`
ptz.sendText(from, the2, m)
global.db.data.users[posi.penantang].balance += posi.hadiah
global.db.data.users[posi.ditantang].balance -= posi.hadiah
delete tictactoe[from];
} else if (KeisiSemua(anu)) {
the3 = `*HASIL SERI*

@${posi.penantang.split('@')[0]} = ❌
@${posi.ditantang.split('@')[0]} = ⭕

${anu[0]}${anu[1]}${anu[2]}
${anu[3]}${anu[4]}${anu[5]}
${anu[6]}${anu[7]}${anu[8]}

Ingin bermain lagi? ${prefix}tictactoe`
ptz.sendText(from, the3, m)

delete tictactoe[from];
} else {
the4 = `@${posi.penantang.split('@')[0]} telah mengisi

@${posi.penantang.split('@')[0]} = ❌
@${posi.ditantang.split('@')[0]} = ⭕

${anu[0]}${anu[1]}${anu[2]}
${anu[3]}${anu[4]}${anu[5]}
${anu[6]}${anu[7]}${anu[8]}

Giliran @${posi.ditantang.split('@')[0]}`
ptz.sendText(from, the4, m)

tictactoe[from].status = false
}
}
}
}
} else if (posi.status === false){
if (sender === posi.ditantang){
for (let i of nomor){
if (Number(body) === i){
if (cekIsi(Number(body) - 1, anu)) return m.reply(`Nomor tersebut sudah terisi`)
tictactoe[from].TicTacToe[Number(body) - 1] = '⭕' 
if (cekTicTac(anu)){
the5 = `@${posi.ditantang.split('@')[0]} Menang

@${posi.penantang.split('@')[0]} = ❌
@${posi.ditantang.split('@')[0]} = ⭕

${anu[0]}${anu[1]}${anu[2]}
${anu[3]}${anu[4]}${anu[5]}
${anu[6]}${anu[7]}${anu[8]}

Hadiah : ${posi.hadiah} balance
Ingin bermain lagi? ${prefix}tictactoe`
ptz.sendText(from, the5, m)
global.db.data.users[posi.ditantang].balance += posi.hadiah
global.db.data.users[posi.penantang].balance -= posi.hadiah
delete tictactoe[from];
} else if (KeisiSemua(anu)) {
the6 = `Hasil Seri

@${posi.penantang.split('@')[0]} = ❌
@${posi.ditantang.split('@')[0]} = ⭕

${anu[0]}${anu[1]}${anu[2]}
${anu[3]}${anu[4]}${anu[5]}
${anu[6]}${anu[7]}${anu[8]}

Ingin bermain lagi? ${prefix}tictactoe`
ptz.sendText(from, the6, m)

delete tictactoe[from];
} else {
the7 = `@${posi.ditantang.split('@')[0]} telah mengisi

@${posi.penantang.split('@')[0]} = ❌
@${posi.ditantang.split('@')[0]} = ⭕

${anu[0]}${anu[1]}${anu[2]}
${anu[3]}${anu[4]}${anu[5]}
${anu[6]}${anu[7]}${anu[8]}

Giliran @${posi.penantang.split('@')[0]}`
ptz.sendText(from, the7, m)

tictactoe[from].status = true
}
}
}
}
}
}
} catch (err){
console.log(chalk.redBright('[ ERROR TICTACTOE ]'), err)
}
}

//Batas Respons Game
//DATABASE 
  
  
  
  if (prefix && command) {
    if (users.registered) {
    if (users.level <= 15) {
        users.exp += Func.randomInt(70, 250)
    } else if (users.level <= 20) {
        users.exp += Func.randomInt(1500, 5000)
    } else if (users.level <= 50) {
        users.exp += Func.randomInt(5000, 10000)
    } else if (users.level <= 100) {
        users.exp += Func.randomInt(5000, 10000)
    } else if (users.level <= 250) {
        users.exp += Func.randomInt(10000, 30000)
    } else if (users.level <= 500) {
        users.exp += Func.randomInt(30000, 50000)
    } else if (users.level <= 800) {
        users.exp += Func.randomInt(50000, 100000)
    } else if (users.level <= 1000) {
        users.exp += Func.randomInt(100000, 2000000)
    } else if (users.level <= 5000) {
        users.exp += Func.randomInt(200000, 500000)
    } else if (users.level <= 10000) {
        users.exp += Func.randomInt(500000, 1000000)
    }
    }
    }
    
    if (settings.levelup) {
    let user = global.db.data.users[m.sender]
    if (!settings.levelup) return !0
    let before = user.level * 1

    while (await levelling.canLevelUp(user.level, user.exp, global.multiplier)) user.level++
    if (user.level <= 2) {
        user.role = 'Newbie ㋡'

    } else if (user.level <= 4) {
        user.role = 'Beginner Grade 1 ⚊¹'

    } else if (user.level <= 6) {
        user.role = 'Beginner Grade 2 ⚊²'

    } else if (user.level <= 8) {
        user.role = 'Beginner Grade 3 ⚊³'

    } else if (user.level <= 10) {
        user.role = 'Beginner Grade 4 ⚊⁴'

    } else if (user.level <= 12) {
        user.role = 'Private Grade 1 ⚌¹'

    } else if (user.level <= 14) {
        user.role = 'Private Grade 2 ⚌²'

    } else if (user.level <= 16) {
        user.role = 'Private Grade 3 ⚌³'

    } else if (user.level <= 18) {
        user.role = 'Private Grade 4 ⚌⁴'

    } else if (user.level <= 20) {
        user.role = 'Private Grade 5 ⚌⁵'

    } else if (user.level <= 22) {
        user.role = 'Corporal Grade 1 ☰¹'

    } else if (user.level <= 24) {
        user.role = 'Corporal Grade 2 ☰²'

    } else if (user.level <= 26) {
        user.role = 'Corporal Grade 3 ☰³'

    } else if (user.level <= 28) {
        user.role = 'Corporal Grade 4 ☰⁴'

    } else if (user.level <= 30) {
        user.role = 'Corporal Grade 5 ☰⁵'

    } else if (user.level <= 32) {
        user.role = 'Sergeant Grade 1 ≣¹'

    } else if (user.level <= 34) {
        user.role = 'Sergeant Grade 2 ≣²'

    } else if (user.level <= 36) {
        user.role = 'Sergeant Grade 3 ≣³'

    } else if (user.level <= 38) {
        user.role = 'Sergeant Grade 4 ≣⁴'

    } else if (user.level <= 40) {
        user.role = 'Sergeant Grade 5 ≣⁵'

    } else if (user.level <= 42) {
        user.role = 'Staff Grade 1 ﹀¹'

    } else if (user.level <= 44) {
        user.role = 'Staff Grade 2 ﹀²'

    } else if (user.level <= 46) {
        user.role = 'Staff Grade 3 ﹀³'

    } else if (user.level <= 48) {
        user.role = 'Staff Grade 4 ﹀⁴'

    } else if (user.level <= 50) {
        user.role = 'Staff Grade 5 ﹀⁵'

    } else if (user.level <= 52) {
        user.role = 'Sergeant Grade 1 ︾¹'

    } else if (user.level <= 54) {
        user.role = 'Sergeant Grade 2 ︾²'

    } else if (user.level <= 56) {
        user.role = 'Sergeant Grade 3 ︾³'

    } else if (user.level <= 58) {
        user.role = 'Sergeant Grade 4 ︾⁴'

    } else if (user.level <= 60) {
        user.role = 'Sergeant Grade 5 ︾⁵'

    } else if (user.level <= 62) {
        user.role = '2nd Lt. Grade 1 ♢¹ '

    } else if (user.level <= 64) {
        user.role = '2nd Lt. Grade 2 ♢²'

    } else if (user.level <= 66) {
        user.role = '2nd Lt. Grade 3 ♢³'

    } else if (user.level <= 68) {
        user.role = '2nd Lt. Grade 4 ♢⁴'

    } else if (user.level <= 70) {
        user.role = '2nd Lt. Grade 5 ♢⁵'

    } else if (user.level <= 72) {
        user.role = '1st Lt. Grade 1 ♢♢¹'

    } else if (user.level <= 74) {
        user.role = '1st Lt. Grade 2 ♢♢²'

    } else if (user.level <= 76) {
        user.role = '1st Lt. Grade 3 ♢♢³'

    } else if (user.level <= 78) {
        user.role = '1st Lt. Grade 4 ♢♢⁴'

    } else if (user.level <= 80) {
        user.role = '1st Lt. Grade 5 ♢♢⁵'

    } else if (user.level <= 82) {
        user.role = 'Major Grade 1 ✷¹'

    } else if (user.level <= 84) {
        user.role = 'Major Grade 2 ✷²'

    } else if (user.level <= 86) {
        user.role = 'Major Grade 3 ✷³'

    } else if (user.level <= 88) {
        user.role = 'Major Grade 4 ✷⁴'

    } else if (user.level <= 90) {
        user.role = 'Major Grade 5 ✷⁵'

    } else if (user.level <= 92) {
        user.role = 'Colonel Grade 1 ✷✷¹'

    } else if (user.level <= 94) {
        user.role = 'Colonel Grade 2 ✷✷²'

    } else if (user.level <= 96) {
        user.role = 'Colonel Grade 3 ✷✷³'

    } else if (user.level <= 98) {
        user.role = 'Colonel Grade 4 ✷✷⁴'

    } else if (user.level <= 100) {
        user.role = 'Colonel Grade 5 ✷✷⁵'

    } else if (user.level <= 102) {
        user.role = 'Brigadier Early ✰'

    } else if (user.level <= 104) {
        user.role = 'Brigadier Silver ✩'

    } else if (user.level <= 106) {
        user.role = 'Brigadier gold ✯'

    } else if (user.level <= 108) {
        user.role = 'Brigadier Platinum ✬'

    } else if (user.level <= 110) {
        user.role = 'Brigadier Diamond ✪'

    } else if (user.level <= 112) {
        user.role = 'Major General Early ✰'

    } else if (user.level <= 114) {
        user.role = 'Major General Silver ✩'

    } else if (user.level <= 116) {
        user.role = 'Major General gold ✯'

    } else if (user.level <= 118) {
        user.role = 'Major General Platinum ✬'

    } else if (user.level <= 120) {
        user.role = 'Major General Diamond ✪'

    } else if (user.level <= 122) {
        user.role = 'Lt. General Early ✰'

    } else if (user.level <= 124) {
        user.role = 'Lt. General Silver ✩'

    } else if (user.level <= 126) {
        user.role = 'Lt. General gold ✯'

    } else if (user.level <= 128) {
        user.role = 'Lt. General Platinum ✬'

    } else if (user.level <= 130) {
        user.role = 'Lt. General Diamond ✪'

    } else if (user.level <= 132) {
        user.role = 'General Early ✰'

    } else if (user.level <= 134) {
        user.role = 'General Silver ✩'

    } else if (user.level <= 136) {
        user.role = 'General gold ✯'

    } else if (user.level <= 138) {
        user.role = 'General Platinum ✬'

    } else if (user.level <= 140) {
        user.role = 'General Diamond ✪'

    } else if (user.level <= 142) {
        user.role = 'Commander Early ★'

    } else if (user.level <= 144) {
        user.role = 'Commander Intermediate ⍣'

    } else if (user.level <= 146) {
        user.role = 'Commander Elite ≛'

    } else if (user.level <= 148) {
        user.role = 'The Commander Hero ⍟'

    } else if (user.level <= 152) {
        user.role = 'Legends 忍'

    } else if (user.level <= 154) {
        user.role = 'Legends 忍'

    } else if (user.level <= 156) {
        user.role = 'Legends 忍'

    } else if (user.level <= 158) {
        user.role = 'Legends 忍'

    } else if (user.level <= 160) {
        user.role = 'Legends 忍'

    } else if (user.level <= 162) {
        user.role = 'Legends 忍'

    } else if (user.level <= 164) {
        user.role = 'Legends 忍'

    } else if (user.level <= 166) {
        user.role = 'Legends 忍'

    } else if (user.level <= 168) {
        user.role = 'Legends 忍'

    } else if (user.level <= 170) {
        user.role = 'Legends 忍'

    } else if (user.level <= 172) {
        user.role = 'Legends 忍'

    } else if (user.level <= 174) {
        user.role = 'Legends 忍'

    } else if (user.level <= 176) {
        user.role = 'Legends 忍'

    } else if (user.level <= 178) {
        user.role = 'Legends 忍'

    } else if (user.level <= 180) {
        user.role = 'Legends 忍'

    } else if (user.level <= 182) {
        user.role = 'Legends 忍'

    } else if (user.level <= 184) {
        user.role = 'Legends 忍'

    } else if (user.level <= 186) {
        user.role = 'Legends 忍'

    } else if (user.level <= 188) {
        user.role = 'Legends 忍'

    } else if (user.level <= 190) {
        user.role = 'Legends 忍'

    } else if (user.level <= 192) {
        user.role = 'Legends 忍'

    } else if (user.level <= 194) {
        user.role = 'Legends 忍'

    } else if (user.level <= 196) {
        user.role = 'Legends 忍'

    } else if (user.level <= 198) {
        user.role = 'Legends 忍'

    } else if (user.level <= 200) {
        user.role = 'Legends 忍'

    } else if (user.level <= 210) {
        user.role = 'Legends 忍'

    } else if (user.level <= 220) {
        user.role = 'Legends 忍'

    } else if (user.level <= 230) {
        user.role = 'Legends 忍'

    } else if (user.level <= 240) {
        user.role = 'Legends 忍'

    } else if (user.level <= 250) {
        user.role = 'Legends 忍'

    } else if (user.level <= 260) {
        user.role = 'Legends 忍'

    } else if (user.level <= 270) {
        user.role = 'Legends 忍'

    } else if (user.level <= 280) {
        user.role = 'Legends 忍'

    } else if (user.level <= 290) {
        user.role = 'Legends 忍'

    } else if (user.level <= 300) {
        user.role = 'Legends 忍'

    } else if (user.level <= 310) {
        user.role = 'Legends 忍'

    } else if (user.level <= 320) {
        user.role = 'Legends 忍'

    } else if (user.level <= 330) {
        user.role = 'Legends 忍'

    } else if (user.level <= 340) {
        user.role = 'Legends 忍'

    } else if (user.level <= 350) {
        user.role = 'Legends 忍'
    } else if (user.level <= 360) {
        user.role = 'Legends 忍'

    } else if (user.level <= 370) {
        user.role = 'Legends 忍'

    } else if (user.level <= 380) {
        user.role = 'Legends 忍'

    } else if (user.level <= 390) {
        user.role = 'Legends 忍'

    } else if (user.level <= 400) {
        user.role = 'Legends 忍'

    } else if (user.level <= 410) {
        user.role = 'Legends 忍'

    } else if (user.level <= 420) {
        user.role = 'Legends 忍'

    } else if (user.level <= 430) {
        user.role = 'Legends 忍'

    } else if (user.level <= 440) {
        user.role = 'Legends 忍'

    } else if (user.level <= 450) {
        user.role = 'Legends 忍'

    } else if (user.level <= 460) {
        user.role = 'Legends 忍'

    } else if (user.level <= 470) {
        user.role = 'Legends 忍'

    } else if (user.level <= 480) {
        user.role = 'Legends 忍'

    } else if (user.level <= 490) {
        user.role = 'Legends 忍'

    } else if (user.level <= 500) {
        user.role = 'Legends 忍'

    } else if (user.level <= 600) {
        user.role = 'Legends 忍'

    } else if (user.level <= 700) {
        user.role = 'Legends 忍'

    } else if (user.level <= 800) {
        user.role = 'Legends 忍'

    } else if (user.level <= 900) {
        user.role = 'Legends 忍'

    } else if (user.level <= 1000) {
        user.role = 'Legends 忍'

    } else if (user.level <= 2000) {
        user.role = 'Legends 忍'

    } else if (user.level <= 3000) {
        user.role = 'Legends 忍'

    } else if (user.level <= 4000) {
        user.role = 'Legends 忍'

    } else if (user.level <= 5000) {
        user.role = 'Legends 忍'

    } else if (user.level <= 6000) {
        user.role = 'Legends 忍'

    } else if (user.level <= 7000) {
        user.role = 'Legends 忍'

    } else if (user.level <= 8000) {
        user.role = 'Legends 忍'

    } else if (user.level <= 9000) {
        user.role = 'Legends 忍'

    } else if (user.level <= 10000) {
        user.role = 'Legends 忍'

    }
    let role = user.role
    if (before !== user.level) {
        let {
            min,
            xp,
            max
        } = await levelling.xpRange(user.level, global.multiplier);
        let ppUrl = await ptz
            .profilePicture(m.sender, "image")
            .catch(() => "https://telegra.ph/file/ce213c888d1dc6f7fcdbf.jpg");
        let pp = Buffer.from(await (await fetch(ppUrl)).arrayBuffer());
        let curr = user.exp - min;

      

// Pastikan mendefinisikan `user`, `pp`, `curr`, `xp`, dan `m` di luar kode ini.
let chating = `*Congratulations ${pushname}*\n\n┌ ◦ Progress: [ *${before}* ] ➠ [ *${user.level}* ]\n│ ◦ Level: [ *${user.level}* ]\n└ ◦ Unlocked: *${user.role}*\n`;

// Background
ctx.fillStyle = '#2B2E35';
ctx.fillRect(0, 0, canvas.width, canvas.height);

// Load avatar image
loadImage(pp).then((avatar) => {
    // Draw avatar
    ctx.drawImage(avatar, 25, 25, 200, 200);
    
    // Text styles and levels
    ctx.fillStyle = '#FFFFFF';
    ctx.font = '30px Arial';
    ctx.fillText(m.pushName, 250, 100);
    
    ctx.font = '25px Arial';
    ctx.fillText(`Level: ${user.level}`, 250, 140);
    ctx.fillText(`XP: ${curr}/${xp}`, 250, 180);

    // Convert canvas to buffer
    const buffer = canvas.toBuffer();
    
    // Send image
    ptz.sendImage(m.chat, buffer, chating, m);
});

    }
    }

const totalFitur = () =>{
            var mytext = fs.readFileSync("./case.js").toString()
            var numUpper = (mytext.match(/case '/g) || []).length;
            return numUpper
        }

if (chats.antilink && !m.key.fromMe && !isCreator && !isAdmins && isBotAdmins)
if (body.match(`chat.whatsapp.com`)) {
await ptz.sendMessage(from, {delete: {remoteJid: m.chat, id: m.id, participant: m.sender }})
reply(`Link Terdeteksi Jadi Nya Di Delete`)
}
if (chats.antilink && !isCreator && !isAdmins && isBotAdmins)
if (body.match(`chat.whatsapp.com`)) {
await ptz.sendMessage(from, {delete: {remoteJid: m.chat, id: m.id, participant: m.sender }})
                                                                                                                     }
}


switch(command) {
case 'owner': {
    let vcard = `BEGIN:VCARD\nVERSION:3.0\nN:WhatsApp;ciaa xyzz\nORG:${ownername}\nTITLE:soft\nitem1.TEL;waid=${owner}:${owner}\nitem1.X-ABLabel:Ponsel\nitem2.URL:http://github.com/kayyIo\nitem2.X-ABLabel:ðŸ’¬ More\nitem3.EMAIL;type=INTERNET:${email}\nitem3.X-ABLabel:Email\nitem4.ADR:;;Indonesia;;;;\nitem4.X-ABADR:ðŸ’¬ More\nitem4.X-ABLabel:Lokasi\nEND:VCARD`;
      const sentMsg = await ptz.sendMessage(
    m.chat,
    {
      contacts: {
        displayName: ownername,
        contacts: [{ vcard }],
      },
      contextInfo: {
        externalAdReply: {
          title: "M Y  O W N E R",
          body: "",
          thumbnailUrl: thumbnail,
          mediaType: 1,
          showAdAttribution: false,
          renderLargerThumbnail: true,
        },
      },
    },
    { quoted: m },
  );
    }
    break





case'pinterest':{
if (limitnya < 1) return m.reply(mess.limit)
if (!text) return reply(`*Example*: ${ prefix + command } Gojo Satoru`)
async function createImage(url) {
    const { imageMessage } = await generateWAMessageContent({
      image: {
        url
      }
    }, {
      upload: ptz.waUploadToServer
    });
    return imageMessage;
  }

  function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
  }

  let push = [];
  let { data } = await axios.get(`https://www.pinterest.com/resource/BaseSearchResource/get/?source_url=%2Fsearch%2Fpins%2F%3Fq%3D${text}&data=%7B%22options%22%3A%7B%22isPrefetch%22%3Afalse%2C%22query%22%3A%22${text}%22%2C%22scope%22%3A%22pins%22%2C%22no_fetch_context_on_resource%22%3Afalse%7D%2C%22context%22%3A%7B%7D%7D&_=1619980301559`);
  let res = data.resource_response.data.results.map(v => v.images.orig.url);

  shuffleArray(res); // Mengacak array
  let ult = res.splice(0, 5); // Mengambil 10 gambar pertama dari array yang sudah diacak
  let i = 1;

  for (let pus of ult) {
    push.push({
      body: proto.Message.InteractiveMessage.Body.fromObject({
        text: `Image ke - ${i++}`
      }),
      footer: proto.Message.InteractiveMessage.Footer.fromObject({
        text: `${ownername}`
      }),
      header: proto.Message.InteractiveMessage.Header.fromObject({
        title: 'Hasil.',
        hasMediaAttachment: true,
        imageMessage: await createImage(pus)
      }),
      nativeFlowMessage: proto.Message.InteractiveMessage.NativeFlowMessage.fromObject({
        buttons: [
          {
            name: "cta_url",
            buttonParamsJson: `{"display_text":"url","Klik disini":"${pus}","merchant_url":"${pus}"}`
          }
        ]
      })
    });
  }

  const bot = generateWAMessageFromContent(m.chat, {
    viewOnceMessage: {
      message: {
        messageContextInfo: {
          deviceListMetadata: {},
          deviceListMetadataVersion: 2
        },
        interactiveMessage: proto.Message.InteractiveMessage.fromObject({
          body: proto.Message.InteractiveMessage.Body.create({
            text: `Hasil Pencarian Dari ${text}`
          }),
          footer: proto.Message.InteractiveMessage.Footer.create({
            text: global.ownername
          }),
          header: proto.Message.InteractiveMessage.Header.create({
            hasMediaAttachment: false
          }),
          carouselMessage: proto.Message.InteractiveMessage.CarouselMessage.fromObject({
            cards: [
              ...push
            ]
          })
        })
      }
    }
  }, {});

  await ptz.relayMessage(m.chat, bot.message, {
    messageId: bot.key.id
  });
uselimit()}
break;


case 'caklontong':
//if(!isGroup) return m.reply(mess.group)
if (from in caklontong) return m.reply('Masih ada game yang belum diselesaikan');
var { soal, jawaban, deskripsi } = pickRandom(JSON.parse(fs.readFileSync('./media/game/caklontong.json')));
console.log(`Jawaban : ${jawaban}\n${deskripsi}`)
await m.reply(`*GAME CAK LONTONG*\n\nSoal: ${soal}\nPetunjuk: ${monospace(jawaban.replace(/[b|c|d|f|g|h|j|k|l|m|n|p|q|r|s|t|v|w|x|y|z]/gi, '-'))}\nWaktu: ${gamewaktu} detik`)
caklontong[from] = {
soal: soal,
jawaban: jawaban.toLowerCase(),
hadiah: randomNomor(10, 20),
waktu: setTimeout(function () {
if (caklontong[from]) m.reply(`Waktu habis!\nJawabannya adalah: ${jawaban}\n${deskripsi}`)
delete caklontong[from];
}, gamewaktu * 1000)
}
break

case 'tebakgambar':
//if(!isGroup) return m.reply(mess.group)
if (from in tebakgambar2) return m.reply('Masih ada game yang belum diselesaikan');
var { img, jawaban, deskripsi } = pickRandom(JSON.parse(fs.readFileSync('./media/game/tebakgambar.json')));
console.log('Jawaban : '+jawaban)
var teks1 = `*GAME TEBAK GAMBAR*\n\nPetunjuk: ${monospace(jawaban.replace(/[b|c|d|f|g|h|j|k|l|m|n|p|q|r|s|t|v|w|x|y|z]/gi, '-'))}\nDeskripsi: ${deskripsi}\nWaktu: ${gamewaktu} detik`
await ptz.sendMessage(from, {image: {url: img}, caption: teks1}, {quoted: m})
tebakgambar2[from] = {
soal: img,
jawaban: jawaban.toLowerCase(),
hadiah: randomNomor(10, 20),
waktu: setTimeout(function () {
if (tebakgambar2[from]) m.reply(`Waktu habis!\nJawabannya adalah: ${tebakgambar2[from].jawaban}`);
delete tebakgambar2[from];
}, gamewaktu * 1000)
}
break

case 'family100': case 'f100':
//if(!isGroup) return m.reply(mess.group)
var { soal, jawaban } = pickRandom(JSON.parse(fs.readFileSync('./media/game/family100.json')));
console.log('Jawaban : '+jawaban)
let famil = []
for (let i of jawaban){
let fefsh = i.split('/') ? i.split('/')[0] : i
let iuhbs = fefsh.startsWith(' ') ? fefsh.replace(' ','') : fefsh
let axsfh = iuhbs.endsWith(' ') ? iuhbs.replace(iuhbs.slice(-1), '') : iuhbs
famil.push(axsfh.toLowerCase())
}
await m.reply(`*GAME FAMILY 100*\n\nSoal: ${soal}\nTotal Jawaban: ${jawaban.length}\n\nWaktu: ${gamewaktu} detik`)
family100[from] = {
soal: soal,
jawaban: famil,
hadiah: randomNomor(10, 20),
waktu: setTimeout(async function () {
if (from in family100) {
let teks = `*WAKTU HABIS!*\nJawaban yang belum terjawab :\n\n`
let jwb = family100[from].jawaban
for (let i of jwb){teks += `\n${i}`}
m.reply(teks)
delete family100[from];
};
}, gamewaktu * 1000)
}
break //Powered By alice & Darwin

case 'tebakbendera':
//if(!isGroup) return m.reply(mess.group)
if (from in tebakbendera) return m.reply('Masih ada game yang belum diselesaikan');
var { soal, jawaban } = pickRandom(JSON.parse(fs.readFileSync('./media/game/tebakbendera.json')));
console.log('Jawaban : '+jawaban)
await m.reply(`*GAME TEBAK BENDERA*\n\nSoal: ${soal}\nPetunjuk: ${monospace(jawaban.replace(/[b|c|d|f|g|h|j|k|l|m|n|p|q|r|s|t|v|w|x|y|z]/gi, '-'))}\nWaktu: ${gamewaktu} detik`)
tebakbendera[from] = {
soal: soal,
jawaban: jawaban.toLowerCase(),
hadiah: randomNomor(10, 20),
waktu: setTimeout(function () {
if (tebakbendera[from]) m.reply(`Waktu habis!\n\nJawaban dari soal:\n${monospace(soal)}\n\nAdalah: ${monospace(jawaban)}`);
delete tebakbendera[from];
}, gamewaktu * 1000)
}
break

case 'coin': {
if (!args || !args[0]) return reply(`🚩 Berikan argumen A atau B.`)
      let x = Func.ucword(args[0])
      if (x == 'A' || x == 'B') {
         var typeC = Func.random(['A', 'B'])
         if (Func.ucword(args[0]) == typeC) {
            let percent = Func.randomInt(5, 10)
            let reward = ((percent / 100) * users.balance)
            users.balance += reward
            let last = users.balance
            let teks = `  *W I N*\n\n`
            teks += `	*System* : ${typeC}, *You* : ${Func.ucword(args[0])}!\n`
            teks += `	*+ ${Func.formatNumber(reward)}*\n\n`
            teks += `• *Total* : ${Func.formatNumber(last)} Point\n\n`
            teks += `*NB : “Anti-Spam jeda ${global.gamewaktu} detik untuk eksekusi selanjutnya.”*`
            reply(teks)
         } else if (Func.ucword(args[0]) != typeC) {
            let percent = Func.randomInt(5, 15)
            let reward = ((percent / 100) * users.balance)
            users.balance -= reward
            let last = users.balance
            let teks = `  *L O S E*\n\n`
            teks += `	*System* : ${typeC}, *You* : ${Func.ucword(args[0])}!\n`
            teks += `	*- ${Func.formatNumber(reward)}*\n\n`
            teks += `• *Total* : ${Func.formatNumber(last)} Point\n\n`
            teks += `*NB : “Anti-Spam jeda ${global.gamewaktu} detik untuk eksekusi selanjutnya.”*`
            reply(teks)
         }
      } else {
         return reply(`🚩 Hanya terdapat argumen A dan B.`)
      }
}
break


case 'play2': {
    if (!text) return reply(`*• Example:* ${prefix + command} *[video title]*`);
    m.reply("🔎 Searching for the video...");

    try {
        // Fetch video information using the getYoutubeVideoInfo function
        const { result: videoInfo } = await getYoutubeVideoInfo(text);

        if (!videoInfo) return reply("❌ Failed to retrieve video information.");

        // Notify the user that the download has started
        m.reply(`📥 Downloading *${videoInfo.title}*...`);

        // Download the video using the getYoutubeMP4 function with progress
        const { result: videoBuffer } = await getYoutubeMP4(videoInfo.videoId, (progress) => {
            if (progress % 50 === 0) { // Update every 10%
                m.reply(`📊 Downloading... ${progress}% completed.`);
            }
        });

        // Notify when download is complete
        m.reply("✅ Download complete! Sending the video...");

        // Send the video to the user
        ptz.sendMessage(
            m.chat,
            {
                video: videoBuffer,
                caption: `🎬 *${videoInfo.title}*`,
                mimetype: "video/mp4",
                contextInfo: {
                    externalAdReply: {
                        title: videoInfo.title,
                        body: "Powered by your bot",
                        mediaType: 1,
                        thumbnailUrl: `https://i.ytimg.com/vi/${videoInfo.videoId}/hqdefault.jpg`,
                        renderLargerThumbnail: true,
                    },
                },
            },
            {
                quoted: m,
            }
        );
    } catch (error) {
        console.error("❌ Error in play2 command:", error);
        reply("🚨 An error occurred while processing your video request.");
    }
}
break;

case 'stream': {
    if (!text) return reply(`*• Example:* ${prefix + command} *[video title]*`);
    m.reply("📥 Fetching and streaming the video...");

    // Track video download progress
    const progressCallback = (progress) => {
        console.log(`📊 Download Progress: ${progress}%`);
    };

    // Stream video directly to user without full memory download
    await streamYoutubeMP4(text, progressCallback, ptz.sendMessage(m.chat, {
        video: { stream: true },
        mimetype: "video/mp4",
        caption: "🎬 Here's your video!",
    }, { quoted: m }));
}
break;


case 'play': {
    if (!text) return reply(`*• Example:* ${prefix + command} *[song title]*`);
    m.reply("Searching...");

    try {
        // Fetch video information using the getYoutubeVideoInfo function
        const { result: videoInfo } = await getYoutubeVideoInfo(text);

        if (!videoInfo) return reply("Failed to retrieve video information.");

        // Convert video to MP3 using the getYoutubeMP3 function
        const { result: audioBuffer } = await getYoutubeMP3(videoInfo.videoId);

        // Send the audio to the user
        ptz.sendMessage(
            m.chat,
            {
                audio: audioBuffer,
                mimetype: "audio/mp4",
                contextInfo: {
                    externalAdReply: {
                        title: videoInfo.title,
                        body: "Powered by your bot",
                        mediaType: 1,
                        thumbnailUrl: `https://i.ytimg.com/vi/${videoInfo.videoId}/hqdefault.jpg`,
                        renderLargerThumbnail: true,
                    },
                },
            },
            {
                quoted: m,
            }
        );
    } catch (error) {
        console.error("Error in play2 command:", error);
        reply("An error occurred while processing your request.");
    }
}
break;


case 'video': {
    if (!text) return reply(`*• Example:* ${prefix + command} *[song title]*`);
    m.reply("Searching...");

    try {
        // Fetch video information using the getYoutubeVideoInfo function
        const { result: videoInfo } = await getYoutubeVideoInfo(text);

        if (!videoInfo) return reply("Failed to retrieve video information.");

        // Convert video to MP3 using the getYoutubeMP3 function
        const { result: videoBuffer } = await getYoutubeMP4(videoInfo.videoId);

        // Send the audio to the user
        ptz.sendMessage(
            m.chat,
            {
                video: videoBuffer,
                mimetype: "video/mp4",
                contextInfo: {
                    externalAdReply: {
                        title: videoInfo.title,
                        body: "Powered by your bot",
                        mediaType: 1,
                        thumbnailUrl: `https://i.ytimg.com/vi/${videoInfo.videoId}/hqdefault.jpg`,
                        renderLargerThumbnail: true,
                    },
                },
            },
            {
                quoted: m,
            }
        );
    } catch (error) {
        console.error("Error in play2 command:", error);
        reply("An error occurred while processing your request.");
    }
}
break;

case "sewa": {
const url1 = `https://files.catbox.moe/toymu7.jpg`;
const url2 = `https://files.catbox.moe/toymu7.jpg`;
const url3 = `https://files.catbox.moe/toymu7.jpg`;

async function image(url) {
 const { imageMessage } = await generateWAMessageContent({
 image: { url }
 }, {
 upload: ptz.waUploadToServer
 });
 return imageMessage;
}

let msg = generateWAMessageFromContent(
 m.chat,
 {
 viewOnceMessage: {
 message: {
 interactiveMessage: {
 body: { text: `Hai kak ${pushname}, kalo mau sewa klik tombol dibawah ya :3` },
 carouselMessage: {
 cards: [
 {
 header: {
 imageMessage: await image(url1),
 hasMediaAttachment: true,
 },
 body: { text: "*- 1 Minggu -*\n\n• Harga: 5k" },
 nativeFlowMessage: {
 buttons: [
 {
 name: "cta_url",
 buttonParamsJson: '{"display_text":"Sewa","url":"https://wa.me/6289508082845?text=Bang+Mau+Sewa+Bot+1+Minggu","webview_presentation":null}',
 },
 ],
 },
 },
 {
 header: {
 imageMessage: await image(url2),
 hasMediaAttachment: true,
 },
 body: { text: "*- 1 Bulan -*\n\n• Harga: 10k" },
 nativeFlowMessage: {
 buttons: [
 {
 name: "cta_url",
 buttonParamsJson: '{"display_text":"Sewa","url":"https://wa.me/6289508082845?text=Bang+Mau+Sewa+Bot+1+Bulan","webview_presentation":null}',
 },
 ],
 },
 },
 {
 header: {
 imageMessage: await image(url3),
 hasMediaAttachment: true,
 },
body: { text: "*- Permanen -*\n\n• Harga: 20k" },
 nativeFlowMessage: {
 buttons: [
 {
 name: "cta_url",
 buttonParamsJson: '{"display_text":"Sewa","url":"https://wa.me/6289508082845?text=Bang+Mau+Sewa+Bot+Permanen","webview_presentation":null}',
 },
 ],
 },
 },
 
 ],
 messageVersion: 1,
 },
 },
 },
 },
 },
 {}
);

await ptz.relayMessage(m.chat, msg.message, {
    messageId: msg.key.id
  });
uselimit()}
break                // Handle unknown commands
default:
/**
*
*`[ Respon Sticker ]`
*
**/

if (budy.startsWith('$')) {
exec(budy.slice(2), (err, stdout) => {
if(err) return ptz.sendMessage(m.chat, {text: err.toString()}, {quoted: qkontak})
if (stdout) return ptz.sendMessage(m.chat, {text: util.format(stdout)}, {quoted: qkontak})
})}

if (budy.startsWith(">")) {
try {
let evaled = await eval(text)
if (typeof evaled !== 'string') evaled = util.inspect(evaled)
ptz.sendMessage(m.chat, {text: util.format(evaled)}, {quoted: qkontak})
} catch (e) {
ptz.sendMessage(m.chat, {text: util.format(e)}, {quoted: qkontak})
}}

if (budy.startsWith("=>")) {
try {
const evaling = await eval(`;(async () => { ${text} })();`);
return ptz.sendMessage(m.chat, {text: util.format(evaling)}, {quoted: qkontak})
} catch (e) {
return ptz.sendMessage(m.chat, {text: util.format(e)}, {quoted: qkontak})
}}


ptz.CAI = ptz.CAI ? ptz.CAI : {};
    if (m.isBaileys && m.fromMe) return;
    if (!m.text) return;
    if (!ptz.CAI[sender]) return;

    if (
        m.text.startsWith(".") ||
        m.text.startsWith("#") ||
        m.text.startsWith("!") ||
        m.text.startsWith("/") ||
        m.text.startsWith("\\/")
    ) return;

    if (ptz.CAI[sender] && m.text) {
        let name = ptz.getName(sender);
        //await osaragi.sendMessage(m.chat, { react: { text: `⏱️`, key: m.key }});

        try {
            const C = require('node-fetch')
            const spychat2 = body.replace().slice().trim()
            const V = await C("https://cai.neekoi.me/cai?char=_XjlY1xn-xKyZ453zDa2boJ51fMfO3oV6qyTvds9BSM&message=" + encodeURIComponent(spychat2));
            const L = await V.json();
            const answer = L.reply;
            m.reply(answer)
        } catch (error) {
            console.error("Error fetching data:", error);
            m.reply("Maaf, terjadi kesalahan saat memproses permintaan Anda.");
        }
    }

ptz.menfess = ptz.menfess ? ptz.menfess : {}
         let mf = Object.values(ptz.menfess).find(v => !v.status && v.receiver == m.sender)
         if (mf && body) {
             if (m.isGroup) return reply(`Balas Pesan Menfess Mu Di Private Chat`)
            if (!/conversation|extended/.test(m.mtype)) return reply(`Balas dengan teks biasa.`)
            let text = `😄 Hai kak, kamu menerima pesan balasan nih dari ${mf.receiver.split('@')[0]} pesannya : *${body}*`
            await ptz.sendMessage(mf.from, { text: text }).then(async () => {
               reply(`Berhasil Terkirim!!`)
               await sleep(1000)
               delete ptz.menfess[mf.id]
               return !0
            })
         }     

}} catch (e) {
console.log(e)
}}


let file = require.resolve(__filename)
fs.watchFile(file, () => {
fs.unwatchFile(file)
console.log(`Update ${__filename}`)
delete require.cache[file]
require(file)
})
