In this lecture, I'll talk about the OCI model, the Open systems interconnection model.

And I so remember 20 years ago when I was in university and.

My instructor tried to explain the OSI model and I literally didn't understand anything.

And I really didn't think it was important because because I was excited about writing C code and C++

code.

I want I want to build an interface.

I want to build a visual basic application.

You know, I was I was interested in that stuff, and I really didn't understand the value of what they

were explaining, right?

And so I end up memorizing everything and they're just like passing the exam.

But I didn't get anything, unfortunately, although the doctor the doctor was really good, you know,

unfortunately.

So I really regret that.

But so what I wanted to do is just learn from that experience.

All I model is really critical to understand it.

Any engineer, any software engineer, if you ever want to interact with networking, you really need

to understand the OSI model, you know and don't.

Don't think like you have to understand everything in it, but just understand the seven layers effectively.

And we're going to talk about also about the simplified OCI model, because it does have some criticism,

you know, when it comes to that.

But just the Aussie model, these seven layers and where does your application live?

That is what really matter.

Where does your application live?

You might say, I don't care.

Why would I care where my app live?

No, you should.

Because if your app is a bridge between two other apps, we really need to understand what you're looking

at.

What do you see?

Are you looking at Mac addresses or are you looking at an IP package or already looking at segments

or looking at ports?

I'm looking at the TCP options.

Or are you looking at the console of a connection, the TCP connection itself, or are you decoding

or encoding the or you serializing these arrives in JSON?

Are you decrypting my stuff to look at it?

And every single layer has a meaning and every application out there a cDNA reverse proxy, a load balancer,

a reverse proxy, an API gateway has to live in one or more of these layers.

And this is what I wanted to talk about.

Let's jump into the slides and nail this.

I promise this is going to be fun.

All right.

So these slides a little bit crowded, so I'm going to disappear in a minute, but you stop.

So I'll be here.

I'll be here.

I'm just going to explain the concepts behind the scenes and I'll show up at the end to summarize this

stuff.

All right.

Those I model the open systems interconnection model.

You know, open systems open has to be open because we really need an open communication.

We really need to understand and make a standard out of this thing.

So.

Orci model, let's get started.

Why do we need a communication model?

I always, as you know, I always start with a Y because to me I don't like to understand something

that I don't know why it exists personally at least.

Yeah, so the goal here is to build agnostic application.

So, you know, imagine this.

If you really don't have a standard, then we want to build a networking applications.

Then we cannot do this because my server have no idea how to talk to your client.

Like, how are you?

You know, how do you, how are you transposing the bits into digital to analog and analog back to digital?

How how am I supposed to look at this bits?

You know, there must be a standard.

It doesn't have to be a stunner.

Have you a protocol to understand how to chop up these bits to make sense of it as the application level?

Without a standard, your application must have knowledge of the underlying network medium that's even

worse.

Imagine this.

Just imagine if you have to order different version of your apps so that it works on wi fi.

You need a different version to work on the Ethernet.

You need a different logic to work on LTE and you need a different version to work on fibre.

That will be a disaster.

Yes, we take it for granted today.

We take it definitely for granted.

Let me show up for a second.

We really take this thing for granted.

You are building a Node.js application today and you're sending out requests or just listening and it

doesn't matter where this application runs, it runs on any CPU, you know, because someone smart built

it, so it compiles on all CPUs.

And when you send a request, it doesn't matter if it we're sending it through the satellite or sending

it through radio wi fi or sending it through Ethernet electric signals or sending it through the LTE

radio waves or thinking it through fiber light.

It doesn't matter why, because we built a standard and that standard is used globally, effectively,

you know.

And the whole ward.

What's the difference between a ward and global?

Global is this means that the earth or just goes to space?

I believe it goes to the space.

It's a global open system, Communications everywhere.

Just the understanding of that is really powerful, because imagine you have to build a different application

to work on the light because it's all different mediums, right?

It's like, how would you expect the application to be the same?

You have to have a standard.

Otherwise the applications are, Oh, I'm talking to this fiber.

This is how I need to convert my bits to light signal.

Or if this is a radio wave, I have to do this to do radio.

But I just wanted to explain this because this is really taken for granted.

But people, smart people, build this so that we don't have to worry about it.

Back to the slides.

