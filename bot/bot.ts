import { BaileysClass } from '../lib/baileys.js';
const { getYoutubeVideoInfo, getYoutubeMP4, getYoutubeMP3, getYoutubeTrending, getRelatedVideos, getLyrics } = require('../lib/youtube.js'); // Adjust path as needed
const fs = require('fs');
const path = require('path');
const https = require('https');

const botBaileys = new BaileysClass({});

botBaileys.on('auth_failure', async (error) => console.log("ERROR BOT: ", error));
botBaileys.on('qr', (qr) => console.log("NEW QR CODE: ", qr));
botBaileys.on('ready', async () => console.log('READY BOT'));

// Enhanced user session management
const userSessions = new Map();

// Helper function to get or create user session
const getUserSession = (userId) => {
    if (!userSessions.has(userId)) {
        userSessions.set(userId, {
            awaitingResponse: false,
            awaitingYouTubeQuery: false,
            awaitingDownloadChoice: false,
            awaitingLyricsQuery: false,
            pendingVideoInfo: null,
            pendingRelatedVideos: null,
            lastActivity: Date.now()
        });
    }
    return userSessions.get(userId);
};

// Clean up inactive sessions (older than 10 minutes)
setInterval(() => {
    const now = Date.now();
    for (const [userId, session] of userSessions.entries()) {
        if (now - session.lastActivity > 600000) { // 10 minutes
            userSessions.delete(userId);
        }
    }
}, 300000); // Check every 5 minutes

// Helper function to create temporary file path
const createTempFilePath = (extension) => {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(7);
    return path.join(__dirname, 'temp', `${timestamp}_${random}.${extension}`);
};

// Ensure temp directory exists
const tempDir = path.join(__dirname, 'temp');
if (!fs.existsSync(tempDir)) {
    fs.mkdirSync(tempDir, { recursive: true });
}

// Helper function to clean up temporary files
const cleanupTempFile = (filePath) => {
    setTimeout(() => {
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
        }
    }, 5000); // Delete after 5 seconds
};

// Helper function to download image from URL
const downloadImage = (url, filepath) => {
    return new Promise((resolve, reject) => {
        const file = fs.createWriteStream(filepath);
        https.get(url, (response) => {
            response.pipe(file);
            file.on('finish', () => {
                file.close();
                resolve(filepath);
            });
        }).on('error', (err) => {
            fs.unlink(filepath, () => {});
            reject(err);
        });
    });
};

botBaileys.on('message', async (message) => {
    const session = getUserSession(message.from);
    session.lastActivity = Date.now();

    try {
        // Handle lyrics query input
        if (session.awaitingLyricsQuery) {
            await handleLyricsSearch(message, session);
            return;
        }

        // Handle YouTube query input
        if (session.awaitingYouTubeQuery) {
            await handleYouTubeSearch(message, session);
            return;
        }

        // Handle download choice
        if (session.awaitingDownloadChoice && session.pendingVideoInfo) {
            await handleDownloadChoice(message, session);
            return;
        }

        // Handle initial menu
        if (!session.awaitingResponse) {
            await botBaileys.sendPoll(message.from, '🤖 Select an option', {
                options: [
                    '💬 Text', 
                    '📷 Media', 
                    '📄 File', 
                    '🎭 Sticker', 
                    '🎵 YouTube Audio', 
                    '🎬 YouTube Video', 
                    '🔍 YouTube Search',
                    '🎤 Song Lyrics',
                    '🔥 Trending Music',
                    '🖼️ Thumbnail Extract'
                ],
            });
            session.awaitingResponse = true;
            return;
        }

        // Handle menu selections
        const command = message.body.toLowerCase().trim();
        await handleMenuCommand(message, session, command);

    } catch (error) {
        console.error('Error processing message:', error);
        await botBaileys.sendText(message.from, '❌ An error occurred. Please try again.');
        resetUserSession(session);
    }
});

