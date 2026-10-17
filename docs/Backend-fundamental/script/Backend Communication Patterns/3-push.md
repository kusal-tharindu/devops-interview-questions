We don't talk about another design pattern when it comes to back end execution, and that's push very

popular.

If you really want the response as fast as possible, if you really want results immediately in the

client, then push is one of the, you know, famous patterns to to implement on the back end.

It has, of course, its pros and it also has its cons.

And that's the purpose of this lecture.

Let's get into it.

So yeah, request response isn't always ideal for certain workloads.

An example is real time notification, right?

So what if someone just logged in or what?

Someone just uploaded a YouTube video?

What if someone just uploaded a Twitter tweet?

You know, how does the client know this?

This event happened?

It's not like the client has to ask write something in order to get the response in this case doesn't

work right.

It's not like something that the client has or knows about.

It doesn't have that knowledge, The server have that knowledge.

It's different an event, right?

So a request response can you can do it.

You can just hey, is there notification?

Is there notification?

Is there notification?

But that doesn't really scale well.

So what are we going to do is like we receive that just a message.

A user just logged in.

We talked about that.

But this here is where the push model is great for certain use cases.

And this is perfect, right?

Hey, chatting app.

Chatting app is a perfect for push notification.

Push logic.

You know where it says, hey, the server knows something is going to push it to the client.

Focus on the war.

Push.

Push means you're actually forcing.

And that could be good.

Sometimes it could be bad because a lot of the clients can actually cannot handle that load that you're

pushing it.

Come to that.

The Bush model is good for certain use cases.

Let's talk about that.

So what is a Bush?

What is Bush?

Here's how it works.

The client connects to us over.

The server sends data to the client.

The client does not have to request anything.

That is only the only thing that needs to happen is there should be a connection that is established.

That's the medium on which you send data.

So it's almost like a unidirectional.

Stream, but from a server side so the client doesn't have to request anything in this case to support

this.

A protocol must be bidirectional.

I can I can argue with that a little bit.

You can argue with that says, hey, you can have a unidirectional from one side.

Right.

But.

Technically we have TCP.

TCP can work as a push as effectively A bidirectional protocol is better in this particular case, and

it actually used by Robert McHugh.

And if we could get a chance, we're going to show Rabbit McHugh in action here and how to do that effectively

in Robert McHugh and the push notification.

So Robert McHugh in there, when you submit a message to the queue system and Robert McHugh, what happens

is there are clients that consumes this queue and Robert queue.

So the model that Rabbitte McHugh chooses, as opposed to Kafka as Robert McHugh, will push the content

of the queue at the moment we get a result in the queue.

The moment we get entries in the queue, they could be pushed to the clients that are connected to it.

So there is a reduction of communication establish with the consumer and then these are pushed.

That's the model they chooses for this.

So let's talk about this a little bit.

So a client this is the timeline.

We have a server and we have a bidirectional connection, right?

So the connection already established.

We're going to talk about how this looks like, actually.

So what happened here is in the back in the back just gets a message out of the blue.

Right.

Because there's things happening here on the other side.

Things can use a can send a message.

They can send requests.

They can upload files.

Right.

And there are other clients that are connected to this.

And the moment we get a message, someone uploaded a YouTube video and we need to push all connected

to clients, push that result to that client.

Now.

Imagine this is some sort of like a YouTube like PewDiePie.

I have like 100 million or Mr. Beast.

And imagine everyone has push notification enabled by default, which is not by the way, YouTube turned

that off by default because they couldn't do it.

So it's impossible to do it.

I imagine every time I pull out a video, I've got to notify 100 million users.

So the act of having fully fledged connected connection all the time is impossible first.

Second is, even if those are connected, and then I have to loop through all of them and spend resources

to actually push, push, push, push, push, push, push.

Right.

So YouTube does it.

But push notification is actually a very complex system is different than we it's not like direct to

consumer you what YouTube does in this particular case, actually it pushes the notification to Apple

or under the Android cloud and they are responsible to push that notification down on their leisure

down to their clients And some other app events can happen here.

And another message can be pushed from the server and we're going to see that gRPC actually supports

this mode, the unidirectional from the server side streaming.

And that's actually very interesting, right?

So the client didn't request anything.

It just gets data and we're going to see how we can play tricks with this as well.

So we can have request response actually work with PUSH.

We'll see how it's actually interesting.

So it is the the push pros and cons.

So the process of push is real time and it's really good the moment things happen, we get to push it.

That's the definition of push because you're pushing the result.

You don't wait.

The moment you get the input, just push it to the client immediately.

Right and pushing.

