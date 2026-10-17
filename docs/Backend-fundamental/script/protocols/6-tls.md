Transport layer security or TLS, is one of the basic fundamental way to encrypt communication between

any two party.

We have to build a standard for encryption because we can't send just IP packets with data that is plain,

you know, text that everybody in the crowd can read.

So we needed to encrypt it and you can encrypt it anywhere you want, right?

But we need a standard.

The standards are good.

Yeah.

So this was invented.

So this is the topic of today's lecture.

And obviously I can't go into much details because TLS is is really rich.

There is so much history when it comes to TLS, and I think it deserves its own course to be on.

So maybe I'll do it from the future, but it's worth maybe 3030 minutes discussion and going through

that, maybe less.

Let's find out.

So in this luck, so we're going to discuss a TLS through a HTTP while you can build TLS on literally

any protocol, anything that comes from layer seven down to the TLS layer can be encrypted.

And it's arguable that TLS which layer sits on.

I believe the best way to if you want to shove it into an outside model, it can be layer five because

it's stateful, because it has state left and right and right with file descriptors of the TCP handshake.

Right.

So while DCB is layer four, the session variables and the window sizes and that we talked about lives

in session five in the session layer, which is layer five, right?

And that's kind of fits there because it has some sort of a session write session that is agreed upon.

So that's if you want to fit it Again, this is not written on stone like, oh, it has to be layer

five.

It's all, you know, intellectual, if you will.

Then go from I'm going to talk about what vanilla ATP looks like without encryption.

Now I'm going to talk about HTTP s, right.

Which is basically HTTP over TLS.

If you want to break it down, then we're going to talk about TLS 1.2 handshake, how it actually works.

So 1.2, you might say, what about the one version?

One version one one.

What happened to those?

Those are unsecure and no longer used.

They are no longer recommended.

So I thought I thought maybe let's just talk about what is actually popular and then I'm going to talk

about Diffie Hellman, which is a special key exchange algorithm that actually found a lot of flaws

at 1.2.

1.2 was improved to support the free element, but it still supports some other, if you will, unsecure

or not really.

It's the top of the chain forward secrecy kind of a thing.

But this actually is one of the best algorithms to exchange keys.

And then we'll get to talk about how to.

Also monitor is currently the best candidate for everything.

You know Walter is 1.2 is still used actually for backward compatibility, things like that.

So how HTTP works, here's a server listening on pause 80.

It is a client and this indicates the TCP handshake that we talked about.

So this is where we open a connection.

We opened a TCP connection.

So we have established the sense and accent, right?

And then we have an open connection and here's where we actually close it.

So before we close the connection, we want to send a request.

And this request looks like this, right?

Hey, get slash and HTTP one, one or two right over or the version is then you put the headers and

then the headers on the body.

If you have a body, get usually don't have bodies.

So send that that gets that moves into an TCP segment and that or more than one TCP segment based on

the MTU, obviously.

And then we will move down the stack and then move that into an IP packet.

And we talked about all of that.

The segment is received here.

The request is understood at the application layer and the application will just respond back with the

headers, more response headers, index.html, whatever it is, right content, effectively the body

and this becomes one or more segments and it depends on the algorithm of the TCP whether we should send

all these segments at once or one by one based on how the congestion control is at that level.

Usually when we start it's slow, right?

That's why we talked about we're going to talk about slow start.

I don't know where this lecture is going to be.

Right.

So that's why it depends like where is going to set.

I think we already talked.

We're going to talk about that slow start later, but we did mention it definitely.

So that's it.

So TBS, what do we do?

Right.

Whatever we explain before this is unencrypted.

So anyone in the middle, right, like a router, like an ISP where all the IP packets will go through,

we'll see this request.

Not nice, right?

We need to encrypt them.

So the same thing.

We open a connection.

And we do a handshake first.

And the goal of this handshake is to share a symmetric key, share encryption key.

The same key should exist on both the client and the server.

And once we have these keys, we're going to use them to encrypt our get request effectively.

Right.

And this is the critical part here.

How can we get the same key as the symmetric encryption algorithm where at the same key is encrypted

at the same key decrypts, and nobody in the middle will have this should have this key.

Nobody should.

So it will be encrypted here.

Nobody in the middle will understand what it is.

The server will get that encrypted request and that will decrypt it with the key and then we send it

back.

The question is, how do we actually exchange that key Is the is the key.

No pun intended.

We encrypt with symmetric key algorithm.

So the question is like, well, I'm saying when we talk some security courses back in uni, but what

does it have to be like at the same key?

Do I have to encrypt with the same key?

Not really.

There are symmetric key algorithms and there is asymmetric key algorithm, but symmetric key algorithms

