The sidecar pattern.

So when again, I also also hesitated to add this to the design pattern section.

But I think this has this is not really a special thing, but the architecture of sidecar pattern really,

really talk to me.

I think I liked it and it goes to a problem that is happen when you use protocols, right?

When you use the HTTP protocol or SDB two or gRPC or Apache thread or soap or TCP or plain UDP, you

need to speak that language that protocols language in order to speak that protocol language.

The library that you're using need to understand how to write to a socket in a specific protocol language

and needs to understand how to read.

And it gets really complex.

If the protocol is complex such as gRPC.

Right, or HTTP to get onto the STB two or STB one or CB three, The clients are isolated from this.

The library of the HTTP is doesn't change.

So if you're sending a fetch request or an Axios, it, you don't you don't care how the protocol is

laid down behind the scenes because they they said they we're going to make TB forward and backward

compatible whatever language you are.

If you wrote a code that sends that request back in again, a higher level write request, then that

code should work in SDB three, right.

At least from a JavaScript perspective, does that make sense?

The library that is being used in the browser understands how to talk HTTP three versus SDB two because

it's different versus should be one, definitely different under the wire.

And these libraries and these clients become really thick and the back ends are even thicker when you

have all this complexity.

So the second pattern was born to solve this problem.

So let's talk some examples here.

Every protocol requires a library must.

This is a must, even if it's SDB one one, right.

If you have a Python app, you need to import an HTTP library to make a call.

You have to write.

Even if it's built into the language, it's still a library.

Right?

Microsoft have a library, you know, C Sharp has a library, C++ has a rich TV library.

Python has a lot of libraries.

They should give you one want library.

So this library lives usually within the app, right?

And then you make a request and it understands the logic that you write.

You're writing a get slash where you're making a get requests, right?

Simple get requests.

This gets translated into completely something different here in The Wire.

The thing we talked about, I get slash protocol and then the headers is written this way, and then

you measure the size of the body and then you write it this way, and then you end the request in this

and then you do all that stuff, right?

Curl is a perfect example.

Curl is a client library and it has it knows how to talk ish TV one one right in a specific manner.

The server side wanted to receive the request.

The library kicks in and parses their request and then moves that request back to the application for

processing.

Same thing with SDB two.

You need an HTTP two library.

Right?

And should be.

Your library will probably have both SDB and one one.

So if you are SDB two client, if you say, Hey, I want to make an HTP to call, you actually can specify

that sometimes you as a back end here you as the application author the client you make a request but

the library can make the decision for you to support the STB to say, Hey, I'm going to do SDB two

by default, and then they negotiate with the server.

And that's another whole thing how to negotiate which protocol to pick.

That's another art by itself.

And so the client will offer say, Hey, I offer XDR-TB to any TB one one, it's up to your server,

you pick and the server will pick.

This is called this is done usually through a TLS extension called the ALP, an application layer protocol

negotiation.

I know that is a lot of information, you guys, but I try to keep it to a minimum.

But again, go through the course with the arm pace.

There is no rush or anything here.

Take your time and ask a lot of questions and the server will respond back is Hey, hey, let's, let's

talk to Edge TB two and then we they start talking a little bit, which is a completely different protocol

in the wire than has to be one completely different.

The whole thing streams and magic streams numbers.

And very complex things, right?

So every protocol required library tells the same thing.

The way we encrypt.

Like you might have a TLS client, right?

Let's say you're going to do an HTTP https request which uses TLS.

You need a TLS library.

So that library there should be to library must use another library to do a TLS.

Right.

So you're going to have a bunch of libraries.

One popular is TLS library is open SSL if you know it right.

There was a big leak.

The hard to believe that happened.

Right.

And that's another problem.

Right?

If you use something that you don't know, if you lose something chances, if that's something got compromised,

a lot of users will get affected.

Look for Jay.

What happened?

Right.

Same thing.

Library.

Use a library.

You are at the mercy of the library.

Right?

So, yes, you can use TLS library to encrypt.

Right.

And then open SSL to do all the crypto stuff, cryptographic information.

Then you send that and then there must be another terrorist library to decrypt this.

It doesn't have to be the same rust.

You can use a rust SSL that was called, I think rust SSL and the server can use that to understand

because TLS is a protocol, right?

Whoever built that library will adhere to the protocol semantics and they better be otherwise.

Compatibility issue happens.

And then the same thing.

gRPC, you have a gRPC library have to write and you have to have a PC library on both sides.

This is an forms.

Usually this is how they are.

The ID basically built the gRPC.

You can build things and then have that as the library for each language.

That's how gRPC works effectively.

We're going to show that as well.

So changing the library becomes hard.

Like was what happened.

Look for J Right.

What happened?

If you have a problem with the open SSL updating, especially if it's entrenched really hard, once

you leave, the app becomes entrenched, right?

App and libraries should be the same language.

That's another thing.

If you have a language right, you're writing a Python app you must use, I say must.

It's not really the case, but most of the case you should use a library that has a Python package.

You saw me, right?