Network equipment management.

Without a standard model, you know.

Without a static model, upgrading network equipment becomes very difficult.

You know now.

If every equipment has a different standard, then you cannot move on.

You know, you you you will have different models and different things that communicate with each other.

First of all, they won't be able to communicate with each other.

This router won't be able to talk to this router because there is no standard.

Right.

And the beauty of this here is.

Regardless of the underlining medium, you can upgrade the actual network because it is completely decoupled

from the actual medium itself.

So there is there is nothing that we can really what would you have to worry about?

The underlining medium.

You can just upgrade the equipment normally and whatever you bring in, we'll just support it, you

know, as long as we know how to talk to it, you know, decouple the innovation, you know, that's

what we talked about in a minute.

Innovation can be done in each layer separately without affecting the rest of the module.

Yeah.

And that's that's very, very critical as well.

We're going to talk about the layers in a minute.

But each layer is built this way because each layer you can innovate and improve each layer alone.

You know, this is a little bit vague now, but it's going to be clear in a minute.

You know, you can improve the physical layer because that's the medium, you know, that's the radio.

You can if someone invented something faster than fiber, I don't think you can.

There's nothing faster than light, but you get my point.

Yeah, it's more efficient.

Then we'll just build the interface for it and we'll go support it, you know?

Right.

And layer two has nothing to do with.

It's just a layer two will pass in the bits and the conversion will happen in the physical layer, you

know, layer three, which is the IP layer, it cares about this stuff.

If you want to add more content or more headers, it can be added at the layer layer too.

You know, although this will break other stuff at the end of the day.

But that's another topic.

You know, just you can only just increase the header because there is something called the protocol

ossification, which is all these protocols, all these routers in the middle actually understand how

to read things in a way.

And if this thing changed, they freak out.

We'll talk about this intimate actually, I'll have to remember to add a lecture.

Just talk about protocol, ossification.

Very critical concept.

What is those?

I model seven layers each describe a specific network component.

Right.

Layer seven, the application.

That's what you even back in the engineers even they don't understand.

They don't really interact with layer seven directly.

It's usually above the application.

When you look at layer seven to a network engineer, that is just data coming in, you know, but to

back an engineer, there are they are using different libraries, they're are listening, they're sending

packets and the packets they're using maybe a gRPC, you know, protocol or certain protocol that sits

on top of HTTP two, which, which, which which creates more and more packets, you know, But that's

the application and that's really what, what really critical here.

The application is, is really huge here and everyone is looking just at that layer differently.

But to us, anything above, you know, effectively the the HTTP is the application, you know or FTP

or C anything here at this layer.

This is the actual application layer, it's the presentation layer encode serialization ever sent a

JSON right through fetch or Axios.

The the JSON need to be serialized from this JSON object if your JavaScript or python if you're if you're

like a bunch of arrays or that data structure down to a string and this is happening in layer six,

while you shouldn't care about this, this is already happening for you.

So it's a little bit a step down from your application.

Your application sends a whole object, but the conversion of the encoding happens there.

Serialization.

Oh, this is a UTF eight, whatever.

Let's encode it.

So the underneath layer does the job.

That's why talking about this stuff is like you might say, Wait a minute, say who cares?

Right?

Right.

You might say who cares?

Like about encoding and serialization.

This is happening in my application and that's what people are frustrated about.

The OSI model people is like, Really?

You really need to break this.

That fine of a level of a detail.

I don't care.

You know, sometimes this is one of the criticisms that presentation layer and also the session layer

at some cases.

You know that's why TCP TCP IP model kind of simplifies this, but I still prefer the Uhs-i model just

in a way because we're used to it, you know, back to the slides.

So.

Yeah.

So that's the presentation layer.

Then we have the session layer.

You know, the session layer is where TLS happened, you know, where connection establishment happened,

where state effectively sets place, you know, where you store a state in the client, you know, where

you state, state store a state in the server.

That's why some protocol is called stateful versus stateless.

HTTP doesn't have a session layer because it's a it's a stateless protocol.

You know, while TCP, it is a stateful protocol.

You store a state on the server and a state on the client and you manage a session effectively.

And if this session is destroyed effectively, either you can restart the connection or invalid it.

So the session layer effectively checks that again, a lot of people says, hey, really really you

