## zander-speak

### Basic messaging app using sockets in Node ###

It's pretty crusty so far, but fun to learn more about Node and the client / server and then peer relationships.
You can send messages to people on your local network through a central server, or
You can send messages to people on your local network through a set of peer to peer connections.

### Try it out! ###

clone this repo down, then run

`npm install`

To run the app, choose your username to use, along with any other people on your network's usernames, by entering them like this:

`npm start <your-username> <another-username> ...<more names>`
eg. `npm start alex esther keith`

this runs the peer.js file, connecting you to the other users you name (or will do should they also connect)

### Bugs ###

At the moment if a user connects after a message has already been sent then they won't receive it.
Also any messages this user sends won't be received until after one of the original connected peers sends another message

### Credits ###

I built this following on from http://mafintosh.github.io/p2p-workshop/build/01.html which is a peer to peer workshop made by Mathias Buus https://github.com/mafintosh who also provides a number of the modules used to put it together.
