console.log("Final_Final_Index.js loaded");

// async function getCurrentTab() {
//     let queryOptions = { active: true, currentWindow: true };
//     let [tab] = await chrome.tabs.query(queryOptions);
//     return tab;
// }

// Functions
let create_btn = (btn_text, btn_id) => {
    let new_btn = document.createElement("button");
    new_btn.innerHTML = btn_text;
    new_btn.id = btn_id;

    return new_btn;
};

// For future update keep track of state instead of having so many ternary operators
// i.e
//      yt_vid_play = true,
//      yt_vid_pause = false,
//      webcam_vid_play = false,
//      webcam_vid_pause = true,

// Youtube Player Controls
// Youtube Video Container
const yt_vid = document.getElementsByClassName(
    "video-stream html5-main-video"
)[0];
const yt_play_button = document.getElementsByClassName("ytp-play-button")[0];

// aria-label="Pause (k)" || "Play (k)"
let play = () => {
    if (yt_play_button.title == "Pause (k)") {
        yt_play_button.click();
        console.log("play Youtube video");
    }
};

let pause = () => {
    if (yt_play_button.title == "Play (k)") {
        yt_play_button.click();
        console.log("pause Youtube video");
    }
};

let restart = () => {
    yt_vid.currentTime = 0;
    console.log("restart Youtube video");
};

//  350px
//
// Webcam Preview CSS
const style = document.createElement("style");
style.innerHTML = `
            
            .disappear {
                opacity: 0;
                display: none;
            }

            .webcam-preview {
                position: relative;
                
                width: fit-content;
                min-width: 333.33px;

                height: fit-content;
                min-height: 250px;

                display: flex;
                flex-direction: column;

                justify-content: space-between;

                background: rgba(167, 166, 166, 0.12);
            }

            .webcam-video {
                width: 100%;
                height: 250px;

                z-index: 98;
            }
            
            .recording-indicator {
                position: absolute;
                top: 8px;
                left: 16px;

                z-index: 99;

                width: 24px;
                height: 24px;

                display: flex;
                align-items: center;
                justify-content: end;

                background-color: #8d8d8dad;
                border-radius: 50%;
            }

            .active-recording {
                background-color: #32e282dd;
                animation: record-animation 3000ms linear 0ms infinite;
            }

            .recording-indicator:hover {
                padding: 0rem .5rem;
                width: fit-content;
                height: unset;
                
                border-radius: 50px;
            }

            .webcam-control-panel {
                    position: absolute;
                    bottom: 5px;

                    z-index: 99;

                    padding: 6px 8px;

                    margin: 0 12px;
                    
                    width: calc(100% - 24px);
                    
                    box-sizing: border-box;

                    display: flex;
                    align-items: center;
                    justify-content: space-between;

                    opacity: 0;
                    background-color: #adadad82;

                    border-radius: 15px;

                    transition: opacity 200ms linear;
            }

            .webcam-preview:hover .webcam-control-panel {
                opacity: 1;
            }

            #record-btn {
                z-index: 99;
                
                padding: .25rem .75rem;
                color: #4d4d4d;
                background-color: #cdcdcd;
                border: 1px solid #4d4d4d;
                border-radius: 25px;
                box-shadow: -1px 2px 0px 0px #4d4d4d;

            }

            #record-btn:active {
                box-shadow: -1px 1px 0px 0px #4d4d4d;
                transform: translateY(1px);
            }

            #download-btn {
                text-decoration: none;
                cursor: pointer;
            }

            #download-btn,
            #playback-btn {
                z-index: 99;

                font-family: "open sans", arial;
                font-size: 14px;
                
                padding: .25rem .75rem;

                display: flex;
                align-items: center;
                justify-content: center;
                
                color: #4d4d4d;
                background-color: #cdcdcd;
                
                border: 1px solid #4d4d4d;
                border-radius: 25px;
                
                box-shadow: -2px 4px 0px 0px #4d4d4d;

                transform: translate(2px, -2px)
            }

            #download-btn:active,
            #playback-btn:active {
                box-shadow: -1px 2px 0px 0px #4d4d4d;
                transform: translateX(-1px) translateY(2px);
            }

            @keyframes record-animation {
                0% {
                    background-color: #32e282ff;
                }
                10% {
                    background-color: #32e28200;
                }
                20% {
                    background-color: #32e282ff;
                }
                100% {
                    background-color: #32e282ff;
                }
            }
    `;