want.

It's like really session layer.

Really.

You need a whole layer just to talk about session.

Believe me, this session is actually this.

This layer is actually important.

A lot of proxies like Linker D I believe actually built logic only at the session layer, only at the

connection establishment.

They would do certain logic.

So their application is a layer five app, you know, because they capture a connection and save it

or do pooling about it, you know.

So that is a layer five app.

That's what it means, like your application is layer seven or this is a layer seven proxy, this is

a layer for proxy.

They talk about this in a minute.

All right, Transport, one of the most important one, let's be honest, Layer four and layer seven.

As a back engineer, that is the only two things that are you going to worry about most of the time?

Hey, maybe if you go and a little bit of DevOps, see, you're going to care about layer three and

layer two.

When you build like the RPE sessions and work with Keep Alive and stuff like that, we're going to worry

about this, but we live here, baby.

We live in layer four and layer seven.

Most of the time we build layer four.

We configure doesn't necessarily be building, but we configure our application to be a layer four app.

Why?

What does that mean?

It means we are aware of the transport.

It means we are aware of the packets, right?

They are not called packets.

They are called segments when it comes to TCP and data groundwork.

DB All right.

Let's be very specific about this naming in a minute.

You're going to across the course, you're going to you're going to worry about this and understanding

it very clearly.

But this is what it is effectively.

TCP UDP Right.

Very, very important concept.

The protocols live here.

These are the only two protocols, Let's be honest.

There are and there aren't any other protocols when it comes to transport.

Well, you can call count quick as part of it.

There's a very new quick protocol, roughly new, but it's it's a transport protocol.

But that's pretty much it.

You know, these are the three protocol and everything is built on top of them.

HTP Built on top of TCP STB two, TCP STB three Quick Quick is built on UDP, you know, so everything

is built eventually on TCP or UDP.

There.

There aren't anything, anything else.

You can be fancy and build application directly on the IP, which is layer three, the IP protocol,

the internet protocol.

Here, we don't have a transport concept.

You know, I don't care about the if the packet reaches or not.

I'll try my best.

I'll tell you if it's bad, but hey, it's up to you.

It's a network protocol.

You know, it's a packet that destined to an IP.

Here we have visibility to ports, you know, port 80, port 80, 80.

Here.

We don't know what ports are.

We only know addresses, IP addresses, you know, So every layer has kind of a beautiful concept introduced

with it, you know, So the IP have the concept of the routing and the IP addresses, which we're going

to explain in the whole section.

So stay tuned.

Beautiful stuff coming.

Beautiful stuff coming.

So Layer two, another important concept here.

Layer two is the data link layer.

And we're dealing here with with the physical medium.

At the end of the day, physical network addresses, you know, hey, this wi fi has this MAC address.

I want to send a frame to it.

So we're sending a frame and layer two and we have we know about we don't know about IP addresses at

this layer.

Nothing.

We only know about Mac addresses we only know about.

That's why Chad and the protocol that we use like Ethernet, WiFi 802 or whatever is called, you know,

frames within frames and layer two.

I'm going to repeat this million times during the course.

We send frames in layer two, we send packets in layer three and we send segment in TCP layer four and

we set data grams when it comes to UDP, you know, also called segments.

And for both, you can sue me if this is not correct.

All right.

But yeah, don't don't worry about it.

The terminology a lot physical layer.

This is the bare metal.

What is what is what?

Once you take the frame, how does it transport to the other medium?

Electric signal when it comes to Ethernet is a fiber and light light waves you.

Is it radio waves, you know wi fi or LTE.

All this stuff, the physical.

And when it comes to this, it's just radio waves at the end of the day or light or electricity.

But eventually someone needs to to convert that electric signal back to a layer two frame.

Well, first it converted into a bunch of digital 101010 and then converts it back to frame, which

then the frame converts to IP, which then the IP, we take the pieces of the data and we understand

the TCP segment and then we understand the, Oh, do we have a session here?

We need a state in this case and do I need to decode, serialize and deliver to the application so you

can serve your beautiful HTTP requests, for example?

Here's an example, actually.

From from the point of view of a sender.

We're sending a postal request.

And I specifically did a post because I need to send body and we cannot send body with get request right

so I have to do a post.

