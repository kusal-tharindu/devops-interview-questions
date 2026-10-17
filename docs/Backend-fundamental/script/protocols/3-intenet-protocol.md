The Internet protocol or as I like to call it, the vehicle of the Internet.

You see, guys, anything you do.

When you send a request to the back end from the client or the back end responds back, any protocol

eventually, regardless, what's the protocol is that data will eventually sit into something called

an IP packet.

The destination is the IP address for the destination and the source is where it come from.

At that layer, we don't know anything about ports.

We don't know anything about headers, HDTV headers, or encryption, nothing.

The job is, Hey, here's a bunch of data.

The data can be encrypted, could be gRPC, it could be UDP, could be TCP IP.

Could be a post Chris response from a sequel.

All will fit into an IP packet.

So and this is this will be the topic of this lecture.

So this lecture is basically taken a collection of lectures from my networking course and then combined

them into a single lecture for your four for ease of consumption.

Effectively, I hope you enjoy it.

Let's get into it.

The IP building blocks and I named it this way because I think these are the basic building blocks that

we need to understand in order to understand the IP protocol.

You know, trying to demystify this as much as possible.

What happened when you actually wrote the packet?

What happened when I send it back and now I'm mentioning the word packet here, guys, and I want you

in your brains to think about what a packet is, is the layer three.

Now when I say packet is layer three, that means it's a bunch of data with destination, IP address,

with source IP address, that's it with other headers.

But we don't care now.

Right.

But that's it.

Ports I don't care.

Port.

Yeah.

There is ports inside it, There is the JSON, the data, the http, all this stuff inside this IP packet.

But to the routers it's just an IP packet.

And that's the beauty of this whole all this, I think, you know, if you think about it, let's jump

into it.

IP address, It's a layer three property.

We talked about this.

It can be set automatically or static statically statically.

Right.

And this is the DHCP thing.

I'm going to talk about it, but the idea is the IP address can be assigned.

You know, this is where a network engineering course, actual course detail ID will be valuable talking

about, okay, how is the DHCP work, how is assigning?

This is a network level thing, you know, networking, network engineering kind of a thing.

You know, it's a little bit more detail so I won't go into that level of detail because hey, as long

as I have an IP address, I'm good.

I'm not troubleshooting my network.

You know, there are the network engineers who are, you know, well versed and adept in that particular

thing, you know, troubleshooting and IP DHCP and how the work it's a protocol.

And so all right, maybe I will change my mind and add a lecture for it in the future.

Who knows?

But the IP address can be assigned automatically or you can statically fix it on your machine.

No, and it has.

I will talk about this.

It has a network port and a host portion.

The IP address is a four bytes and it's going to be v four and it's more than that IPV six.

I'm going to talk about IPV six in this course.

Maybe in the future I'm going to add more.

Let's just keep it lower a little bit, right?

There's so much content as is, we'll add more stuff in the future.

But yeah, there is do a bit right?

And there's two.

Portion, the A, B, C, D, or the A, B, c, D is this is the first by second, by third, by fourth

by and slash X.

And I want you to understand the slash x, right?

The x here is the network bits and the what remains or the host.

And here is an example.

If I say 12192168.254.0 slash 24.

That means the first 24 bit, which is 888, that's 24.

These puppies are the network portion.

And this left byte alone, the fourth byte in this case is the host.

That means I can have up to two, five, three, five host Right.

Well I can have up to whatever two to the 424 networks.

The first 24 bit, three bytes are networks, the rest are eight for the host.

Just talk about this.

This means we can have up to to the power 24 look out over the course you want.

Do you really need this much networks?

Ask yourself again if you're a network administrator.

That's that's one part of your job.

And this is not something we usually do.

As we build applications, we need to understand how the packets are delivered.

But configuring the network is something really is better left to the network engineer who this is their

bread and butter, as they say.

Right?

Like how many network do I need?

Oh, do I need slash 24?

A little bit too much?

Let me let me reduce that.

I need more host than networks, actually.

And you can play with that.

This is a ward by itself.

That's why I really mentioned that this course is really for a depth network in general won't teach

you all these low level stuff, you know CCNA and passing all these exams.

No, this is actually decided designed for us software engineers who want to understand the network.

It's a bridge.

Now, after that, if you're really interested in networking, you might take an actual networking course

and you might have actually a better, you know, better luck with it if you want, if you think about

it, because now you get to understand the high level stuff.

And each of these network will have 2 to 55 hosts.

And this is also called a subnet.

If you ever heard about this subnet because of subnet subnet mask, very critical concept.

So if I do 19216 8 to 2 54 to 0 24, this is also called a subnet and the subnet must have a subnet

mask.

So if the subnet mask is used, if you're sending an IP packet, you know, and you have an IP address

and you want to know that is this IP address that I'm about to send to belong to my subnet or not to

answer that particular question because that question will.

Will be forked into two logics.

It's like if it's in my subnet to do this, if it's not on my assignment, do that right.

If it's in my subnet, you can use the MAC address to send it directly back to the host to host communication.

Just use the MAC address to send it directly because it's literally in the same network as you know,

while if it's not in your subnet, all bets are off.

You need to talk to someone who knows how to route this and usually this is usually called a router

or a gateway.

That's why you have a gateway IP address.

In every network you assign, there is a gateway IP address.

That's when things are unclear.

Hey, what do I know that I don't know.

Send it to the gateway.

Some of that mess is used to determine whether an IP is in the same subnet or not.

Default Gateway.

We just talk about this default gateway.

Most networks consist of host and a default gateway.

So you have a network and you have a bunch of hosts right in that network up to whatever the host bets

you are allowed to have that network.

And there must be one of those hosts must be a gateway.

Why?

Because those hosts, they want to talk to something outside of their subnet.

They need to talk to the gateway.

The gateway is just another device that happened to have two network interfaces, one network that is

assigned to belong to this network and another network that belongs to another network, or maybe three

