So for the first lecture of this section going, I talk about protocol properties, what to take into

account when designing a protocol, but what is the properties of a protocol?

This section might sound a bit theoretical and it is to be honest, and so take it with a grain of salt.

Don't memorize these properties, don't live by them, don't by these rules.

You know what matters is at the end of the day performance, I think.

And that's what matters.

And whether you use cases solved with this protocol or not, and that's what matters.

So take that into account when designing a protocol, and that's what matters.

So these are some of the protocol properties, like there are many there are ones might you might discover

that is not even listed here.

And again, this is collected from my personal experience, what I saw as a pattern and from certain

resources as well.

Let's jump into it.

So what is a protocol?

A communication protocol?

It's the definition is it's a system that allows two parties to communicate and a system of rules to

be specific.

It's a set of rules.

It is all one, one, two, three, four, five, and then follow these rules.

And if both parties follow the same rules, they can communicate.

That's a that's a what a protocol is.

So a protocol is designed with the with this sets of properties, effectively the rules.

And depending on the purpose of the protocol, it all depends on the purpose of the protocol.

What are we building to begin with?

Why are we building it?

What problems are we trying to solve?

Right.

And every single protocol out there was designed to solve a problem.

And.

TCP.

The most famous one was designed to solve a problem.

Back in the sixties.

Right?

Way back.

1960, I believe.

Right.

And people are finding currently in the data center TCP is not is pushing its limit.

That's it.

That's why people are inventing a new protocol to replace TCP because TCP ah is hitting its limit when

it comes to data center.

Remember, TCP was designed for low bandwidth network back then.

They didn't imagine that we're going to have data centers that that with very close proximity, that

sends tons of data right back and forth.

Right.

So this is hitting that limit.

But we might talk about it.

I might I might put one of my podcast in this course, talk about something called Homa.

So another protocol that is fresh 2022 is really, really new, right?

And it's just a paper.

It's not even an RFC.

So we're going to talk about it, but today we're going to talk about the classics.

Classics such as DHCP, UDP, http G or PC three, Apache FTP.

All these protocols are SMTP.

All these protocols were designed to solve certain different problems.

So the protocol properties is the most important.

One is the data format.

Like one of the most important one, the data format and the data format.

You can look at it at really two things.

Either your protocol could be text base, things that can be readable in the wire, assuming it's not

encrypted, of course, plaintext, JSON, XML, http normal text.

So that's one data format.

The other format is binary.

It was not designed to be read by humans.

We don't care if a human read it as long as a machine can read it efficiently, I'm going to do it binary,

right?

That's political buffers.

That's resp.

This is the writers, by the way.

I read this.

I think it's called ready serialization.

Serialization protocol.

That's what that's what it's a binary protocol as well for readers to communicate with other instances.

And the client as well should be to the binary.

It should be three.

It's also binary, right too.

Although it should be two is actually stands for hypertext.

Right.

But in the wire, it's a completely binary.

They changed the in wire transfer, but the compatibility stays at the API level.

Nothing changed.

You still make the same git request.

They still do the same thing.

But they changed the underlining protocol in wire changed.

So data format is important.

The next thing is transfer mode.

So you can either transfer.

The transfer mode and the protocol either can be message based where a message has a start and an end,

Right.

An example is a CDB is a message protocol where request has a start and end.

A response has a start and end.

UDP also is a message block.

It's based on messages, discrete messages, right?

So each message sits in a nice tucked in IP packet and if the message is too large for the MTU, it

will be broken into multiple IP packets and be labeled by fragment IDs effectively so the the destination

can group them together.

The other transfer mode is stream.

It's just a stream of bytes that we just don't.

There is no end or necessarily a start or an end.

It's just a stream of data.

It is just just bytes coming in.

Right.

TCP is a stream protocol.

Actually, it's not really message based.

What about this is also a stream.

It's just just it was designed for videos.

So, hey, there is a bunch of audio.

There's a bunch of videos there.

That's it.

You just a stream of messages, right?

Of.

Of bytes.

So it's like a river.

Another trick is if you build HTTP on top of TCP, now you have the client has to.

Pass the stream, which is TCP stream, just a collection of bytes to actually understand where requests

start and ends.

That's the problem that we have here.

That's why the cost of the the client side and the server side to do this parsing, to find out these

messages is actually is one of the limitation.

If you think about of TCP IP being just stream.

Right.

That's why this new protocol that's called homo is actually tried to do a message based TCP.

Right.

That is actually actually based on messages, not just a stream of bytes.

Right.

One after the other.

Right.

It's slightly different.

Our protocol must have an addressing system like where are you going?

Right.

And that's very interesting.

Right.

What is the destination?

And that is what is what is this coming from and where is this going to be very important.

Right.

So if you think about it, what kind of addressing system we have today?

We have DNS, right?

WWE do a Google dot com, that's DNS.

That's one way to address a destination.

Another way to address is using the IP, the Internet protocol address.

That's 9.7.3.2.

So that's one way to address at a layer three.

Effectively, DNS is a layer seven, right?

Mac, The media access control is also an addressing system so that as a system is used for like ARP

address a resolution protocol which is of a layer two protocol to find out what's the MAC address for

a given IP address.

Right?

So the destination and source changes like if at layer two, when you send a message and you send a

frame, you put the MAC address for the device and the source Mac address, source and destination.

But when you put it in an IP packet, you put the IP address as the the source and destination, but

you're sending an because you don't use the IP.

We use the DNS, which resolves that IP, which resolves eventually to a mac and when it reaches the

destination.

Another thing is directionality, right?

Is it bidirectional?

It's just unidirectional or is it full and half duplex?

Right.

Like in wi fi, it's a half duplex where no, no.

Two devices can send at the same time.

Right.

Versus a full duplex connection.

Let's continue.

What are the protocol state we talked about in the stateful versus stateless, right.

Where a stateful protocol is gRPC TCP Apache thread, right.

A stateless protocol is UDP and UDP.

There is no state as necessarily when it comes to the protocol itself.

Routing.

How does this your protocol works with different gateways and proxies?

Right.

And this comes back to addressing really like if you if your destination is Google.com, right?

If you send a request to Google.com, the host header will set Google.com.

But then in order to do that, you're going to need to do a DNS resolution to find the IP address.

Why?

Because you need to establish a TCP connection.

So you find the IP address.

Now you send, you're going to connect to the to that IP is in the TCP connection and then you send

HTTP requests.

But you might have a proxy where the connection instead goes to the proxy first.

So your final destination is technically Google, but your immediate destination is the proxy from a

from a TCP connection point of view.

So you send, you talk to, you talk to the proxy and the proxy, turn around and talk to the final

destination.

So how does how does your protocol play when it comes to these things?

Does it have flow and congestion control or is it reliable?

Is it not all this stuff?

Right.

Like UDP doesn't have any of this stuff.

TCP has flow and congestion control, reliable delivery, guaranteed retransmission, all that stuff.

Right?

UDP is just hey whatever you you do it it reaches a region and of course error management like SDB.

We have specific error messages right.

What do we do in case of errors, write error codes.

What do we do in case of a timeout?

Do we retry?

Do we not?

And these were basically the protocol properties.

Of course, it's a very theoretical thing.

I thought, I'll talk about it.

I think it's good to understand these.

As you work with a protocol, you understand that these are some of its properties, right?

If you ever were going to build a protocol, you might take might take some of this into consideration

while designing it.

See you in the next lecture.