// Handle lyrics search
const handleLyricsSearch = async (message, session) => {
    const query = message.body.trim();
    
    if (query.toLowerCase() === 'cancel') {
        await botBaileys.sendText(message.from, '❌ Lyrics search cancelled.');
        resetUserSession(session);
        return;
    }

    await botBaileys.sendText(message.from, '🎤 Searching for lyrics...');

    try {
        const lyricsResult = await getLyrics(query);
        
        if (lyricsResult.error) {
            await botBaileys.sendText(message.from, `❌ ${lyricsResult.error}`);
            resetUserSession(session);
            return;
        }

        const lyrics = lyricsResult.result;
        
        // Note: We don't send full lyrics due to copyright restrictions
        // Instead, we provide song information and a snippet
        const lyricsInfo = `
🎤 *Song Found*

🎵 *Title:* ${lyrics.title}
👨‍🎤 *Artist:* ${lyrics.artist}
💿 *Album:* ${lyrics.album || 'Unknown'}

📝 *Lyrics Preview:*
${lyrics.lyrics ? lyrics.lyrics.substring(0, 200) + '...' : 'Lyrics not available'}

⚠️ *Note:* Full lyrics are not provided due to copyright restrictions. Please visit the official music platforms or lyrics websites for complete lyrics.`;

        await botBaileys.sendText(message.from, lyricsInfo);
        
        // If thumbnail is available, send it
        if (lyrics.thumbnail) {
            try {
                const thumbnailPath = createTempFilePath('jpg');
                await downloadImage(lyrics.thumbnail, thumbnailPath);
                await botBaileys.sendMedia(message.from, thumbnailPath, '🖼️ Song Thumbnail');
                cleanupTempFile(thumbnailPath);
            } catch (error) {
                console.error('Error downloading thumbnail:', error);
            }
        }

    } catch (error) {
        console.error('Lyrics search error:', error);
        await botBaileys.sendText(message.from, '❌ Error searching for lyrics. Please try again.');
    }
    
    resetUserSession(session);
};

// Handle YouTube search
const handleYouTubeSearch = async (message, session) => {
    const query = message.body.trim();
    
    if (query.toLowerCase() === 'cancel') {
        await botBaileys.sendText(message.from, '❌ YouTube search cancelled.');
        resetUserSession(session);
        return;
    }

    await botBaileys.sendText(message.from, '🔍 Searching YouTube...');

    try {
        const videoInfo = await getYoutubeVideoInfo(query);
        
        if (videoInfo.error) {
            await botBaileys.sendText(message.from, `❌ ${videoInfo.error}`);
            resetUserSession(session);
            return;
        }

        const info = videoInfo.result;
        const infoText = `
🎬 *YouTube Video Found*

📝 *Title:* ${info.title}
⏱️ *Duration:* ${info.durationFormatted}
📺 *Channel:* ${info.channelId}
👀 *Views:* ${info.viewCount ? info.viewCount.toLocaleString() : 'N/A'}
👍 *Likes:* ${info.likeCount ? info.likeCount.toLocaleString() : 'N/A'}
🆔 *Video ID:* ${info.videoId}

📝 *Description:*
${info.shortDescription.substring(0, 200)}${info.shortDescription.length > 200 ? '...' : ''}

What would you like to do?`;

        await botBaileys.sendText(message.from, infoText);
        
        // Send thumbnail if available
        if (info.thumbnail) {
            try {
                const thumbnailPath = createTempFilePath('jpg');
                await downloadImage(info.thumbnail, thumbnailPath);
                await botBaileys.sendMedia(message.from, thumbnailPath, '🖼️ Video Thumbnail');
                cleanupTempFile(thumbnailPath);
            } catch (error) {
                console.error('Error downloading thumbnail:', error);
            }
        }

        await botBaileys.sendPoll(message.from, 'Choose an option:', {
            options: [
                '🎵 Download Audio (MP3)', 
                '🎬 Download Video (MP4)', 
                '🔗 Related Videos',
                '🖼️ Extract Thumbnail',
                '❌ Cancel'
            ]
        });

        session.awaitingYouTubeQuery = false;
        session.awaitingDownloadChoice = true;
        session.pendingVideoInfo = info;

        // Get related videos in background
        try {
            const relatedVideos = await getRelatedVideos(info.videoId);
            session.pendingRelatedVideos = relatedVideos.result || [];
        } catch (error) {
            console.error('Error getting related videos:', error);
            session.pendingRelatedVideos = [];
        }

    } catch (error) {
        console.error('YouTube search error:', error);
        await botBaileys.sendText(message.from, '❌ Error searching YouTube. Please try again.');
        resetUserSession(session);
    }
};

