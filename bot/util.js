//lib/util.js

const moment = require("moment-timezone");
const crypto = require('node:crypto');
const { tmpdir } = require('node:os');
const path = require("node:path");
const fs = require('fs-extra');

// Converts a timestamp to a formatted date and time (DD/MM HH:mm:ss)
const timestampToDate = (timestampMsg) => {
    return moment(timestampMsg).format('DD/MM HH:mm:ss');
};

// Formats seconds into minutes and seconds (mm:ss)
const formatSeconds = (seconds) => {
    return moment(seconds * 1000).format('mm:ss');
};

// Returns the current date and time (DD/MM HH:mm:ss)
const currentDateTime = () => {
    return moment(Date.now()).format('DD/MM HH:mm:ss');
};

// Capitalizes the first letter of a word
const capitalizeFirstLetter = (word) => {
    return word.charAt(0).toUpperCase() + word.slice(1);
};

// Generates a random name with a given extension
const getRandomName = (extension) => {
    return `${Math.floor(Math.random() * 10000)}.${extension}`;
};

// Generates a path for a temporary file with a given extension
const getTemporaryPath = (extension) => {
    const tempDir = path.join(tmpdir(), 'lbot-api-midias');
    if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir);
    return path.join(tempDir, `${crypto.randomBytes(20).toString('hex')}.${extension}`);
};

// Exporting functions
module.exports = {
    timestampToDate,
    formatSeconds,
    currentDateTime,
    capitalizeFirstLetter,
    getRandomName,
    getTemporaryPath
};

//lib/videos.js
const ffmpeg = require('fluent-ffmpeg')
const fs = require('fs-extra')
const axios = require('axios')
const { getTemporaryPath } = require('./util.js')

/**
 * Converts MP4 video to MP3 audio
 * @param {Buffer} videoBuffer - Input video as a buffer
 * @returns {Promise<{result?: Buffer, error?: string}>}
 */
const convertMp4ToMp3 = (videoBuffer) => {
    return new Promise((resolve, reject) => {
        try {
            let response = {}
            let videoPath = getTemporaryPath('mp4')
            fs.writeFileSync(videoPath, videoBuffer)
            let audioOutput = getTemporaryPath('mp3')
            
            ffmpeg(videoPath)
                .outputOptions(['-vn', '-codec:a libmp3lame', '-q:a 3'])
                .save(audioOutput)
                .on('end', () => {
                    let audioBuffer = fs.readFileSync(audioOutput)
                    fs.unlinkSync(videoPath)
                    fs.unlinkSync(audioOutput)
                    response.result = audioBuffer
                    resolve(response)
                })
                .on("error", (err) => {
                    fs.unlinkSync(videoPath)
                    response.error = 'There was an error converting to MP3.'
                    reject(response)
                })
        } catch (err) {
            console.log(`API convertMp4ToMp3 - ${err.message}`)
            reject({ error: "There was an error converting to MP3." })
        }
    })
}

/**
 * Generates a video thumbnail from MP4
 * @param {string | Buffer} media - Input media (file path, buffer, or URL)
 * @param {string} [type="file"] - Media type: "file", "buffer", or "url"
 * @returns {Promise<{result?: string, error?: string}>}
 */
const getVideoThumbnail = async (media, type = "file") => {
    return new Promise(async (resolve, reject) => {
        try {
            let response = {}
            let inputPath = ''
            let thumbnailOutput = getTemporaryPath('jpg')

            if (type === "file") {
                inputPath = media
            } else if (type === "buffer") {
                inputPath = getTemporaryPath('mp4')
                fs.writeFileSync(inputPath, media)
            } else if (type === "url") {
                let urlResponse = await axios.get(media, { responseType: 'arraybuffer' })
                let bufferUrl = Buffer.from(urlResponse.data, "utf-8")
                inputPath = getTemporaryPath('mp4')
                fs.writeFileSync(inputPath, bufferUrl)
            }

            ffmpeg(inputPath)
                .addOption("-y")
                .inputOptions(["-ss 00:00:00"])
                .outputOptions(["-vf scale=32:-1", "-vframes 1", "-f image2"])
                .save(thumbnailOutput)
                .on('end', () => {
                    if (type !== 'file') fs.unlinkSync(inputPath)
                    let thumbBase64 = fs.readFileSync(thumbnailOutput).toString('base64')
                    fs.unlinkSync(thumbnailOutput)
                    response.result = thumbBase64
                    resolve(response)
                })
                .on('error', (err) => {
                    response.error = 'There was an error obtaining the video thumbnail.'
                    reject(response)
                })
        } catch (err) {
            console.log(`API getVideoThumbnail - ${err.message}`)
            reject({ error: "There was an error obtaining the video thumbnail." })
        }
    })
}