So sending a post request to an https web page here, this means that it's encrypted, so there's TLS

here, but we'll come to that.

The application post request with the JSON data to HTTP server, that's the that's what the application

does.

So you use Axios or you use fetch or you use your Python request library and you send a post request

with this blob of JSON and says, Hey, send it.

The presentation layer takes your JSON object, which is just the object here and serialize it to flat

byte strings.

Right.

Because you can send an object doesn't mean mean anything, right?

The object is meaningful in your language only.

Yeah, it does.

It doesn't mean anything when it comes to it's a string.

You need to convert it to bytes.

Right.

And shove this bytes as a bunch of data here.

So now we have this JSON and we have the protocol, we have other stuff as well.

Information The session here.

Do I need to establish a TCP connection?

Do I need to establish TLS?

Yes and yes.

Yes and yes.

We establish a TCP connection because we need to communicate.

We're going to explain all this beautiful stuff.

We're going to explain how the GCP connection what is TLS really mean here in a minute, Right.

So the encryption that happens.

So we have this is what happened in session.

What do you need to start a state transport send the send request target port four, four, three.

So that's the actual first thing that we send.

Right.

This is a direct command from session layer because to establish a connection you need to send the Send

Snack act.

Right.

We're going to talk about this.

Don't worry if it's confusing, but but don't send the data and send just the send request.

We're posed here.

The JSON doesn't go away, doesn't go to the other party yet because we don't have a connection yet.

So you establish a connection, you receive a connection request and you authenticate and then you send

the data here.

But let's just say I'm just sending the send request for a minute here.

The Syn is sent to port four, four, three.

Why?

Because the transport understand what ports are.

Why four, four, three.

Well, you said https and that's the default port.

Four, four, four, three.

We understand four, four, three as the port for this and that network, the network layer which is

we we shove that send request which is the segment down to an IP packet and add the source and destination

IP.

So if you need the IP address, you need to do a DNS to get the IP address.

And once you get the IP address, we shove it into this packet.

Don't worry, we're going to have a beautiful diagram to explain all that stuff, but the data link

goes, each packet goes into a single frame and adds the source and destination Mac addresses.

So we need to figure out the Mac as well.

That's ARP and talk about it.

Each frame becomes a string of bits in the physical layer.

Just 10101010.

These one zeros are converted into this radio signal or electric signal or light, and then that's it.

And take this with a grain of salt.

Whatever we explain here doesn't have to be clear cut and dry, as they say.

You know, some layers can inherit from each other and do the stuff.

And then the human built this.

You know, nothing is just oh, layer four, layer five.

You can argue about all any of that stuff.

Receiver What does the receiver do?

The receiver will receive the physical layer first, right?

Hey, we received a bunch of radio or electrical light, right?

Because your server might be on fiber, but your network you can have sent from wifi.

See the beauty guys?

Do you see the beauty of this?

I can send your data from wi fi, right?

And then you receive it through fiber.

You might say duh, but I absolutely appreciate this.

You know, So now the physical layer at the receiver side, convert this to digital bits and then the

data link.

Okay?

Oh, the bits from layer one are a symbol and into frames.

The frames from layer two are assembled into an IP packet.

Oh now IP packet I know that the destination IP address is this for me.

Yes it is.

Right.

And every router, by the way, asked the same question as well.

I'm going to come to that.

It's like is this package for me?

So the transport, the IP packets from layer three are assembled into TCP segments, you know, all

right.

And then deals with congestion controls or flow controls and trade transmission and hey, is this the

the sic, is this the rice packet?

Is this the old packet?

Is this a new and going to order all that stuff.

If if a segment is a sin, we don't need to go any further into more layers as we are still processing

the connection request.

Here's the beauty here, right?

Since it's a connection request, we don't really go down.

There is no point to go down to the session layer.

Well, we have to go to the session layer here to establish the connection.

And once we have the connection, we're going to have our JSON back in this next request and then we're

going to go all the way to that connection here.

And then we're going to go to the this area.

We're going to do the presentation layer.

This is that fly by string JSON back to the JSON object for the app to consume.

And this serialization here could be completely different from the serialization that happened on the

client because you can just, you can serialize from JavaScript, but this serialized into Python or

you can serialize from C sharp and D serialize into go, you know, it doesn't matter.

And that's where your logic is.

