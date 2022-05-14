let name = null;
let roomNo = null;
let chat= io.connect('/chat');


/**
 * called by <body onload>
 * it initialises the interface and the expected socket messages
 * plus the associated actions
 */
function init() {
    // it sets up the interface so that userId and room are selected
    document.getElementById('initial_form').style.display = 'block';
    document.getElementById('chat_interface').style.display = 'none';

    initChatSocket();
}


/**
 * it initialises the socket for /chat
 */

function initChatSocket() {
    // called when someone joins the room. If it is someone else it notifies the joining of the room
    chat.on('joined', function (room, userId) {
        if (userId === name) {
            // it enters the chat
            hideLoginInterface(room, userId);
        } else {
            // notifies that someone has joined the room
            writeOnCommentsHistory('<b>' + userId + '</b>' + ' joined room ' + room);
        }
    });
    // called when a message is received
    chat.on('chat', function (room, userId, chatText) {
        let who = userId
        if (userId === name) who = 'Me';
        writeOnCommentsHistory('<b>' + who + ':</b> ' + chatText);
    });

}


/**
 * called when the Send button is pressed. It gets the text to send from the interface
 * and sends the message via  socket
 */
function sendChatText() {
    let chatText = document.getElementById('chat_input').value;
    chat.emit('chat', roomNo, name, chatText);
}

/**
 * used to connect to a room. It gets the user name and room number from the
 * interface
 * It connects both chat and news at the same time
 */
function connectToRoom() {
    roomNo = document.getElementById('roomNo').value;
    name = document.getElementById('name').value;
    if (!name) name = 'Unknown-' + Math.random();
    chat.emit('create or join', roomNo, name);
    data = {'title': roomNo}
    axios.post('/singleStory', data)
        .then((response)=>{
            let instance = response.data
            let title = instance.story_title;
            let img_url = instance.story_image;
            let description = instance.story_description;
            initStory(title, img_url, description);
            initCanvas(chat, img_url);
        })
        .catch((error)=>{
            alert('Error: '+error)
        })
}

/**
 * it appends the given html text to the history div
 * @param text: teh text to append
 */
function writeOnCommentsHistory(text) {
    let history = document.getElementById('news_history');
    let paragraph = document.createElement('p');
    paragraph.innerHTML = text;
    history.appendChild(paragraph);
    document.getElementById('news_input').value = '';
}

/**
 * it appends the given html text to the history div
 * @param json: the story to display
 */
function initStory(title, img_url, description) {
    // let history = document.getElementById('news_history');
    let _title = document.getElementById('story_title');
    let _img = document.getElementById('img');
    // let _canvas =  document.getElementById('canvas');
    let _description = document.getElementById('description');
    _title.innerHTML = title;
    _img.src = img_url;
    _description.innerHTML = description;
    // _canvas.id = "canvas";
    // history.appendChild(_title);
    // history.appendChild(_img);
    // history.appendChild(_canvas);
    // history.appendChild(_description);
}



/**
 * it hides the initial form and shows the chat
 * @param room the selected room
 * @param userId the user name
 */
function hideLoginInterface(room, userId) {
    document.getElementById('initial_form').style.display = 'none';
    document.getElementById('chat_interface').style.display = 'block';
    document.getElementById('who_you_are').innerHTML= userId;
    document.getElementById('in_room').innerHTML= ' '+room;
}