module.exports = {
    convertMp4ToMp3,
    getVideoThumbnail
    }


//lib/youtube.js
const fs = require('fs-extra')  
const { getTemporaryPath, formatSeconds } = require('./util.js')  
const { convertMp4ToMp3 } = require('./video.js')  
const Youtube = require('youtube-sr').default  
const ytdl = require('@distube/ytdl-core')  
const axios = require('axios')  

const yt_agent = ytdl.createAgent([{ name: 'cookie1', value: 'GPS=1; YSC=CkypMSpfgiI; VISITOR_INFO1_LIVE=4nF8vxPW1gU; VISITOR_PRIVACY_METADATA=CgJCUhIEGgAgZA%3D%3D; PREF=f6=40000000&tz=America.Sao_Paulo; SID=g.a000lggw9yBHfdDri-OHg79Bkk2t6L2X7cbwK7jv8BYZZa4Q1hDbH4SZC5IHPqi_QBmSiigPHAACgYKAYgSARASFQHGX2Mi3N21zLYOMAku61_CaeccrxoVAUF8yKo3X97N4REFyHP4du4RIo1b0076; __Secure-1PSIDTS=sidts-CjIB3EgAEmNr03Tidygwml9aTrgDf0woi14K6jndMv5Ox5uI22tYDMNEYiaAoEF0KjGYgRAA; __Secure-3PSIDTS=sidts-CjIB3EgAEmNr03Tidygwml9aTrgDf0woi14K6jndMv5Ox5uI22tYDMNEYiaAoEF0KjGYgRAA; __Secure-1PSID=g.a000lggw9yBHfdDri-OHg79Bkk2t6L2X7cbwK7jv8BYZZa4Q1hDbYpnHl6jq9y45aoBaqMd96QACgYKAR4SARASFQHGX2MiqFuOgRtuIS_FKmulaCrckxoVAUF8yKpX5r8ISh5S5eQ4eofBuyCg0076; __Secure-3PSID=g.a000lggw9yBHfdDri-OHg79Bkk2t6L2X7cbwK7jv8BYZZa4Q1hDb_8Q3teG8nn23ceeF8jiOvwACgYKAY0SARASFQHGX2MiwBtnenbu4CRMpjQza-asfhoVAUF8yKoFXx_Zxl4MvxGnWSSsnv1z0076; HSID=AWgIQn3iifuaU_eRW; SSID=AR8Jlj2XTnPAmL5kf; APISID=l6PTqM9Dy8G_2E6P/A-sAusHOyG1pQ3T75; SAPISID=OSmwE6VjdFmB1u5-/A2N-7DiRQUreUSpgT; __Secure-1PAPISID=OSmwE6VjdFmB1u5-/A2N-7DiRQUreUSpgT; __Secure-3PAPISID=OSmwE6VjdFmB1u5-/A2N-7DiRQUreUSpgT; LOGIN_INFO=AFmmF2swRQIgShGx2tfQkQV4F8lyKnh4mwj54yTOPJqEdI44sDTtsrwCIQD870Le1gTMDFpz7rRHS6Fk0HzraG_SxHw_PdyLjUDXxg:QUQ3MjNmeVpqbVhSQlNCMnFFZXBKQkhCTHJxY1NXOVlYcG50SHNNOGxGZGZ3Z2ZobWwyOW95WGJ2LVplelNaZ0RfbGU3Tm1uYktDdHBnVm9fd3N3T0NncVpTN0ZaNlRoTTVETDJHSjV6QkxUWmdYWGx0eVFYeEFqa0gxUGdBYUJKbG5oQ2pBd3RBb0ROWXBwcFQwYkpBRktEQXlWbmZIbHJB; SIDCC=AKEyXzXkXTftuhPOtObUSCLHxp1byOAtlesMkptSGp8hyE3d97Dvy2UHd4-2ePWBpzUbQhV6; __Secure-1PSIDCC=AKEyXzXlrhkCIONPS4jCvhmtFb8nAKr8fEFCCFEFqN8BKyrw8tKHFh3-r8EWjrqjAKH9Z9fq0A; __Secure-3PSIDCC=AKEyXzWLIbNbh8dxdyKhTafkyKIbEBwVKGR4lNRhhYX5u_v1k4vBnu4eAS9lgpP-JK2PgiSDJw'}])  