That's why a lot of people say really the presentation and application layer is just the application

to be honest.

Like this is the application.

My application is doing this logic at the end of the day and you can argue with that.

Of course, again, take it with a grain of salt.

The application understands the JSON request and says, Hey, your express JSON or Apache request at

the end of the receive the event and will trigger that event which says, Hey, someone just sent you

a post request, what do you want to do with it?

That function that will get called, it will be triggered and say, Hey, someone just sent you a request.

You can consume the request, go to the database, do something, and then get back synchronously and

the response back to the client.

All right.

Finally some diagrams.

So this diagram took me a while to build.

Let's see if you guys like it.

So the first thing client So the client and server notice that arrow we're going down or going up them

is the client is the sender in this case and the server is the receiver doesn't mean that the server

doesn't send data.

It also can absolutely send data.

So the application layer goes to the presentation.

We talk about it serialization, decoding, encoding, all this, just such a layer, establishing a

connection, whether this is TLS or or the handshake itself, the TCP handshake, establishing the concept

of a connection, a stateful thing, then transport actually working with a TCP flow control in the

ports and all that jazz, you know, the actual segments go down network, right?

The IP packets itself go down data link.

This is yellow.

This orange.

I don't know if it's clear.

Hopefully it's clear.

Hopefully I don't regret the choice of these colors, you know, the physical layer, which is the actual

medium.

And then we send it and I chose the waves.

In this case, the server sees that we received it first from the physical medium because that's how

we receive things.

You know, the lowest layer, your network card receives this signal and then convert it to the data

link and then convert it back to the IP address.

Now IP packets all the way transport and then session, you know, go to the presentation and go all

the application.

So you just route, you see the mouse, right.

And then go all the way up.

It's like this.

It's you.

Now.

Let's go.

The question is, do I have to always go through all these layers?

Absolutely not.

I'll give you an example.

If you if you send a TCP.

No, let's go.

I'm sending an Stevie Post request, but I need to establish a new connection.

Well, the application sends the request.

You know, the presentation does the JSON thing, the session pauses, the presentation.

I said, Wait a minute, session.

I don't have a session here.

What are you talking about?

Let me create a session.

Wait for it.

Wait a minute.

Just let me create a session real quick.

So we go send the request to two, two, two, two, two, two, two weeks in there.

Send request to create a connection.

Goes all the way here.

You're seeing this pointer.

This is important to see the point.

Otherwise the whole thing is pointless.

You see?

Go reach the session.

Okay.

I agree.

I'm going to create a connection.

We don't go up.

We don't.

There's no point.

There is no application yet.

This is just the request to send a request to send the connection here, to establish a connection.

And then we establish send ec bum, bum, bum, bum, bum bum bum bum bum bum, bum, bum bum.

Go back is said okay, I receive your slack.

Let me finally do an act to do to to go back and then boom stop here session now we have a full connection

Now the session will say okay, now that we sent the EC, you may unlock and go further.

All right, you have another session.

Continue.

Remember the post JSON request is now resumed.

Go to the transport layer or let me put it in a segment.

This is you put your bytes, string JSON into the transport layer, shove it into an IP packet, determine

the IP address the destination, shove it into the data link, determine the MAC address.

Obviously, we already determined all that stuff in the handshake, but I'm just explaining here again

and then send the send the physical layer, all the data transport, transport all the way.

Go transport layer.

You have a session.

Yes, you do presentation layer.

What do I do?

I have the beautiful JSON, I have all this data and this could be a single.

Packet or a segment, if you will, or multiples.

So this will do the assemblage will assemble all the packets that are necessary and then deliver one

huge string to the presentation layer which will decode it or serialize it, go back to the application

and all of a sudden you just triggered that lesson, you know, not the reason what is called the post

router, if you will, if you're using Express as here, just that now it's trigger.

So look at the work.

That is happening, guys, And that is the purpose of this course.

Understand what is happening and there is beauty of of understanding.

I don't know what that means, but you get the point.

All right.

So this is a segment.

This is the packet and this is a frame.

I'm going to repeat that million times until he and this is hammered frame back at segment.

Very critical to understand this is another view that I like to do.

I personally do.

I never seen anyone do something like this before.

I just this is how I understand it.

Not necessarily.