or four or five or six.

These border routers have hundreds of networks.

You know, they can talk to many other networks, so.

Host They can actually talk to host B directly if they are both in the same network, you know, same

subnet effectively, and they use the MAC address for that, right?

Otherwise, if a doesn't know how to talk to B, if its B is not in a subnet and it can find out by

using the subnet mask, we're going to give an example.

Don't worry.

No wait a minute.

Otherwise a sends it to someone who might know the gateway.

The gateway might not know, by the way.

Right.

Because the gateway eventually might talk to another gateway that might know.

You know, you get the point, right.

It's an elegant design.

I absolutely love it.

The Gateway has an IP address on each, and each host should know its gateway, right?

And also have multiple IP addresses depending on how many networks it talks to.

Hey, find an example and I'm going to disappear here so you can see the whole picture.

All right, so host 192168.123.

Wants to talk to 19216821, two two to talk.

I use the word talk here.

I really literally mean sending data, sending packets which to translate it to application client,

front end, back end speak.

We're sending an HTTP request, for example.

You know that's talking, right?

Assuming .1.2 is actually a server and one, two, three is actually a client in this case, or you

want to send a curl request or you do an SSH server.

That's what talks really mean.

At the end of the day, as I said or not, HTTP, DNS, all of these fits into a nicely tucked in IP

packet which has a destination IP and the source IP.

And that's the beauty of this.

Routers don't care about the protocol.

Some routers of fortunately do.

They look at the content, they block certain protocols but most don't you.

But look let's take a look 192168.1231.

To talk to one on two.

First a question tries to answer Are you and my subnet?

It applies a subnet mask to itself and the destination IP address.

What subnet mask?

It's own subnet mask.

Right.

Because that's the only thing it has.

It doesn't have the subject matter with the other machine.

It doesn't need it actually it needs the subnet mask of you which you have.

Right.

You can go to your network, you're going to have three things the your IP address, your subnet mask

and your gateway.

Without these your you cannot do anything.

You're basically dead in the water.

You cannot connect with anyone, right?

You need these three pieces.

So you take this guy, do the 255255255.0.

Apply that right if you do the normal and operator you know this is ones all of these are ones two or

five.

Five are the ones.

Right.

And this is zero one then anything one if you end anything with a one it becomes the same value.

So when you add these bits, right, this is simple byte operations.

Anything that you end with the one becomes the same value, right?

So 192 becomes remains 192168 with 255 becomes one nine.

Because at the end of the day these are one one.

I wish I, I built a bitmap for you guys but you get an idea right 111111.

And these are actual bits like one zero whatever.

Right.

So anything.

You and is going to become the same value right to five, five and one becomes one.

And there's the most important thing, zero and anything is zero.

If you add anything with zero, just nulls it out.

Right?

So zero and three is zero.

All right.

Let's apply to the second IP address two and Z two and zero is zero.

And this is the output from this.

The second IP address, this is the output 4192168101920601110.

These are the same subnet and that question leads to the first branch that we talked about which no

need to root.

I don't need to root it.

I don't need you guys.

I don't need this guy.

I actually do because it's a switch.

In this case, it's playing as a switch.

We're going to talk about it in a minute.

So I'm sending this data to my router, but the router is just going up to layer two.

In this case, it doesn't need the IP address.

But why?

Because it isn't the same subnet, right?

I believe maybe the router will go to the layer and looks at the IP address, but it is the same IP

address.

Right.

So in this case it will just look at the MAC address.

This is all right.

This MAC address is actually on this port boom.

Let's send it right here.

So the router will act as a switch in this case.

So we'll look it really neat.

Just layer two on this particular case.

And this is, by the way, the second network.

We're going to come to that.

All right, let's spice things up a little bit.

19222168.1.3.

Wants to talk to 192221682, two, two.

This guy, this guy wants to talk to this guy.

Well, it's a different network, right?

How did I know?

Well, apply the mask and all of a sudden, you know that this is 192160120.

I, I been one, two, three.

I.

Am I right?

This is my network.

The guy I want to talk to is 2 to 0 different subnet.

I don't know what to do.

This is different subnet.

I need to route it to someone who does.

The packet is sent to the default gateway.

My default gateway is 192168 1.100.

Now you need to send the packet to the router and guess what you need.

This is now loops back to the first scenario.

What you're sending horse to horse directly.

Now you are as if sending the package itself destined to this guy.

But the Mac address, right, is the router.

And here is where every attack possible happens.

This is called our poisoning.

If someone here pretend to be the router, then all the packets can go through it.

And that's how our poisoning happened.

That's another topic for another day.

Right.

Because the Mac addresses is I need to know what is the Mac address of my router because now I need

to send the packet to my router.

Right.

And my router is in my the same subnet as I am.

I send this to the router and the router turns around and understand that Hey OC, where is this guy?

192.

So the router has actually another IP address on the other end.

1921682 200.

Right.

So router lives, double lives, you know it lives two lives.

You know, that's that's what it does, you know, so it's living two lives effectively.

It's a it's an it's an address here and it's an address here.

So it's living it really has two representations.

So this can talk to this and this kind of address.

And that's how that's how basically it is done.

All right, let's summarize.

So talked about what an IP address is talked about.

What is the difference between a network portion and the host portion?

And you can know what is your network today if you want and you can know how many hosts can possibly

happen and you can configure your router to assign more or less host.

Right.

Based on that and we talk about the subnet, we talk about the subnet mask, very, very critical concept

to understand.

We're going to talk about more why this is a critical and in the final section actually where if your

database is actually in a different subnet, then you're back in application, then IP packets that

are in form of TCP connection request from your backend application to the database is going through

the router.

And if this router is congested, then you're going to see delays.

So this is a little bit of a tease and spoiler alert, you know, to that section.

But that's one of the things that just makes sense.

Do not put your database in a different subnet.