document.head.appendChild(style);

// Create Elements
// Webcam Preview
const webcam_preview = document.createElement("div");
webcam_preview.classList.add("webcam-preview");

// Webcam Video
// Getting Webcam Data
const web_vid = document.createElement("video");
web_vid.playsInline = true;
web_vid.autoplay = true;
web_vid.muted = true;
web_vid.classList.add("webcam-video");
web_vid.classList.add("disappear");

let setupWebcam = () => {
    navigator.mediaDevices
        .getUserMedia({
            video: true,
            audio: true,
        })
        .then((stream) => {
            chrome.storage.local.set(
                {
                    camAccess: true,
                },
                () => {}
            );

            web_vid.srcObject = stream;
            window.stream = stream;

            console.log(stream);
            console.log(web_vid);
        })
        .catch((e) => {
            console.error(e);
        });
};

// Recording Indicator
const r_indicator = document.createElement("div");
r_indicator.classList.add("recording-indicator");

// Control Panel
const panel = document.createElement("div");
panel.classList.add("webcam-control-panel");

// Recording Button
const record_id = "record-btn";
const record_btn = create_btn("Start Recording", record_id);
record_btn.classList.add("disappear");

// Play Button
const play_id = "playback-btn";
const play_btn = create_btn("Playback", play_id);

// Download Button
// const download_id = "download-btn";
// const download_btn = create_btn("Download", download_id);
const download_btn = document.createElement("a");
download_btn.innerHTML = "Download";
download_btn.id = "download-btn";
download_btn.href = "#";

// Attach Event Listeners

const recordedVideo = document.createElement("video");

// let playbackVideo = () => {
//     recordedVideo.play();
// };

// Listen for messages from the html.
// chrome.runtime.onMessage.addListener((msg, sender, response) => {
//     // First, validate the message's structure.
//     if ((msg.from === 'tab') && (msg.subject === 'DOMInfo')) {
//         // const blob = new Blob(recordedBlobs, { type: "video/mp4" });

//         // (async () => {
//         //     const b64 = await blobToBase64(blob);
//         //     const jsonString = JSON.stringify({blob: b64});
//         //     //console.log(jsonString);
//         // })();

//         var domInfo = {
//             str: "cat",
//         };
//         // Directly respond to the sender (popup),
//         // through the specified callback.
//         response(domInfo);
//     }
// })

// Play Button
play_btn.addEventListener("dblclick", (event) => {
    event.stopPropagation();
});

play_btn.addEventListener("click", (event) => {
    // restart and play Youtube Video
    console.log(event.target.tagName);
    event.stopPropagation();
    // console.log(this.tagName);

    const blob = new Blob(recordedBlobs, { type: "video/mp4" });

    (async () => {
        const b64 = await blobToBase64(blob);
        const jsonString = JSON.stringify({ blob: b64 });
        //console.log(jsonString);

        // Inform the background page to start tab.
        chrome.runtime.sendMessage(
            { msg: "startTab", data: jsonString },
            (response) => {
                if (response) {
                    console.log("tab started");
                }
            }
        );
    })();

    // Play/Pause Webcam this should play pause the recording
    //play_btn.innerHTML == "Playback" ? web_vid.play() : web_vid.pause();

    // Change Button Text
    // play_btn.innerHTML == "Playback" ? "Stop Playing" : "Playback";
});

//Listening to playback.js
// chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
//     if (message === 'get-user-data') {
//         console.log("cat");
//     }
//     //return true; // Required to keep message port open
// });

const blobToBase64 = (blob) => {
    return new Promise((resolve) => {
        const reader = new FileReader();
        reader.readAsDataURL(blob);
        reader.onloadend = function () {
            resolve(reader.result);
        };
    });
};