// Handle download choice
const handleDownloadChoice = async (message, session) => {
    const choice = message.body.toLowerCase().trim();
    
    if (choice.includes('cancel')) {
        await botBaileys.sendText(message.from, '❌ Operation cancelled.');
        resetUserSession(session);
        return;
    }

    const videoInfo = session.pendingVideoInfo;
    
    if (choice.includes('audio') || choice.includes('mp3')) {
        await downloadYouTubeAudio(message.from, videoInfo);
    } else if (choice.includes('video') || choice.includes('mp4')) {
        await downloadYouTubeVideo(message.from, videoInfo);
    } else if (choice.includes('related')) {
        await showRelatedVideos(message.from, session);
    } else if (choice.includes('thumbnail')) {
        await extractThumbnail(message.from, videoInfo);
    } else {
        await botBaileys.sendText(message.from, '❌ Invalid choice. Please select a valid option.');
        return;
    }
    
    resetUserSession(session);
};

// Show related videos
const showRelatedVideos = async (phoneNumber, session) => {
    try {
        if (!session.pendingRelatedVideos || session.pendingRelatedVideos.length === 0) {
            await botBaileys.sendText(phoneNumber, '❌ No related videos found.');
            return;
        }

        let relatedText = '🔗 *Related Videos:*\n\n';
        
        session.pendingRelatedVideos.slice(0, 5).forEach((video, index) => {
            relatedText += `${index + 1}. *${video.title}*\n`;
            relatedText += `   📺 ${video.channelTitle}\n`;
            relatedText += `   ⏱️ ${video.duration || 'N/A'}\n`;
            relatedText += `   👀 ${video.viewCount ? video.viewCount.toLocaleString() : 'N/A'} views\n`;
            relatedText += `   🔗 https://youtu.be/${video.videoId}\n\n`;
        });

        await botBaileys.sendText(phoneNumber, relatedText);
        
    } catch (error) {
        console.error('Error showing related videos:', error);
        await botBaileys.sendText(phoneNumber, '❌ Error retrieving related videos.');
    }
};

// Extract thumbnail
const extractThumbnail = async (phoneNumber, videoInfo) => {
    try {
        await botBaileys.sendText(phoneNumber, '🖼️ Extracting thumbnail...');
        
        if (!videoInfo.thumbnail) {
            await botBaileys.sendText(phoneNumber, '❌ No thumbnail available for this video.');
            return;
        }

        const thumbnailPath = createTempFilePath('jpg');
        await downloadImage(videoInfo.thumbnail, thumbnailPath);
        
        await botBaileys.sendMedia(phoneNumber, thumbnailPath, 
            `🖼️ *Thumbnail Extracted*\n\n📝 *Title:* ${videoInfo.title}\n📺 *Channel:* ${videoInfo.channelId}`
        );
        
        cleanupTempFile(thumbnailPath);
        
    } catch (error) {
        console.error('Thumbnail extraction error:', error);
        await botBaileys.sendText(phoneNumber, '❌ Error extracting thumbnail. Please try again.');
    }
};

