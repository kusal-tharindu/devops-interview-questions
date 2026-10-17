I wanted to take this lecture with a grain of salt because it's a very contentious topic in the engineering

space, and that's stateful versus stateless or stateless versus stateful.

And the definition game really doesn't matter.

Youguys, it's just what is the.

You know, the side effect of things.

And that's what matters to us engineers.

So the entire lecture or the entire course for that matter, never.

Hone your mind into the definition that, Oh, this must be this, because the definition is this.

It's pointless, right?

And I suppose this is kind of a theoretical discussion, philosophical, if you will.

But I think it's very important to understand why are we doing things to begin with?

Stateless versus stateful is the.

Is the style of storing state within an application.

And to me, at least relying on that state being there.

Otherwise things break.

That's what the definition of stateless is and stateful.

And you can take this to a system.

You can take this to a back end, you can take this to a function, really, And you can take this to

a protocol.

A protocol can be stateless or a stateful.

It all depends of how you perceive things.

Let's get into it.

So stateful versus stateless backends.

What is stateful?

A stateful backend is is a backhand that stores state about its clients in its memory.

Not only that.

It actually depends on that information being there for it to function properly.

And that's a big difference between stateful to anyone because you store information all the time you

are of course you're going to have a variable, right?

Is storing a variable state.

Of course it's a state, right?

And you can that's where the definition games goes amok.

But having that information, being there and relying on it, being stateful is basically that's the

copout really here.

The problem and and stateless is the client is there is no state stored in the client at all in the

server at all.

The client is responsible to transfer the state with every request.

So we're always in case the back end crashes.

I can always get back to that state without needing to remember that state, if you will.

Right.

You may store some state in memory, some state even in disk, but it's okay if you lose it because

you don't really rely on anything being there.

Right.

Let's say you store something and you lost it and the disk corrupts and you start back again.

If you rely on that particular thing, then you're kind of stateful.

But technically, a stateful app can still store something outside of its application somewhere else,

like a database, right?

So if you if you look at it this way, then the entire architecture is stateful because there is a state

store that we're relying on.

But the app itself is stateless.

Why?

Because I can crash the app and I can start a brand new app from scratch, and that app will work because,

yeah, I will read from another application, but that's the responsibility of another app, right?

Does that make sense?

So you spin back up and then that state is gone effectively.

It's okay if it's gone.

I'm not relying on anything.

I'm completely stateless in this particular case.

And so let's talk about some examples of stateless backend.

This is backend can store data somewhere else, right?

So that's what we talked about.

Yeah.

Even if I'm at the back end, the stateless, I can still store some data somewhere else.

And I don't really rely on that data even to be there and says, Hey, I'm just moving along like logs.

Like if you're logging something, you turn it on, you take the data, you store it in that database,

and then you even if you turn it off and turn on, it doesn't matter.

You're stateless.

Can you start?

Here's another thing that I always ask people to do.

And that's how what tells you if you're back into stateless again?

I'm looking at just the back end here.

Just that's that piece.

You have money and many applications running many services.

But looking at just at the back end application you own, can you restart that back end if it's idle,

of course.

And then you start to back up and can the clients there were connected before finish their workflow

without actually breaking as if nothing happens?

If that's the case, your application is stateless.

If that's not the case, then there is a state store somewhere that you lost it and the clients were

relying on that being there.

And that's the problem.

So what makes in the back end stateless, stateless backend can store states somewhere else in the database.

So we talked about that and their backend remains stateless, but the system technically is still stateful,

right?

You can absolutely have something like that.

The whole system is stateful because there is database, right?

Of course I need to store my data.

If that data is gone, then technically I'll be broken.

Right?

But my application in itself, it can still serve request by itself.

It is stateless.

There is no state stored in that application itself.

Right.

And then same thing.

Can you restart the back end during the idle time?

And the client workflow can continue to work.

If you can do that, you're back in a stateless and don't don't think of this like it's like a it's

like a medal.

You take like, Oh, my application is stateless.

I'm I'm good, right?

It's not really a badge of honor or something to attain to it's just a state right at the end of the

day.

And there are disadvantages and advantages for both, right.

Stateful and stateless.

Right.

And if you're willing to take the hit, you can actually play some tricks to to achieve that.

So it is a state pull back.

And for example, let's say I built a login application where my user visits a page called Login user

and password, and then the back end talks are turn around and talk to Postgres or a database and verifies

that the username and password is correct.

It responds back and then the application will generate the backend will generate a session, ID is

the session and it returns the user.

That session ID and stores it locally.

It stores the session right here.

It does not store the session in the in the database stores it right here because hey, I want it to

be a state for in this case I return the session the next call for the profile for example.

Hey I want to view the profile.

And of course, if the S1, we set the cookie.

The cookie will send S1 with every request, subsequent request, because the cookies were sent.

In this particular case, the session is there.

What the back end Will does is, Hey, let's check.

I got the cookie.

S1 Is the S1 in memory?

Is it in my application?

If I have it in my memory, that means I already authenticated this user before.

I know he's good.

Everything is, you know, have been authenticated before.

It's good.

