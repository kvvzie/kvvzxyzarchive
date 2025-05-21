document.addEventListener("DOMContentLoaded", function() {
    if (!window.location.pathname.includes('/spying')) {
        return;
    }

    let currentTrackId = null;
    let currentYouTubeVideoId = null;

    async function fetchCurrentlyPlaying() {
        try {
            const response = await fetch('https://kvvz.xyz/currently-playing');

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();

            if (data.error) {
                console.error('Error:', data.error);
                displayMessage('No track currently playing');
                return;
            }

            console.log('Track data:', data);

            if (data.trackId !== currentTrackId) {
                const iframeElement = document.getElementById('spotify-embed');
                iframeElement.src = `https://open.spotify.com/embed/track/${data.trackId}?utm_source=generator`;

                displayMessage('');

                currentTrackId = data.trackId;
            }
        } catch (error) {
            console.error('Error:', error);
            displayMessage('Error fetching currently playing track');
        }
    }

    async function fetchCurrentlyWatching() {
        try {
            const response = await fetch('https://kvvz.xyz/currently-watching');

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();

            if (data.message) {
                displayYouTubeMessage(data.message);
                return;
            }

            console.log('YouTube data:', data);

            if (data.videoId !== currentYouTubeVideoId) {
                const iframeElement = document.getElementById('youtube-embed');
                iframeElement.src = `https://www.youtube.com/embed/${data.videoId}`;

                displayYouTubeMessage('');

                currentYouTubeVideoId = data.videoId;
            }
        } catch (error) {
            console.error('Error:', error);
            displayYouTubeMessage('Error fetching currently watching video');
        }
    }

    function displayMessage(message) {
        const messageElement = document.getElementById('message');
        messageElement.textContent = message;
    }

    function displayYouTubeMessage(message) {
        const messageElement = document.getElementById('youtube-message');
        messageElement.textContent = message;
    }

    fetchCurrentlyPlaying();
    fetchCurrentlyWatching();
    setInterval(fetchCurrentlyPlaying, 5000);
    setInterval(fetchCurrentlyWatching, 5000);
});

function onPageLoaded()
{
    console.log("page loaded :3");
}

document.addEventListener('DOMContentLoaded', function () {
    const colorThief = new ColorThief();
    const images = document.querySelectorAll('.image-with-glow');

    images.forEach(function (img) {
        img.addEventListener('load', function () {
            if (img.complete) {
                const dominantColor = colorThief.getColor(img);
                const rgbaColor = `rgba(${dominantColor[0]}, ${dominantColor[1]}, ${dominantColor[2]}, 0.8)`;

                img.style.boxShadow = `0 0 25px 10px ${rgbaColor}`;
                img.addEventListener('mouseover', function () {
                    img.style.boxShadow = `0 0 50px 30px ${rgbaColor}`;
                });
                img.addEventListener('mouseout', function () {
                    img.style.boxShadow = `0 0 25px 10px ${rgbaColor}`;
                });
            }
        });
    });
});
document.addEventListener('DOMContentLoaded', function() {
    let clickCount = 0; 
    const maxClicks = 5;
    const discElement = document.querySelector('.disc');
    const audioElement = document.getElementById('background-music');

    function removeContent(callback) {
        const contentElements = document.querySelectorAll('.container');
        contentElements.forEach(element => {
            element.style.transition = 'opacity 1s ease-out';
            element.style.opacity = '0';

            setTimeout(() => {
                element.remove();

                if (contentElements[contentElements.length - 1] === element) {
                    callback();
                }
            }, 1000);
        });
    }

    function logMusicFileName() {
        if (audioElement) {
            const musicSource = audioElement.querySelector('source').src;
            const fileNameWithMp3 = musicSource.split('/').pop(); 
            const fileName = fileNameWithMp3.replace('.mp3', '');
            console.log(`Current music file: ${fileName}`);

            const lyricsPath = `/lyrics/${fileName}.txt`;

            fetch(lyricsPath)
                .then(response => {
                    if (!response.ok) {
                        throw new Error(`File not found: ${lyricsPath}`);
                    }
                    return response.text();
                })
                .then(data => {
                    console.log(`Lyrics for ${fileName}:`);
                    console.log(data); 

                    displayLyricsAtTop(data);
                })
                .catch(error => {
                    console.error(error);
                });
        }
    }

    function displayLyricsAtTop(lyrics) {
        const newContainer = document.createElement('div'); 
        newContainer.classList.add('container');
        newContainer.style.marginBottom = '20px';
        newContainer.style.color = 'white';
        newContainer.style.opacity = '0';
        newContainer.style.transition = 'opacity 1s ease-in';

        const lines = lyrics.split('\n');

        lines.forEach(line => {
            const lineElement = document.createElement('p');
            lineElement.textContent = line;
            newContainer.appendChild(lineElement);
        });

        document.body.insertBefore(newContainer, document.body.firstChild);

        setTimeout(() => {
            newContainer.style.opacity = '1';
        }, 10);
    }

    function darkerBackground() {
        const content = document.querySelector('#background-container');
        if (content) {
            content.style.opacity = '0.2';
            content.style.transition = 'opacity 2s ease-out';
        }
    }

    let discClicked = false;

    if (discElement) {
        discElement.addEventListener('click', function() {
            clickCount++;

            if (clickCount === maxClicks) {
                discClicked = true;
                removeContent(() => {
                    logMusicFileName();
                });
                darkerBackground();
            } else if (clickCount === 66) {
                const notePatch = '/files/note.dontreadme';
                fetch(notePatch)
                    .then(response => {
                        if (!response.ok) {
                            throw new Error(`File not found: ${notePatch}`);
                        }
                        return response.text();
                    })
                    .then(data => {
                        console.log(`${notePatch}:`);
                        console.log(data);
                    })
                    .catch(error => {
                        console.error(error);
                    });
            }
        });
    }

    function changeMusic() {
        removeContent(() => {
            logMusicFileName();
        });
    }

    audioElement.addEventListener('ended', function() {
        if (discClicked) { 
            discClicked = false;
            changeMusic();
        }
    });
});