You know, sometimes it's not that bad, to be honest.

It's it's okay to put it in a different subnet.

But what happened if this router is so congested, if it's if it's talking to thousands of the networks.

Right.

Or so many networks and so many hosts, it's routing packets, then there might be chances where the

router will buffer will fill down and your beautiful SQL statement request, which will transmit to

multiple segments, will be posed in the router and will never reach the database until a few milliseconds

later and you will see those delays.

Anyone knows why I do have delays in my back end application.

That's just tiny, something tiny.

And this is immediately you understand it because now they understand what is actually happening.

Now go check your back and configuration.

Do you have your database different than your your application?

Put in the subnet because it costs you nothing.

Right.

In this case, put a switch.

Put an actual switch.

This is where a network configuration comes into the picture, actually, right where you're going to

put an actual network switch and you talk a high performing network switch and you put the database

and the application.

Talk to this switch.

The application has no business talking to the router, right?

Don't use the router to route application packets to your as a switch.

You know, that's just a cheap switch at this end.

Right.

Router is not are not designed to be switches that's why those high performance switches are cost a

lot of money enterprise switches.

You know again, I'm not very versed on this but if you really want to go to that level, that's a network

engineering bread and butter you know that's where.

And that's what I want.

I want to bridge that gap.

That's what I'm talking about, guys.

Back in the moment.

You understand this.

You will ask the network engineer to do this configuration for you because you have no idea what you

want, right?

Because they know everything, but they don't know what you want, right?

So if you are a network engineer, you talk the course.

Thank you.

But you now understand the requirements, Right?

But now we're bridging this gap.

We're closing the wound, as they say.

But yeah, and the default gateway, the concept of the default gateway is also has been explained in

this lecture.

How about we jump into it and move to the next lecture over the first lecture of the IP packet?

Harvey, think you know, there is there is so much, so much to discuss here.

Let's jump into it.

Now that we have discussed the building blocks of the Internet protocol itself, I'd like to go and

take a moment to.

Take the lid off of this and dive into the IP packet itself.

This is the anatomy of the IP packet.

Let's jump into it.

All right.

The IP packet, the anatomy of the IP packet itself.

You know, we're now we're going a little bit deeper.

We've always as backend engineers and as engineers, we always look at the IP packet as just a bunch

of data with a target IP address and a source IP address.

As at least I always visualize it this way, but it's critical to understand certain pieces, not all

really.

What I believe.

There are certain important information about the IP packet itself, and this is what this lecture is

about.

So what is the IP about IP?

It has headers and data sections, two sections, the data and the header.

Most of the time we really care about the data.

We don't really care about the headers, but if you want to debug certain problems or understand certain

situations, you need to dive into this thing.

One more important thing to understand is the size of the packet and headers come into the picture.

If you add a 20 extra byte, that's the IP header by the way, 20 byte extra to your data.

That is a 20 bar that you that's not really your data.

It's it's the cost of doing business effectively.

And guess what?

This can go up to 60 bytes if there are certain options are enabled.

So I believe those options are not always in it, but if they are, you can go up to 60 bytes for a

certain packet.

So it is really important for these certain algorithms to kick in to save on sending like a single byte

of packet, you know, with 20 header at 20 bytes header.

It's just a waste of time, you know, it's just a waste of resources to send a single wide and then

attach a 20 byte header to it.

So that's what goes like Nigel I them and delayed acknowledgement try to solve effectively you know

trying not to send your LS command through such as a single packet.

It's just a waste you know, but sometimes you kind of scared that, you know, that's why we have the

data section can go up to 65 536, you know, and that's because the length of the data itself is 16

bit.

So you can only address up to 16 bit worth of content that's equal equivalent to 65,000.

And to be honest, I never seen an IP packet that large at all because if you think about it right,

and we're going to talk about this in later sections, there is something called the MTU, right, which

is the maximum transmission unit.

So maximum transmission in the internet is 1500.

So what packet and avoid all the ideas of fragmentations, you can't really shove more than 1500 water

in IP packet without fragmentation.

So seeing that maybe in a cloud and Amazon, whereas the custom made hardware with MTU is I don't know,

a gigabyte gigabit and to use that, I don't know if that's even possible, but that will reach that.

But to me you will never reach that in single IP packets is almost the average is 5500 bytes, maybe

9000 certain situation, but that's in jumbo frames, but that's pretty much it.

So yeah, I always like to add this IP packet to a back end engineer.

It's a bunch of data destination IP address.

So the IP address I for the longest time I always look at the IP packet like this, you know, and effectively

like this, the right hand side has the destination and this left hand side is the source IP address.

It doesn't look like this on.

On paper.

Right.

But I personally like to it this way because it fits like a Petrushka doll, if you will.

You know, I package based on their frame.

The segment fits into the data and so on.

Right.

I just like it to it this way.

But here is how the actual IP packet looked like.

Scary, isn't it?

So this is how it actually looks like, you know, the IP packet itself and these are the references

you can use that at this, the RFC of the IP protocol, you know, the Internet protocol.

And this is the Wikipedia that explains you have a summary of all that stuff.

What are we looking at here?

This is, you know, horizontally from 0 to 31 is that is is four bytes, you know, so this is eight

bits, eight bits, eight bits a bit.

You know, this is how it's organized.

So four bytes in the first row, four bytes on the second row for byte in the third row for by the fifth

row and fourth byte on the final one.

So if you multiply by four by five rows that gives you 20 bytes that we talked about.

So this is the options and this is determined by the Internet headline.

We're going to talk about it in a minute.

By default, this is five which which explains these five bytes, you know, five rows.

And if it goes more than that, then that will define the length of the options effectively.

And this goes up to 60.

Now, we're going to talk about it so we can add stuff to these options.

You know, and this is good.

Those guys, whoever decide define the IP protocol, they define it in a way to make it extensible.

Unfortunately, from what I read is some routers effectively block the options for some reason, you