Think of it as just you have a two connection, you have a connection, and then you're literally writing

to the client socket.

It's not really magic, right?

We call it push because the the result is pushed immediately as the moment the event is generated.

But there is a lot of disadvantages, to be honest with this.

First of all, the clock must be online to get anything pushed to it, right?

It has to be online.

When I say online means.

It's physically connected to the server that is doing the pushing, right?

Otherwise, you cannot you cannot push something to a client that is offline.

Right?

You can you can push something to the server and then later on the client connected, do the pushing,

but you cannot do it while they are online.

Another.

Disadvantage.

And that's basically why Kafka didn't move, didn't do the push model like Robert McHugh is.

We have no idea.

Pushing means, Hey, here's data, here's data.

I'm going to push it to you and I don't care.

Right.

That means the client has to be able to handle the load.

Right.

So what if the server is pushing tons of notification, tons of messages to the client?

The server doesn't have a knowledge, right.

For say, to the sites from flow control at the TCP level, for example.

Whether the client can handle or not, it doesn't know that, right?

It doesn't have that knowledge.

So if you push, push, push, push, push, push data, the client might be processing this messages,

but it cannot keep up with this.

So you're forcing if you have like simple a client, they might crash as a result of this, right.

That's why Kafka moved to something called log polling.

We're going to talk about it.

Right.

And it also requires a bidirectional protocol, right.

In this case.

And this is where polling is preferred for lighter clients so that the client pulls on their leisure.

They only make a request if they know that, Hey, I actually can't handle the load right now.

Tell me if there's something happening.

And of course, if there's like one video being uploaded or one thing, you don't really care.

But if it's a volume, it's a large volume of data.

It adds up.

Really adds up.

All right, guys, on the interest of time, I already spent some time to write a simple web socket

application that does basically two participants or multiple participants chatting with each other.

Right.

And the moment a message is sent to the server, this message is pushed to all clients.

So this is an example of a push notification.

And the reason is because web Sockets is actually a bi directional protocol, because it uses the TCP

link underneath it, right?

So it can support push.

And this is what we going to do here in this case.

And we're going to have an entire section just for web socket.

So don't worry about that.

We're going to talk about the socket in detail in the future lectures.

So let's get started.

Actually, this card was going to be available for you guys here.

So we're going to do here is we're going to use the HBX library in Node.js.

We're going to get the web socket and package and then we're going to build an array of connection.

And these are our users.

Basically, every time someone connects to this server, which is this, this what I'm building, we're

going to add to that connection to the array.

And then every one, every time someone sends a message, we're going to loop through the connections

and then push, push, push, push, push, send messages through that connections.

Very simple app.

So we're going to create the HTTP server web app that we're going to create the Web server app, right?

The package here and this is basically the actual library here.

And we're going to pass that server down to the web socket object so that we can establish the web socket

handshake, which is the upgrade command.

Right.

So once this is done, we're going to listen on the SDB server and this doesn't matter.

Hey, I'm listening right now on Port 88, as we're going to do.

And this is where the beauty happens when the Web socket object actually receives a legitimate non connection,

an actual request for a web socket upgrade request, because you can connect all day through the TLS

handshake.

But the web socket, this event will only execute if there is someone who sent a web web socket request

connect and this happens.

You can do it from the client side through the browser doing the web socket object in the browser.

That's what we're going to do as a client, right?

So on the client, we're going to spin up multiple browsers and each browser are going to be a user

effectively.

All right.

So sounds good.

Once we get a request, we're going to accept that connection, right?

And the moment we get accept that connection becomes its own instance.

And this is where we're going to wire the event on this says, Hey, if someone sends a message, a

web socket message, in this case on this connection, so go ahead and loop through all the connections

and just turn around and send that that whoever sent that connection, like the remote port, I'm using

the remote port as a unique identifier here, which is a very nice trick here, because how do I identify

users?

When you establish a TCP connection, there is always the source IP, the source port, the destination

IP, the destination port.

The source port is always going to be unique, right?

Because that's the user who's connected.

And I'm using that as a unique identifier for the user here, whoever the connected user user remote

port says.

And the message, we're going to just print the message and then just tell everybody that's connected.

Once we're done with that, we're going to push that connection to the array.

Hey, because we just got a new user, right?

This will only execute if someone just connected, right?

And then also mine as well.

We're going to tell everybody that someone just connected as well.

And that's another loop.

Say, hey, user blah just connected.

So very, very simple server.

Let's go ahead and run this and debug mode.

Now we have our chatting web server running.

Let's go ahead and spin up some browsers and do some push notifications.

How about that?

All right.