I wrote a web socket application, a Node.js.

I used a Node.js web socket package.

Right.

It has to be the same language, right?

It doesn't have to be.

You can play trick with a C API.

Do some interop shims and stuff like that.

But most of the time the app and the library to import it you have to be the same language, same programming

language.

Java, Java, C shops.

All right.

There is tricks to avoid that, but it's out of the scope of this course.

So changing that already required returns if you change the library to another library.

So there's limitations for it has to be the same language.

And there is also another limitation where requires retesting.

Retesting is hard, right?

Breaking changes back home compatibility.

All the stuff I have to do, right, adding features to a library's art and as a result, microservices

suffer.

And that's one way microservices became popular.

That was one of the problems they tried to solve.

Twitter started all of that, I think, back in 2010.

Where.

I believe in the World Cup 2010 World Cup.

We were tweeting.

I was like, Yeah, go and Twitter will go down.

It was funny because, like, I was like when Paul told her really, really popular back in 2010 ish,

right?

And they're back and would not handle the load in the World Cup because like, everybody was tweeting

at the same time.

It was just the VM.

They have VMs.

And again, I took this from a podcast from one of Twitter employees.

I'm not making this up.

I didn't work on Twitter.

And what happened is the VM will just crash, go down.

So they had to sell and then the time to spin up another VM to do the load balancing.

It just takes a long time and that without VM will crash as well.

So they moved from this, you know, monolith VM into microservices.

They broke the tweet API alone, the Red API, the other APIs.

They broke it into many services and then they found that they need to talk to each other.

And so they built their own library called Finn Angle.

And that library is what they use to basically talk to these microservices.

And this library basically is.

Everybody must use this library and they are forced to to use whatever language there is.

I forgot what languages, but they're fixed to that.

And if you make a system like that, you're stuck with that system and that's fine.

If it works, it works.

And Twitter apparently works, right?

There is a trick you can play here.

What if we delegate the idea of communication to another?

App.

So what if we let the proxy a proxy communicate instead of us?

Right.

So the proxy has the rich library, right?

And the client has a very thin library.

That talks to the proxy.

That never changes much to be one one never changes which to be one is a beautiful, elegant design,

never changes.

So we can look to the proxy initiative on one and the proxy is free to talk to whatever language or

whatever protocol it chooses to the back end to the actual final destination, which is, by the way,

another proxy.

Right.

And that's the trick here.

So meet the sidecar pattern.

So in this case, each client must have a sidecar proxy.

Right.

And here's here's a simple example here, but let's say we have an STB one one client here and it needs

to be one one server, right?

So what we do is we're going to configure a proxy in my application such that, hey, all HTTP requests,

please direct them to this sidecar proxy.

And the reason is called Sidecar because it literally lives within the same machine.

So this is loopback.

This is also loopback you can have.

Two applications.

Almost like another application running in the same server, same machine.

And that's how Fiddler, for example, and Charlie and this debugging man in the middle proxy works,

right?

You just literally spin up a proxy and then have all the stable requests go through the proxy so you

can log them effectively, right?

That's how proxy thing works.

And then this.

So the final request is actually you're going to this guy, right?

This is the final destination.

But because you configure the proxy all the by default, all requests will go to this guy, all requests

will go to this guy.

And so you send the request, the side card proxy will receive that request and we'll know the final

destination from the host header.

There is a header specific header that has that and then it will do that and says, Hey, since you

are still on one, you don't really care what how I communicate with an actual server side reverse proxy.

Right?

What you do is hey.

I'm going to do an inch TV, too.

I'm going to use secure connection.

I'm going to use the latest tools library, 1.3.

All that jazz.

And I'm organizing the request.

And on the server side side color proxy receives.

That is just it knows that, oh, if someone talks to me, that means this is the actual server that

I want to talk to.

And this again, lives in the same machine.

Doesn't have to, but most of the time it does.

Like this is where also if in a in a container architecture is called a sidecar container or something,

which basically shares the loopback with the host with the application.

And that's the trick.

It doesn't again, it doesn't have to you can put in another container, you can put in another IP address

and configure that.

It's just easier to use loopback because loopback doesn't change, right, versus IP addresses changes

and there's the threat.

So what you did is like you sent a request but it went through two hops and the communication is completely

isolated from you.

The app doesn't change.

You still making a request that can give you a making request in this case to the final destination.

But all of a sudden, because we put a proxy, it works, right?

Because the client side proxy will will capture everything and it will change.

You will rewrite the request.

And so the client side proxy actually sees everything and this guy sees everything as well.

So you might want to trust these guys, of course.

So we just got a brand new protocol.

Without us needing to actually upgrade anything.

So this whoever owns this will do the upgrading.

This is how usually service mesh of service mesh is based on the sidecar pattern where this is like

symbol, like envoy or link or D, you know, where these proxies talk to each other and they do everything

so that if the server actually responds, it responds back to whoever made the call.

And whoever made the call to to the server is actually this proxy, right?

So it will just respond back.

Right.

And that's just another client server request response system, right?

It will make the response and then take that.