So I'm going to go ahead and actually return their user profile, right in this case.

But what does that actually breaks?

Here's where it breaks.

If you effectively let's say we restarted that back in that session, it is gone.

We never stored it locally.

So the beauty here is we never actually relied on the database to check if the session is valid or not.

Right.

You could have done that, but you did this way because, hey, I just want to quickly check here and.

I want to save a trip to the database.

I don't want to do that trip.

I wanted to check locally.

Right.

It's how cash is work in this particular case.

And this case, let's say.

But let's say I restart my back in a crashes.

What happened is if the user actually refreshed their page, that request will send the S-1, right?

It will send this one the back and we'll check it.

And this one is not there.

It will assume that, hey, I don't know.

You all right?

I don't know.

The session ID just exit.

Right.

And we'll actually respond back with the login.

You remember these days, back in the nineties, at least you would log in.

And.

You would log in and press, submit the page row loads.

Fine.

Right.

But the moment.

The moment you refresh your profile.

Right.

You would get back to the login page again.

Sometimes it works.

Sometimes you get back to the profile y because your request happened to hit a backend that they didn't

have because that's what when development, when you when you develop an application, you develop it

in a single machine.

So you never see this problem because you, you will always hit the same back end.

Right.

But the moment you do a load balancing right, then what happened is sometimes you got into this server

and the session is valid.

Sometimes you hit this server and the session is not valid and it will give you the problem.

And that's why it's sticky sessions.

Sometimes stateful applications require the stickiness.

You configure your load balancer to have a sticky connections to it, and sometimes it's required to

do that, to do a sticky, you know, sticky session or sticky load balancing where all the requests

from this client goes to the same backend.

Sometimes you're required to do this.

Actually, while I was building a gaming app, I had to do that to to to minimize the number of records

to the database just for a short period of time so you can play with these things.

So the workflow in this case the user has broken is like, Why?

Why are you forcing me to log in again?

Right?

So how do you solve this with a stateless back end?

What do you do is, Yeah, let's store the session in the database so you got to log in, verify the

generator is one, but also turn it on and store that S1 in the database.

So we have a centralized system where we're storing this thing here and now we're going to return this

one.

The client would refresh, but every time we don't store anything, you may store it if you want, right?

Locally, it's up to you.

But the database that the back end will always check the database.

Hey, is this this one valid?

Right?

It says, Hey, it's one.

Yep, it's valid.

If it's valid, go in and say, yep, that's good.

Go ahead and continue.

Right.

If it's not valid, then you're going to fail.

Right.

So the session is actually stored persistent somewhere, right?

Whether this is the Postgres this is right is you took the you remove the responsibility here so you

can spin up a number of backends and your app will work.

So if that user profile went to another backend that works because that backend will still talk to the

database, right?

So the entire system is still stateful because we're stalling, we're storing a state in the database,

but the statelessness is a property of the back end application itself.

I can destroy it, I can kill my application, I can restart it and do another one.

Absolutely fine.

And that's the trick here.

And you might you might, of course, argue with this, says no, it's actually the backend still stateful

because storing somewhere else.

Right.

It goes back to what what what do you define stateful and stateless to be as right technically like

in this example, if the database dies, the whole system is pointless.

Right?

Right.

But the back end, even the back end cannot respond to you because they realize there is a piece of

information that relies on it.

Right.

So stateful versus stateless protocols.

Now we're talking about the protocols themselves, the way we talk to each other, from the client to

the server.

Right.

So the protocols can be actually designed to store state or to not store state or not rely on any states

as well.

That's a very good example here as well.

So for example, TCP is definitely stateful.

Why?

Because there are.

Information stored above the client and the server in both the client and the server.

There is sequences.

Every segment that you send is labeled with a sequence, and the sequence is actually stored in the

state.

There is literally a state diagram that says, Oh, the connection is now closed.

The connection is now open.

The connection is now established.

The connection is now waiting.

There is a state.

The state machine living here and in the server side.

Right.

And they maintain the connection they maintain to the sequences, they maintain the window sizes, the

flow control the congestion control, the congestion control window.

All of this are state information.

If they are lost, this connection is pointless, it's useless.

You kill the connection right there and then it's pointless to to move on.

You reset the connection if any of these parameters are lost, effectively that's that's what that's

why TCP is stateful.

Right.

So we have connection file descriptor sequences we talked about.

The UDP, on the other hand, is actually completely stateless.

It's a message base, but it doesn't store anything.

Or even if it does a store like there is a file descriptor, but it doesn't really have to be there,

right?

You can effectively send multiple data grams and have this data grams received by multiple servers and

that's fine.

It's completely stateless.

Like let's take DNS for example.

DNS by itself is a stateless protocol.

Why?

Because when you send out a UDP datagram that has the DNS query, right, you don't send it on a connection,

it's UDP, it's connection less, it doesn't have connections.

You simply say, Hey, I'm going to this IP address.

Right?

And this is the destination port, right?

And you you generate a local port and you generate your, of course, your IP address and say, hey,

go.

How do you know if we ever responded in TCP?

We have a connection.

Anything coming from on this connection that means I probably send something and now it's coming in

