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