This is how it looks like in the wire.

You know, if you well or this is how I will look, I look at this.

This is the Russian matryoshka.

If you are aware of this, this dolls inside a doll.

This is exactly what a model is in the application.

You go to the presentation layer, go to the session layer, and the content here goes into a TCP segment.

You add a destination port and the source port left and right, but not necessarily left and right.

It's just literally at the end.

But I like it to do it this way because I understand it better.

And then this this green segment shoves into an IP packet and that IP packet, now we have to add the

destination IP address and the source IP address, and then the whole IP packet gets shoved in into

a frame and boy, a better fits into our frame.

And we're going to talk about the frame size called the MTU maximum transmission unit.

You cannot put an IP address IP packet into multiple frames unless you fragment, which is something

we're going to talk about in the future.

Destination Mac and the source Mac, you put it that and then the whole thing becomes just this red

blob of radio signals and we're going to do the same thing.

Hey.

Get the bets right from the physical layer.

Understand where the frame starts, where the frame ends, because that's what the physical layer does.

And actually they are to death.

Healing does that for you.

And now, hey, we have the Mac address here.

We have the source, Mac.

Take the data portion of this frame that becomes the IP packet.

Hey, this is the destination IP.

This is the source IP here.

You don't see this.

This is shoved here down into that frame.

Right.

You have to unpack it.

That unpacking takes finite amount of time.

If you nanoseconds, if you will.

You know, just understand this nanosecond time, very critical.

So move up.

Take that IP packet.

What do we do?

The IP packet.

Hey, Destination IP.

Is it for me?

Yes.

Take that segment.

What do we do?

The segment.

Back.

There is a segment distinction port Searsport which application this is destined to.

There are thousands of ports here.

Oh, you want this port?

Okay, let me deliver that segment to that application, to that process.

Because based in the port, you're going to deliver it this way.

Right.

And there's something we're also going to explain.

Each port is technically one process is one port.

This can change, obviously, but this is just a general rule of thumb.

And then we understand.

Do I have a connection?

Yes, we do.

Do I need to do anything in presentation layer?

Nope.

Do I have to do anything application here?

And we deliver the app effectively.

Here's another slide that is very important to understand.

You understand that the client is not directly connected to the server, right?

This is the client.

This is the server.

There are switches in the middle that is there outers that are proxies that are CD ins that are reverse

proxies.

You know, there is load balancers.

What are those suckers doing in the middle?

They look, they peak the content and when they peek at the content, they take finite amount of time

because they make decisions based on this peaking of the data.

All right.

So let's go through an example where a client wants to talk to a server, but it goes to a switch and

a router, right?

So the client will send an information as usual.

You know, the client wants that information as usual, go through the application presentation session,

transport network data and the physical end, and then will send.

Right.

The first thing that you might hit in your organization, maybe switch the switch connects different

subnets together, you know, Hey, this is the subnet work, this is a subnet for this network.

I want to connect them together and I don't want data to be sent unnecessarily to different network.

You know, that's the power of the switch.

You know, it understands where to send the data based on the frame itself, based on the MAC address.

That's the trick it does.

It's like, Oh, this computer is connected to this port.

So the Mac address of that is this.

So it goes to this port, you know, so it doesn't necessarily unlike a hub, for example, where just

literally the hub broadcasts the data to every single port, which is a lot that is a lot of bandwidth

wastage there.

But the switch to do its job, it needs to look at the MAC addresses because that's how it does its

lookup.

So it only need to take the physical layer.

Convert that to a data link, look at the frames, look at the destination Mac address and then that's

it.

It doesn't need the IP address more to it.

Most, most switches don't, but some do.

But most switches.

Just look at layer two.

That's it.

And then once it does it, it's like, okay, I'm done.

And then sends the data to the next board.

Right.

So it does it does re transmit the data, if you think about it here.

Well now let's go through our router.

The router will do the same thing.

The router will need the physical layer.

Obviously we'll go to the data link.

It will sometimes act like a switch if you're sending it through the same subnet.

But the most important thing the routers need to route and routers need the IP addresses in order to

route, so it needs to go up to layer three.

To route.

That's why a router is a layer three device, while the switch is a layer two device.

Very critical concept to understand.

So you go up to and then we'll go down and the router goes all the way to a layer three and then go

