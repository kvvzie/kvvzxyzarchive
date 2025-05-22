// spotify and yt spyier
document.addEventListener("DOMContentLoaded", function() {
    /*if (!window.location.pathname.includes('/spying')) {
        return;
    }
    */

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
            displayMessage('error not listening to anything');
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
// page load
function onPageLoaded()
{
    console.log("page loaded :3");
}
// img shadow
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
// music v1
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
        document.body.style.overflowY= 'auto';

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
// music v2
document.addEventListener('DOMContentLoaded', function() {
    const audioElement = document.getElementById('background-music');
    const sourceElement = document.getElementById('audio-source');
    const hoverTextElement = document.querySelector('.hover-text');
    const musicDirectory = '/music/';
    const discnamesDirectory = '/discnames/';
    const myMusicDirectory = '/mymusic/';

    const myMusicFiles = [
        'experiment1.mp3',
        'experiment1seperate.mp3'
    ];

    const musicFiles = [
// The College Dropout - Kanye West
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
        'heavyhitters.mp3',
        'livininamoviepart1.mp3',
// Graduation - Kanye West
        'goodmorning.mp3',
        'champion.mp3',
        'stronger.mp3',
        'iwonder.mp3',
        'goodlife.mp3',
        'canttellmenothing.mp3',
        'barrybonds.mp3',
        'drunkandhotgirls.mp3',
        'flashinglights.mp3',
        'everythingiam.mp3',
        'theglory.mp3',
        'homecoming.mp3',
        'bigbrother.mp3',
        'goodnight.mp3',
        'bittersweetpoetry.mp3',
// 808s & Heartbreak - Kanye West
        'sayyouwill.mp3',
        'welcometoheartbreak.mp3',
        'heartless.mp3',
        'amazing.mp3',
        'lovelockdown.mp3',
        'paranoid.mp3',
        'robocop.mp3',
        'streetlights.mp3',
        'badnews.mp3',
        'seeyouinmynightmares.mp3',
        'coldestwinter.mp3',
        'pinocchiostory.mp3',
// My Beautiful Dark Twisted Fantasy - Kanye West
        'darkfantasy.mp3',
        'gorgeous.mp3',
        'power.mp3',
        'allofthelightsinterlude.mp3',
        'allofthelights.mp3',
        'monster.mp3',
        'soappalled.mp3',
        'devilinanewdress.mp3',
        'runaway.mp3',
        'hellofalife.mp3',
        'blamegame.mp3',
        'lostintheworld.mp3',
        'whowillsurviveinamerica.mp3',
// Yeezus - Kanye West
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
// The Life Of Pablo - Kanye West
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
// ye - Kanye West
        'ithoughtaboutkillingyou.mp3',
        'yikes.mp3',
        'allmine.mp3',
        'wouldntleave.mp3',
        'nomistakes.mp3',
        'ghosttown.mp3',
        'violentcrimes.mp3',
// MM..FOOD - MF DOOM
        'onebeer.mp3',
    ];


    function getRandomMusicFile() {
    const myMusicWeight = 2;

    const weightedList = [];

    myMusicFiles.forEach(file => {
        for (let i = 0; i < myMusicWeight; i++) {
            weightedList.push({ file: file, folder: myMusicDirectory });
        }
    });

    musicFiles.forEach(file => {
        weightedList.push({ file: file, folder: musicDirectory });
    });

    const randomPick = weightedList[Math.floor(Math.random() * weightedList.length)];
    return randomPick;
}


    function setMusicAndDiscInfo() {
        const selected = getRandomMusicFile();
        const fileName = selected.file.replace('.mp3', '');

        sourceElement.src = selected.folder + selected.file;
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
//secret cds
document.addEventListener('DOMContentLoaded', function() {
    if (!window.location.pathname.includes('/pictures')) {
        return;
    }

    var cds = document.getElementById('cds');
    var clickCount = 0;

    cds.addEventListener('click', function() {
        clickCount++;

        if (clickCount === 3) {
            window.location.href = '/cds';
        }
    });
});
//idk
document.querySelector("img").addEventListener("mouseover", function () {
    this.classList.add("bounce");
});
//rainbow cursor
document.addEventListener('mousemove', (e) => {
    const trail = document.createElement('div');
    trail.className = 'cursor-trail';

    
    trail.style.left = `${e.pageX}px`;
    trail.style.top = `${e.pageY}px`;

    document.body.appendChild(trail);

   
    setTimeout(() => {
        trail.remove();
    }, 1200);
});
// popup
document.addEventListener('DOMContentLoaded', () => {
    const taskbar = document.getElementById('taskbar');
    const createPopupButton = document.getElementById('createPopupButton');
    const actionDeniedMessage = document.getElementById('actionDeniedMessage');

    function displayActionDenied() {
        actionDeniedMessage.classList.remove('hidden');
        setTimeout(() => {
            actionDeniedMessage.classList.add('hidden');
        }, 1000);
    }

    window.closePopup = function (popupId) {
        const popup = document.getElementById(popupId);
        if (popup && popup.classList.contains('unclosable')) {
            displayActionDenied();
        } else if (popup) {
            popup.remove();
            removeTaskbarItem(popupId);
            localStorage.removeItem(`popupState-${popupId}`);
        }
    };

    function loadPopupState() {
        document.querySelectorAll('.popup').forEach(popup => {
            const popupId = popup.id;
            const savedState = localStorage.getItem(`popupState-${popupId}`);
            if (savedState) {
                const { top, left, width, height, minimized } = JSON.parse(savedState);
                popup.style.top = `${top}px`;
                popup.style.left = `${left}px`;
                popup.style.width = `${width}px`;
                popup.style.height = `${height}px`;
                popup.style.display = minimized ? 'none' : 'block';
            }
        });
    }

    function savePopupState(popup) {
        const popupId = popup.id;
        if (popupId) {
            const state = {
                top: popup.offsetTop,
                left: popup.offsetLeft,
                width: popup.offsetWidth,
                height: popup.offsetHeight,
                minimized: popup.style.display === 'none'
            };
            localStorage.setItem(`popupState-${popupId}`, JSON.stringify(state));
        }
    }

    document.querySelectorAll('.popup').forEach(popup => {
        const popupId = popup.id;
        const title = popup.querySelector('.popupHeader').innerText.trim();
        addTaskbarItem(popupId, title);
        if (!popup.classList.contains('non-draggable')) {
            makePopupDraggable(popup);
        }

        const closeButton = popup.querySelector('.popupHeader button');
        if (closeButton) {
            closeButton.onclick = () => closePopup(popupId);
        }

        const header = popup.querySelector('.popupHeader');
        header.addEventListener('contextmenu', (e) => {
            e.preventDefault();
            showContextMenu(e, popupId);
        });
    });

    loadPopupState();

    createPopupButton.addEventListener('click', () => {
        const popupId = 'dynamicPopup-' + Date.now();
        const newPopup = document.createElement('div');

        newPopup.id = popupId;
        newPopup.classList.add('popup', 'resizable');
        newPopup.innerHTML = `
            <div class="popupHeader">
                New Dynamic Popup
                <button style="border: 0px; background-color: transparent;" onclick="closePopup('${popupId}')">
                    <img height="20px" src="/images/Exit.png">
                </button>
            </div>
            <div class="popupContent">
                <p>This is the content of a new dynamic popup.</p>
            </div>
        `;

        document.body.appendChild(newPopup);
        makePopupDraggable(newPopup);
        addTaskbarItem(popupId, 'Dynamic Popup');

        const header = newPopup.querySelector('.popupHeader');
        header.addEventListener('contextmenu', (e) => {
            e.preventDefault();
            showContextMenu(e, popupId);
        });

        savePopupState(newPopup);
    });

    function addTaskbarItem(popupId, title) {
        const taskbarItem = document.createElement('div');
        taskbarItem.classList.add('taskbarItem');
        taskbarItem.innerText = title;
        taskbarItem.dataset.popupId = popupId;

        taskbar.appendChild(taskbarItem);

        taskbarItem.addEventListener('click', () => {
            const popup = document.getElementById(popupId);
            if (popup) {
                popup.style.display = popup.style.display === 'none' ? 'block' : 'none';
        
                document.querySelectorAll('.popup').forEach(p => p.style.zIndex = '1000');
                popup.style.zIndex = '2000';
        
                savePopupState(popup);
            }
        });
        

        taskbarItem.addEventListener('contextmenu', (e) => {
            e.preventDefault();
            showContextMenu(e, popupId);
        });
    }

    function removeTaskbarItem(popupId) {
        const taskbarItem = Array.from(taskbar.children).find(item => item.dataset.popupId === popupId);
        if (taskbarItem) {
            taskbarItem.remove();
        }
    }

    function makePopupDraggable(popup) {
        if (popup.classList.contains('non-draggable')) return;

        let offsetX, offsetY, isDragging = false;
        const header = popup.querySelector('.popupHeader');
        header.style.cursor = 'grab';

        header.addEventListener('mousedown', (e) => {
            isDragging = true;
            offsetX = e.clientX - popup.offsetLeft;
            offsetY = e.clientY - popup.offsetTop;
            header.style.cursor = 'grabbing';
        });

        document.addEventListener('mousemove', (e) => {
            if (isDragging) {
                popup.style.top = `${e.clientY - offsetY}px`;
                popup.style.left = `${e.clientX - offsetX}px`;
            }
        });

        document.addEventListener('mouseup', () => {
            if (isDragging) {
                isDragging = false;
                header.style.cursor = 'grab';
                savePopupState(popup);
            }
        });

        document.querySelectorAll('.popup.scalable').forEach(popup => {
            popup.addEventListener('resize', () => {
                savePopupState(popup);
            });
        });
    }

    function showContextMenu(e, popupId) {
        let contextMenu = document.getElementById('contextMenu');
        if (!contextMenu) {
            contextMenu = document.createElement('div');
            contextMenu.id = 'contextMenu';
            contextMenu.classList.add('context-menu');
            document.body.appendChild(contextMenu);
        }

        contextMenu.innerHTML = `
            <div onclick="minimizePopup('${popupId}')">Minimize</div>
            <div onclick="closePopup('${popupId}')">Close</div>
            <div onclick="resetPopup('${popupId}')">Reset</div>
        `;

        const spaceBelow = window.innerHeight - e.clientY;
        if (spaceBelow < contextMenu.offsetHeight) {
            contextMenu.style.top = `${e.clientY - contextMenu.offsetHeight}px`;
        } else {
            contextMenu.style.top = `${e.clientY}px`;
        }
        contextMenu.style.left = `${e.clientX}px`;
        contextMenu.style.display = 'block';

        document.addEventListener('click', () => {
            contextMenu.style.display = 'none';
        }, { once: true });
    }

    window.minimizePopup = function (popupId) {
        const popup = document.getElementById(popupId);
        if (popup) {
            popup.style.display = 'none';
            savePopupState(popup);
        }
    };

    window.resetPopup = function (popupId) {
        const popup = document.getElementById(popupId);
        if (popup) {
            const defaultBottom = popup.getAttribute('data-bottom') || '50px';
            const defaultLeft = popup.getAttribute('data-left') || '50px';
            const defaultWidth = popup.getAttribute('data-width') || '300px';
            const defaultHeight = popup.getAttribute('data-height') || '200px';
    
            popup.style.bottom = defaultBottom;
            popup.style.left = defaultLeft;
            popup.style.width = defaultWidth;
            popup.style.height = defaultHeight;
    
            popup.style.display = 'block';
    
            localStorage.removeItem(`popupState-${popupId}`);
            savePopupState(popup);
        }
    };
});

//global chat
document.addEventListener('DOMContentLoaded', () => {
    const chatForm = document.getElementById('chatForm');
    const chatNick = document.getElementById('chatNick');
    const chatInput = document.getElementById('chatInput');
    const chatMessages = document.getElementById('chatMessages');

    chatForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const msg = chatInput.value.trim();
        const nick = chatNick.value.trim();

        if (msg === '' || nick === '') return;

        fetch('/save_message.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: new URLSearchParams({
                nick: nick,
                message: msg
            }).toString()
        })
        .then(res => {
            if (!res.ok) {
                return res.text().then(err => { throw new Error(err); });
            }
            chatInput.value = '';
            chatNick.value = '';
            loadMessages();
        })
        .catch(err => {
            alert("error: " + err.message);
        });
    });

    function loadMessages() {
        fetch('/get_messages.php')
            .then(res => res.text())
            .then(data => {
                chatMessages.innerHTML = data;
                chatMessages.scrollTop = chatMessages.scrollHeight;
            });
    }

    setInterval(loadMessages, 2000);
    loadMessages();
});

// color change sections and taskbar and popups

document.addEventListener("DOMContentLoaded", function() {
    const logo = document.querySelector(".taskbarlogo");


    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const theme = entry.target.dataset.theme;
                document.body.className = 'theme-' + theme;

                switch(theme) {
                    case 'red':
                        logo.src = '/images/windnowsxplogo2010red.png';
                        break;
                    case 'pink':
                        logo.src = '/images/windnowsxplogo2010pink.png';
                        break;
                    case 'green':
                        logo.src = '/images/windnowsxplogo2010green.png';
                        break;
                    default:
                        logo.src = '/images/taskbarlogo.png'; // default red bo jest pierwszy
                }
            }
        });
    }, {
        root: document.querySelector(".popupContent"),
        threshold: 0.3
    });

    document.querySelectorAll(".section").forEach(section => {
        observer.observe(section);
    });
});