this connection, you read this connection.

UDP There is no connection.

So if there are UDP packets you are responsible to find out what is what.

So that's why DNS actually adds a query ID for every dialogue.

So if you if you send a DNS query, you attach a query ID to it and the response, the DNS server is

responsible once to reply back, Hey, Google a Google dot com is actually this IP address.

Here is the query ID it will actually respond that with the caller ID back to the port who actually

sent it.

Now in this case the query idea will come back and the UDP client in this case will read that information

and it will effectively the Linux, the operating system will map based on the destination port.

Maybe back to the application.

Now you can argue that if the application actually dies in this case, Right.

If the application actually dies.

Then there is no.

One to respond to.

To accept this that dragon because the destination port is not doesn't exist in the operating system.

So you can argue with that there's that the DNS client server is stateful but the protocol which is

the UDP is stateless.

I don't care.

It's your fault that you disconnected.

Right.

Very slippery slope talking through this.

That's why I don't like talking about this in a very little way.

I want to I want to just kind of mention it and to learn about it and then don't again take it with

a grain of salt.

These things, these are discussion very hard to discuss.

Quick, same thing.

This would be a little more in a second.

Quick is a very similar actually Quick sends a connection ID to identify the connection, but quick

is actually stateful because there's all sorts of states because it acts like TCP, but because it uses

UDP, which is stateless, it has to always send the same connection ID to with every UDP packet.

So we know that all we're talking about this particular connection.

So we're effectively transferring the state across the protocol itself, which is stateless.

And here's, here's another thing that is that there is a twist a little bit.

You can build a stateless protocol on top of a stateful one and vice versa.

Right.

Like HTTP is is a state HTTP is stateless because it's a request response.

You can send a request, right.

And to the server and then you can and then you get back a response.

If the server dies and another server comes back, you don't care because your next request will have

everything it needs to.

It has this will have this cookie to identify itself.

That's why we need cookies, right?

With with HTTP, because cookies will effectively transfer our state, will remember our state or remember

us.

And it is stateless, built on top of TCP.

So what happens if the TCP connection breaks?

Right.

Fine.

Did he just blindly creates another one?

Who cares?

Right.

It's a medium for transfer.

They don't rely on a TCP connection being always there if it dies or going create another one.

That's what we saw with the browser.

And a quick, for example, is a stateful protocol built on top of UDP.

Right.

Same thing.

So what is a completely stateless system here?

If you think about it, system system are really rare.

Let's say you.

In this case, the state must be carried with every single request and a back end.

Like here is an example of a stateless request where a backend service that relies completely on the

input completely the input itself is is basically.

It has the the input itself has everything in need.

It doesn't really need to talk to another service even.

So the system, the entire system is stateless if you only rely on them, for example.

Right.

Let's say I'm building an app that to check if some a number is a prime or not.

That's a completely stateless system.

Right.

You send a request, I suppose you can you can store the prime number in a database that makes this

kind of the system stateful.

But in this case, you can just loop through this and say, hey, this is actually a prime move.

On JSON web token, JWT is actually a completely stateless system.

Granted, when I made I talked about that on my YouTube channel.

Jason Jason web token is it's not it's not really that secure or because.

By itself because because there's a stateless everything is in the token.

It kind of it's advantages and disadvantages at the same time.

Because if everything is in this token, then what if someone stole this and you want to mark this as

invalid?

This.

This token is bad.

Someone stole it with such an IDs.

That's easy.

Go to the database and flip that to invalid.

The next next person to actually try to validate, they will query the database and say, Hey, wait

a minute, the session has been revoked.

What are you doing?

And.

But Jason was talking.

You're not talking to another server.

So this if this was the length of the talking was long.

Right.

Then you get to whoever stole this token will lose it forever or whatever the validity is.

I discover it was stolen.

Someone could have used it to do bad things.

Right?

It's a problem regardless.

But you have more control over a session versus JWT.

So that's why JWT have the concept of refresh token.

The way you develop a refresh token and the access token and then make the access token as short as

possible.

The refresh token make it longer.

But then same problem happened, right?

Whatever.

And what if someone stole the refresh token and it's a it's a this.

That's why you have to have TLS in your system encrypt everything.

Try to be as delicate as possible, but.

This is, by the way, you guys don't think that everything is figured out in back in engineering?

I don't think everything is figured out.

I know a lot of engineers talk like they know everything, but not everything is figured out.

There are a lot of holes in current engineering, right.

And the reason?

The reason is because people will only talk about when problems happen.

Some people know about these holes.

Some people don't.

That's why I.

I try when I talk about things, I talk from my current knowledge.

But remember.

Things can happen, bad things can happen, and there are flaws with everything.

And we try to understand the system.

That's the goal.

And to me at least I'm talking to myself, really trying to become a better software engineer, better

backend engineer is just understanding what we have today and the current limitations of this.

And knowing these limitations, you can work around them and that's the best you can do for now.

Tomorrow something else might happen.

And again, I always add this definitions go nowhere, so take those with a grain of salt again.

Oh guys, that was the session for this stateful versus stateless architecture.

It's mostly that last lecture.