down.

And then until you reach the application, you might go through multiple routers and we go up to layer

three and go down up to layer three and go down until we reach the application where we go all the way

to application if necessary.

Again, because sometimes you're establishing a connection and you want only to go to layer session,

the session layer or sometimes the the packet is invalid and will it will fail right here.

I said, Hey, you don't have a connection.

Why?

You wouldn't be sending me data without a connection.

You know, that's the TCP ID effectively.

And that's why UDP doesn't really have a concept of a session layer, if you think about it might be

wrong there, but if you think about it, there is no state in UDP.

UDP is stateless.

It just send data and that's it.

There's no state.

But that's that's a very critical concept as well.

My favorite let's add a firewall.

Let's add a layer for proxy.

Let's add a CDN content management content delivery network.

So a firewall, guys, what is a firewall do?

For our block, certain applications from sending data or blocks and blocks, certain unwanted packets

to come through your network.

And in order to do that, it needs to look at the IP address.

It needs to look at the ports.

That's why the at least the ports, some firewalls are are they go all the way and look at the application.

These are the firewalls that look up to here.

They're effectively called transparent firewall.

Transparent firewalls or transparent proxies really are transparent, like your ISP.

Everything up to here is available to everyone.

Everyone can read your ports, everyone can read your IP addresses.

That is why.

It's public.

It's not.

It's never encrypted.

Never.

The network IP address you need.

You need the IP address in order to to route data and the ports, you need them public as well.

All right.

So these are public.

That's why anyone looking at this, they are called transparent, transparent firewall, transparent

proxies, if you ever heard about this.

These are proxy.

That doesn't really change anything.

It's almost like a transplant.

They go through it and that's why your ISP can technically block you from going to any website they

want.

They don't want you to go there.

A lot of a lot of government uses transparent proxies.

You know, they don't go all the way to the application because if you go to the application, you need

to decrypt, you need to stop the session and decrypt it.

Right.

And to do that, you need to serve the certificate of the server, which you don't have, right, unless

you're Kazakhstan, which literally forces a certificate into every computer in their citizens, you

know, to the certificate authority for trusting it.

But most of the world, they are not like that, you know.

So they are always in transparent.

The only thing you can do is just block the IP address that you're going to.

You can do that.

All you have to do is just stop.

Don't send the data right, because it goes through you.

If something goes through, you can stop it.

So the firewall stops this layer for proxy.

If you want to do the load balancing based on a port.

Hey, if you are going to import 8080, I want you to rewrite the packet and send it to to this address

instead.

Or send it to this address instead.

Right.

So you can rewrite the packet right here, change it effectively, and then send it somewhere else.

Actually, if you think about it, you'll always be can do that too, right?

You can get it, can send you somewhere else if you want.

If they want to.

You know anyone I say your ISP because your ISP is where your first packets go to.

Right.

That's why a lot of people use VPNs.

VPNs effectively.

I don't add it here, but VBM is actually a layer three protocol.

If you think about it.

It takes the IP packets and put them in another IP packet.

That's that's a simple, simpler solution for the IP for the VPNs.

Most VPNs not doesn't do this, but one solution is to put an IP in an IP.

So I don't care what the content of this IP packet is, it could be an IP request, could be a gRPC

database or of course I don't care, it's an IP.

And that's why our side models are really critical.

You know, take that and just shove it there and then send it, you know.

So the VPN is actually a layer three protocol.

If you think about it.

Some people are actually living that layer too as well.

No.

So.

Go all the way here as a file or a proxy.

But then if you have a load balancer, like a layer seven load balancer, you know.

If you built one as a back in an engineer, you know, like in Gen X where you want to cache data or

you want to balance based on certain paths, like, Hey, if I go to slash whatever slash pictures,

right?

Go to this server.

If you go to slash images, pictures are the same thing.

Images, slash, whatever blob.

Go to this set of servers if you want to do that.

The slash that path is actually an application concept which is encrypted most of the time.

To look at it, you have to decrypt it.

So the layer seven proxies or content delivery networks or layer seven, they play at this layer.

That means they decrypt everything you send, look at it, cache it and then resend it.

So they go all the way there.

So they are way slower than a router or a firewall.

Where is lower?

You go and go all the way up and then re transmit everything back down.

