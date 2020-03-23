const io = require('socket.io');
const users = require('./users');


function keyGen(keyLength) {
  var i, key = "", characters = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

  var charactersLength = characters.length;

  for (i = 0; i < keyLength; i++) {
      key += characters.substr(Math.floor((Math.random() * charactersLength) + 1), 1);
  }

  return key;
}




/**
 * Initialize when a connection is made
 * @param {SocketIO.Socket} socket
 */
function initSocket(socket) {
    console.log("socket Initialisation")
  let id;

  //Initilising the         connection
  socket.on("test", (msg) => {
    console.log({msg})
  })
    .on('init', async () => {
      
        //Getting a unique id for customer 
        // id = await users.create(socket);
         id = keyGen(25);
      socket.emit('init', { id });
    })
    .on('request', (data) => {

      
        //The user to which we are requesting to call
      const receiver = users.get(data.to);
      if (receiver) {
        //receiver the contains the socket data to which we are requesting
        receiver.emit('request', { from: id });
      }
    })
    .on('call', (data) => {
      //reciever variable contains the socket data for which we are requesting to
      const receiver = users.get(data.to);
      
      //If there is such a reciever then make the call
      if (receiver) {
        
        receiver.emit('call', { ...data, from: id });
      } else {
        socket.emit('failed');
      }
    })
    .on('end', (data) => {
      //reciever here also contains the socket data for which we are trying to end the call
      const receiver = users.get(data.to);
      if (receiver) {
        
        //If such a reciever exists, then end the call  
        receiver.emit('end');
      }
    })
    .on('disconnect', () => {
      //This executes when the user disconnects from the socket
      users.remove(id);
      console.log(id, 'disconnected');
    });
}

module.exports = (server) => {
  io
    .listen(server, { log: true })
    .on('connection', initSocket);
};