know, because it's dangerous or whatever.

So this is sometimes getting blocked.

You know, that's the sad thing about the Internet.

Not everybody follows the rules and as a result, you don't get predictable.

So otherwise I as I back it up, I would have definitely used the IP packet to try to sneak in data,

my own data in the packet itself.

Imagine that how cool this is.

You know, we always build on top of, you know, protocols on top of TCP, on top of CDB two, we build

protocols on top of protocols and we forget how that this is available for us.

You know, as programmers, we can write a packet and we can send options, right?

Unfortunately, we guarantee that these options are arrived safely.

I don't know.

Apparently not.

You know, because these options sometimes are dropped, but it's pretty cool if you think about it.

I don't know if these are user set or not, but regardless, this is the data portion we talked about.

This goes up to 65 kilobytes, you know, 64 kilobytes to be specific.

And let's go through this version.

What's the version of this is either four or six.

We don't have either versions of the IP protocol, right?

So this is either for a specific bits, we have zero one, two, three, we have four bits to describe

that.

A little bit of an overkill if you think about it, right.

Four bits.

How much is that?

Is that 16 numbers.

Right.

Because to the bar.

Eight.

Exactly.

15.

Right.

That's a lot.

So they envisioned like hey, we will go up to version 15 of the IP protocol, but sadly these bits

are never used, you know, because we only use for our six now so we never lose the other bits.

So it's a waste.

But that's what we have today.

Internet header length.

We talked about this.

This defines how long is the options and by default it is five I believe.

Right.

And you can add more.

So yeah.

Okay.

I need, I don't know, 20 bytes write of options and that will that will allow the router to read the

options or not.

If this is five it will read one, two, three four, five with these five rows if you will, a total

length.

Right.

This describes the total length of the whole thing.

You know, this includes the data and the header.

So and this is 16 bit as we talked about, so eight plus eight.

So you can go up to two to the power

16, which gives you the 65,000 bytes and that describes not just the data, just serve the whole header

which is could be 20 you know, do do the math 20 to up to 60 based on the options if you have options

there.

But yeah.

Fragmentation.

This is really a powerful concept.

Sadly, this is very hard to get right, and from what I know, most implementations actually

are frowned upon.

Fragmentation quick is a good example.

Quick Every packet and quick.

The protocol, you know, disables IP fragmentation because it causes so all sorts of things, you know,

because now if the packet is so large, first of all, let's talk about what fragmentation really is.

We talked about M2, right?

The maximum transmission unit.

And you don't really need this, so we can talk about it right here.

So we talk about the M2, right?

The maximum transmission unit, which is the frame size.

And we talked about the IP packet.

By default, the IP package, IP package should fit nicely into a single frame.

And if it doesn't fit, that means if the IP packet is large for some reason, let's say the MTU is

1500 and the IP packet is 2000.

Then that is called you have two options here.

The IP packet won't fit in the frame.

You have two options.

You can either tell the client whoever sent this packet, hey, empty you to too small.

I can't fit this large packet that you sent in in that rm2 fail.

It will send a message.

How does it send a message?

We talked about the ICMP protocol, the internet control message protocol.

Messages are sent through this protocol paying traceroute things like that through the IP vehicle.

We'll say, Hey, I can't.

This packet is too large, right?

That is only if you set that don't fragment bit.

But the other option is.

Fragment this thing.

The IP packet, 2000.

All right, let's put 1501 frame and the 500 goes to another frame.

So you have one IP packet that have been fragmented into two frames.

So those frames will be sent as two frames.

So one packet, two frames, the two frames will arrive.

Guess what?

No, not necessarily in order.

So the host has to understand that this frame belongs to something that is fragmented and try to assemble.

So there is assemblage that needs to require assembling.

The fragment is one of the most dangerous things, right?

Security wise.

And just because people can fake fragmentation, you know, and I won't go into details on this, but

plus it's its cost that is on the whole site.

So you can fragment if you want.

Right.

And this is how you do it.

We're going to talk about it.

But if you do understand the consequences, one frame might fail.

You have to resend it.

And how do you send just part of the fragment?

It's very complicated, right?

That's why.

You know what?

Let's not let's not fragment.

Let's not.

Hey, if you don't fit into a frame, just fail.

So that's the responsibility of the client to send a that they know the should fit in all the empty

use that the network will pass through.

Back to the slides.

Well, actually, I can talk like this.

Yeah, because there's nothing here.

So.

Yeah, well, the ID, this is the idea of the fragment.

So if you have one packet that fragments into four.

So this is one, two, three, four.

Effectively write the ID of the frat flags like, Hey, should I fragment or should I not fragment?

So this is a flag that literally tells the the client which are outer or not.

Am I supposed to break this big packet if the empty is too small or not?

So there is a DF I believe here a flag will say okay, you can, you can, you can fragmented fragment

offset is the 0123 and this is the ID which is the unique identifier of the fragment itself.

Now so all of these are just using four four for fragmentation jumbo packets.

You can get into this as well if you have a large IP packet effectively time to live.

We're going to talk about this as well.

Right.

Every IP packet has a bit actually eight bits, you know, a single byte that represent a counter.

And this is very interesting.

Before we talk about time to live, we're going to talk about a problem because what are we doing this?

Cause we we always ask the question of why?

Why does something exist?

Why do we need to fragment that is too large?

Why do we have time to live?

Because of the idea of routing that we talked about in a while.

The packet can go into different routes, right?

And they can end up into a situation where they will go into an infinite loop.

We'll go to this route, this route, and the theories are out there and this route and then back to

the same router and the packet can go infinitely and you have no idea if you visit this because routers

are not stateful, you know, they don't save the state.

IP protocol is stateless.

You know, they don't save the state of that protocol.

Like, oh, this package was visited before, unlike the layer layer for where we have states, we have

session, we have all that stuff.

IP is just stateless, no IP packets just passing through.