// Get trending music
const getTrendingMusic = async (phoneNumber) => {
    try {
        await botBaileys.sendText(phoneNumber, '🔥 Getting trending music...');
        
        const trendingResult = await getYoutubeTrending('music');
        
        if (trendingResult.error) {
            await botBaileys.sendText(phoneNumber, `❌ ${trendingResult.error}`);
            return;
        }

        const trending = trendingResult.result;
        let trendingText = '🔥 *Trending Music:*\n\n';
        
        trending.slice(0, 10).forEach((video, index) => {
            trendingText += `${index + 1}. *${video.title}*\n`;
            trendingText += `   👨‍🎤 ${video.channelTitle}\n`;
            trendingText += `   👀 ${video.viewCount ? video.viewCount.toLocaleString() : 'N/A'} views\n`;
            trendingText += `   🔗 https://youtu.be/${video.videoId}\n\n`;
        });

        await botBaileys.sendText(phoneNumber, trendingText);
        
    } catch (error) {
        console.error('Trending music error:', error);
        await botBaileys.sendText(phoneNumber, '❌ Error getting trending music. Please try again.');
    }
};

// Download YouTube audio
const downloadYouTubeAudio = async (phoneNumber, videoInfo) => {
    try {
        await botBaileys.sendText(phoneNumber, '🎵 Downloading audio... Please wait.');
        
        const audioResult = await getYoutubeMP3(`https://www.youtube.com/watch?v=${videoInfo.videoId}`);
        
        if (audioResult.error) {
            await botBaileys.sendText(phoneNumber, `❌ Error downloading audio: ${audioResult.error}`);
            return;
        }

        // Save audio buffer to temporary file
        const tempFilePath = createTempFilePath('mp3');
        fs.writeFileSync(tempFilePath, audioResult.result);
        
        // Send audio file
        await botBaileys.sendAudio(phoneNumber, tempFilePath);
        await botBaileys.sendText(phoneNumber, `🎵 *${videoInfo.title}*\n✅ Audio downloaded successfully!`);
        
        // Cleanup
        cleanupTempFile(tempFilePath);
        
    } catch (error) {
        console.error('Audio download error:', error);
        await botBaileys.sendText(phoneNumber, '❌ Error downloading audio. Please try again.');
    }
};

// Download YouTube video
const downloadYouTubeVideo = async (phoneNumber, videoInfo) => {
    try {
        await botBaileys.sendText(phoneNumber, '🎬 Downloading video... Please wait (this may take a while).');
        
        // Show progress updates
        const progressCallback = (progress) => {
            console.log(`Download progress: ${progress}`);
        };
        
        const videoResult = await getYoutubeMP4(`https://www.youtube.com/watch?v=${videoInfo.videoId}`, progressCallback);
        
        if (videoResult.error) {
            await botBaileys.sendText(phoneNumber, `❌ Error downloading video: ${videoResult.error}`);
            return;
        }

        // Save video buffer to temporary file
        const tempFilePath = createTempFilePath('mp4');
        fs.writeFileSync(tempFilePath, videoResult.result);
        
        // Check file size (WhatsApp has limits)
        const fileSizeMB = fs.statSync(tempFilePath).size / (1024 * 1024);
        
        if (fileSizeMB > 64) { // WhatsApp video limit is ~64MB
            await botBaileys.sendText(phoneNumber, 
                `❌ Video is too large (${fileSizeMB.toFixed(1)}MB). WhatsApp limit is 64MB.\n\n` +
                `🎵 Would you like to download as audio instead?`
            );
            cleanupTempFile(tempFilePath);
            return;
        }
        
        // Send video file
        await botBaileys.sendVideo(phoneNumber, tempFilePath, `🎬 *${videoInfo.title}*\n✅ Video downloaded successfully!`);
        
        // Cleanup
        cleanupTempFile(tempFilePath);
        
    } catch (error) {
        console.error('Video download error:', error);
        await botBaileys.sendText(phoneNumber, '❌ Error downloading video. Please try again.');
    }
};