And then because we're responding, the reverse proxy here will just take that and then write back to

the same connection that made the response right, that made the request.

And then once we get that the server in this case will just pull back.

So everyone was effectively waiting this, this made a request to until we got back the response that

the proxy made all this stuff until we got back.

Very elegant.

Absolutely like it era where you shield the responsibility to someone else.

Brilliant.

Hey, I want to move to this TB three thing.

Easy.

You don't have to change anything.

Your code stays identical.

The reverse proxy here, these side patterns, they have to upgrade and the only they upgrade.

And that's how they sold us.

Right on.

On the microservice and then service mesh.

The service architecture is say, Hey, upgrade to link RD 1.3, and all of a sudden you have HDB three

secure and you get the quick protocol.

How magnificent is this by just upgrading this, you just to remove the connection about here and then

the same thing here.

So let's talk about sidecar pattern examples, service mesh proxies.

As we talked about Ray Link or Istio, the Google one envoy circa proxy container.

Yeah, as we talked about, you can spin up the circle proxy as a container by itself.

But here's the thing, it has to be layer seven, right?

And we're going to talk about what layer seven versus layer four.

This is very critical.

And then in the protocol section, we're going to talk about layer seven proxy in layer seven load balancing.

What is a layer seven?

What is layer four?

Because this you got to know, understand these things.

The OSI model is one of the most important things when it comes to back end engineering, in my opinion

at least.

Right.

So it has to be layer seven.

I mean, it is an application thing that means it decrypts everything, it sees everything and re re

encrypts on the back end and it's basically your application.

So what's the pros and cons?

The pros, it's language agnostic.

It's what they call a polyglot architecture.

Right.

In this case, if you have two services that you force them to use a library, then everyone should

use the same language because whatever that library is must be the same language, right?

Twitter with an angle, whatever that language, I think.

What is Java or Scala?

Scala, I think might have been Scala.

Right.

So yeah, everyone is forced to write in Scala.

That's it.

You cannot write in another language because hey, guess what?

To make connections to make networking requests to do all these retry logic, all this beautiful circuit

breaking, all this special logic, because it's not just making a protocol, right?

You can do all special networking logic in this cycle proxy, anything networking related, anything

connection related, anything requests retries can do it there.

But if you're stuck with a library, then you're stuck with the language, right?

But in this case, your language.

You can build a python microservice that talks to a JavaScript.

Microservice It doesn't matter why?

Because the sidecar proxy is built in, let's say rust write linker, curly uses rust and this these

guys talk to each other.

I don't care.

We're going to use a HTTP to connect anyway between the proxies, right?

So it's language agnostic.

You get you get protocol upgrade.

Any time you get security, even if you're insecure, you can get executed.

And in case one TLS library found to be like have weak cipher, you configure the proxy, hey, don't

use the cipher anymore, you're done.

And every single application gets that latest change.

Pretty cool tracing and monitoring you can trace request because now everything goes into this same

funnel, right?

And this said core proxies talk to each other and they have something called the control plane, another

centralized thing that controls pretty much everything where you can have them tracing, you can have

the monitor you can control, Oh, this service actually cannot talk to this service.

This service can talk to the service.

Right.

And you can monitor you can trace requests by adding tagging requests with a special tracing ID so that

you can follow it across the entire architecture of microservice.

So if service eight talks to service B and B talks to C and C talks to D and D talks you, E and D and

E talks to F, you send one request and you want to know how long it took tracing.

If you're using service mesh, if you don't using services, forget about it.

Tracing this right.

You have to teach all the services to understand what this tracing ID is.

But if you're not, if you don't care, then using service as sidecar pattern, that's our core pattern

will add the trace ID for you and it will just trace the follow the request all along and it will make

sure to repeat that trace ID.

Service discovery.

Right.

Another thing where you can discover the services, right.

Using a centralized DNS system and all of these.

Proxies will talk to the service discovery.

You don't even need to think about it anymore.

Caching this sidecar pattern can do caching again.

Right?

Which is very interesting.

Right.

Although this is all things that have to be done.

But of course, that's complexity.

Nothing is free, right?

I know I'm out of.

I think I'm out pros.

All right.

Now cones.

What's bad about it?

Complexity.

We just talked about it.

It's a complex system and complexity means that it's very effectively struggle to understand all of

this, struggle to know if things are broken.

Right.

How do you debug this thing?

Good luck debugging a microservice.

Latency.

You just added two hops that didn't exist, right?

With each call, you added one hop to the proxy and one hop to the reverse proxy, which goes back to

the server.

Although these hops are local, right, they still there is the cost of rewriting the request, understanding

the request and doing the protocol upgrade.

Doing all that stuff.

Doing the trace, the service discovery, doing the caching, doing the tracing, all this there is

cost for everything and then ends our sidecar proxy lecture.

And I think this is the final lecture on this section.

Of course, as always, I might add more lectures in the future, but this as of recording of this course,

this is the final lecture of this section.

I'm going to see you next time in the protocol section.

Meanwhile, enjoy the course.