So there is no state.

So how do I prevent packets from roaming around the internet forever?

Meet time to live.

Tell you when you send a packet, you say, okay.

I estimate that this packet will live for 100 routes, right?

So we put 100 here.

I say go.

This packet goes from u L reaches the host.

You know the gateway.

Of course.

If you sending it to the Internet, it will go to your gateway, which is your router.

The router will do minus one to the packet.

So.

Well, the the IP packet will arrive at the physical layer will be converted to a data link, will be

converted to frame the frames.

Right.

Will be converted to IP packets.

You know, one frame, let's assume simplicity.

One frame goes into a single IP packet.

That's best best case scenario.

We have the IP packet and the router takes that IP packet, takes the time to live decrement by one

and send it again.

So it goes back to the same model and goes off to the internet and every one of the routers and hosts

that sees this packet decrements it.

That's the responsibility, that's the contract.

This way we kind of add the state right to the packet.

You know if your program before you know the concept of stateless versus state for stateless we have

to send the information with the with the request right there.

Of course in this case the IP packet.

Right.

Send it with it.

So the state always follows the data itself now instead of saving it in the host.

Right.

So now if this time to live rich zero, whoever decrement it to zero must stop, you know.

Must drop the packet and must send back an ICMP message.

ICMP shows again.

That's why I explained it.

Very critical.

The ICMP protocol shows up again, say packet timed out, whatever.

No, I don't remember that exact message and we'll say it will send it back to whomever was the source

IP address.

And that is exactly how traceroute works.

Traceroute works or router route, same thing.

Trace tracer out or trace route.

You know I believe the British call the router.

Yeah.

So routers, you know the routers.

Right.

Will decrement that until it reaches zero and then send a message to the source and says hey, it's

done.

So the trace route actually does it this way.

It will set a very small time to live and it will increment it.

And every time we pass a hop, we reach the next hop.

That router will tell us about its source IP address.

So we know effectively we trace the entire route.

Obviously some routers disable ICMP altogether, some firewalls disable ICMP, and if that is the case,

that's where you get the dot, dot, dot, dot and trace route.

You cannot basically trace it in that particular case.

So that's time to let very, very important concept.

How many hops can this packet survive And this is usually 128 number or whatever you said it is a large

number, not too large because eventually the packet will live for a long time.

You know, I believe that whatever the default number is enough, if you see your packet takes more,

maybe longer path and they are dying, maybe the client will increase that number protocol you might

say.

I'm saying what we know we are in the IP address.

No, this is the protocol of what is the content that is inside this data.

No, I always find this when I first saw this is like, why that's kind of moot.

I have to define the protocol and you have to know about my protocol.

I want to send this to random data.

It doesn't have to be a protocol.

I want to invent my own protocol.

Are you going to block me then?

I thought about this, right?

It's like, say, hey, just read the data and figure out the protocol.

That's why that's what that's the first thought that came to my mind.

Why do you need an extra eight bits waste?

You know, Then I thought about it.

You know what?

There's actually a good idea.

This way, the routers don't have to pass the entire data.

They can just read the 20 bytes header and immediately figure out what is inside this and whether they

should pull the data or not.

You know, that's ingenious.

Effectively, we always do this.

You know, this is metadata, metadata to save performance.

And obviously it's probably decided to block or want to do anything else.

You can just read this protocol.

So our protocol could be ICMP is part of whether it is TCP, whether UDP, whatever the content of the

IP, the IP data itself, that's the protocol here.

There is a list in in Wikipedia, but if I can share it as well, showing you all every single protocol

that protocol server and specify just I think that is like miscellaneous or something like that, you

can put all that stuff here.

There's there's obviously a bay eight bit.

So how many do we have?

You can have up to 255 protocols but that's it.

Source and destination IP.

By far the most important pieces of metadata here, the header, where are you going and where are you

coming from.

Very important piece of information.

Everybody can fake source IP address.

You know, you can try.

That's why it's like, okay, all my IP address has been spoofed.

You know, here a lot of people it's like it's like, Hey, oh, this is not this.

We've seen your IP address on our forums.

No, that was not me.

My IP address was spoofed.

I was like, Yeah, like spoofing is something easy to do, huh?

Spoofing is the idea of changing the source.

Every packet that you send right from your machine, you effectively changed the source IP address to

be something else.

You can do that, right?

But guess what?

Your ISP, the packet, the IP will go through the routers and the first router.

It hits the major router.

What is what's, what's the first major router?

It's your ISP because that's your link to the internet and it will say say, hey, my source IP address

is actually whatever that guy, you know, you can put any number you want, you can you can write simple

code that do that, does that rewrite every single IP packet.

Right.

The source IP to be something else, but your ISP ISP will call you out.

It's like, wait a minute, that's not your source of IP address.

I know your IP address.

I assigned it to you so you would always be actually blocks said No, you cannot do that right.

Unless.

Yeah, every single internet provider will have this block.

You cannot spoof anymore.

You know, it's not easy to spoof IP addresses, you know, unless you build your own ISP, which is

I don't think it's impossible.

You can do it and then you run your own ISP, you pay money to link yourself to the Internet.

Yeah, you can spoof all you want then, but even if you spoof, then how how would you get responses

back?

Because that's what is used to get responses, you know.

So yeah, destination IP is where are you going, source is where you're coming from.

Very critical.

And these are, as we talked about for bytes because this is what this is the IPV four write explicit

congestion notification.

We're going to talk about this more on the TCP section.

But this bit is effectively is is from an so from a lower layer or an upper layer from an upper layer.

This bit is set by the router.

And this is what it means explicit congestion notification before we talk about congestion notification.

And again, we're talking about this in details in the future, but it doesn't hurt to talk about it

now.

Congestion is when packets start to drop.

You know, IP packets will be arrived at routers like floods.

You know, everybody's sending data.

Everybody I am as I speak, I'm sending data.