// Handle menu commands
const handleMenuCommand = async (message, session, command) => {
    switch (command) {
        case 'text':
        case '💬 text':
            await botBaileys.sendText(message.from, 'Hello world! 👋');
            break;
            
        case 'media':
        case '📷 media':
            await botBaileys.sendMedia(message.from, 'https://www.w3schools.com/w3css/img_lights.jpg', 'Hello world! 📷');
            break;
            
        case 'file':
        case '📄 file':
            await botBaileys.sendFile(message.from, 'https://github.com/pedrazadixon/sample-files/raw/main/sample_pdf.pdf');
            break;
            
        case 'sticker':
        case '🎭 sticker':
            await botBaileys.sendSticker(message.from, 'https://gifimgs.com/animations/anime/dragon-ball-z/Goku/goku_34.gif', { pack: 'User', author: 'Me' });
            break;
            
        case 'youtube audio':
        case '🎵 youtube audio':
            await botBaileys.sendText(message.from, 
                '🎵 *YouTube Audio Downloader*\n\n' +
                'Send me:\n' +
                '• YouTube URL\n' +
                '• Video title to search\n' +
                '• Artist name and song\n\n' +
                'Type "cancel" to abort.'
            );
            session.awaitingYouTubeQuery = true;
            session.awaitingResponse = false;
            break;
            
        case 'youtube video':
        case '🎬 youtube video':
            await botBaileys.sendText(message.from, 
                '🎬 *YouTube Video Downloader*\n\n' +
                'Send me:\n' +
                '• YouTube URL\n' +
                '• Video title to search\n\n' +
                '⚠️ *Note:* Videos larger than 64MB cannot be sent via WhatsApp.\n\n' +
                'Type "cancel" to abort.'
            );
            session.awaitingYouTubeQuery = true;
            session.awaitingResponse = false;
            break;
            
        case 'youtube search':
        case '🔍 youtube search':
            await botBaileys.sendText(message.from, 
                '🔍 *YouTube Search*\n\n' +
                'Send me any search term and I\'ll find videos for you!\n\n' +
                'Examples:\n' +
                '• "Imagine Dragons Bones"\n' +
                '• "How to cook pasta"\n' +
                '• "JavaScript tutorial"\n\n' +
                'Type "cancel" to abort.'
            );
            session.awaitingYouTubeQuery = true;
            session.awaitingResponse = false;
            break;
            
        case 'song lyrics':
        case '🎤 song lyrics':
            await botBaileys.sendText(message.from, 
                '🎤 *Song Lyrics Search*\n\n' +
                'Send me:\n' +
                '• Song title and artist\n' +
                '• Just the song title\n' +
                '• Part of the lyrics\n\n' +
                'Examples:\n' +
                '• "Imagine Dragons Bones"\n' +
                '• "Shape of You Ed Sheeran"\n' +
                '• "Hello Adele"\n\n' +
                '⚠️ *Note:* Only song information and preview will be provided due to copyright restrictions.\n\n' +
                'Type "cancel" to abort.'
            );
            session.awaitingLyricsQuery = true;
            session.awaitingResponse = false;
            break;
            
        case 'trending music':
        case '🔥 trending music':
            await getTrendingMusic(message.from);
            break;
            
        case 'thumbnail extract':
        case '🖼️ thumbnail extract':
            await botBaileys.sendText(message.from, 
                '🖼️ *Thumbnail Extractor*\n\n' +
                'Send me:\n' +
                '• YouTube URL\n' +
                '• Video title to search\n\n' +
                'I\'ll extract the high-quality thumbnail for you!\n\n' +
                'Type "cancel" to abort.'
            );
            session.awaitingYouTubeQuery = true;
            session.awaitingResponse = false;
            break;
            
        default:
            await botBaileys.sendText(message.from, 
                '❌ Sorry, I didn\'t understand that command.\n\n' +
                '🔄 Please select an option from the poll menu.'
            );
            break;
    }
    
    // Reset session for completed commands (except YouTube and lyrics ones)
    if (!session.awaitingYouTubeQuery && !session.awaitingLyricsQuery) {
        resetUserSession(session);
    }
};

// Reset user session
const resetUserSession = (session) => {
    session.awaitingResponse = false;
    session.awaitingYouTubeQuery = false;
    session.awaitingDownloadChoice = false;
    session.awaitingLyricsQuery = false;
    session.pendingVideoInfo = null;
    session.pendingRelatedVideos = null;
};
