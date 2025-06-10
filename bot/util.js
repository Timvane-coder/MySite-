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