This is not life threatening, but you get the point.

And if you're playing this, packets are coming through routers.

You know, at the end of the day, routers to process this packet, they need a certain amount of memory

called the buffer to put the packets in.

This memory fills up.

If it fills up, if you have too many packets or your router is slower, like it does a lot of stuff

to pass.

More work means more time.

More time means queue will go longer and the buffer will fail.

If the buffer fails, that means you cannot accept more packets.

That means you have to drop incoming packets.

Any package that comes the controller of the router will drop the packet and when that happens, that

indicates something called congestion.

That means, hey, the network is congested or these routers are having a having a hard time processing

packets stop.

So there is a whole solution to congestion control, control the traffic in the Internet, and that's

called congestion control for the longest time.

Routers always dropped the packets.

Hey, drop the packet.

I don't care that it doesn't even send any message or anything like that.

Just drop it and leave it alone.

You know, it doesn't even send an ICMP message.

I don't think so.

The client have to guess is okay, my packet had timed out.

I don't see an acknowledgement.

I'm going to assume it's gone, it's dropped, and I'm going to assume congestion.

That's what happens.

It's a waste because that timeout is so long and we're wait.

We need better communication.

Meet explicit congestion notification, the router.

When their buffer fills up because they are IP packets, they only deal with layer three packets.

They will take this packet and say.

I'm about to drop this on my bucket.

It's beautiful.

But wait a minute.

I'm going to actually, I'm going to actually not drop it.

My buffer is about to fail.

I know it's going to feel easy.

N said the bit to one right?

Whatever.

Set it to true Boom notification.

I'm about to get filled and then it will actually process.

So the receiver will see that bit.

Oh oh.

Someone actually some of the routers experience congestion.

I better tell the I better tell the receiver.

And so the TCP layer text controls is where we experience congestion and then the client will start

communicating at the higher levels.

And the TCP transport layer is okay, we experience congestion.

So the beauty here is with this small change, we manage to notify the both the client and the server,

right?

The server will reply back to the client with the same bit, so everybody will know eventually and and

they just manage to know that there's congestion without any packets getting dropped.

Beautiful design.

I absolutely love how elegant such small to bits can do.

And to be honest, I don't know.

Why do we have to better we can go into more detail, but this is the gist of it.

Beautiful.

I absolutely love this stuff.

You know, we can learn so much as backend engineer from these elegant designs, you know, because

we waste so much when we build applications, we build all sorts of, you know, we allocate arrays

like thousands and thousands of by Jason Bloated Jason.

We duplicate keys all around.

We took duplicate responses from the database.

We put it everywhere.

We send information we don't need.

So all of this stuff really hurts me when I see a response from an API that that we just got back up.

You know, we send the same value over and over again.

These kind of things makes me know back in the old days they had a limit to work with and they appreciate

this limit.

Today.

Engineers We don't have a limit.

Ram, what is Ram?

I don't care.

I have 700 gigabyte ram.

I don't care.

Let me look at everything I want.

And unfortunately, we lost that, you know, source of scarcity.

This is just me ranting and that's pretty much this is the most important thing that I like to explain.

And when it comes to the header, the IP of the header.

All right, I've always summarize this IP packet.

The IP packet is one of the more elegant, you know, anatomy there is.

You know, the packet has headers, it's 20 bytes can go up to 60 if you have options and I'll is enabled,

the data section can go to 65,000 bytes.

I never seen such such a IP packet that large because there is no MTU that fits it.

First of all, you know, so you can argue that hey 16 bit is actually too much, but you never know.

Maybe in Amazon Cloud Cloud, Amazon Cloud or Microsoft Azure or Google, they build their own network

interface with a large MTU that can effectively be 65,000.

Who knows?

They don't share this information with us.

So if you have such a large frame, you can send one IP, large IP packet and then fits it in a single

frame.

Now I don't know the limitations of that and what can what can go wrong with that?

Probably people will try them but definitely will decrease the latency, right?

If you have your own network that all of these devices have tightly high bandwidth network, I'm not

going to the internet.

It's just between me.

It's on my own back.

End the database, connect to the to the back end application and all they are, I don't know, 100

gigabit Ethernet and MTU 65 K MTU use, and I'm going to use that.

Sure, you're not going to the Internet.

So this is tightly local area network, so you're optimizing the heck out of everything.

So I'd like to see this one day.

So if someone, if there is an article or something I would love to read someone actually taking advantage

or if there is any limitation that comes to him, to you sizes we talked about packets need to be fragmented

if it doesn't fit a frame, unless you set the bet that says, Hey, don't fragment my the flag that

we talked about, hey, don't fragment.

And if you don't fragment, then if that packet is too large for them to you, we fail, we drop the

packet and we tell the client that, Hey, we couldn't fragment your stuff because you told us, don't

fragment.

Right.

And that's where ICMP.

Uh, actually, this is where a black hole connection can happen.

We're going to talk about this as well in the future.

Black hole TCP connection.

Google that.

All right.

That was the IP packet.

How?

I'm moving to the next lecture.

All right, guys.

ICMP is one of the most critical protocols that lives in layer three, and we talked about it a lot.

But this is where we actually explain it.

If you ever used Ping, that's ICMP.

If you ever use traceroute, that's ICMP.

We're going to demystify this protocol and talk about how critical this thing is.

How about we jump into it?

So ICMP stands for the Internet Control Message protocol and lives in layer three.

That means what does that mean?

It means only there is a destination and source IPA.

There is no concept of ports at that layer.

There is no ports.

There are no ports, you know.

So it's just for information.

Messages between host.

Beautiful.

No, just very critical.

That's why when I Now we have the same language, we talk the same language.

When I say layer three, we You understand what that means When I say layer four, immediately ports.

Think of ports.

You know, think of TCP.

Think of congestion control.

Think of that stuff.

We're going to become more clear as the course goes.