are way much faster than asymmetric because symmetric key is usually use XOR and it uses the key to

x or the content, which is extremely fast because you're exploring blocks of content based on whether

your symmetric key algorithm is block based or not.

And then you're going to get an encrypted content.

And if nobody has the key, nobody can actually decrypt it, right?

And that's the goal of this.

So it's very fast.

Asymmetric is where you have a key.

That encrypts.

And another key that actually decrypts, right.

You cannot use the same key that encrypts to decrypt or you cannot use the key that decrypts to encrypt.

Does that make sense?

And this is also popular, but it's very slow because it always relies on exponential stuff.

So any way we have exponential is going to be slower to compute, right?

And you need more CPU, more processing, more energy, you know.

So that's why we always use symmetric key.

So if anybody asks.

But the problem with symmetric key is we've got to share the key because you cannot just send the key

across the board because anyone can grab it.

Right.

And that's the really the gist of the situation is how to exchange the key without getting caught.

Right.

And also the goal of the DLC is also to authenticate the server and do other stuff as well.

Like, Hey, I want to make sure that you are who you say, who you are and the server to do that.

They send you back a certificate and the certificate has an always rely on this p PKI.

The public key infrastructure is like asymmetric key algorithms where you can you have the public key

make sure that it's actually me that signed the certificate and it will go back to check if the certificate

authority is actually who signed this key and they will verify the certificate authority goes back up

to the root.

And this is not our topic, but that's just a general overview of authentication extensions during the

TLS client.

Hello, which is the key exchange.

We talk.

We have so many extensions packed in this client.

Hello, we have SNI server name indication we can't talk about that is going to take a long time but

rather not so pre pre shared key.

So where?

Hey, I already establish a connection prior right with the server.

So here is the pre shared key.

So I'm going to encrypt my encryption.

My my my my communication from from this first step there is no back and forth.

So this is called zero RTT, so there is no roundtrips at all.

So extension is very it's another thing as well.

All right.

Let's talk about the last 1.2 again, guys.

I'm going to avoid the math here.

First of all, I'm not that great in math.

So I kind of I think I think it's really irrelevant for us network engineers.

But I'll mention it for those interested, obviously.

So then at one point too, you open a connection, you close it.

This is against the HTTPS connection, but I want you to pay attention to here.

We're going to use RSA, one of the most popular asymmetric key encryption algorithm.

If you are in RSA, you have a public key and you have a private key.

Right?

A private key is not never shared, but the public key is can be shared effectively.

And that's where the certificate actually contain the public key of the server.

So with that in mind.

What the what the server will do after opening the connection, the TCP connection.

Immediately the first thing we can get is to do a TLS client.

Hello.

And in the Stella's client.

Hello.

We're going to request an encryption.

Request.

So, hey, I want to.

I want to encrypt.

That's it.

Says, Hey, I want to encrypt and I'm going to use let's use RSA as a key exchange algorithm and let's

use a as as a symmetric key algorithm or Cha-Cha as a symmetric key, because there are two algorithms,

one for to exchange the key, as we talked about, and one for the actual encryption, which is supposed

to be symmetric, which is faster.

So now the server will reply back is like, okay, here's here's my certificate and here's my public

key client generate for me a pre master.

Or you can think of it as this generate your symmetric key and send it to me.

Like I was saying, you cannot just send it across the wall.

Well, you can.

We're going to show how.

And so what the client will do is we'll generate this yellow key, right.

Which is the golden key, which is the symmetric key, which we want the client and the server to have.

Right.

So the client should have it here.

Maybe we can fix that so the client will generate the symmetric key and then we'll take this server's

public key, encrypt that symmetric key.

It's actually not the actual symmetric key.

It's a pre master, right?

It's the input to generate the symmetric key, but might as well.

It's this is just explanation purposes.

So we're going to take that and then encrypt it and then send it across the wire.

So anyone in the middle, if they get this, they will not understand anything.

They will.

L Sure, they're going to see an encrypted symmetric key what is supposed to be because we we have a

label for this TLS handshake that's called change cipher, -- and finish.

I'm done here.

So there's one roundtrip.

And then the second one is where we finish here.

But we get it.

If somebody snipped here and got this key, they can't decrypt it because they don't have the corresponding

private key.

Right?

So the server will get this and they will use the private key to decrypt that content.

And as a result, how did you like that information?

Huh?

That's awesome.

The the private key will be used to decrypt that content and then they the server will get the private

key as a result, the symmetric key.

So now both of them have to have it and nobody else in the middle can actually get it.

And then the server say care, I got it done and then the encryption can happen using this symmetric

key.

Right.

Again, we don't want to use the public key because we could do this right?

We could.

We could we could kill this thing, this yellow key, this golden key.