// Function to get YouTube video information
const getYoutubeVideoInfo = async (text) => {  
    return new Promise(async (resolve, reject) => {  
        try {  
            let response = {}, video_id = ''  
              
            // Check if the URL is valid  
            const VALID_URL = ytdl.validateURL(text)  
            if (VALID_URL) {  
                video_id = ytdl.getVideoID(text)  
            } else {  
                await Youtube.searchOne(text).then((videoSearch) => {  
                    video_id = videoSearch.id  
                }).catch(() => {  
                    response.error = 'There was an error retrieving the video information.'  
                    return reject(response)  
                })  
            }  

            // Get video information  
            ytdl.getInfo(video_id, {  
                playerClients: ["WEB", "WEB_EMBEDDED", "ANDROID", "IOS"],  
                agent: yt_agent  
            }).then(videoInfo => {  
                const formats = ytdl.filterFormats(videoInfo.formats, "videoandaudio")  
                const format = ytdl.chooseFormat(formats, { quality: 'highest' })  
                response.result = {  
                    videoId: videoInfo.player_response.videoDetails.videoId,  
                    title: videoInfo.player_response.videoDetails.title,  
                    shortDescription: videoInfo.player_response.videoDetails.shortDescription,  
                    lengthSeconds: videoInfo.player_response.videoDetails.lengthSeconds,  
                    keywords: videoInfo.player_response.videoDetails.keywords,  
                    channelId: videoInfo.player_response.videoDetails.channelId,  
                    isOwnerViewing: videoInfo.player_response.videoDetails.isOwnerViewing,  
                    isCrawlable: videoInfo.player_response.videoDetails.isCrawlable,  
                    durationFormatted: formatSeconds(parseInt(videoInfo.player_response.videoDetails.lengthSeconds)),  
                    format  
                }  
                resolve(response)  
            }).catch((err) => {  
                if (err.message === "Status code: 410") {  
                    response.error = 'The video seems to have age restrictions or requires login to watch.'  
                } else {  
                    response.error = 'There was an error retrieving the video information.'  
                }  
                reject(response)  
            })  
        } catch (err) {  
            console.log(`API getYoutubeVideoInfo - ${err.message}`)  
            reject({ error: 'There was an error on the YouTube search server.' })  
        }  
    })  
}  

// Function to get YouTube video in MP4 format
const getYoutubeMP4 = async (text) => {  
    return new Promise(async (resolve, reject) => {  
        try {  
            let response = {}  
            let videoOutput = getTemporaryPath('mp4')  
            let { result: videoInfo } = await getYoutubeVideoInfo(text)  
              
            if (!videoInfo) {  
                return reject({ error: "Failed to retrieve video information." })  
            }  

            let videoStream = ytdl(videoInfo.videoId, { format: videoInfo.format, agent: yt_agent })  
            videoStream.pipe(fs.createWriteStream(videoOutput))  
              
            videoStream.on("end", () => {  
                let videoBuffer = fs.readFileSync(videoOutput)  
                fs.unlinkSync(videoOutput)  
                response.result = videoBuffer  
                resolve(response)  
            }).on('error', () => {  
                response.error = "Server error while retrieving the YouTube video."  
                reject(response)  
            })  
        } catch (err) {  
            console.log(`API getYoutubeMP4 - ${err.message}`)  
            reject({ error: "Server error while retrieving the YouTube video." })  
        }  
    })  
}  

// Function to get YouTube audio in MP3 format
const getYoutubeMP3 = async (text) => {  
    return new Promise(async (resolve, reject) => {  
        try {  
            let response = {}  
            let { result: videoBuffer } = await getYoutubeMP4(text)  
            let { result: audioBuffer } = await convertMp4ToMp3(videoBuffer)  
            response.result = audioBuffer  
            resolve(response)  
        } catch (err) {  
            console.log(`API getYoutubeMP3 - ${err.message}`)  
            reject({ error: "Error during conversion to obtain YouTube MP3." })  
        }  
    })  
}  

module.exports = { getYoutubeVideoInfo, getYoutubeMP4, getYoutubeMP3 }