Designed for informational messages hosted, unreachable.

Hey, you send a message to a host that doesn't exist.

ICMP port unreachable.

Although port is a layer four concept, the ICMP is a layer three concept that is sent back from the

server.

So if you try to reach a port on a server that doesn't exist, it will send a ICMP message back if that's

enabled and we'll say, Hey port unreachable.

Host unreachable fragmentation needed.

We spent 5 minutes talking about that fragmentation.

Hey, you need to fragment your packet because it's too large for them to you.

Packet expiry infinite loop and routers like hey, this is the time to live things that we talked about,

right?

Until if we keep a decrement and they decrement thing until it's reached the hit and then hey, packet

expired, it's zero, it's dead.

You send an ICMP message so all the time uses IP directly, ping and TRACEROUTE uses it.

We talked about that doesn't it doesn't require listeners or port to be opened.

I love to add this kind of concept.

You'll never find anything else.

That's because a lot of people take this for granted.

But I like to kind of emphasize this point.

There is no port to listen to get the ICMP messages.

You know, you can send an ICMP message any time you want.

As long as the host itself enables ICMP, that means IP packets with IP packets, with the protocol

set to ICMP, no ports, nothing like that.

You can send these echo messages all you want.

You know, this is how the ICMP header looks like.

This is basically I took this from the RFC 792.

Can look at the ICMP message.

It's very simple.

You know, it's a four byte, four octet as they say.

ID right?

The one poor, one by two, by three by.

So there is a white for the code.

Obviously you can have up to 255 code, write a type of the message.

So the thing goes is this is the type, this is the subtype, if you will.

And there is like a list of everything here and all the list is here effectively checksum, whether

this message was corrupted or not, the rest of the headers, you know, some firewalls block ICMP for

security reasons, you know, a lot of you know, that's the sad thing about the Internet.

You know, you build something cool.

We can't have nice things in the Internet.

You build nice things and attackers find an exploit to use ICMP for bad thing.

You know, some people use that to do flooding attacks, to flood ICMP messages to certain server.

Some use it some some some used it for back channel attacks.

To kind of probe the server has to find certain ports that are enabled you know just some firewalls

actually block ICMP or some some some firewalls timeout ICMP messages like hey you can't you're doing

a lot of ICMP requests right now, so I'm going to time you out for a sec.

For for example, this is why Pink might not work in this case.

So ever wonder that you're pinging a machine that you absolutely know it's alive, but your pain is

not going through?

It could be that it's not going through because the host is not available.

But most of the time think one of the packets, right?

The routers that you're going your ping is going through your IP packet because the thing is just an

IP packet that has ICMP.

It's really nothing, nothing fancy there.

And what it does is, is like, hey, one of those routers drop the IP because IP packet because ICMP

is blocked.

So disabling ICMP can also cause real damage with connection establishment.

This is called the TCP blackhole effectively.

So you would establish the connection, right?

But then you start.

So a TCP three way handshake is we're going to talk about it, but it's tiny.

You know, the data you're sending is so send and sent back and Ach.

Right.

But then so so that passes because your IP packet is so tiny.

But the moment you start sending real data.

Right.

Right.

And you say, don't fragment.

And then one of the MTA's in.

The devices are so small and you need to fragment the router will send will try to send you a message

ICMP message saying hey your your your IP packet is so large for my MM2, please make it smaller.

But guess what?

ICMP is blocked, right?

If it's blocked, you will never reach you will never get the ICMP message.

So all of a sudden you see the TCP connection open, but your data is not going through what the heck

is going on?

It's like you open a black hole.

That's literally what is called TCP IP black hole.

Google it, you know, and we're going to do a panic demo a little bit in a minute here.

Let me let me ping something here.

I'm going to ping.

Ping is available on literally every operating system.

So let's pick something that's ping 192168.254.2 54.

This is actually my router.

So if you see this ping, we'll send an ICMP sequence message, you know, and it will specify a title.

Hey, we know the stuff now, right?

TTL Time to Live 64.

Titled Time to Live Iterations and ascending 64 bytes.

Right.

And this is the time it takes from for the ICMP to reach this router and from the router back to me

and it's six millisecond.

If you think about this a little bit slow.

My daughter is right over there.

Why is it taking me maybe through the wi fi?

Because I'm connect to the wi fi.

But look at this.

Sometimes 11 milliseconds, sometimes 12.

That is nuts, you know?

But this is the ICMP sequence.

It's beautiful to understand this stuff.

Right?

So let's.

Let's bring Google.com.

Ping.

Google.com.

So what ping does is like, first of all, ping only works with IP addresses.

Google.com is not IP address.

So it does a DNS finds the IP address.

Right.

So Bing does more work here.

Give me the IP address and now we ping and notice that it decided to do a larger deal.

Now, just because the Google I guess, is farther so it will estimate.

Let me put a larger title and this is like, look at this.

Google is almost as close to my router.

It's like 12 million, nine millisecond and my router is six millisecond.

I really need to check like why is my router is so slow and I need maybe to upgrade my router now.

But this is really interesting stuff.

Back to the slides.

All right, Ping.

This is how ping works and this is the destination server.

All right.

Let's explain what this beautiful diagram that I spent so much time trying to draw because I'm not a

very good animator.

Right.

As you might have noticed already.

So 19216 100 is the first router that 3800 is the second router.

So this is a network.

This is a network.

And these are their puppy devices for that network.

1.2.68 The 5800.

These are the network and these are the devices, 10.100.

This is another network.

So we're connected.

We're connecting many networks together.

So as we talked about, this router belongs to two networks, right?

This guy and this guy, this router belong to two networks.

There's another block to do network.

This router two belong to one network.

Right.

And this is just one of the devices.

So if I send a packet, what do we do is like I send a 200 ICMP echo request.

That's what it means, right?

Hey, I want to go to 192168 or 10.3.

So this guy.

192.168.123.

