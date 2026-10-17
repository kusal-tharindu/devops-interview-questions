So this is one of my favorite patterns.

I hesitated, adding this as part of a design pattern, but I just fell in love when I first learned

about server center events that I thought, You know what I think?

I think this is elegant design.

You know, whoever designed server center event is brilliant.

You know, it's it's a pure HTTP thing, right?

It's not really other it doesn't really work on other protocols.

But the fact that they moved HTTP being a request to respond right into this streaming server streaming

model is brilliant.

And the trick was one request.

But the response is very, very, very long.

We are responding, but it doesn't have an end.

Basically, the respawn doesn't have an end.

That's basically what sort of recent events, if you send an active request, but you get keep getting

data data, you keep getting data right.

And just never ends.

And the trick here is the client understand these chunks, the streaming chunks and pauses, the mini

responses, if you will, the messages in between.

Right.

So to the application, someone is making a request and it's streaming a bunch of response that is never,

never ending using the chunk of chunk streaming.

Right.

The content type.

But to the client smart enough says, Hey, you know what?

I'm actually I'm actually going to parse these mini messages and I'm going to find my mini responses,

meaning message, meaning events.

And that's the trick here.

Let's get into it.

Of course, there's always the limitation of request response that forces us to do this stuff right.

The venue request isn't ideal for notification in the back end.

The clients want real time notification from the back end, right?

If a user just logged in.

All right, if a message is received, Bush works.

Definitely.

You can do a build warp sockets where the server physically pushes messages or out of the blue to the

client.

That works, but it's restrictive.

And so recent events work with a request response, and it's also work with SDB.

That means it works with vanilla.

Any gdb server just supports it.

You don't even need to be a web socket server, so it works on the web and it's designed for it to be

as we said.

So what is a server sentiment?

A response?

We talked about a response and a request always has a start and an end.

Right?

Client Send the request the server sent.

The server sends logical events as part of the response.

So to the HTTP response, it didn't technically end.

We didn't send the final two lines.

That ends the response.

But we're sending effectively events in this chunks that the client smart enough.

That is, by the way, a server sent object event source object in the browser that understands this

and then just play with that.

Right?

The server never writes the end of the response, the final response, if you will, but it needs these

mini events that can be paused.

So if someone, let's say someone just logged in, you can respond with an event in this long response,

part of it.

And the client just pauses this segment and oh, someone just actually logged in.

So did you get the track?

It's very beautiful and it's still a request, but it's an unending response.

Effectively, that's you can think about it this way.

Client pauses the stream data looking for these events, and it works with the request response initiative.

All right, let's take an example.

So server center event, I have a server that's just a normal web server.

At least it should be 1110 cannot work.

So this is of course, because it doesn't support streaming.

Right.

And the client here sends a request, special request with a special content type and the server.

Well, the survey will do is it will actually respond with an event which is a bunch of bytes that has

a start and end.

Right.

That the client actually need to understand.

It didn't technically finish writing the response yet because technically, if you write the response,

you can write part of the response, but you cannot you don't have to write the full response, right?

That's how TCP sockets work.

You can write another event in this case and then pauses.

The client can process these events and then finally it can close that whole connection.

So I'll go with the pros and cons.

Real time.

It is a real time, right?

Because the moment we get that, we will immediately.

It's like we have an open channel with the server that immediately sends us a feed of information and

it's compatible with the request response model and with the HTTP model as well.

What's the cause?

The cause is that client must be online, right?

Because you're sending a request.

The client has to be there to receive the responses, the mini responses we talked about.

Right.

And the client.

Might not be able to handle.

It's the kind of, if you think about it, the same problem as Bush, Right.

If you're sending all these notifications, right, these messages, the client can can disconnect.

It might not be able to handle the messages.

And what does the server do in this case?

Does the server save the state of the client or the client actually was able to process this event but

not the server.

That's a lot of load on the back end.

Sometimes you don't want that.

Polling is preferred.

If you want a lighter clients that are not sophisticated enough, you might want to go with a polling

approach, whether long or short.

But it is a problem also with server side event and we didn't really discuss this.

Maybe in the HTTP lecture.

We're going to go into more details about this.

But.

There is a limitation also of recent events when it comes to HTP one one you see.

Well, we'll discuss this morning in the XDR-TB lecture, but.