And we'll get let's just use all of the public key for every content.

Let's encrypt the client, the encrypted with the public key.

And then this the server will decrypted with the private key that is so slow, especially for a large

pool.

You're sending out a large 16 k JavaScript file that's going to be so slow you don't want to do that.

Yeah, we do it for tiny data.

That's why I said you get away with it.

It's as if it uses private public key encryption.

But but it can because we're sending commands.

Right.

And this is not like sending huge data right now.

Let's see what transferring files that's can't get slower, but sure, but yeah, the encryption can

happen now.

No problem.

It was the problem with this.

Before we go to the phenomenon.

Well, the problem with this is.

Something called a.

Forward secrecy or perfect forward secrecy.

And let's assume I'm an attacker that happened to be in the middle.

I am an ISP, right?

I like to use the ISP because ISP, all the IP packets passes through the ISP.

Right?

So ISP sees everything.

Yes, encrypted, but the ISP, right can record everything.

Let's say I'm recording all this configuration, I'm saving it to disk and I have a terabytes worth

of content communication between all clients and the server.

I have all the communication recorded for the past year to say Who cares?

Sure you can have it, but you can't see anything.

You can.

You can.

You can run all the quantum computer against it to break it, but you can't.

It's going to take you years to break it.

Millions of years.

Hmm.

What if I get the private key of the server?

How?

You can't just get it right.

You're an ISP, You don't have access to the server.

It happened once.

There was something called Heartbleed openness bug, which is the.

This is the library that people use to do all this mumbo jumbo, this TLS and encryption, because you

can't write this code for yourself.

You can try it.

It's so complex, you know, but people use libraries and that library had a bug and that bug was.

Was able people were able to extract where the private key was loaded into the server memory and people

were able to use certain crash opening cell and leak.

Part of the memory from the server.

And part of the memory is going to be a lot of junk.

But part of that junk is gold.

What is that gold?

It's a private key.

So people managed to get the private key of servers.

Right.

I just realized that I'm covering the page.

I'm not really covering anything.

That's good.

Yeah.

So people, uh, was able to get the private at the moment.

The ISP can get the key.

What can they do?

I'm not saying that ISP's are bad because I'm just giving an example of you interest.

You understand?

Because of this perfect example, someone in Starbucks happened to hijack the router, right?

And all the packets will go through that outer, right?

All the package that goes to the internet will go to the router.

Another example.

But yeah, once we have that private key, I'll do a loop and exchange every single, you know, decrypt

all this thing.

Because now I have the private key I'm going to look for for each change cipher call, go decrypt it,

get the symmetric key and then decrypt the communication.

Because even if the symmetric key is different, right for each session.

I don't care.

The private key is the same, so I will get the symmetric key for each session and I'll decrypt it.

That was really bad.

So people try to avoid as much as possible using RSA as a key exchange algorithm because of this, because

it lacks forward secrecy, because in the future someone might go and go back to a recorded conversation,

and if the private key is leaked, that could be a problem.

And that's basically why people don't use the RSA.

Now, people also try to use it, make sure the private key is as short as possible.

That means whatever whoever generates the certificate should be as short as three months.

Or sometimes Cloudflare gives like two weeks to get more security.

So even if someone did hack it, they only have two weeks worth of things to steal.

But yeah, so that's it.

So made diffi hellman, which is a better key exchange algorithm.

Right.

And I started giving the math portion of here, But the key here.

For Duffy Hellman is to generate a symmetric key.

Right.

You need two private keys.

Generate a private number.

A key is a number.

Computers deal with number.

Right.

So we generate two private numbers, and one can be public.

If you combine the three together, you get the golden key.

This private key.

Has to be private.

This private key has to be private.

This can be public.

So what do you do is like you make one party, the client generates this private key, let's call it

X, and the server generates the other private key, which is why.

Right.

And they keep it next to each other.

Right.

But the public key, which is a public number, it's actually two numbers that can be that can be shared.

That's fine.

And that's the that's the key here.

Now, if you happen once all the three are together, you get the key.

All right, that's.

That's not really enough.

Put it into perspective.

Here's another development thing here.

If you combine the private key, one of the private key, the blue key with the public key.

This is an unbreakable thing.

Nobody can break it.

So you can and this can be public.

You can share this fine, and nobody can get the private key if you combine them together.

It's like.

It's like you merge something and that's it.

You cannot merge it.

Same thing with this key.

And that might get a little confusing.

But here's the math here.

We can explain it.

So the public key is G.

Right, Right.

The public number.

So you you basically raise G to the power X again.

Exponentials are slow.

That's why development is can be slow for large data.

So g.

It's recommended to be a prime and has to be a prime has to be right.