We do all the shebang that we talked about.

You know, do the subnet mask or you and my subnet.

No, you're not.

Let me send it right.

And with the message, the packet will reach there and we're going to decrement all the TLS.

Right.

So from 100 we reach 96.

So one, two, three, four.

Right.

Makes sense.

Right.

And I'm not sure if the host actually decrement that or not.

We can we can we can study that and make sure that ALK is at 95 or 96.

I really don't know.

But I know the router is decrement that it goes Yeah so we reached that.

So that's that's how ping worked so we got the echo the server.

If it supports ICMP it will respond back with an ICMP echo reply again reset the title the source.

The destination is 1921682123 and the source is 10 to 3 and do all the subnet mask shebang and then

boom, send it over and we get it.

That's how ping works.

Let's go.

A ping that is unreachable.

I'm sending to 192168 or ten two three, which is right there and 161 1.123.

Right.

But look at the title.

I just set it to three specifically just to time it out for for testing reasons here.

So it reaches here.

It becomes two, the packet reaches here, the router determines that becomes one, right reaches here,

the other determines it becomes zero.

This is wait a minute, it's not reachable.

I have to drop it so the router before it drops it.

It drops it and then sends an ICMP destination.

Unreachable ICMP message because just an IP packet.

It's just an IP packet.

That's a beauty.

Everything is just an IP packet to the layer three routers here, we're sending all this beautiful stuff.

MAN 1921688.

One, two, three.

Target is where I want you to send it back to.

Yeah, Look at this.

We're sending.

We're sending to whoever the source was.

But who is the source here?

Now the source becomes this router $160.

500.

So now look at this.

So now we got the machine, got back another packet, but it knows who sent it.

This is the whole implementation of traceroute because the because the tail dies right here and because

the router sends back and ICMP destination unreachable or whatever.

What happens here is effectively the we know who sent this, right?

We know where the packet dies and that's beautiful.

Trace traceroute or route.

Can you identify the entire path your IP packet takes?

That's the question Trace right answer level use of.

Right.

And now I probably understand explain it a lot incremental slowly and you will get the router IP address

for each hop.

So start with the one you're going to get immediate, right?

Because that will decrement, reach zero and will immediately respond back with an ICMP message.

Right.

Doesn't always work as the path changes.

Right.

And ICMP might be blocked.

Right.

That's the problem here because if ICMP is blocked, you're done.

You cannot do anything but.

The other thing is your packet might take one route, but the second title that you send might take

another route, so you might get the wrong result.

So traceroute is not really 100% correct.

And here's an animation I did for the traceroute.

So what do you do is we send a TTL.

You saw this animation.

I'm going to do it again because I want you to appreciate my beautiful animation.

Look at this TTL one.

We send it one echo, send it to that destination, and then immediately we get a response from who

the one 800 says and destination unreachable man.

Why?

Because we set it as one immediately documented and we're done.

So now we know that my packet passed through this guy.

All right, Let me make it to now.

It survives the first router minus one.

It doesn't survive the second because minus one and then minus one becomes zero because you send two

and then it dies right here.

And now we get the second router.

So we have the first.

This is how traceroute works.

We know the first hop.

Is this the second hop is this.

All right, What's the third hop?

That's three.

Then boom, boom, boom.

Right.

We get this four, we get it here, and then finally five.

We're going to get an echo reply from the actual one.

That means, Hey, we actually found the destination, right?

And that's pretty much it.

You know, how about we do a demo?

Could it clear?

Uh, Trace, Artie.

I believe it's in windows called Trace.

Artie in Mac and Linux called trace root.

So trace, root out Google.com.

Let's do something else.

Do I have another network here?

If I traced out my router, that's kind of pointless because there is only one help.

But let's do it.

Exactly.

So my gateway is immediately that right?

So that's.

That's.

That's kind of pointless.

But let's try this route.

Yeah, let's try another machine.

Do I have another machine?

I believe I do.

All right, let's try this.

I'm going to trace route my other Mac book right here.

254 to 10, I believe.

Right.

And immediately look at this beauty.

So traceroute to this, right?

We immediately go to that.

Right?

There is no other hop despite us actually going through the router because that's what we have to go

through the router to reach my packet.

But my router here acted like a switch, right?

If it acts like a switch, it goes all up to what layer two?

So it never actually reaches a layer three.

So there is no TTL.

The TTL doesn't get affected if you're sending something to the same network.

Very critical to understanding.

Right.

Very, very, very important.

Let's try out something, I guess.

And another network.

Can you hear me?

All right.

Google dot com.

Sure, definitely.

The first hop now is the gateway.

Because what?

142 252 72.142 is definitely not in my subnet.

Why?

Because my subnet is 25525 out of five is not me.

So immediately we got to this is probably I'm going to block all this stuff because all of this is my

ISP and I don't want to show any of this stuff.

Right.

But.

It shows probably everything here, right?

It shows you all the path that it took or until it reaches Google.

Right.

So I'm going to block part of this here for security reasons.

But so I'm going to block part of this stuff.

But you can see that eventually we reached the Google network here.

Right.

All right.

How about we summarize?

So what is ICMP?

It's an IP level protocol that is used to send information back and forth.

Very critical protocol.

Fortunately, some browsers, some firewalls block it.

And if it blocked, that means you cannot ping, you cannot send critical information messages.

You can get into weird situations.

A ping and trace route uses it, don't fragment fragmentation needed all these messages around.

It will use to tell you that whether your host is reachable or not, you know port is reachable or not,

you know, and that's basically that very critical infrastructure, fundamental first principle protocol

that really need just to understand it so that you can explain things better when when it happens,

you know, and in the future, who knows, maybe we can extend this ICMP messages because we have so

much tools in our, you know, as they could shed.

But we never use this thing.

We always build on top of other stuff.

You know, I wonder if we can use the ICMP for our own purposes.

All right.

Onto the next lecture.