There's a limitation in Chrome today.

If you connect connected to a domain, you can only establish six TCP connections to that domain.

That's it.

That's a limitation arbitrarily put by Chrome.

And I think a lot of browsers follow that.

Why?

Because.

In HDB one one.

You can only send one request per connection.

And once that while this request is being processed, you cannot send anything else in that connection.

Right.

Unless you enable pipeline.

But it's a problematic thing.

So nobody does.

So you can only send one request.

And the moment you send the request, this connection is marked as busy.

And if the connections are busy, you cannot use it.

So what?

What about the rest of the HTTP requests?

Like I want my CSS, my JavaScript, my, you know, other files?

How do I download them?

Well, the browser actually opens six connections for you up to six, and you can use those to send

requests.

But guess what?

What if all of these six are service and event requests?

What did we say?

Service interval.

So recent events or a request that doesn't have an end?

The response is just being written.

So technically all the six connections are marked as busy.

So if you want, if you're connected to this domain and you're you has six channels.

Like six requests instead of a sent event, then.

Other requests will starve to the same domain.

Even if you cannot even make a gate request, you cannot even fetch a JavaScript file because the connections

will be blocked because there is no.

It's pending.

We're going to show that in the connection pooling example.

Right.

That's why it should be too, is a better approach where we can have unlimited streams, where you can

multiple one connection.

But we're going to stream.

We can send multiple streams in the same connections.

We're going to send multiple streams in the same connection.

And I think the limit is like 200 and you can configure it, of course, right?

So that's one problem with the server sentiment.

Be careful with it.

Right.

And again, it comes back to just understanding how things work.

Right?

By the end of the course, hopefully you will have a grasp of some understanding.

Don't don't memorize any of this thing.

It's just goes down to understanding how things work.

And naturally it will.

It will click when things comes into the picture.

Now let's do a demo for servers and events.

All right, how about we show how server sent events works?

So as we explain, server sent events is a single request that you the client makes and the server responds

with a special header.

You know, and this is the content type text event stream.

And if it responds with that, anything that is sends after that as just part of the body will be interpreted

by the client.

As different streams.

Right.

As long as you start with the word data and you end with two new lines.

Right.

So the stream never finished technically, but it's a it's an unending response.

Right.

But we captured these events.

That starts with the data, right.

Colon And then these new lines.

How do how do we do this parsing?

Actually, the browser does it for us.

This is the client code.

If the client code is built, if you use this event source object in the browser which ships with every

browser and you connect to this endpoint, then you can be able to capture every message that sent.

So what this code does is it's an express library that listens to both eight, eight, eight, eight.

It just returns when you visit the root returns this hello just to avoid coarse cross origin resource

sharing.

And then when you send a request to the slash stream, you got to get a single header.

And then after that I have a function here that's called send.

And this basically every second, it just sends back a data with a counter.

It's an event effectively, so that listens and does this stuff.

How about we actually run it and test it again?

I'm going to share all this code with you guys, but let's go ahead and run it.

And if I go to the browser right now and go to.

Local host eight, 888.

Now we get the Hello.

Go to the console.

And ladies, we're going to do we're going to create a concert Sassy equal new event source.

And then you just point to the.

Directly to the stream.

Local host.

8888 slash stream.

Right.

And then.

Well, won't you do that right?

What happened is if you see the network, we actually sent a request request and we actually got the

response.

And we're getting this we're getting we're getting some data, but we're this death has not been captured

by the client.

See, if I go to the event stream, I can see it in the console, but nothing the console here is because

we never wired the event.

So what you do is do see the ability on message and then do a console log and then every time.

You get a message.

You get a whole message.

Object.

Right.

So here's the data.

See, the data itself is just hello from server, remember?

If you go back here.

You have to actually send data code in space and then the string, right?

And that's how the boundary of the event is determined.

It's like little hacky, but who cares as long as it works, right?

But that's that's how basically how server center events work.

Very elegant.

Very simple.

Right.

Yet.

If I look at that, of course, it's a single request.

Looking at that, the response actually look at this.

You see, even the told me this is an to the tools.

This is an unending request.

See, caution request is not finished yet.

All right.

So that's the track.

I just absolutely love this track.

I think it's very cool.

And I think there are a lot of applications for server center events.

Hope you enjoyed this.

I'm going to see you in the next lecture.