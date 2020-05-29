import os
import time
import datetime
from flask import Flask, session, render_template, redirect, url_for, abort, jsonify, request, make_response
from flask_socketio import SocketIO, send, join_room, leave_room, emit
from flask_session import Session

message_id = 0
users = []
channels = []

app = Flask(__name__)
socketio = SocketIO(app, manage_session=False)
# Configure session to use filesystem
app.config["SECRET_KEY"] = "secret_shack"
socketio = SocketIO(app, async_mode='eventlet')

def checkChannelExists(chans, rm):
    for ch in chans:
        if ch["name"] == rm:
            return True
    return False

#Socket methods
@socketio.on('message')
def message(data):
    #print(f"\n\n{data}\n\n")
    send(data)

@socketio.on('incoming-msg')
def on_message(data):
    print(data)
    theMessages = []
    msg = data["msg"]
    username = data["username"]
    room = data["room"]
    time_stamp = datetime.datetime.timestamp(datetime.datetime.now())
    time_display = time.strftime('%A %b-%d %Y, %I:%M%p', time.localtime())
    global channels
    global message_id
    for ch in channels:
        if ch["name"] == room:
            ch["messages"].append({"username": username, "msg": msg, "time_stamp": time_stamp, "id": message_id, "time_display": time_display})
            theMessages = ch["messages"]
    send(theMessages, room=room)
    message_id += 1


@socketio.on('join')
def on_join(data):
    print(data)
    theMessages = []
    username = data["username"]
    if username is None:
        username = "?"
    room = data["room"]
    msg = str(username) + " has entered the channel " + room
    time_stamp = datetime.datetime.timestamp(datetime.datetime.now())
    time_display = time.strftime('%b-%d %I:%M%p', time.localtime())
    join_room(room)
    global channels
    if not checkChannelExists(channels, room):
        send([{"msg":"Channel no longer exists"}], room=room)
        return
    for ch in channels:
        if ch["name"] == room:
            if len(ch["messages"]) <= 0:
                ch["messages"] = [{"msg": username + " created the channel " + room,  "time_stamp": time_stamp}]
            ch["messages"].append({"msg": msg, "time_stamp": time_stamp})
            ch["lastActive"] = time_stamp
            theMessages = ch["messages"]
    send(theMessages, room=room)


@socketio.on('leave')
def on_leave(data):
    room = data['room']
    if room == None:
        pass
    else:
        theMessages = []
        username = data['username']
        msg = username + " has left the channel " + room
        time_stamp = datetime.datetime.timestamp(datetime.datetime.now())
        time_display = time.strftime('%b-%d %I:%M%p', time.localtime())
        leave_room(room)
        global channels
        for ch in channels:
            if ch["name"] == room:
                ch["messages"].append({"msg": msg, "time_stamp": time_stamp})
                theMessages = ch["messages"]
        send(theMessages, room=room)

@socketio.on("delete-msg")
def on_delete(data):
    global channels
    room = data['room']
    theMessages = []
    message_id = data['message_id']
    for ch in channels:
        if ch["name"] == room:
            for msg in ch["messages"]:
                if "id" in msg:
                    if msg["id"] == message_id:
                        msg["msg"] = "User has deleted this message"
                        msg["deleted"] = True
            theMessages = ch["messages"]
    send(theMessages, room=room)

#Flask methods
@app.route("/", methods=["GET", "POST"])
def index():
    global users
    print(users)
    for i, user in enumerate(users):
        keyname = user["name"]
        if user["last-login"] >= datetime.datetime.timestamp(datetime.datetime.now() + datetime.timedelta(days=1)):
            del users[i]
    if request.method == "GET":
        return render_template("home.html")
    else:
        name = request.form.get("displayname")
        for i, user in enumerate(users):
            if name == keyname:
                users[i]["last-login"] =  datetime.datetime.timestamp(datetime.datetime.now())
                return redirect("chatrooms")
        users.append({
            "name" : name, 
            "last-login": datetime.datetime.timestamp(datetime.datetime.now())
        })
        return redirect("chatrooms")

@app.route("/createuser", methods=["POST"])
def createuser():
    name = request.form.get("displayname")
    global users
    users = users[-100:]
    print(name)
    for user in users:
        keyname = user["name"]
        print(name)
        if name == keyname:
            return make_response("true")
    return make_response("false")

@app.route("/chatrooms", methods=["GET", "POST"])
def chatrooms():
    global channels
    if len(channels) > 100: 
        channels = channels[-100:]
    for i, ch in enumerate(channels):
        if ch["lastActive"] >= datetime.datetime.timestamp(datetime.datetime.now() + datetime.timedelta(days=5)):
            del channels[i]
        for i, msg in enumerate(ch["messages"]):
            if len(ch["messages"]) > 100:
                ch["messages"] = ch["messages"][-100:]
            if msg["time_stamp"] >= datetime.datetime.timestamp(datetime.datetime.now() + datetime.timedelta(days=1)):
                del ch["messages"][i]
    if request.method == "GET":
        return render_template("chatrooms.html", channels=jsonify(channels))

@app.route("/channel/<string:channelname>")
def openChannel(channelname):
    global channels
    myMessages = []
    for channel in channels:
        if channel["name"] == channelname:
            myMessages = channel["messages"]
    return jsonify(myMessages)

@app.route("/logout", methods=["POST"])
def logout():
    global users
    name = request.form.get("displayname")
    for i, user in enumerate(users):
        if user["name"] == name:
            del users[i]
    return redirect("/")

@app.route("/channelexist", methods=["POST"])
def channelexist():
    mychannel = request.form.get("channelname")
    global channels
    for channel in channels:
        if channel["name"] == mychannel:
            return make_response("true")
    return make_response("false")

@app.route("/createchannel", methods=["POST"])
def createchannel():
    mychannel = request.form.get("channelname")
    myuser = request.form.get("username")
    global channels
    channels.append({
        "name": mychannel,
        "messages": [],
        "admin": myuser,
        "lastActive":  datetime.datetime.timestamp(datetime.datetime.now())
    })
    return make_response(jsonify(channels))


@app.route("/getchannels")
def getchannels():
    global channels
    thechannels = jsonify(channels)
    return make_response(thechannels)

if __name__ == '__main__':
    port = int(os.environ.get("PORT", 5000))
    app.run(host='0.0.0.0', port=port)
    socketio.run(app, debug=True)