document.addEventListener('DOMContentLoaded', function() {
    const audioElement = document.getElementById('background-music');
    const sourceElement = document.getElementById('audio-source');
    const hoverTextElement = document.querySelector('.hover-text');
    const musicDirectory = '/music/';
    const discnamesDirectory = '/discnames/';

    const musicFiles = [
        'barrybonds.mp3',
        'bigbrother.mp3',
        'bittersweetpoetry.mp3',
        'canttellmenothing.mp3',
        'champion.mp3',
        'drunkandhotgirls.mp3',
        'everythingiam.mp3',
        'flashinglights.mp3',
        'goodlife.mp3',
        'goodmorning.mp3',
        'goodnight.mp3',
        'homecoming.mp3',
        'iwonder.mp3',
        'onebeer.mp3',
        'stronger.mp3',
        'theglory.mp3',
        'onsight.mp3',
        'blackskinhead.mp3',
        'iamagod.mp3',
        'newslaves.mp3',
        'holdmyliquor.mp3',
        'iminit.mp3',
        'bloodontheleaves.mp3',
        'guilttrip.mp3',
        'senditup.mp3',
        'bound2.mp3',
        'darkfantasy.mp3',
        'gorgeous.mp3',
        'power.mp3',
        'allofthelights.mp3',
        'monster.mp3',
        'soappalled.mp3',
        'devilinanewdress.mp3',
        'runaway.mp3',
        'hellofalife.mp3',
        'blamegame.mp3',
        'lostintheworld.mp3',
        'whowillsurviveinamerica.mp3',
        'ultralightbeam.mp3',
        'fatherstreatchmyhandspt1.mp3',
        'pt2.mp3',
        'famous.mp3',
        'feedback.mp3',
        'lowlights.mp3',
        'highlights.mp3',
        'freestyle4.mp3',
        'ilovekanye.mp3',
        'waves.mp3',
        'fml.mp3',
        'realfriends.mp3',
        'wolves.mp3',
        'frankstrack.mp3',
        'silversurferintermission.mp3',
        '30hours.mp3',
        'nomorepartiesinla.mp3',
        'facts.mp3',
        'fade.mp3',
        'saintpablo.mp3',
        'intro.mp3',
        'wedontcare.mp3',
        'graduationday.mp3',
        'allfallsdown.mp3',
        'illflyaway.mp3',
        'spaceship.mp3',
        'jesuswalks.mp3',
        'neverletmedown.mp3',
        'getemhigh.mp3',
        'workoutplan.mp3',
        'thenewworkoutplan.mp3',
        'slowjamz.mp3',
        'breatheinbreatheout.mp3',
        'schoolspiritskit1.mp3',
        'schoolspirit.mp3',
        'schoolspiritskit2.mp3',
        'liljimmyskit.mp3',
        'twowords.mp3',
        'throughthewire.mp3',
        'familybusiness.mp3',
        'lastcall.mp3',



        
    ];


    function getRandomMusicFile() {
        const randomIndex = Math.floor(Math.random() * musicFiles.length);
        return musicFiles[randomIndex];
    }

    function setMusicAndDiscInfo() {
        const selectedMusicFile = getRandomMusicFile();
        const fileName = selectedMusicFile.replace('.mp3', '');

        sourceElement.src = musicDirectory + selectedMusicFile;
        audioElement.load();
        audioElement.play();

        const discFilePath = discnamesDirectory + fileName + '.disc';
        fetch(discFilePath)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`File not found: ${discFilePath}`);
                }
                return response.text();
            })
            .then(data => {
                const formattedText = data.split('\n').map(line => line.trim()).join('<br>');
                hoverTextElement.innerHTML = formattedText;
            })
            .catch(error => {
                console.error(error);
                hoverTextElement.textContent = 'File not found';
            });
    }

    audioElement.addEventListener('ended', function() {
        setMusicAndDiscInfo();
    });

    setMusicAndDiscInfo();
});
