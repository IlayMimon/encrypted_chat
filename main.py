from flask import Flask, render_template, request, redirect, url_for, session
from flask_socketio import SocketIO, join_room, leave_room, emit
from flask_session import Session
import pymongo
from pymongo import MongoClient
import os

app = Flask(__name__)
app.debug = True
app.config['SECRET_KEY'] = 'secret'
app.config['SESSION_TYPE'] = 'filesystem'

Session(app)
cors_allowed_origins = 'https://localhost'

socketio = SocketIO(app, manage_session=False, cors_allowed_origins="*")


# cluster = MongoClient(os.environ.get(MONGO_CLIENT))
# db = cluster["chat"]
# collection = db["messages"]


@app.route('/', methods=['GET', 'POST'])
def index():
    return render_template('index.html')


@app.route('/chat', methods=['GET', 'POST'])
def chat():
    if request.method == 'POST':
        username = request.form['username']
        room = request.form['room']
        # Store the data in session
        session['username'] = username
        session['room'] = room
        return render_template('chat.html', session=session)
    else:
        if session.get('username') is not None:
            return render_template('chat.html', session=session)
        else:
            return redirect(url_for('index'))


clients = []


@socketio.on('join', namespace='/chat')
def join(message):
    room = session.get('room')
    join_room(room)
    global clients
    clients.append(session.get('username'))
    for client in clients:
        if len(clients) < 2:
            emit('status', {'msg': 'you are the only person in this room'}, room=room)
        else:
            emit('status', {'msg': client + ' has entered the room'}, room=room)


# counter = 0
#
# last_document = str(list(db.messages.find({}, {'_id': -1}))[-1])
# last_document = last_document.replace("{'_id': ", '')
# last_document = last_document.replace("}", '')
#
# counter = int(last_document) + 1


@socketio.on('text', namespace='/chat')
def text(message):
    # global counter
    room = session.get('room')

    user = session.get('username')
    msg = message['msg']
    print(msg)

    # post = {"_id": counter, "user": user, "message": msg, "room": room}
    # counter += 1

    emit('message', {'msg': user + ' : ' + message['msg']}, room=room)
    # collection.insert_one(post)


@socketio.on('left', namespace='/chat')
def left(message):
    room = session.get('room')
    user = session.get('username')
    leave_room(room)
    session.clear()
    global clients
    clients.remove(user)
    emit('status', {'msg': user + ' has left the room.'}, room=room)


if __name__ == '__main__':
    socketio.run(app)