// Download Button
download_btn.addEventListener("dblclick", (event) => {
    event.stopPropagation();
});

download_btn.addEventListener("click", (event) => {
    console.log("Download video");
    event.preventDefault();
    event.stopPropagation();

    const blob = new Blob(recordedBlobs, { type: "video/mp4" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.style.display = "none";
    a.href = url;
    a.download = "test.mp4";
    document.body.appendChild(a);
    a.click();
    chrome.alarms.create({ delayInMinutes: 1 });
    chrome.alarms.onAlarm.addListener(() => {
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
    });
});

// Recording Indicator
// Recording Indicator: click
// Method 1: Ternary
// record_btn.innerHTML =
//     record_btn.innerHTML == "Start Recording"
//         ? "Stop Recording"
//         : "Start Recording";

// Method 2: Ternary + Function
let start_record = () => {
    // Setup Webcam and make visible
    setupWebcam(); // can run this when the script is injected to speed up
    web_vid.classList.remove("disappear");

    // Play Youtube Video
    // restart();
    play();

    // Update Button Text
    record_btn.innerHTML = "Stop Recording";

    start_record_helper();
    // Debug
    console.log("Start Recording");
};

let start_record_helper = () => {
    console.log("Start recording helper");
    recordedBlobs = [];

    // Set Option
    const mimeType = "video/mp4";
    const options = { mimeType };

    // Try to get Media Recorder from Media Stream
    try {
        mediaRecorder = new MediaRecorder(window.stream);
    } catch (e) {
        console.error(e);
        return;
    }

    // Show Result
    console.log(
        "Created MediaRecorder",
        mediaRecorder,
        "with options",
        options
    );

    // Set on stop event
    mediaRecorder.onstop = (event) => {
        console.log("Recorder stopped: ", event);
        console.log("Recorded Blobs: ", recordedBlobs);
    };

    // When data is available start recording and handle data
    mediaRecorder.ondataavailable = handleDataAvailable;
    mediaRecorder.start();

    console.log("MediaRecorder started", mediaRecorder);

    // Restart Video
    // restart();
    // //Play Video
    // play();

    // Update Record Button
    record_btn.innerHTML = "Stop Recording";
};

let handleDataAvailable = (event) => {
    console.log("handleDataAvailable", event);
    if (event.data && event.data.size > 0) {
        recordedBlobs.push(event.data);
    }
};

let stop_record = () => {
    // Pause Youtube Video
    //pause();

    // Stop Webcam
    //web_vid.pause();

    // Update Button Text
    record_btn.innerHTML = "Start Recording";

    stop_record_helper();

    // Debug
    console.log("Stopped Recording");
};

let stop_record_helper = () => {
    console.log("Stop recording helper");

    // pause();
    // web_vid.pause();
    mediaRecorder.stop();
    record_btn.innerHTML = "Start Recording";
};

// Record Button Event Listeners
record_btn.addEventListener("dblclick", (event) => {
    event.stopPropagation();
});
record_btn.addEventListener("click", (event) => {
    // toggle recording indicators style, (color and animation)
    event.stopPropagation();
    r_indicator.classList.toggle("active-recording");

    record_btn.innerHTML === "Start Recording" ? start_record() : stop_record();
});

// Recording Indicator: mouseEnter, mouseLeave
r_indicator.addEventListener("mouseenter", () => {
    record_btn.classList.remove("disappear");
});

r_indicator.addEventListener("mouseleave", () => {
    record_btn.classList.add("disappear");
});

// Append to DOM
// Get Root container

const root_class = ".html5-video-container";
const root = document.querySelector(root_class);
// Note: root should be the main youtube videos container

// Append Video element to preview window
webcam_preview.appendChild(web_vid);

// Append Buttons to control panel
panel.appendChild(play_btn);
panel.appendChild(download_btn);

// Append Recording Button to recording indicator container
r_indicator.appendChild(record_btn);

// Append [ Indicator, Control Panel ] to container
webcam_preview.appendChild(r_indicator);
webcam_preview.appendChild(panel);

// Append preview to root video container
root.appendChild(webcam_preview);