Now I think I can safely disappear here.

Let's go out and fire up my dev tool right here.

I've got a fire up dev tool right here, and then we're going to play a client here.

All right?

So in my first user, I'm going to declare a variable called the AWS equal new web socket in the browser.

And the protocol is the server is local host and the port is 8080.

And that's it.

Just doing that, we just connected.

And that will effectively call the request command here.

And so what I'm going to do also and on message, if someone sent me a message, I am going to print

that message.

That's the that's the only two pieces of information that we require.

So we have one here.

And just so we can actually be in the same page, I am going to well, the second call, I'm going to

do our breaking point here so that I know that someone can.

I just want to show you what happens.

That is actually this gets cold.

There's no point.

We can just copy and paste.

Right.

But the moment we do that immediately, a request is created and a connection object is created for

us.

And the socket here will have the remote port, which is six, four, eight, seven, six in this case.

So the next line will be wide of the message.

So if in case someone sent a message, call this function right.

And then add the connection to the array.

And then now we can notify everybody who has actually connected to let you know that this one, this

guy just connected.

And this is the loop.

How many lines do we have?

We have to actually.

So I'm going to notify myself, too.

So that's fine.

Let's go ahead and run it.

Go back.

Look at that.

We got that user 64876 just connected, but we didn't get it here.

That's easy, right?

Because we never actually wired the event.

It was so fast.

We never actually managed to wire the event.

So let's go ahead and just wire it up.

And of course it's too late.

We didn't capture it.

That's fine.

But let's say.

This client is going to say, Hey, Dawson.

Hey.

Now, this client actually sent the message.

So now this is me.

Six, four, six, four, eight.

Is this six four, eight, seven, six is the other one.

So we got back the message that, hey, some we said to ourself, right.

But this guy also got it.

So that's kind of a push.

Let's actually send a message from this guy.

Hi.

You notice that when we sent the high message here.

That's me I got everybody gets this basically immediately the message goes to the server and the server

just rebroadcast it to everyone.

So that's a push, almost a push model, right?

And now we're chatting.

We can send more commands here.

What's up?

Immediately we get the What's up?

Of course.

And everyone else.

I guess we can write server side logic to.

For me not to get the message here, but actually this works with.

Not just one client or two clients.

Actually, it works with multiple.

Maybe this will make it a little bit more clearer and.

A new client will connect right now.

Let's steal the code here.

We got this event executed.

We no longer need this break point.

Go back.

Notice 94 disconnected.

94.

Just connected.

Disconnected us.

Doth send.

Hey, all.

So a 94 is says, Hey, oh, 94 says hello and then you can chat.

You can easily add a button here that was an HTML page that does the chatting, but this is basically

the gist of push notification.

You guys, you need a bidirectional directional right.

So if you can build a unidirectional from the server, you can also have push notifications.

But that's as opposed to making a request with Curl or any other client to say, Hey, do I have a do

have a message?

Do I have a message?

This way you get pushed the result and the pushing happen to be exact right here, right?

It's just nothing about a sent message.

But the trick here is as you give the event that someone just sent a message because this will get executed.

By the way, if there is a message, there's because remember, everyone is connected to the server,

right?

Nobody is actually connected to each other.

Technically, all of these clients are it's a centralized, connected to one central server and the

server gets the message and is responsible to just repeat the message to every other connected client.

Of course.

Is this code perfect?

Of course.

No, because if some of these clients get disconnected, the server need to know how to skip it and

pop it out of the connection.

All right.

Like, let's try this.

What would happen if I could disconnect it?

Is that close?

I think.

I just closed.

Right.

So now what happened?

If I say.

I think this will break the server.

But yeah, it might actually crash the server because now we're looping and sending someone send a connection

to a connection that is already closed.

Right?

So yeah, actually no one got the message.

So because I think the server didn't really crash, we can actually debug.

It's all part of the test.

Let's do that.

Do we do we get a message to see?

Do we get an event reader?

So we got here.

We have we still have three connections despite one regard.

Disconnected, Right.

And if we look at the state, which was the first user was disconnected.

Right.

So let's find, um.

User zero got disconnected.

I bet that this close the connected false.

See?

So now what we need to do is actually add just a nice of a statement.

If connected, then send it.

That's easy, but still is to waste to loop through things that are already disconnected.

Right.

You can do like a map here or things like that to fix this bug.

It should be easy.

Just do a C dots connected.

Right.

Do that.

Right.

So that's another thing.

I'll let you do this stuff.

It's just the nitty gritty stuff.

All right, guys, that was the push model.

Hope you enjoyed it.

Let's see you in the next lecture.