And then due to the power X, you, you raise it to the power of that private key and then you do a

modular in and it has to be a large number and it has to be a prime to get an actual value of it.

This is the unbreakable thing.

Once you get this, you cannot get X out of it.

You cannot do a log.

You know, you can do all the math you want.

You can do a log G to the power G, but you cannot because you did a modular on it.

It's gone, right?

It's very hard to break this without spending a lot of compute.

Compute.

This is the same thing here, G to deploy modular and can be broken, but it is the key.

If you merge all the three, then you get the golden how power of the math.

Take this thing due to the power x module in.

If you raise the whole thing to the power y, let's assume you have y, you have you are the server.

The client can send you this portion.

Nobody can sniff it, they can't sniff it, they cannot extract anything to the power y And because

of math.

G to the power X to the power Y is equal G to the power x Y.

Right.

And this is actually the symmetric key, right?

It's the input to the symmetry key algorithm that generates the symmetric key.

Same thing g to the power.

Roy Modular N all raised the power.

X you put that and then you multiply X and Y and that's the key.

That's, that's the math behind it if you're interested.

TLS 1.3 again, AZT has 1.3, but has 1.2 has an option to use Diffie element or even better elliptic

curve development, which is an even better algorithm than development.

Write development is that secure can be broken with certain.

It depends on the key size as well.

So now what do we do?

We combine the keys, as we said.

Right?

The client generates the private key, the blue key, and the generates also the public key, which

is the the G and the N, Right.

It combines them with which the raises to the power you take G to the power X, and then modulo N,

and then you send that nobody can they can take this.

Sure they can know that G And even that is not enough for them.

Right.

They can, they can read this, but they cannot understand.

They cannot get the blue right again once they get the x that that could get the x that can decrypt

it, but they can't.

So the server will receive this part and then.

Well, the survey will do is will generate its own private part of the DV element, which is the Y as

we talked about.

Right.

And then take this and combine it with the three.

What do you get, which basically take this and raise it to the power of Y and you get a beautiful symmetric

key.

Now we got the symmetry key.

What does the client need to generate its own symmetric key?

It needs this, right?

But you cannot just send that plane.

Right.

What you can do instead is you take this and combine it with the red key, which you have the server

got from here.

Now, this is combined.

Nobody can break it.

So that's g to the bottom of Y modulo n and then you send that the server will get this, the client

will get this, and then the client will take this part and raise it to the part of what to X, And

that basically will give you the private key.

No, the symmetric sorry.

And then you basically do the exchange you encrypted and the server can decrypt with the same key and

we're done.

And that is the algorithm again, right?

So g to the power X module in the power of Y, that is done by the server because the server has the

Y, Right.

And this is unbreakable G to double y to the all in power X is done by the client because the client

has the X.

Got it, got it.

Again, I'm covering part of it, but it's just the server.

It's not, not a big deal.

And now I think I can I can disappear.

All right.

So let's summarize.

We talked about the vanilla TV.

Right how it works.

We talked about IDPs.

We talk about TLS 1.2, how it is actually two ROUNDTRIPS.

Right?

Because the first answer is just to agree on what what are we going to use?

Hey, what key exchange you got to go in use and what symmetric key are going to use to address 1.3?

Just remove that says, hey, it's always better to use Diffie Hellman, right?

Or Hellman.

And in the first handshake and in the first handshake, immediately send this parameters.

Don't even don't negotiate.

Just just send your parts of the exchange and the server will immediately know that.

Right?

And so that's the power of development here.

You can do it in a single handshake.

There is no exchange.

The first one was like, just like, you know, just negotiation that's just removed.

Right?

So to 1.3 is way faster than 1.2, right?

Because there is no external round trip that we have to do.

And we know like any roundtrip that TLS 1.3 and 1.2 is content to the TCP layer.

Right?

And we talked about that.

So segments, you better really know how large this things are.

Right.

And and the payload that comes back from the server by the way it has a certificate this is really large

right there is a specific ref see a request for comments to actually compress the certificate which

is not today is not compressed so this is a lot of segments send back.

Yeah, I draw one arrow, but there are so many segments here.

Right.

And we talked about all of that stuff as well.

And it's one writer, but it can also be zero with zero RTT, the client can send the the everything

including the pre pre shared something that is agreed upon.

They can immediately encrypt in the first handshake.

Right.

If they want to if they have communicated before so they can agree on some some pre master -- and

the server can look it up and use that to to get the key immediately.

So it's a little bit stateful but yeah.

I guys hope you enjoyed this TLS lecture and let's have any questions you might have.

But in the section question Q&amp;A, I try to answer all of these questions and I pick some of these questions

to present as lectures, which are very, very valuable.

See you in the next one.

Stay.

Awesome.