So you effectively now you need a completely different session between this, those two Puppis right.

Because this session, this is one session and this is one session.

This is the final endpoint to you as a client.

You're connecting to this.

You know, that's why this is called a reverse proxy.

You know where this is your final destination, but your true final destination is actually this backend

server which you don't know anything about.

That's how Google work at any other application.

When you go to Google, you really don't touch the front end server.

You're just going there.

But the Google server might turn around and send a request to another server on the backend that you

have no idea of as what is called a reverse proxy.

While a proxy goes through you, you know you're sending a request, but you know, the final destination,

you know, you know this is your final destination, but the proxy makes that request on your behalf.

Does that make sense?

All right, so what are the shortcomings of this Orci model?

Though?

Simon has too many layers which can be hard to comprehend.

And definitely that was my belief and opinions back maybe three years ago, and I changed my mind ever

since then.

You know, I really thought really session and presentation.

I think this, this shouldn't really treat as one.

But now the more I understand, the more I build back in application, the more I started to read and

understand we really need that low level, you know, breaking down sometimes, you know, not all the

time, but is really hard to argue about which layer does what it's like.

People still argue it's like, oh, presentation layer shouldn't really the script or presentation layer

should really decode OC at the end of the day.

It's all people speculating at the end of the day.

So it's really not funny.

You know, just everybody has an opinion.

It becomes an opinion at the end of the day.

Right.

Because there's no if you look at the computer, there is no layer five.

You know, it's just it's not something you read.

It's something we talk about.

So our so as engineers can talk through things, you know.

So simpler.

It's definitely simpler to deal with layer five, six and seven.

That's just one layer, which is the application and that's what the CPI B model does.

Exactly that.

It's much simpler.

It's just the application layer, Hey, five, 6/7, the application, I don't care, don't, don't

complicate things, which I, I have mixed feeling about this.

It's up to you really.

What do you think?

But applications on application, right?

Some people say, hey, don't, don't, don't do that.

Just hey, one layer application, I don't care.

But yeah, avoid numbering the CPI B layers.

It's not layer five or layer four, Layer three.

You can with layer four, layer three, it's the same language, you know, because layer four, layer

three are identical to the outside model, But layer five is if you say layer five, you have to specify,

Oh, this is the TCP IP model.

That means this is the application while layer five and, and also is actually the session layer, you

know, so we can become real cumbersome to talk through layer two, same thing.

Data link and physical layer is really something never talked about as far as I know, right?

So I don't even see this layer in the TCP IP model.

So it's literally the TCP IP, which is TCP and IP and the data link, right, which is the MAC addresses

and all that jazz.

All right, how about we summarize this beautiful OSI model?

I believe one of the most important things specifically when you write an applications, you know,

it's really good to understand where your application sets.

If it is if it's a network based application, if if, if, if data passes through your application,

it's good to know where your application is so that you can talk through it, so you can know what you

can optimize, what do you have access to and what can you improve?

Right.

It's very critical, right?

So we talked about the OSI model.

We talked about the we showed examples, many examples where firewalls, we added proxies, we added

a reverse proxy, we added the content delivery networks.

It is like fastly, stuff like that.

They all every CDN is a layer seven reverse proxy.

That's what they are just, you know, that's a glorified naming see content delivery network because

it stores your content by definition, it has to access it.

Has it need access to your content.

Right?

Right.

So again, take it with a grain of salt.

You know, each device doesn't have to map to all the seven layers.

You know, it's really blurred.

The line is blurred sometimes, you know, the TCP IP is definitely a simpler model.

My personally, I prefer the the finer granularity of things, the breaking things down.

Now while we don't talk about session five as layer six is really the layer that I almost never hear

anything anyone talk about.

Right.

But layer five, I've seen use cases where someone, Hey, I'm actually a layer five, we're playing

a layer five here.

Link linker.

This is a clear example.

One envoy I believe Another one, right.

Hey, we manage sessions, we manage connections ourselves, you know, So you're playing it, you're

playing at the session layer, you're playing at the connection, you're playing at that.

Just that you don't, you don't really care about anything else.

You're building a proxy At the end of the day, Link card is a proxy, by the way, if you didn't know

that.

But yeah, guys.

Hope you enjoy this lecture.

How do we jump into the next one?